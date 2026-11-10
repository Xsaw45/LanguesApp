/**
 * Progress and state management using localStorage, synchronised per Tailscale user (shared/sync.js).
 */
import { createSync } from '../../shared/sync.js';
import {
  applyResult, daysUntilReview, isDue, isMastered, isOnCooldown, migrateEntry, normalizeEntry,
} from './srs.js';

const STORAGE_KEY = 'italienapp-progress';

// One sync record per entry of these maps ("vocab/casa", "conjugation/parlare_presente_lui/lei"...),
// one record per other top-level field ("settings", "lastActive").
const COLLECTIONS = ['schede', 'vocab', 'conjugation', 'translation'];

function createDefaultState() {
  return {
    version: 1,
    lastActive: null,
    settings: {
      strictAccents: false,
      darkMode: false,
      language: 'it'
    },
    schede: {}
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const state = JSON.parse(raw);
    if (!state.version) return createDefaultState();
    return state;
  } catch {
    return createDefaultState();
  }
}

function toRecords(state) {
  const records = new Map();
  const add = (key, value) => {
    if (value !== undefined) records.set(key, JSON.stringify(value));
  };
  for (const [field, value] of Object.entries(state)) {
    if (field === 'version') continue;
    if (COLLECTIONS.includes(field)) {
      for (const [id, entry] of Object.entries(value || {})) add(`${field}/${id}`, entry);
    } else {
      add(field, value);
    }
  }
  return records;
}

