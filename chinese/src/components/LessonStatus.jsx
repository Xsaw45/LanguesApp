import { Check, Lock } from 'lucide-react'
import { isLessonDue, isLessonPassed } from '../utils/lessonProgress.js'
import { ICON_SM, percent } from './uiStyles.js'

/** État d'une leçon dans une liste : verrouillée, à revoir, réussie, tentée ou à faire. */
export function LessonStatus({ progress, unlocked }) {
  if (!unlocked) return <Lock {...ICON_SM} className="text-fg-3" />
  if (progress.known && isLessonDue(progress)) return <span className="text-sm text-accent">À revoir</span>
  if (isLessonPassed(progress)) {
    return <span className="inline-flex items-center gap-1 text-sm tabular-nums text-good"><Check {...ICON_SM} />{percent(progress.bestPct)}</span>
  }
  if (progress.bestPct > 0) return <span className="text-sm tabular-nums text-fg-3">{percent(progress.bestPct)}</span>
  return <span className="text-sm text-accent">À faire</span>
}
