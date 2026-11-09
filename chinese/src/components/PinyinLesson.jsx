import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { TONES } from '../data/pinyinLessons.js'
import { buildLessonQuiz, getLessonProgress } from '../utils/pinyinQuiz.js'
import { applyLessonResult, PASS_THRESHOLD } from '../utils/lessonProgress.js'
import { play, preload, unlockAudio, syllableSrc, recordedWordSrc } from '../utils/audio.js'
import { ToneCurve } from './ToneCurve.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Button, Feedback, ProgressBar, Score, Screen, TopBar } from './ui.jsx'
import { ICON_SM, fr, optionClass, percent } from './uiStyles.js'

const soundSrc = s => (s.syl ? syllableSrc(s.syl) : recordedWordSrc(s.word))

function Intro({ lesson, onStart, onBack }) {
  return (
    <Screen>
      <TopBar onBack={onBack} backLabel="Leçons" />
      <div className="flex flex-1 flex-col px-5 pb-8">
        <header className="pt-4 pb-6">
          <h1 className="text-[28px] font-medium leading-tight text-fg">{lesson.title}</h1>
          <p className="mt-1 text-[15px] text-fg-2">{lesson.subtitle}</p>
        </header>

        <div className="mb-8 flex flex-col gap-5">
          {lesson.intro.map((block, i) => {
            if (block.p) return <p key={i} className="text-[15px] leading-relaxed text-fg">{fr(block.p)}</p>
            if (block.tones) {
              return (
                <div key={i} className="grid grid-cols-2 gap-3">
                  {TONES.map(t => (
                    <button
                      key={t.tone}
                      type="button"
                      onClick={() => play(syllableSrc(`ma${t.tone}`))}
                      className="rounded-2xl border border-line bg-card p-4 text-left transition-colors duration-150 ease-out hover:bg-raised active:bg-raised"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[28px] font-medium leading-none text-fg">m{t.mark}</span>
                        <ToneCurve tone={t.tone} className="h-7 w-9 text-accent" />
                      </div>
                      <p className="mt-3 inline-flex items-center gap-2 text-[15px] font-medium text-fg">
                        {t.name}
                        <Volume2 {...ICON_SM} className="text-fg-3" />
                      </p>
                      <p className="mt-1 text-sm leading-snug text-fg-2">{fr(t.description)}</p>
                    </button>
                  ))}
                </div>
              )
            }
            return (
              <ul key={i} className="divide-y divide-line rounded-2xl border border-line bg-card">
                {block.sounds.map(s => (
                  <li key={s.label + s.note} className="flex items-center gap-3 px-4 py-3">
                    <SpeakButton src={soundSrc(s)} />
                    <span className="min-w-12 text-base font-medium text-fg">{s.label}</span>
                    <span className="text-sm leading-snug text-fg-2">{fr(s.note)}</span>
                  </li>
                ))}
              </ul>
            )
          })}
        </div>

        <Button onClick={onStart} className="mt-auto">Commencer le test · 10 questions</Button>
      </div>
    </Screen>
  )
}