function applyRemote(records) {
  const state = loadState();
  const defaults = createDefaultState();
  for (const { key, value } of records) {
    const slash = key.indexOf('/');
    const field = slash > 0 ? key.slice(0, slash) : key;
    if (COLLECTIONS.includes(field) && slash > 0) {
      const id = key.slice(slash + 1);
      state[field] = state[field] || {};
      if (value === null) delete state[field][id];
      else state[field][id] = migrateEntry(value); // from a device still on the pre-FSRS version
    } else if (value === null) {
      if (field in defaults) state[field] = defaults[field];
      else delete state[field];
    } else {
      state[field] = value;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const sync = createSync({
  app: 'it',
  applyRemote,
  resetLocal: () => localStorage.removeItem(STORAGE_KEY),
});

export function saveState(state) {
  const before = toRecords(loadState());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Could not save state to localStorage');
    return;
  }
  const after = toRecords(state);
  const changes = [];
  for (const [key, json] of after) {
    if (before.get(key) !== json) changes.push({ key, value: JSON.parse(json) });
  }
  for (const key of before.keys()) {
    if (!after.has(key)) changes.push({ key, value: null });
  }
  sync.track(changes);
}

export function getSchedaState(schedaId) {
  const state = loadState();
  return state.schede[schedaId] || null;
}

export function markTheoryViewed(schedaId) {
  const state = loadState();
  if (!state.schede[schedaId]) {
    state.schede[schedaId] = { theoryViewed: false, exercises: {} };
  }
  state.schede[schedaId].theoryViewed = true;
  state.lastActive = schedaId;
  saveState(state);
}

export function saveExerciseResult(schedaId, exerciseId, score, total) {
  const state = loadState();
  if (!state.schede[schedaId]) {
    state.schede[schedaId] = { theoryViewed: false, exercises: {} };
  }

  const prev = state.schede[schedaId].exercises[exerciseId];
  const attempts = prev && prev.attempts ? prev.attempts + 1 : 1;

  state.schede[schedaId].exercises[exerciseId] = {
    score,
    total,
    attempts,
    lastAttempt: new Date().toISOString()
  };

  state.lastActive = schedaId;
  saveState(state);
}

export function markOpenEndedDone(schedaId, exerciseId) {
  const state = loadState();
  if (!state.schede[schedaId]) {
    state.schede[schedaId] = { theoryViewed: false, exercises: {} };
  }
  state.schede[schedaId].exercises[exerciseId] = {
    attempted: true,
    lastAttempt: new Date().toISOString()
  };
  state.lastActive = schedaId;
  saveState(state);
}

export function getSettings() {
  return loadState().settings;
}

export function updateSettings(newSettings) {
  const state = loadState();
  state.settings = { ...state.settings, ...newSettings };
  saveState(state);
  return state.settings;
}

/**
 * Calculate overall progress stats.
 * @param {Object} manifest - The manifest data
 * @returns {{ completed: number, total: number, percentage: number }}
 */
export function getOverallProgress(manifest) {
  const state = loadState();
  let completed = 0;
  const schedeIds = Object.keys(manifest.schede);
  const total = schedeIds.length;

  for (const id of schedeIds) {
    const schedaState = state.schede[id];
    if (schedaState && schedaState.exercises) {
      const exerciseCount = manifest.schede[id].exerciseCount || 0;
      const attemptedCount = Object.keys(schedaState.exercises).length;
      if (attemptedCount >= exerciseCount && exerciseCount > 0) {
        completed++;
      }
    }
  }

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

/**
 * Get progress for a single scheda.
 * @param {string} schedaId
 * @param {number} exerciseCount
 * @returns {'not-started'|'in-progress'|'completed'}
 */
export function getSchedaProgress(schedaId, exerciseCount) {
  const state = loadState();
  const schedaState = state.schede[schedaId];

  if (!schedaState || !schedaState.exercises || Object.keys(schedaState.exercises).length === 0) {
    if (schedaState && schedaState.theoryViewed) return 'in-progress';
    return 'not-started';
  }

  const attemptedCount = Object.keys(schedaState.exercises).length;
  if (attemptedCount >= exerciseCount && exerciseCount > 0) {
    return 'completed';
  }

  return 'in-progress';
}

/**
 * Get the last active scheda ID.
 */
export function getLastActive() {
  return loadState().lastActive;
}

// -------------------------------------------------------------------------
// Spaced repetition (vocabulary, conjugation, translation): see srs.js (FSRS).
// Entries live in state.vocab / state.conjugation / state.translation, keyed by
// word id, conjugation card id ("parlare_presente_io") or phrase id ("ph001").
// -------------------------------------------------------------------------
const UNLOCK_THRESHOLD = 0.75; // 75% of level mastered to unlock next level
const SRS_VERSION = 2; // 2: FSRS (entries carry a card), no more archived phase

/**
 * One-time conversion of pre-FSRS entries (phases with 2- and 7-day pauses, archived phase 3), called at startup
 * after the first sync. Saved (and synchronised) once; srsVersion marks it done.
 */
export function migrateProgress() {
  const state = loadState();
  if (state.srsVersion === SRS_VERSION) return;
  for (const collection of ['vocab', 'conjugation', 'translation']) {
    for (const [id, entry] of Object.entries(state[collection] || {})) state[collection][id] = migrateEntry(entry);
  }
  state.srsVersion = SRS_VERSION;
  saveState(state);
}

const entryOf = (collection, id) => loadState()[collection]?.[id];

function saveResult(collection, id, isCorrect) {
  const state = loadState();
  state[collection] = state[collection] || {};
  state[collection][id] = applyResult(state[collection][id], isCorrect);
  saveState(state);
}

// --- Vocabulary -----------------------------------------------------------

export function saveVocabResult(wordId, isCorrect) {
  saveResult('vocab', wordId, isCorrect);
}

/** Map of wordId → raw entry. */
export function getVocabState() {
  return loadState().vocab || {};
}

export const isWordOnCooldown = wordId => isOnCooldown(entryOf('vocab', wordId));
export const isWordDue = wordId => isDue(entryOf('vocab', wordId));
export const isWordMastered = wordId => isMastered(entryOf('vocab', wordId));
export const wordDaysUntilReview = wordId => daysUntilReview(entryOf('vocab', wordId));

/**
 * Get the unlocked level IDs based on mastery progress.
 * @param {Object} vocabData - The vocab.json data (levels format)
 * @returns {number[]} e.g. [1], [1, 2], or [1, 2, 3]
 */
export function getUnlockedLevels(vocabData) {
  const levels = vocabData.levels || [];
  const unlocked = [];
  for (let i = 0; i < levels.length; i++) {
    if (i === 0) { unlocked.push(levels[i].id); continue; }
    const prevWords = levels[i - 1].categories.flatMap(cat => cat.words);
    const masteredCount = prevWords.filter(w => isWordMastered(w.id)).length;
    if (prevWords.length > 0 && masteredCount / prevWords.length >= UNLOCK_THRESHOLD) unlocked.push(levels[i].id);
  }
  return unlocked;
}

// --- Conjugation (card id: "${verbId}_${tenseId}_${person}") ---------------

const CONJ_PERSONS = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];

/** All card IDs for a conjugation level */
function getConjLevelCardIds(level) {
  const ids = [];
  for (const verb of level.verbs) {
    for (const tense of level.tenses) {
      for (const person of CONJ_PERSONS) ids.push(`${verb.id}_${tense.id}_${person}`);
    }
  }
  return ids;
}

export function saveConjugationResult(cardId, isCorrect) {
  saveResult('conjugation', cardId, isCorrect);
}

export function getConjugationState() {
  return loadState().conjugation || {};
}

export const isConjugationOnCooldown = cardId => isOnCooldown(entryOf('conjugation', cardId));
export const isConjugationDue = cardId => isDue(entryOf('conjugation', cardId));
export const isConjugationMastered = cardId => isMastered(entryOf('conjugation', cardId));
export const conjugationDaysUntilReview = cardId => daysUntilReview(entryOf('conjugation', cardId));

/**
 * Get unlocked conjugation level IDs based on mastery progress.
 * @param {Object} conjData - conjugation.json data
 * @returns {number[]}
 */
export function getUnlockedConjugationLevels(conjData) {
  const levels = conjData.levels || [];
  const unlocked = [];
  for (let i = 0; i < levels.length; i++) {
    if (i === 0) { unlocked.push(levels[i].id); continue; }
    const prevCardIds = getConjLevelCardIds(levels[i - 1]);
    const masteredCount = prevCardIds.filter(id => isConjugationMastered(id)).length;
    if (prevCardIds.length > 0 && masteredCount / prevCardIds.length >= UNLOCK_THRESHOLD) unlocked.push(levels[i].id);
  }
  return unlocked;
}

// --- Translation (phrase id: "ph001") ---------------------------------------

export function saveTranslationResult(phraseId, isCorrect) {
  saveResult('translation', phraseId, isCorrect);
}

export function getTranslationState() {
  return loadState().translation || {};
}

export const isTranslationOnCooldown = phraseId => isOnCooldown(entryOf('translation', phraseId));
export const isTranslationDue = phraseId => isDue(entryOf('translation', phraseId));
export const isTranslationMastered = phraseId => isMastered(entryOf('translation', phraseId));
export const translationDaysUntilReview = phraseId => daysUntilReview(entryOf('translation', phraseId));
