import { useState } from 'react'
import { Check } from 'lucide-react'
import { CHARS_BY_RADICAL, charSenses } from '../data/hanzi.js'
import {
  QUIZ_RADICALS, RADICAL_QUIZ_SIZE, buildRadicalQuiz, displayForms, getRadicalProgress,
} from '../utils/hanziQuiz.js'
import { applyFailure, applySuccess, isActive, isDueForReview } from '../utils/spacedrep.js'
import { useLang } from '../i18n/useLang.js'
import { Button, Feedback, ProgressBar, Score, Screen, SectionLabel, TopBar } from './ui.jsx'
import { ICON_SM, optionClass } from './uiStyles.js'

function Status({ progress }) {
  const { t } = useLang()
  if (progress.known && isDueForReview(progress)) return <span className="text-sm text-accent">{t('common.toReview')}</span>
  if (progress.known) return <span className="inline-flex items-center gap-1 text-sm text-good"><Check {...ICON_SM} />{t('common.mastered')}</span>
  if (progress.successCount > 0) return <span className="text-sm tabular-nums text-fg-3">{progress.successCount} / 3</span>
  return null
}

/** Exemples d'une clé : ses caractères les plus courants (ordre des listes HSK). */
const examples = (radical, n = 8) => CHARS_BY_RADICAL.get(radical.n).slice(0, n).map(ch => ch.c).join(' ')

