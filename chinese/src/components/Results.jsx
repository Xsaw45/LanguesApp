import { SpeakButton } from './SpeakButton.jsx'
import { wordSrc } from '../utils/audio.js'
import { wordSenses } from '../data/index.js'
import { useLang } from '../i18n/useLang.js'
import { Button, Score, Screen, SectionLabel } from './ui.jsx'

function messageKey(ratio) {
  if (ratio >= 0.8) return 'vocab.result.great'
  if (ratio >= 0.5) return 'vocab.result.good'
  return 'vocab.result.more'
}

export function Results({ results, onRestart, onHome }) {
  const { lang, t, pct } = useLang()
  const correct = results.filter(r => r.correct).length
  const total = results.length
  const ratio = correct / total
  const wrongWords = results.filter(r => !r.correct)

  return (
    <Screen className="px-5 pb-8">
      {/* score et liste groupés, centrés dans l'espace au-dessus des boutons */}
      <div className="my-auto">
        <Score value={`${correct} / ${total}`} label={t('common.success', { pct: pct(ratio) })} caption={t(messageKey(ratio))} good={ratio >= 0.8} />

        {wrongWords.length > 0 && (
          <section className="mb-8">
            <SectionLabel>{t('vocab.rework', { n: wrongWords.length })}</SectionLabel>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
              {wrongWords.map(({ word }) => (
                <li key={word.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-2">
                      <span className="chinese-text text-xl text-fg">{word.simplified}</span>
                      <span className="text-sm text-fg-2">{word.pinyin}</span>
                    </p>
                    <p className="truncate text-sm text-fg-3">{wordSenses(word, lang)[0]}</p>
                  </div>
                  <SpeakButton src={wordSrc(word)} text={word.simplified} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={onRestart}>{t('common.newTest')}</Button>
        <Button variant="secondary" onClick={onHome}>{t('vocab.backToVocab')}</Button>
      </div>
    </Screen>
  )
}
