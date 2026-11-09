import { useState } from 'react'
import { buildPointQuiz, getPointProgress, POINT_QUIZ_SIZE } from '../utils/grammarQuiz.js'
import { applyLessonResult, PASS_THRESHOLD } from '../utils/lessonProgress.js'
import { GrammarQuiz } from './GrammarQuiz.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Button, Score, Screen, SectionLabel, TopBar } from './ui.jsx'
import { fr, percent } from './uiStyles.js'

function Sheet({ point, onStart, onBack }) {
  return (
    <Screen>
      <TopBar onBack={onBack} backLabel="Points" />
      <div className="flex flex-1 flex-col px-5 pb-8">
        <header className="pt-4 pb-6">
          <h1 className="text-[28px] font-medium leading-tight text-fg">{fr(point.title)}</h1>
          <p className="mt-1 text-[15px] text-fg-2">HSK {point.level}</p>
        </header>

        <div className="rounded-2xl border border-line bg-card px-4 py-3">
          <p className="chinese-text text-lg font-medium text-fg">{fr(point.pattern)}</p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {point.explanation.map((p, i) => <p key={i} className="text-[15px] leading-relaxed text-fg">{fr(p)}</p>)}
        </div>

        <SectionLabel className="mt-8">Exemples</SectionLabel>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
          {point.examples.map(ex => (
            <li key={ex.zh} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="chinese-text text-xl text-fg">{ex.zh}</p>
                <p className="mt-0.5 text-sm text-fg-3">{ex.pinyin}</p>
                <p className="mt-0.5 text-[15px] text-fg-2">{fr(ex.fr)}</p>
              </div>
              <SpeakButton text={ex.zh} />
            </li>
          ))}
        </ul>

        <SectionLabel className="mt-8">Piège courant</SectionLabel>
        <p className="mb-8 rounded-2xl border border-line bg-card px-4 py-3 text-[15px] leading-relaxed text-fg">{fr(point.pitfall)}</p>

        <Button onClick={onStart} className="mt-auto">Commencer le test · {POINT_QUIZ_SIZE} questions</Button>
      </div>
    </Screen>
  )
}

function Results({ pct, hasNext, onRetry, onNext, onExit, title }) {
  const passed = pct >= PASS_THRESHOLD
  const caption = passed
    ? hasNext ? 'Point réussi, le suivant est débloqué' : 'Point réussi, tu as terminé le module'
    : `Il faut ${percent(PASS_THRESHOLD)} pour réussir. Relis la fiche et réessaie`
  return (
    <Screen className="px-5 pb-8">
      <div className="my-auto">
        <Score value={percent(pct)} label={fr(title)} caption={caption} good={passed} />
      </div>
      <div className="flex flex-col gap-2">
        {passed && hasNext && <Button onClick={onNext}>Point suivant</Button>}
        <Button variant={passed && hasNext ? 'secondary' : 'primary'} onClick={onRetry}>Recommencer</Button>
        <Button variant="secondary" onClick={onExit}>Retour aux points</Button>
      </div>
    </Screen>
  )
}

export function GrammarPoint({ point, hasNext, progressMap, applyUpdates, onExit, onNextPoint }) {
  const [quiz, setQuiz] = useState(null) // { id, questions }
  const [pct, setPct] = useState(null)

  function start() {
    setPct(null)
    setQuiz(q => ({ id: (q?.id ?? 0) + 1, questions: buildPointQuiz(point) }))
  }

  function finish(results) {
    const score = results.filter(r => r.correct).length / results.length
    applyUpdates([applyLessonResult(getPointProgress(progressMap, point), score)])
    setQuiz(null)
    setPct(score)
  }

  if (pct !== null) {
    return <Results pct={pct} title={point.title} hasNext={hasNext} onRetry={start} onNext={onNextPoint} onExit={onExit} />
  }
  if (quiz) {
    return <GrammarQuiz key={quiz.id} questions={quiz.questions} onExit={() => setQuiz(null)} onFinish={finish} />
  }
  return <Sheet point={point} onStart={start} onBack={onExit} />
}
