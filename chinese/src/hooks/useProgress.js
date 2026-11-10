import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllProgress, saveManyProgress, REMOTE_PROGRESS_EVENT } from '../db/index.js'
import { createInitialProgress } from '../utils/spacedrep.js'

/**
 * Loads all user progress from IndexedDB and exposes helpers to read/update it.
 * progressMap: Map<wordId, progressObject>
 * latestMap(): la Map à jour, modifications pas encore affichées comprises (pour calculer une modification à partir
 * d'une autre faite juste avant, sans attendre le rendu).
 */
export function useProgress() {
  const [progressMap, setProgressMap] = useState(null) // null = loading
  const current = useRef(null)

  useEffect(() => {
    const load = () => getAllProgress().then(list => {
      current.current = new Map(list.map(p => [p.wordId, p]))
      setProgressMap(current.current)
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

  const latestMap = useCallback(() => current.current, [])

  const applyUpdates = useCallback(async (updates) => {
    // updates: array of progress objects
    const next = new Map(current.current)
    for (const p of updates) next.set(p.wordId, p)
    current.current = next
    await saveManyProgress(updates)
    setProgressMap(current.current)
  }, [])

  return { progressMap, latestMap, getProgress, applyUpdates, loading: progressMap === null }
}
