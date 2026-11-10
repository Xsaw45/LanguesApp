import { ALL_LEVELS, getWordsForLevel } from '../data/index.js'
import { buildQuestion } from './quiz.js'
import { addDays, createInitialProgress, today } from './spacedrep.js'

// Tests de niveau du vocabulaire.
//   Placement (premier lancement) : PLACEMENT_PER_LEVEL questions par niveau, du HSK 1 vers le haut, tant que le
//   niveau est réussi (PLACEMENT_PASS) ; le dernier niveau réussi est le niveau de l'utilisateur.
//   Déblocage : UNLOCK_TEST_SIZE mots du niveau qui bloque le suivant, UNLOCK_PASS pour le passer.
// Un niveau réussi n'est pas marqué maîtrisé d'un coup : ses mots sont planifiés en révision (FSRS les confirme ou
// les renvoie en apprentissage). Mots réussis au test : révision dans 2 à 6 semaines ; mots non testés (« sans doute
// connus ») : étalés sur 3 à 20 semaines pour ne pas tout réviser le même jour ; mots ratés : restent à apprendre.

export const PLACEMENT_PER_LEVEL = 8
export const PLACEMENT_PASS = 0.75
export const UNLOCK_TEST_SIZE = 20
export const UNLOCK_PASS = 0.8
export const PLACEMENT_KEY = 'placement' // réglage synchronisé : { level, date } une fois le test fait

const TESTED_DAYS = [14, 45]
const UNTESTED_DAYS = [20, 140]
const PARTIAL_DAYS = [7, 21] // niveau raté au placement : mots réussis seulement

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const between = ([min, max]) => min + Math.floor(Math.random() * (max - min + 1))

/**
 * Questions à choix (sens, ou caractère d'après le sens) sur n mots du niveau ; seulement des mots jamais travaillés
 * si possible (ceux qu'on a déjà en cours ou maîtrisés ne prouvent rien de nouveau).
 */
export function levelTestQuestions(level, n, progressMap) {
  const words = getWordsForLevel(level)
  const unseen = words.filter(w => !progressMap?.has(w.id))
  const pool = unseen.length >= n ? unseen : words
  const questions = []
  for (const word of shuffle(pool)) {
    const question = buildQuestion(word, createInitialProgress(word.id, word.level))
    if (question.options) questions.push(question) // QCM impossible pour ce mot : il serait à taper
    if (questions.length === n) break
  }
  return questions
}

/** Mot « placé » : maîtrisé d'après un test, première révision dans `days` jours. */
function placed(word, days, now) {
  const due = addDays(today(), days)
  return {
    ...createInitialProgress(word.id, word.level),
    successCount: 3,
    known: true,
    placed: true, // ne compte pas dans les mots appris de la semaine (activity.js)
    nextReview: due,
    reviewInterval: days,
    card: { s: days, d: 5, reps: 1, lapses: 0, last: now.toISOString(), due: new Date(due).toISOString() },
  }
}

/**
 * Progressions à enregistrer pour un niveau testé. answers : Map wordId → bonne réponse. passed : niveau réussi
 * (les mots non testés sont alors placés aussi). Les mots qui ont déjà une progression ne changent pas.
 */
export function levelUpdates(level, answers, passed, progressMap, now = new Date()) {
  const updates = []
  for (const word of getWordsForLevel(level)) {
    if (progressMap?.has(word.id)) continue
    const answer = answers.get(word.id)
    if (answer === true) updates.push(placed(word, between(passed ? TESTED_DAYS : PARTIAL_DAYS), now))
    else if (answer === undefined && passed) updates.push(placed(word, between(UNTESTED_DAYS), now))
  }
  return updates
}

/** Niveaux suivants du placement : du premier niveau jusqu'au dernier. */
export const PLACEMENT_LEVELS = ALL_LEVELS
