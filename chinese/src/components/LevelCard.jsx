import { Check, Lock } from 'lucide-react'
import { ProgressBar } from './ui.jsx'
import { ICON_SM, percent } from './uiStyles.js'

export function LevelCard({ stat, unlocked, last }) {
  const remaining = Math.ceil(stat.total * 0.8) - stat.known

  return (
    <div className={`rounded-2xl border border-line p-4 ${unlocked ? 'bg-card' : 'bg-page opacity-60'}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-base font-medium text-fg">
          HSK {stat.level}
          {!unlocked && <Lock {...ICON_SM} className="text-fg-3" />}
        </span>
        <span className="text-sm tabular-nums text-fg-3">{stat.known} / {stat.total}</span>
      </div>

      <ProgressBar value={stat.pct} />

      <div className="mt-2 flex justify-between gap-3 text-sm text-fg-3">
        <span className="tabular-nums">{percent(stat.pct)} maîtrisés</span>
        {unlocked && !last && remaining > 0 && (
          <span className="tabular-nums">encore {remaining} pour débloquer HSK {stat.level + 1}</span>
        )}
        {unlocked && !last && remaining <= 0 && (
          <span className="inline-flex items-center gap-1 text-good"><Check {...ICON_SM} />HSK {stat.level + 1} débloqué</span>
        )}
      </div>
    </div>
  )
}
