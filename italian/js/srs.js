/**
 * Répétition espacée (vocabulaire, conjugaison, traduction), en deux temps.
 *   Apprentissage (phase 0) : un cycle d'au moins 3 essais avec 80 % de bonnes réponses fait passer l'élément à
 *   « maîtrisé » (phase 1), puis 2 après sa première révision réussie.
 *   Révisions : algorithme FSRS (vendor/ts-fsrs.js, le même qu'Anki). Il estime pour chaque élément sa difficulté et
 *   la durée pendant laquelle il est retenu ; la révision suivante tombe quand on a encore 90 % de chances de s'en
 *   souvenir (3, 14, 57… jours, un an au plus). Une erreur raccourcit l'intervalle sans tout effacer ; après
 *   LEECH_LAPSES oublis, l'élément repasse en apprentissage. Plus rien n'est archivé pour toujours.
 *
 * Entrée : { attempts, correct, lastAttempt, phase (0-2), cooldownUntil (prochaine révision, ISO), cycleAttempts,
 * cycleCorrect, card? } ; card : état FSRS { s (stabilité, jours), d (difficulté), reps, lapses, last, due }.
 */
import { Rating, State, createEmptyCard, fsrs, generatorParameters } from './vendor/ts-fsrs.js';

export const LEARNING_LIMIT = 20; // éléments en apprentissage à la fois, au plus
export const LEECH_LAPSES = 4;
const CYCLE_MIN_ATTEMPTS = 3;
const CYCLE_ACCURACY = 0.8;

const scheduler = fsrs(generatorParameters({
  request_retention: 0.9,
  maximum_interval: 365,
  enable_fuzz: true,
  enable_short_term: false,
}));

const DAY = 24 * 60 * 60 * 1000;

export function normalizeEntry(raw) {
  const entry = raw || {};
  return {
    attempts: entry.attempts || 0,
    correct: entry.correct || 0,
    lastAttempt: entry.lastAttempt || null,
    phase: Math.min(entry.phase || 0, 2),
    cooldownUntil: entry.cooldownUntil || null,
    cycleAttempts: entry.cycleAttempts || 0,
    cycleCorrect: entry.cycleCorrect || 0,
    ...(entry.card ? { card: entry.card } : {}),
  };
}

/**
 * Conversion des entrées d'avant FSRS (phases 1 à 3 avec pauses de 2 et 7 jours, phase 3 archivée) : état FSRS
 * reconstitué. Un élément archivé dont la révision serait déjà passée revient dans les 30 prochains jours (étalé au
 * hasard) plutôt que tous le même jour. À enregistrer une fois (voir state.js).
 */
export function migrateEntry(raw, now = new Date()) {
  if (!raw || raw.card || !raw.phase) return raw;
  const stability = [0, 2, 7, 30][Math.min(raw.phase, 3)];
  const last = raw.lastAttempt ? new Date(raw.lastAttempt) : now;
  let due = raw.cooldownUntil ? new Date(raw.cooldownUntil) : new Date(last.getTime() + stability * DAY);
  if (raw.phase >= 3 && due <= now) due = new Date(now.getTime() + (1 + Math.floor(Math.random() * 30)) * DAY);
  return {
    ...normalizeEntry(raw),
    phase: raw.phase >= 2 ? 2 : 1,
    cooldownUntil: due.toISOString(),
    card: { s: stability, d: 5, reps: Math.min(raw.phase, 3), lapses: 0, last: last.toISOString(), due: due.toISOString() },
  };
}

function cardOf(entry, now) {
  const c = entry.card;
  if (!c) return null;
  return {
    ...createEmptyCard(now),
    stability: c.s,
    difficulty: c.d,
    reps: c.reps,
    lapses: c.lapses,
    state: State.Review,
    last_review: new Date(c.last),
    due: new Date(c.due),
  };
}

