import { Rating, State, createEmptyCard, fsrs, generatorParameters } from 'ts-fsrs'

/*
 * Répétition espacée, en deux temps.
 *   Apprentissage : 3 bonnes réponses d'affilée (successCount 0 → 3) font passer un élément à « maîtrisé » ; une erreur
 *   ramène à 0 (les questions redeviennent faciles) et compte dans misses.
 *   Révisions : algorithme FSRS (ts-fsrs, licence MIT, le même qu'Anki). Pour chaque élément, il estime la difficulté et
 *   la durée pendant laquelle il est retenu, d'après les réponses ; la révision suivante tombe quand on a encore 90 %
 *   de chances de s'en souvenir. Un élément bien su revient de plus en plus tard (3, 14, 57, 196 jours, un an au plus),
 *   un élément difficile plus souvent. Une erreur raccourcit l'intervalle sans tout effacer ; après LEECH_LAPSES
 *   oublis, l'élément repasse en apprentissage.
 *
 * Progression enregistrée : { wordId, level, successCount, misses, known, nextReview (AAAA-MM-JJ), reviewInterval
 * (jours), card? } ; card : état FSRS { s (stabilité, jours), d (difficulté 1-10), reps, lapses, last, due (ISO) }.
 * Enregistrements d'avant FSRS (card absent) : reconstitués à partir de reviewInterval à la révision suivante.
 */

export const LEECH_LAPSES = 4

const scheduler = fsrs(generatorParameters({
  request_retention: 0.9,
  maximum_interval: 365,
  enable_fuzz: true, // étale les révisions : pas tous les mots appris le même jour à revoir le même jour
  enable_short_term: false, // pas d'étapes en minutes : on pratique par séances
}))

/** Note d'une bonne réponse : 'hard' (avec des hésitations ou des erreurs), 'good', 'easy'. */
const RATINGS = { hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy }

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

/** État FSRS d'un élément ; un élément maîtrisé d'avant FSRS est reconstitué depuis son dernier intervalle. */
function cardOf(progress, now) {
  const c = progress.card
  if (c) {
    return {
      ...createEmptyCard(now),
      stability: c.s,
      difficulty: c.d,
      reps: c.reps,
      lapses: c.lapses,
      state: State.Review,
      last_review: new Date(c.last),
      due: new Date(c.due),
    }
  }
  if (progress.known && progress.reviewInterval && progress.nextReview) {
    return {
      ...createEmptyCard(now),
      stability: progress.reviewInterval,
      difficulty: 5,
      reps: 1,
      state: State.Review,
      last_review: new Date(addDays(progress.nextReview, -progress.reviewInterval)),
      due: new Date(progress.nextReview),
    }
  }
  return null
}

/** Applique une note FSRS et reporte l'échéance dans la progression. */
function schedule(progress, card, rating, now) {
  const next = scheduler.next(card ?? createEmptyCard(now), now, rating).card
  return {
    ...progress,
    known: true,
    nextReview: next.due.toISOString().split('T')[0],
    reviewInterval: next.scheduled_days,
    card: {
      s: Number(next.stability.toFixed(3)),
      d: Number(next.difficulty.toFixed(3)),
      reps: next.reps,
      lapses: next.lapses,
      last: now.toISOString(),
      due: next.due.toISOString(),
    },
  }
}

/**
 * Bonne réponse. En apprentissage, un pas de plus ; à la 3e, l'élément est maîtrisé et sa première révision est
 * planifiée (plus tôt s'il y a eu des erreurs pendant l'apprentissage). En révision, FSRS allonge l'intervalle.
 */
export function applySuccess(progress, quality = 'good', now = new Date()) {
  if (progress.known) return schedule(progress, cardOf(progress, now), RATINGS[quality], now)
  const successCount = progress.successCount + 1
  if (successCount < 3) return { ...progress, successCount }
  const card = cardOf(progress, now)
  const rating = card ? Rating.Good : progress.misses ? Rating.Hard : RATINGS[quality]
  return schedule({ ...progress, successCount, misses: 0 }, card, rating, now)
}

/**
 * Mauvaise réponse. En apprentissage : retour aux questions faciles. En révision : l'élément reste maîtrisé mais
 * revient bientôt (FSRS « oublié ») ; à partir de LEECH_LAPSES oublis, il repasse en apprentissage.
 */
export function applyFailure(progress, now = new Date()) {
  if (!progress.known) return { ...progress, successCount: 0, misses: (progress.misses || 0) + 1 }
  const lapsed = schedule(progress, cardOf(progress, now), Rating.Again, now)
  if (lapsed.card.lapses < LEECH_LAPSES) return lapsed
  return { ...lapsed, known: false, successCount: 0, misses: 1, nextReview: null, reviewInterval: null }
}

/** Planification FSRS d'une leçon réussie (pinyin, grammaire, lecture) : voir lessonProgress.js. */
export function scheduleLesson(progress, quality, now = new Date()) {
  const card = cardOf(progress, now)
  return schedule(progress, card, RATINGS[quality], now)
}
