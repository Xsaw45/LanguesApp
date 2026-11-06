import { useEffect, useState } from 'react'
import { TONES } from '../data/pinyinLessons.js'
import { buildLessonQuiz, getLessonProgress, applyLessonResult, PASS_THRESHOLD } from '../utils/pinyinQuiz.js'
import { play, preload, unlockAudio, syllableSrc, recordedWordSrc } from '../utils/audio.js'
import { ToneCurve } from './ToneCurve.jsx'
import { SpeakButton } from './SpeakButton.jsx'

function TopBar({ onBack, label, center }) {
  return (
    <div className="flex items-center justify-between px-4 pt-6 pb-2">
      <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-sm">← {label}</button>
      <span className="text-slate-400 text-sm font-medium">{center}</span>
      <div className="w-12" />
    </div>
  )
}

const soundSrc = s => (s.syl ? syllableSrc(s.syl) : recordedWordSrc(s.word))

function Intro({ lesson, onStart, onBack }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <TopBar onBack={onBack} label="Leçons" />
      <div className="px-4 pb-8 flex-1 flex flex-col">
        <h1 className="text-2xl font-bold text-white mt-2">{lesson.title}</h1>
        <p className="text-slate-400 text-sm mb-4">{lesson.subtitle}</p>
        <div className="flex flex-col gap-4 mb-6">
          {lesson.intro.map((block, i) => {
            if (block.p) return <p key={i} className="text-slate-300 text-sm leading-relaxed">{block.p}</p>
            if (block.tones) {
              return (
                <div key={i} className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t.tone}
                      onClick={() => play(syllableSrc(`ma${t.tone}`))}
                      className="text-left rounded-xl border border-slate-700 bg-slate-900 hover:border-slate-500 p-3 transition-all"
                    >
                      <div className="flex items-center justify-between text-red-400">
                        <span className="text-2xl font-bold text-white">m{t.mark}</span>
                        <ToneCurve tone={t.tone} />
                      </div>
                      <p className="text-white text-sm font-semibold mt-1">{t.name} 🔊</p>
                      <p className="text-slate-400 text-xs">{t.description}</p>
                    </button>
                  ))}
                </div>
              )
            }
            return (
              <ul key={i} className="flex flex-col divide-y divide-slate-800 rounded-xl border border-slate-800">
                {block.sounds.map(s => (
                  <li key={s.label + s.note} className="flex items-center gap-3 px-3 py-2">
                    <SpeakButton src={soundSrc(s)} />
                    <span className="text-white font-semibold min-w-12">{s.label}</span>
                    <span className="text-slate-400 text-sm">{s.note}</span>
                  </li>
                ))}
              </ul>
            )
          })}
        </div>
        <button
          onClick={onStart}
          className="mt-auto w-full py-4 rounded-2xl text-lg font-semibold bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-900/30 transition-all"
        >
          Commencer le test · 10 questions
        </button>
      </div>
    </div>
  )
}

function optionStyle(answered, option, chosen) {
  if (!answered) return 'border-slate-600 bg-slate-800 hover:border-slate-400 text-white'
  if (option.correct) return 'border-green-600 bg-green-900/40 text-green-300'
  if (option.key === chosen) return 'border-red-600 bg-red-900/40 text-red-300'
  return 'border-slate-800 bg-slate-900 text-slate-400'
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <TopBar onBack={onExit} label="Quitter" center={`${index + 1} / ${questions.length}`} />
      <div className="px-4 mb-2">
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col">
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm mb-4 uppercase tracking-wider">{question.prompt}</p>
          {question.display && (
            <div className={`text-6xl font-bold text-white mb-2 leading-tight ${question.displayChinese ? 'chinese-text' : ''}`}>
              {question.display}
            </div>
          )}
          {question.audio && (
            <button
              onClick={() => play(question.audio)}
              className="mx-auto mt-2 w-20 h-20 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-4xl flex items-center justify-center transition-colors"
              aria-label="Réécouter"
            >
              🔊
            </button>
          )}
        </div>

        <div className={layout === 'list' ? 'flex flex-col gap-2 mb-4' : 'grid grid-cols-2 gap-3 mb-4'}>
          {question.options.map(o => (
            <button
              key={o.key}
              onClick={() => choose(o)}
              className={`rounded-xl border transition-all ${optionStyle(answered, o, chosen)} ${
                layout === 'list' ? 'px-4 py-3 text-left text-base' : 'py-4 text-2xl font-bold'
              }`}
            >
              {layout === 'tones' ? (
                <span className="flex flex-col items-center gap-1">
                  <ToneCurve tone={o.tone} className="w-12 h-9" />
                  <span className="text-base font-semibold">{o.label}</span>
                </span>
              ) : o.label}
              {answered && o.audio && <span className="block text-xs font-normal opacity-70 mt-1">🔊 écouter</span>}
            </button>
          ))}
        </div>

        {answered && (
          <>
            <div className={`rounded-2xl p-4 mb-4 ${lastCorrect ? 'bg-green-900/40 border border-green-700' : 'bg-red-900/40 border border-red-700'}`}>
              <div className="flex items-start justify-between gap-2">
                <p className={`font-semibold text-lg mb-1 ${lastCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {lastCorrect ? '✓ Correct !' : '✗ Incorrect'}
                </p>
                <SpeakButton src={question.revealAudio || question.audio} />
              </div>
              <p className="text-slate-200 text-sm chinese-text">{question.answer}</p>
              {question.explanation && <p className="text-slate-400 text-sm mt-1">{question.explanation}</p>}
            </div>
            <button
              onClick={next}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all mb-6"
            >
              {index + 1 < questions.length ? 'Suivant →' : 'Voir le résultat'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function Results({ lesson, pct, hasNext, onRetry, onNext, onExit }) {
  const passed = pct >= PASS_THRESHOLD
  const score = Math.round(pct * 100)
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col px-4 py-8">
      <div className="text-center mb-8">
        <div className={`text-7xl font-bold mb-2 ${passed ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
          {score}%
        </div>
        <p className="text-slate-300 text-lg">{lesson.title}</p>
        <p className="text-slate-400 text-sm mt-2">
          {passed
            ? hasNext ? '🎉 Leçon réussie : la suivante est débloquée.' : '🎉 Leçon réussie : tu as terminé le parcours !'
            : `Il faut ${Math.round(PASS_THRESHOLD * 100)} % pour réussir. Relis l'explication et réessaie.`}
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-auto">
        {passed && hasNext && (
          <button onClick={onNext} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-semibold transition-all">
            Leçon suivante →
          </button>
        )}
        <button
          onClick={onRetry}
          className={`w-full py-4 rounded-2xl font-semibold transition-all text-white ${passed && hasNext ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-500'}`}
        >
          Recommencer
        </button>
        <button onClick={onExit} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all">
          Retour aux leçons
        </button>
      </div>
    </div>
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
