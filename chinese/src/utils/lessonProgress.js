import { REVIEW_INTERVALS, addDays, today, isDueForReview } from './spacedrep.js'

// Progression d'une leçon (pinyin, point de grammaire) : un enregistrement synchronisé par leçon.
export const PASS_THRESHOLD = 0.8

/** Progression enregistrée, ou initiale. key : 'py_tons', 'gr_shi'… ; level : 'py' | 'gr' */
export function lessonProgress(progressMap, key, level) {
  return progressMap?.get(key) || {
    wordId: key,
    level,
    bestPct: 0,
    passes: 0,
    known: false,
    nextReview: null,
    reviewInterval: null,
  }
}

export const isLessonDue = progress => isDueForReview(progress)
export const isLessonPassed = progress => progress.bestPct >= PASS_THRESHOLD

/** Réussite (≥ 80 %) : leçon validée, prochaine révision de plus en plus espacée. Échec : seul le record change. */
export function applyLessonResult(progress, pct) {
  const next = { ...progress, bestPct: Math.max(progress.bestPct, pct) }
  if (pct < PASS_THRESHOLD) return next
  next.passes = progress.passes + 1
  next.known = true
  next.reviewInterval = REVIEW_INTERVALS[Math.min(next.passes, REVIEW_INTERVALS.length) - 1]
  next.nextReview = addDays(today(), next.reviewInterval)
  return next
}
