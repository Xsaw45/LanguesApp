import { useState, useMemo } from 'react'
import { ALL_LEVELS, getWordsForLevel } from '../data/index.js'
import { SpeakButton } from './SpeakButton.jsx'
import { wordSrc } from '../utils/audio.js'

export function VocabularyPage({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(ALL_LEVELS[0])

  const words = useMemo(() => getWordsForLevel(selectedLevel), [selectedLevel])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors text-sm shrink-0"
        >
          ← Retour
        </button>
        <h1 className="text-white font-bold text-lg flex-1 text-center">Vocabulaire</h1>
        <div className="w-14 shrink-0" />
      </div>

      {/* Level selector */}
      <div className="px-4 py-3 border-b border-slate-800">
        <select
          value={selectedLevel}
          onChange={e => setSelectedLevel(Number(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-base outline-none focus:border-red-500 appearance-none"
        >
          {ALL_LEVELS.map(l => (
            <option key={l} value={l}>
              HSK {l} — {getWordsForLevel(l).length} mots
            </option>
          ))}
        </select>
      </div>

      {/* Word count */}
      <div className="px-4 py-2">
        <p className="text-slate-500 text-xs">{words.length} mots au niveau HSK {selectedLevel}</p>
      </div>

      {/* Word list */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="flex flex-col divide-y divide-slate-800">
          {words.map(word => {
            const senses = word.definition.split(/[;|]/).map(s => s.trim()).filter(Boolean)
            return (
              <div key={word.id} className="py-3 flex gap-3 items-start">
                <div className="shrink-0 w-14 text-center">
                  <span className="chinese-text text-2xl font-bold text-white">{word.simplified}</span>
                  <p className="text-slate-500 text-xs mt-0.5">{word.pinyin}</p>
                </div>
                <SpeakButton src={wordSrc(word)} text={word.simplified} className="w-8 h-8 text-sm" />
                <div className="flex-1 min-w-0">
                  {senses.length === 1 ? (
                    <p className="text-slate-300 text-sm">{senses[0]}</p>
                  ) : (
                    <ul className="space-y-0.5">
                      {senses.map((s, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-1.5">
                          <span className="text-slate-600 shrink-0">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
