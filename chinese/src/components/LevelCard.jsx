import { Check, Lock } from 'lucide-react'
import { useLang } from '../i18n/useLang.js'
import { Button, ProgressBar } from './ui.jsx'
import { ICON_SM } from './uiStyles.js'

/** onUnlockTest : sur le premier niveau verrouillé, lance le test qui le débloque. */
export function LevelCard({ stat, unlocked, last, onUnlockTest }) {
  const { t, pct } = useLang()
  const remaining = Math.ceil(stat.total * 0.8) - stat.known

  return (
    <div className={`rounded-2xl border border-line p-4 ${unlocked ? 'bg-card' : 'bg-page'}`}>
      <div className={unlocked ? '' : 'opacity-60'}>
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-base font-medium text-fg">
            HSK {stat.level}
            {!unlocked && <Lock {...ICON_SM} className="text-fg-3" />}
          </span>
          <span className="text-sm tabular-nums text-fg-3">{stat.known} / {stat.total}</span>
        </div>

        <ProgressBar value={stat.pct} />

        <div className="mt-2 flex justify-between gap-3 text-sm text-fg-3">
          <span className="tabular-nums">{t('vocab.mastered', { pct: pct(stat.pct) })}</span>
          {unlocked && !last && remaining > 0 && (
            <span className="tabular-nums">{t('vocab.toUnlock', { n: remaining, level: stat.level + 1 })}</span>
          )}
          {unlocked && !last && remaining <= 0 && (
            <span className="inline-flex items-center gap-1 text-good"><Check {...ICON_SM} />{t('vocab.unlocked', { level: stat.level + 1 })}</span>
          )}
        </div>
      </div>
      {onUnlockTest && (
        <Button variant="secondary" onClick={onUnlockTest} className="mt-4 h-10 text-sm">
          {t('lt.unlockButton', { level: stat.level })}
        </Button>
      )}
    </div>
  )
}
