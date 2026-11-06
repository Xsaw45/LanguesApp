export const REVIEW_INTERVALS = [3, 7, 21, 30] // days

export function createInitialProgress(wordId, level) {
  return {
    wordId,
    level,
    successCount: 0,
    known: false,
    nextReview: null,
    reviewInterval: null,
  }
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function today() {
  return new Date().toISOString().split('T')[0]
}

export function isDueForReview(progress) {
  if (!progress.known || !progress.nextReview) return false
  return progress.nextReview <= today()
}

export function isActive(progress) {
  return !progress.known || isDueForReview(progress)
}

export function applySuccess(progress) {
  const next = { ...progress }

  if (!progress.known) {
    next.successCount = progress.successCount + 1
    if (next.successCount >= 3) {
      next.known = true
      next.reviewInterval = REVIEW_INTERVALS[0]
      next.nextReview = addDays(today(), REVIEW_INTERVALS[0])
    }
  } else {
    // Successful review: advance interval
    const currentIdx = REVIEW_INTERVALS.indexOf(progress.reviewInterval)
    const nextInterval = currentIdx >= 0 && currentIdx < REVIEW_INTERVALS.length - 1
      ? REVIEW_INTERVALS[currentIdx + 1]
      : REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1]
    next.reviewInterval = nextInterval
    next.nextReview = addDays(today(), nextInterval)
  }

  return next
}

export function applyFailure(progress) {
  return {
    ...progress,
    successCount: 0,
    known: false,
    nextReview: null,
    reviewInterval: null,
  }
}
