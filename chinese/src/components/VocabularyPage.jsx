import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { ALL_LEVELS, getWordsForLevel } from '../data/index.js'
import { SpeakButton } from './SpeakButton.jsx'
import { wordSrc } from '../utils/audio.js'
import { Screen, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

export function VocabularyPage({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(ALL_LEVELS[0])
  const words = useMemo(() => getWordsForLevel(selectedLevel), [selectedLevel])

  return (
    <Screen>
      <TopBar onBack={onBack} title="Liste des mots" bordered />

      <div className="border-b border-line px-5 py-4">
        <div className="relative">
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(Number(e.target.value))}
            aria-label="Niveau"
            className="h-12 w-full appearance-none rounded-[10px] border border-line bg-card px-4 text-base text-fg outline-none transition-colors duration-150 ease-out hover:bg-raised"
          >
            {ALL_LEVELS.map(l => (
              <option key={l} value={l}>HSK {l} · {getWordsForLevel(l).length} mots</option>
            ))}
          </select>
          <ChevronDown {...ICON} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-fg-3" />
        </div>
      </div>

      <ul className="flex-1 divide-y divide-line px-5 pb-8">
        {words.map(word => {
          const senses = word.definition.split(/[;|]/).map(s => s.trim()).filter(Boolean)
          return (
            <li key={word.id} className="flex items-start gap-4 py-4">
              <div className="w-16 shrink-0">
                <p className="chinese-text text-2xl leading-tight text-fg">{word.simplified}</p>
                <p className="mt-1 text-sm text-fg-3">{word.pinyin}</p>
              </div>
              <ol className="min-w-0 flex-1 space-y-1 text-[15px] text-fg">
                {senses.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    {senses.length > 1 && <span className="w-4 shrink-0 text-right tabular-nums text-fg-3">{i + 1}</span>}
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <SpeakButton src={wordSrc(word)} text={word.simplified} />
            </li>
          )
        })}
      </ul>
    </Screen>
  )
}
