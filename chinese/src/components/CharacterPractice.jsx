import { useState } from 'react'
import { charRadical, charSenses, charSrc } from '../data/hanzi.js'
import { allowedMistakes, getCharProgress } from '../utils/hanziQuiz.js'
import { applyFailure, applySuccess, isActive } from '../utils/spacedrep.js'
import { useLang } from '../i18n/useLang.js'
import { HanziBoard } from './HanziBoard.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Button, Feedback, ProgressBar, Score, Screen, SectionLabel, TopBar } from './ui.jsx'

/**
 * Séance d'écriture : chaque caractère se trace sur le modèle (nouveau) ou s'écrit de mémoire, d'après son sens et
 * sa lecture. Réussi avec au plus allowedMistakes(ch) erreurs ; sinon (ou « Je ne sais pas ») l'ordre des traits
 * est montré.
 */
export function CharacterPractice({ items, progressMap, applyUpdates, onExit, onRestart, exitLabel }) {
  const { t, l, lang, pct } = useLang()
  const [index, setIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [outcome, setOutcome] = useState(null) // { correct, mistakes } une fois le caractère fini
  const [results, setResults] = useState([])

  if (index >= items.length) {
    const correct = results.filter(r => r.correct).length
    const ratio = correct / results.length
    const missed = results.filter(r => !r.correct).map(r => r.ch)
    return (
      <Screen className="px-5 pb-8">
        <div className="my-auto">
          <Score value={`${correct} / ${results.length}`} label={t('common.success', { pct: pct(ratio) })} good={ratio >= 0.8} />
          {missed.length > 0 && (
            <section className="mb-8">
              <SectionLabel>{t('common.toRework', { n: missed.length })}</SectionLabel>
              <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
                {missed.map(ch => (
                  <li key={ch.c} className="flex items-baseline gap-3 px-4 py-3">
                    <span className="hanzi-display text-2xl text-fg">{ch.c}</span>
                    <span className="text-sm text-fg-2">{ch.pinyin}</span>
                    <span className="min-w-0 flex-1 truncate text-right text-sm text-fg-3">{charSenses(ch, lang)[0]}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={onRestart}>{t('common.newTest')}</Button>
          <Button variant="secondary" onClick={onExit}>{exitLabel ?? t('hz.back')}</Button>
        </div>
      </Screen>
    )
  }

  const { ch, trace } = items[index]
  const radical = charRadical(ch)

  function finish(correct, total) {
    if (outcome) return
    setOutcome({ correct, mistakes: total })
    setResults(prev => [...prev, { ch, correct }])
    const progress = getCharProgress(progressMap, ch)
    // Caractère déjà maîtrisé et pas encore à réviser (séance complétée) : seule une erreur compte.
    // Tracé sans aucune erreur : révision suivante plus lointaine qu'avec des erreurs tolérées.
    const updated = !correct ? applyFailure(progress) : isActive(progress) ? applySuccess(progress, total === 0 ? 'good' : 'hard') : null
    if (updated) applyUpdates([updated])
  }

  function next() {
    setOutcome(null)
    setMistakes(0)
    setIndex(i => i + 1)
  }

  return (
    <Screen>
      <TopBar onBack={onExit} backLabel={t('nav.quit')} aside={`${index + 1} / ${items.length}`} />
      <ProgressBar value={(index + (outcome ? 1 : 0)) / items.length} className="mx-5" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="py-5 text-center">
          <p className="text-[15px] text-fg-2">{t(trace ? 'hz.askTrace' : 'hz.askWrite')}</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <p className="text-2xl text-fg">{ch.pinyin}</p>
            <SpeakButton src={charSrc(ch)} text={ch.c} />
          </div>
          <p className="mt-1 text-[15px] text-fg">{charSenses(ch, lang).slice(0, 3).join('; ')}</p>
        </div>

        <HanziBoard
          key={index}
          char={ch.c}
          mode={outcome && !outcome.correct ? 'animate' : 'quiz'}
          outline={trace}
          showRadical
          onMistake={setMistakes}
          onComplete={total => finish(total <= allowedMistakes(ch), total)}
        />

        {outcome ? (
          <div className="mt-4 flex flex-col gap-4">
            <Feedback correct={outcome.correct}>
              <p className="flex items-baseline gap-2">
                <span className="hanzi-display text-2xl text-fg">{ch.c}</span>
                <span className="text-[15px] text-fg-2">{ch.pinyin}</span>
              </p>
              <p className="mt-2 text-[15px] text-fg">
                {t('hz.radical')} <span className="hanzi-display text-accent">{radical.forms.slice(0, 2).join(' ')}</span> · {l(radical.meaning)} · {t('hz.strokes')} {ch.strokes}
              </p>
              {outcome.mistakes !== null && (
                <p className="mt-1 text-sm tabular-nums text-fg-3">{t('hz.result', { n: outcome.mistakes, max: allowedMistakes(ch) })}</p>
              )}
            </Feedback>
            <Button onClick={next}>{t(index + 1 < items.length ? 'common.next' : 'common.seeResult')}</Button>
          </div>
        ) : (
          <div className="mt-3 flex flex-col items-center gap-3">
            <p className="text-sm tabular-nums text-fg-3">{t('hz.mistakes', { n: mistakes })} · {t('hz.hint')}</p>
            <Button variant="secondary" onClick={() => finish(false, null)}>{t('hz.giveUp')}</Button>
          </div>
        )}
      </div>
    </Screen>
  )
}