function Quiz({ questions, onExit, onFinish }) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [results, setResults] = useState([])
  const question = questions[index]
  const answered = chosen !== null
  const lastCorrect = answered && question.options.find(o => o.key === chosen).correct

  // Son de la question joué à l'affichage ; préchargement de la suivante.
  useEffect(() => {
    const q = questions[index]
    if (!q) return
    preload([q.audio, q.revealAudio, ...q.options.map(o => o.audio)])
    const next = questions[index + 1]
    if (next) preload([next.audio, next.revealAudio])
    if (q.audio) play(q.audio)
  }, [questions, index])

  function choose(option) {
    if (answered) {
      if (option.audio) play(option.audio) // comparer les sons après la réponse
      return
    }
    setChosen(option.key)
    setResults(prev => [...prev, option.correct])
    if (question.revealAudio) play(question.revealAudio)
  }

  function next() {
    if (index + 1 >= questions.length) {
      onFinish(results.filter(Boolean).length / questions.length)
      return
    }
    setChosen(null)
    setIndex(i => i + 1)
  }

  const layout = question.layout
  return (
    <Screen>
      <TopBar onBack={onExit} backLabel="Quitter" aside={`${index + 1} / ${questions.length}`} />
      <ProgressBar value={(index + (answered ? 1 : 0)) / questions.length} className="mx-5" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="py-10 text-center">
          <p className="text-[15px] text-fg-2">{fr(question.prompt)}</p>
          {question.display && (
            <div className={`mt-6 text-[56px] leading-tight text-fg ${question.displayChinese ? 'hanzi-display' : 'font-medium'}`}>
              {question.display}
            </div>
          )}
          {question.audio && (
            <button
              type="button"
              onClick={() => play(question.audio)}
              aria-label="Réécouter"
              className="mx-auto mt-6 flex size-16 items-center justify-center rounded-full border border-line bg-card text-fg transition-colors duration-150 ease-out hover:bg-raised active:bg-raised-2"
            >
              <Volume2 size={24} strokeWidth={1.5} aria-hidden />
            </button>
          )}
        </div>

        <div className={layout === 'list' ? 'mb-4 flex flex-col gap-2' : 'mb-4 grid grid-cols-2 gap-3'}>
          {question.options.map(o => (
            <button
              key={o.key}
              type="button"
              onClick={() => choose(o)}
              className={`relative rounded-xl border transition-colors duration-150 ease-out ${optionClass({ answered, correct: o.correct, chosen: o.key === chosen })} ${
                layout === 'list' ? 'min-h-12 px-4 py-3 text-left text-base' : 'flex h-24 flex-col items-center justify-center gap-2'
              }`}
            >
              {layout === 'tones' ? (
                <>
                  <ToneCurve tone={o.tone} className="h-8 w-11 text-accent" />
                  <span className="text-[15px] font-medium">{o.label}</span>
                </>
              ) : layout === 'list' ? fr(o.label) : <span className="text-2xl font-medium">{o.label}</span>}
              {answered && o.audio && <Volume2 {...ICON_SM} className="absolute top-2 right-2 text-fg-3" />}
            </button>
          ))}
        </div>

        {answered && (
          <div className="flex flex-col gap-4">
            {question.options.some(o => o.audio) && (
              <p className="-mt-1 text-center text-sm text-fg-3">Touche une réponse pour l'écouter</p>
            )}
            <Feedback correct={lastCorrect} aside={<SpeakButton src={question.revealAudio || question.audio} />}>
              <p className="chinese-text text-[15px] text-fg">{fr(question.answer)}</p>
              {question.explanation && <p className="mt-1 text-[15px] text-fg-2">{fr(question.explanation)}</p>}
            </Feedback>
            <Button onClick={next}>{index + 1 < questions.length ? 'Suivant' : 'Voir le résultat'}</Button>
          </div>
        )}
      </div>
    </Screen>
  )
}

function Results({ lesson, pct, hasNext, onRetry, onNext, onExit }) {
  const passed = pct >= PASS_THRESHOLD
  const caption = passed
    ? hasNext ? 'Leçon réussie, la suivante est débloquée' : 'Leçon réussie, tu as terminé le parcours'
    : `Il faut ${percent(PASS_THRESHOLD)} pour réussir. Relis l'explication et réessaie`
  return (
    <Screen className="px-5 pb-8">
      <div className="my-auto">
        <Score value={percent(pct)} label={lesson.title} caption={caption} good={passed} />
      </div>
      <div className="flex flex-col gap-2">
        {passed && hasNext && <Button onClick={onNext}>Leçon suivante</Button>}
        <Button variant={passed && hasNext ? 'secondary' : 'primary'} onClick={onRetry}>Recommencer</Button>
        <Button variant="secondary" onClick={onExit}>Retour aux leçons</Button>
      </div>
    </Screen>
  )
}

export function PinyinLesson({ lesson, hasNext, progressMap, applyUpdates, onExit, onNextLesson }) {
  const [quiz, setQuiz] = useState(null) // { id, questions }
  const [pct, setPct] = useState(null)

  function start() {
    unlockAudio()
    setPct(null)
    setQuiz(q => ({ id: (q?.id ?? 0) + 1, questions: buildLessonQuiz(lesson) }))
  }

  function finish(score) {
    applyUpdates([applyLessonResult(getLessonProgress(progressMap, lesson), score)])
    setQuiz(null)
    setPct(score)
  }

  if (pct !== null) {
    return <Results lesson={lesson} pct={pct} hasNext={hasNext} onRetry={start} onNext={onNextLesson} onExit={onExit} />
  }
  if (quiz) {
    return <Quiz key={quiz.id} questions={quiz.questions} onExit={() => setQuiz(null)} onFinish={finish} />
  }
  return <Intro lesson={lesson} onStart={start} onBack={onExit} />
}