function schedule(entry, rating, now) {
  const next = scheduler.next(cardOf(entry, now) ?? createEmptyCard(now), now, rating).card;
  return {
    ...entry,
    phase: next.reps >= 2 ? 2 : 1,
    cooldownUntil: next.due.toISOString(),
    card: {
      s: Number(next.stability.toFixed(3)),
      d: Number(next.difficulty.toFixed(3)),
      reps: next.reps,
      lapses: next.lapses,
      last: now.toISOString(),
      due: next.due.toISOString(),
    },
  };
}

/** Nouvelle entrée après une réponse. */
export function applyResult(raw, isCorrect, now = new Date()) {
  let entry = normalizeEntry(raw);
  entry = {
    ...entry,
    attempts: entry.attempts + 1,
    correct: entry.correct + (isCorrect ? 1 : 0),
    lastAttempt: now.toISOString(),
  };

  if (entry.phase >= 1) {
    if (isCorrect) return schedule(entry, Rating.Good, now);
    const lapsed = schedule(entry, Rating.Again, now);
    if (lapsed.card.lapses < LEECH_LAPSES) return lapsed;
    return { ...lapsed, phase: 0, cooldownUntil: null, cycleAttempts: 0, cycleCorrect: 0 };
  }

  const cycleAttempts = entry.cycleAttempts + 1;
  const cycleCorrect = entry.cycleCorrect + (isCorrect ? 1 : 0);
  if (cycleAttempts < CYCLE_MIN_ATTEMPTS || cycleCorrect / cycleAttempts < CYCLE_ACCURACY) {
    return { ...entry, cycleAttempts, cycleCorrect };
  }
  // Maîtrisé : première révision plus tôt si le cycle a eu des erreurs.
  const rating = entry.card || cycleCorrect === cycleAttempts ? Rating.Good : Rating.Hard;
  return schedule({ ...entry, cycleAttempts: 0, cycleCorrect: 0 }, rating, now);
}

export const isMastered = entry => normalizeEntry(entry).phase >= 1;

/** Prochaine révision pas encore arrivée. */
export function isOnCooldown(entry, now = new Date()) {
  const e = normalizeEntry(entry);
  return e.phase >= 1 && !!e.cooldownUntil && new Date(e.cooldownUntil) > now;
}

/** Révision arrivée à échéance. */
export function isDue(entry, now = new Date()) {
  const e = normalizeEntry(entry);
  return e.phase >= 1 && !!e.cooldownUntil && new Date(e.cooldownUntil) <= now;
}

/** Jours avant la prochaine révision (0 si elle est due ou s'il n'y en a pas). */
export function daysUntilReview(entry, now = new Date()) {
  const e = normalizeEntry(entry);
  if (e.phase < 1 || !e.cooldownUntil) return 0;
  return Math.max(0, Math.ceil((new Date(e.cooldownUntil) - now) / DAY));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Éléments d'un test, dans cet ordre de priorité : révisions dues (les plus en retard d'abord), éléments en cours
 * d'apprentissage, puis nouveaux (dans l'ordre de la liste, donc des niveaux les plus bas d'abord) tant que moins de
 * LEARNING_LIMIT éléments sont en cours. Le rythme suit l'utilisateur : qui maîtrise vite reçoit de nouveaux
 * éléments, qui a du mal retravaille les mêmes, les révisions en retard passent avant tout.
 * items : éléments dans l'ordre d'apprentissage ; entryOf(item) : entrée enregistrée (ou undefined).
 */
export function buildPool(items, entryOf, size, now = new Date()) {
  const due = [];
  const learning = [];
  const fresh = [];
  for (const item of items) {
    const raw = entryOf(item);
    const entry = normalizeEntry(raw);
    if (entry.phase >= 1) {
      if (isDue(entry, now)) due.push({ item, at: entry.cooldownUntil });
    } else if (entry.attempts > 0) {
      learning.push(item);
    } else {
      fresh.push(item);
    }
  }
  const reviews = shuffle(due).sort((a, b) => a.at.localeCompare(b.at)).map(d => d.item);
  const newItems = fresh.slice(0, Math.max(0, LEARNING_LIMIT - learning.length));
  return shuffle([...reviews, ...shuffle(learning), ...shuffle(newItems)].slice(0, size));
}