export function RadicalQuiz({ questions, progressMap, applyUpdates, onExit, onRestart, exitLabel }) {
  const { t, l, lang, pct } = useLang()
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [results, setResults] = useState([])

  if (index >= questions.length) {
    const correct = results.filter(r => r.correct).length
    const ratio = correct / results.length
    const missed = results.filter(r => !r.correct).map(r => r.radical)
    return (
      <Screen className="px-5 pb-8">
        <div className="my-auto">
          <Score value={`${correct} / ${results.length}`} label={t('common.success', { pct: pct(ratio) })} good={ratio >= 0.8} />
          {missed.length > 0 && (
            <section className="mb-8">
              <SectionLabel>{t('common.toRework', { n: missed.length })}</SectionLabel>
              <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
                {missed.map(r => (
                  <li key={r.n} className="flex items-baseline gap-3 px-4 py-3">
                    <span className="hanzi-display text-2xl text-fg">{displayForms(r).join(' ')}</span>
                    <span className="text-[15px] text-fg">{l(r.meaning)}</span>
                    <span className="hanzi-display min-w-0 flex-1 truncate text-right text-fg-3">{examples(r, 4)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={onRestart}>{t('common.newTest')}</Button>
          <Button variant="secondary" onClick={onExit}>{exitLabel ?? t('rad.back')}</Button>
        </div>
      </Screen>
    )
  }

  const { radical, type, ch, options } = questions[index]
  const answered = chosen !== null
  const lastCorrect = answered && options.find(o => o.key === chosen).correct

  function choose(option) {
    if (answered) return
    setChosen(option.key)
    setResults(prev => [...prev, { radical, correct: option.correct }])
    const progress = getRadicalProgress(progressMap, radical)
    const updated = !option.correct ? applyFailure(progress) : isActive(progress) ? applySuccess(progress) : null
    if (updated) applyUpdates([updated])
  }

  function next() {
    setChosen(null)
    setIndex(i => i + 1)
  }

  return (
    <Screen>
      <TopBar onBack={onExit} backLabel={t('nav.quit')} aside={`${index + 1} / ${questions.length}`} />
      <ProgressBar value={(index + (answered ? 1 : 0)) / questions.length} className="mx-5" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="py-10 text-center">
          <p className="mb-6 text-[15px] text-fg-2">{t(type === 'meaning' ? 'rad.askMeaning' : 'rad.askChar')}</p>
          {type === 'meaning' ? (
            <div className="hanzi-display text-[72px] leading-none text-fg">{displayForms(radical).join(' ')}</div>
          ) : (
            <>
              <div className="hanzi-display text-[72px] leading-none text-fg">{ch.c}</div>
              <p className="mt-4 text-[17px] text-fg-2">{ch.pinyin} · {charSenses(ch, lang)[0]}</p>
            </>
          )}
        </div>

        <div className={type === 'meaning' ? 'mb-4 flex flex-col gap-2' : 'mb-4 grid grid-cols-2 gap-3'}>
          {options.map(o => (
            <button
              key={o.key}
              type="button"
              onClick={() => choose(o)}
              disabled={answered}
              className={`rounded-xl border transition-colors duration-150 ease-out ${optionClass({ answered, correct: o.correct, chosen: o.key === chosen })} ${
                type === 'meaning' ? 'min-h-12 px-4 py-3 text-left text-[15px]' : 'flex h-20 items-center justify-center'
              }`}
            >
              {type === 'meaning' ? l(o.label) : <span className="hanzi-display text-[32px] leading-none">{o.label}</span>}
            </button>
          ))}
        </div>

        {answered && (
          <div className="flex flex-col gap-4">
            <Feedback correct={lastCorrect}>
              <p className="flex items-baseline gap-3">
                <span className="hanzi-display text-2xl text-fg">{displayForms(radical).join(' ')}</span>
                <span className="text-[15px] text-fg">{l(radical.meaning)}</span>
              </p>
              <p className="hanzi-display mt-2 text-xl text-fg-2">{examples(radical)}</p>
            </Feedback>
            <Button onClick={next}>{t(index + 1 < questions.length ? 'common.next' : 'common.seeResult')}</Button>
          </div>
        )}
      </div>
    </Screen>
  )
}

export function RadicalsPage({ progressMap, applyUpdates, onBack }) {
  const { t, l } = useLang()
  const [quiz, setQuiz] = useState(null) // { id, questions } pendant un test
  const startQuiz = () => setQuiz(q => ({ id: (q?.id ?? 0) + 1, questions: buildRadicalQuiz(progressMap) }))

  if (quiz) {
    return (
      <RadicalQuiz
        key={quiz.id}
        questions={quiz.questions}
        progressMap={progressMap}
        applyUpdates={applyUpdates}
        onExit={() => setQuiz(null)}
        onRestart={startQuiz}
      />
    )
  }

  const known = QUIZ_RADICALS.filter(r => getRadicalProgress(progressMap, r).known).length

  return (
    <Screen>
      <TopBar onBack={onBack} title={<>{t('rad.title')} <span className="chinese-text text-fg-2">部首</span></>} bordered />

      <div className="border-b border-line px-5 py-6">
        <p className="text-[15px] leading-relaxed text-fg">{t('rad.intro')}</p>
        <Button onClick={startQuiz} className="mt-5">{t('rad.test', { n: RADICAL_QUIZ_SIZE })}</Button>
        <p className="mt-3 text-center text-sm tabular-nums text-fg-3">{t('rad.progress', { known, total: QUIZ_RADICALS.length })}</p>
      </div>

      <div className="flex-1 px-5 pb-8">
        <SectionLabel className="mt-8">{t('rad.list')}</SectionLabel>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
          {QUIZ_RADICALS.map(r => (
            <li key={r.n} className="flex items-center gap-4 p-4">
              <p className="hanzi-display w-20 shrink-0 whitespace-nowrap text-center text-[26px] leading-none text-fg">{displayForms(r).join(' ')}</p>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[15px] text-fg">{l(r.meaning)}</p>
                  <Status progress={getRadicalProgress(progressMap, r)} />
                </div>
                <p className="mt-1 truncate text-sm text-fg-3">
                  <span className="hanzi-display text-fg-2">{examples(r, 6)}</span> · {t('rad.chars', { n: CHARS_BY_RADICAL.get(r.n).length })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  )
}
