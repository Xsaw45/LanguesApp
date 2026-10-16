import { useMemo } from 'react'
import { ALL_LEVELS, getWordsForLevel } from '../data/index.js'

const UNLOCK_THRESHOLD = 0.80

/**
 * Returns per-level stats and which levels are unlocked.
 * progressMap: Map<wordId, progressObject> | null
 */
export function useLevels(progressMap) {
  const levelStats = useMemo(() => {
    if (!progressMap) return null

    return ALL_LEVELS.map(level => {
      const words = getWordsForLevel(level)
      const total = words.length
      const known = words.filter(w => progressMap.get(w.id)?.known).length
      const pct = total > 0 ? known / total : 0
      return { level, total, known, pct }
    })
  }, [progressMap])

  const unlockedLevels = useMemo(() => {
    if (!levelStats) return []
    const unlocked = []
    for (let i = 0; i < levelStats.length; i++) {
      const { level } = levelStats[i]
      if (i === 0) {
        unlocked.push(level) // level 1 always unlocked
      } else {
        const prev = levelStats[i - 1]
        if (prev.pct >= UNLOCK_THRESHOLD) unlocked.push(level)
      }
    }
    return unlocked
  }, [levelStats])

  return { levelStats, unlockedLevels }
}
