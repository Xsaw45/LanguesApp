import { isDueForReview, scheduleLesson } from './spacedrep.js'

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

/**
 * Réussite (≥ 80 %) : leçon validée, prochaine révision planifiée par FSRS (plus tard après un sans-faute, plus tôt
 * de justesse). Échec : seul le record change ; une leçon à revoir le reste.
 */
export function applyLessonResult(progress, pct) {
  const next = { ...progress, bestPct: Math.max(progress.bestPct, pct) }
  if (pct < PASS_THRESHOLD) return next
  return { ...scheduleLesson(next, pct === 1 ? 'good' : 'hard'), passes: progress.passes + 1 }
}
