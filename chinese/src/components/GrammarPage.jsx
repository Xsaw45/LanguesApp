import { useState } from 'react'
import { GRAMMAR_POINTS } from '../data/grammar.js'
import { buildReviewQuiz, getPointProgress, isPointUnlocked, scoreByPoint, POINT_QUIZ_SIZE } from '../utils/grammarQuiz.js'
import { applyLessonResult, isLessonDue, isLessonPassed, PASS_THRESHOLD } from '../utils/lessonProgress.js'
import { GrammarPoint } from './GrammarPoint.jsx'
import { GrammarQuiz } from './GrammarQuiz.jsx'
import { LessonStatus } from './LessonStatus.jsx'
import { Button, Score, Screen, SectionLabel, TopBar } from './ui.jsx'
import { fr, percent } from './uiStyles.js'

const LEVELS = [1, 2]

function ReviewResults({ results, onAgain, onExit }) {
  const correct = results.filter(r => r.correct).length
  const ratio = correct / results.length
  const missed = GRAMMAR_POINTS.filter(p => results.some(r => r.pointId === p.id && !r.correct))
  return (
    <Screen className="px-5 pb-8">
      <div className="my-auto">
        <Score value={`${correct} / ${results.length}`} label={`${percent(ratio)} de réussite`} good={ratio >= PASS_THRESHOLD} />
        {missed.length > 0 && (
          <section className="mb-8">
            <SectionLabel>À retravailler · {missed.length}</SectionLabel>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
              {missed.map(p => (
                <li key={p.id} className="px-4 py-3">
                  <p className="text-base font-medium text-fg">{fr(p.title)}</p>
                  <p className="mt-0.5 text-sm text-fg-2">{fr(p.pattern)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={onAgain}>Nouvelle révision</Button>
        <Button variant="secondary" onClick={onExit}>Retour aux points</Button>
      </div>
    </Screen>
  )
}

export function GrammarPage({ progressMap, applyUpdates, onBack }) {
  // null : liste ; nombre : index du point ouvert ; { review, questions, results? } : révision
  const [view, setView] = useState(null)

  const startReview = () => setView(v => ({ review: (v?.review ?? 0) + 1, questions: buildReviewQuiz(progressMap) }))

  // Seuls les points dont la révision est due changent : les autres gardent leur prochaine échéance.
  function finishReview(results) {
    const updates = []
    for (const [pointId, ratio] of scoreByPoint(results)) {
      const point = GRAMMAR_POINTS.find(p => p.id === pointId)
      const progress = getPointProgress(progressMap, point)
      if (isLessonDue(progress)) updates.push(applyLessonResult(progress, ratio))
    }
    if (updates.length) applyUpdates(updates)
    setView(v => ({ ...v, results }))
  }

  if (typeof view === 'number') {
    return (
      <GrammarPoint
        key={view}
        point={GRAMMAR_POINTS[view]}
        hasNext={view + 1 < GRAMMAR_POINTS.length}
        progressMap={progressMap}
        applyUpdates={applyUpdates}
        onExit={() => setView(null)}
        onNextPoint={() => setView(view + 1)}
      />
    )
  }

  if (view?.results) return <ReviewResults results={view.results} onAgain={startReview} onExit={() => setView(null)} />
  if (view) {
    return <GrammarQuiz key={view.review} questions={view.questions} onExit={() => setView(null)} onFinish={finishReview} />
  }

  const progresses = GRAMMAR_POINTS.map(p => getPointProgress(progressMap, p))
  const passed = progresses.filter(isLessonPassed).length
  const due = progresses.filter(p => p.known && isLessonDue(p)).length

  return (
    <Screen>
      <TopBar onBack={onBack} title={<>Grammaire <span className="chinese-text text-fg-2">语法</span></>} bordered />

      <div className="flex flex-col px-5 py-6">
        <p className="text-[15px] leading-relaxed text-fg">
          Chaque point a une fiche et un test de {POINT_QUIZ_SIZE} questions. Il faut {percent(PASS_THRESHOLD)} pour
          débloquer le suivant.
        </p>

        <Button variant="secondary" className="mt-5" disabled={passed === 0} onClick={startReview}>
          Réviser · {passed} {passed > 1 ? 'points vus' : 'point vu'}
        </Button>
        <p className="mt-3 text-center text-sm text-fg-3">
          {due > 0 ? `${due} à revoir` : 'Les points réussis reviennent en révision de plus en plus espacée'}
        </p>

        {LEVELS.map(level => (
          <section key={level} className="mt-8">
            <SectionLabel>HSK {level}</SectionLabel>
            <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
              {GRAMMAR_POINTS.map((point, i) => {
                if (point.level !== level) return null
                const unlocked = isPointUnlocked(progressMap, i)
                return (
                  <li key={point.id}>
                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() => setView(i)}
                      className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 ease-out hover:bg-raised disabled:hover:bg-transparent"
                    >
                      <span className={`w-5 shrink-0 text-right text-[15px] tabular-nums ${unlocked ? 'text-fg-3' : 'text-fg-3/60'}`}>{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-base font-medium ${unlocked ? 'text-fg' : 'text-fg-3'}`}>{fr(point.title)}</span>
                        <span className={`mt-0.5 block text-sm ${unlocked ? 'text-fg-2' : 'text-fg-3/70'}`}>{fr(point.pattern)}</span>
                      </span>
                      <LessonStatus progress={progresses[i]} unlocked={unlocked} />
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </Screen>
  )
}
