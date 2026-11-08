import { useMemo, useState } from 'react'
import manifest from '../data/audio.json'
import { ALL_INITIALS, splitInitial, withTone } from '../utils/pinyin.js'
import { play, syllableSrc } from '../utils/audio.js'
import { ToneCurve } from './ToneCurve.jsx'
import { Screen, TopBar } from './ui.jsx'

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

  const selectedClass = 'border-accent/50 bg-accent/10 text-fg'
  const idleClass = 'border-line bg-card text-fg hover:bg-raised'

  return (
    <Screen>
      <TopBar onBack={onBack} title="Tableau des sons" bordered />

      <div className="border-b border-line px-5 py-4">
        <p className="mb-3 text-sm text-fg-2">Consonne de départ</p>
        <div className="flex flex-wrap gap-2">
          {ALL_INITIALS.map(i => (
            <button
              key={i || '-'}
              type="button"
              onClick={() => { setInitial(i); setSelected(null) }}
              className={`h-9 min-w-10 rounded-lg border px-3 text-[15px] font-medium transition-colors duration-150 ease-out ${i === initial ? selectedClass : idleClass}`}
            >
              {i || 'aucune'}
            </button>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-10 border-b border-line bg-page px-5 py-4">
        {selected ? (
          <>
            <p className="mb-3 text-sm text-fg-2">Touche un ton pour l'écouter</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(t => tones.get(selected).includes(t) && (
                <button
                  key={t}
                  type="button"
                  onClick={() => play(syllableSrc(`${selected}${t}`))}
                  className="flex h-20 flex-col items-center justify-center gap-1 rounded-xl border border-line bg-card transition-colors duration-150 ease-out hover:bg-raised active:bg-raised-2"
                >
                  <span className="text-xl font-medium text-fg">{withTone(selected, t)}</span>
                  <ToneCurve tone={t} className="h-6 w-8 text-accent" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-fg-3">Choisis une syllabe pour l'écouter à chaque ton</p>
        )}
      </div>

      <div className="grid flex-1 auto-rows-min grid-cols-4 gap-2 px-5 py-4 pb-8">
        {byInitial.get(initial).map(base => (
          <button
            key={base}
            type="button"
            onClick={() => { setSelected(base); play(syllableSrc(`${base}${tones.get(base)[0]}`)) }}
            className={`h-12 rounded-[10px] border text-base font-medium transition-colors duration-150 ease-out ${base === selected ? selectedClass : idleClass}`}
          >
            {base.replaceAll('v', 'ü')}
          </button>
        ))}
      </div>
    </Screen>
  )
}
