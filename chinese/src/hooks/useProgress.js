import { useState, useEffect, useCallback } from 'react'
import { getAllProgress, saveManyProgress, REMOTE_PROGRESS_EVENT } from '../db/index.js'
import { createInitialProgress } from '../utils/spacedrep.js'

/**
 * Loads all user progress from IndexedDB and exposes helpers to read/update it.
 * progressMap: Map<wordId, progressObject>
 */
export function useProgress() {
  const [progressMap, setProgressMap] = useState(null) // null = loading

  useEffect(() => {
    const load = () => getAllProgress().then(list => {
      const map = new Map(list.map(p => [p.wordId, p]))
      setProgressMap(map)
    })
    load()
    // progression modifiee depuis un autre appareil (synchronisation)
    window.addEventListener(REMOTE_PROGRESS_EVENT, load)
    return () => window.removeEventListener(REMOTE_PROGRESS_EVENT, load)
  }, [])

  const getProgress = useCallback((wordId, level) => {
    if (!progressMap) return createInitialProgress(wordId, level)
    return progressMap.get(wordId) || createInitialProgress(wordId, level)
  }, [progressMap])

  const applyUpdates = useCallback(async (updates) => {
    // updates: array of progress objects
    await saveManyProgress(updates)
    setProgressMap(prev => {
      const next = new Map(prev)
      for (const p of updates) next.set(p.wordId, p)
      return next
    })
  }, [])

  return { progressMap, getProgress, applyUpdates, loading: progressMap === null }
}
