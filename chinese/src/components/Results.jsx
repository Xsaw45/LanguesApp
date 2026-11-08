import { SpeakButton } from './SpeakButton.jsx'
import { wordSrc } from '../utils/audio.js'
import { Button, Score, Screen, SectionLabel } from './ui.jsx'
import { percent } from './uiStyles.js'

function message(ratio) {
  if (ratio >= 0.8) return 'Excellent travail'
  if (ratio >= 0.5) return 'Continue comme ça'
  return 'Encore un peu d\'entraînement'
}

export function Results({ results, onRestart, onHome }) {
  const correct = results.filter(r => r.correct).length
  const total = results.length
  const ratio = correct / total
  const wrongWords = results.filter(r => !r.correct)

  return (
    <Screen className="px-5 pb-8">
      {/* score et liste groupés, centrés dans l'espace au-dessus des boutons */}
      <div className="my-auto">
        <Score value={`${correct} / ${total}`} label={`${percent(ratio)} de réussite`} caption={message(ratio)} good={ratio >= 0.8} />

        {wrongWords.length > 0 && (
          <section className="mb-8">
            <SectionLabel>Mots à retravailler · {wrongWords.length}</SectionLabel>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
              {wrongWords.map(({ word }) => (
                <li key={word.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-2">
                      <span className="chinese-text text-xl text-fg">{word.simplified}</span>
                      <span className="text-sm text-fg-2">{word.pinyin}</span>
                    </p>
                    <p className="truncate text-sm text-fg-3">{word.definition.split(/[;|]/)[0]}</p>
                  </div>
                  <SpeakButton src={wordSrc(word)} text={word.simplified} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={onRestart}>Nouveau test</Button>
        <Button variant="secondary" onClick={onHome}>Retour au vocabulaire</Button>
      </div>
    </Screen>
  )
}
