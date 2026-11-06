import { useMemo, useState } from 'react'
import manifest from '../data/audio.json'
import { ALL_INITIALS, splitInitial, withTone } from '../utils/pinyin.js'
import { play, syllableSrc } from '../utils/audio.js'
import { ToneCurve } from './ToneCurve.jsx'

// Syllabes enregistrées, regroupées par consonne initiale : base → tons disponibles.
function useSyllablesByInitial() {
  return useMemo(() => {
    const tones = new Map()
    for (const s of manifest.syllables) {
      const base = s.slice(0, -1)
      tones.set(base, [...(tones.get(base) || []), Number(s.slice(-1))])
    }
    const byInitial = new Map(ALL_INITIALS.map(i => [i, []]))
    for (const base of [...tones.keys()].sort()) byInitial.get(splitInitial(base).initial)?.push(base)
    return { byInitial, tones }
  }, [])
}

export function PinyinChart({ onBack }) {
  const { byInitial, tones } = useSyllablesByInitial()
  const [initial, setInitial] = useState('b')
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-sm shrink-0">← Retour</button>
        <h1 className="text-white font-bold text-lg flex-1 text-center">Tableau des sons</h1>
        <div className="w-14 shrink-0" />
      </div>

      <div className="px-4 py-3 border-b border-slate-800">
        <p className="text-slate-500 text-xs mb-2">Consonne de départ</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_INITIALS.map(i => (
            <button
              key={i || '-'}
              onClick={() => { setInitial(i); setSelected(null) }}
              className={`min-w-10 px-2.5 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                i === initial ? 'bg-red-600 border-red-600 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {i || 'aucune'}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900">
          <p className="text-slate-400 text-xs mb-2">Touche un ton pour l'écouter</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(t => tones.get(selected).includes(t) && (
              <button
                key={t}
                onClick={() => play(syllableSrc(`${selected}${t}`))}
                className="flex flex-col items-center gap-0.5 rounded-xl border border-slate-600 bg-slate-800 hover:border-slate-400 py-2 text-red-400"
              >
                <span className="text-xl font-bold text-white">{withTone(selected, t)}</span>
                <ToneCurve tone={t} className="w-8 h-6" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          {byInitial.get(initial).map(base => (
            <button
              key={base}
              onClick={() => { setSelected(base); play(syllableSrc(`${base}${tones.get(base)[0]}`)) }}
              className={`py-3 rounded-xl border text-base font-semibold transition-all ${
                base === selected ? 'border-red-500 bg-slate-800 text-white' : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'
              }`}
            >
              {base.replaceAll('v', 'ü')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
