import { useState } from 'react'
import { buildPointQuiz, getPointProgress, POINT_QUIZ_SIZE } from '../utils/grammarQuiz.js'
import { applyLessonResult, PASS_THRESHOLD } from '../utils/lessonProgress.js'
import { useLang } from '../i18n/useLang.js'
import { GrammarQuiz } from './GrammarQuiz.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Button, Score, Screen, SectionLabel, TopBar } from './ui.jsx'

function Sheet({ point, onStart, onBack }) {
  const { t, l } = useLang()
  return (
    <Screen>
      <TopBar onBack={onBack} backLabel={t('gr.points')} />
      <div className="flex flex-1 flex-col px-5 pb-8">
        <header className="pt-4 pb-6">
          <h1 className="text-[28px] font-medium leading-tight text-fg">{l(point.title)}</h1>
          <p className="mt-1 text-[15px] text-fg-2">HSK {point.level}</p>
        </header>

        <div className="rounded-2xl border border-line bg-card px-4 py-3">
          <p className="chinese-text text-lg font-medium text-fg">{l(point.pattern)}</p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {point.explanation.map((p, i) => <p key={i} className="text-[15px] leading-relaxed text-fg">{l(p)}</p>)}
        </div>

        <SectionLabel className="mt-8">{t('gr.examples')}</SectionLabel>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
          {point.examples.map(ex => (
            <li key={ex.zh} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="chinese-text text-xl text-fg">{ex.zh}</p>
                <p className="mt-0.5 text-sm text-fg-3">{ex.pinyin}</p>
                <p className="mt-0.5 text-[15px] text-fg-2">{l(ex.tr)}</p>
              </div>
              <SpeakButton text={ex.zh} />
            </li>
          ))}
        </ul>

        <SectionLabel className="mt-8">{t('gr.pitfall')}</SectionLabel>
        <p className="mb-8 rounded-2xl border border-line bg-card px-4 py-3 text-[15px] leading-relaxed text-fg">{l(point.pitfall)}</p>

        <Button onClick={onStart} className="mt-auto">{t('gr.start', { n: POINT_QUIZ_SIZE })}</Button>
      </div>
    </Screen>
  )
}

function Results({ score, hasNext, onRetry, onNext, onExit, title }) {
  const { t, l, pct } = useLang()
  const passed = score >= PASS_THRESHOLD
  const caption = passed
    ? t(hasNext ? 'gr.passedNext' : 'gr.passedLast')
    : t('gr.failed', { pct: pct(PASS_THRESHOLD) })
  return (
    <Screen className="px-5 pb-8">
      <div className="my-auto">
        <Score value={pct(score)} label={l(title)} caption={caption} good={passed} />
      </div>
      <div className="flex flex-col gap-2">
        {passed && hasNext && <Button onClick={onNext}>{t('gr.nextPoint')}</Button>}
        <Button variant={passed && hasNext ? 'secondary' : 'primary'} onClick={onRetry}>{t('common.retry')}</Button>
        <Button variant="secondary" onClick={onExit}>{t('gr.backToPoints')}</Button>
      </div>
    </Screen>
  )
}

export function GrammarPoint({ point, hasNext, progressMap, applyUpdates, onExit, onNextPoint }) {
  const [quiz, setQuiz] = useState(null) // { id, questions }
  const [score, setScore] = useState(null)

  function start() {
    setScore(null)
    setQuiz(q => ({ id: (q?.id ?? 0) + 1, questions: buildPointQuiz(point) }))
  }

  function finish(results) {
    const result = results.filter(r => r.correct).length / results.length
    applyUpdates([applyLessonResult(getPointProgress(progressMap, point), result)])
    setQuiz(null)
    setScore(result)
  }

  if (score !== null) {
    return <Results score={score} title={point.title} hasNext={hasNext} onRetry={start} onNext={onNextPoint} onExit={onExit} />
  }
  if (quiz) {
    return <GrammarQuiz key={quiz.id} questions={quiz.questions} onExit={() => setQuiz(null)} onFinish={finish} />
  }
  return <Sheet point={point} onStart={start} onBack={onExit} />
}
