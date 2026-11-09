import { CHARS_BY_RADICAL, HANZI, HANZI_LEVELS, charsForLevel, hanziKey } from '../data/hanzi.js'
import { RADICALS, radicalForms } from '../data/radicals.js'
import { LANGS } from '../i18n/text.js'
import { createInitialProgress, isDueForReview } from './spacedrep.js'

/** Niveau en cours : le premier qui n'est pas entièrement maîtrisé. */
export const currentHanziLevel = progressMap =>
  HANZI_LEVELS.find(lv => charsForLevel(lv).some(ch => !getCharProgress(progressMap, ch).known)) ?? HANZI_LEVELS[0]

export const HANZI_PRACTICE_SIZE = 10
export const RADICAL_QUIZ_SIZE = 10
export const HANZI_LEVEL = 'hz'
export const RADICAL_LEVEL = 'rad'
const CHOICES = 4

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

export function getCharProgress(progressMap, ch) {
  const key = hanziKey(ch)
  return progressMap?.get(key) || createInitialProgress(key, HANZI_LEVEL)
}

/** Erreurs tolérées pour réussir un caractère : 1 jusqu'à 7 traits, puis 1 de plus tous les 4 traits. */
export const allowedMistakes = ch => Math.max(1, Math.floor(ch.strokes / 4))

/**
 * Caractères d'une séance : révisions arrivées à échéance (tous niveaux), puis ceux en cours d'apprentissage du
 * niveau choisi, puis ses nouveaux caractères, les plus simples (moins de traits) d'abord.
 * Étape de chaque caractère : 0 bonne réponse → tracer sur le modèle ; ensuite → écrire de mémoire.
 */
export function buildHanziPractice(progressMap, level) {
  const due = HANZI.filter(ch => isDueForReview(getCharProgress(progressMap, ch)))
  const learning = []
  const fresh = []
  for (const ch of charsForLevel(level)) {
    const p = getCharProgress(progressMap, ch)
    if (p.known) continue
    ;(p.successCount > 0 ? learning : fresh).push(ch)
  }
  fresh.sort((a, b) => a.strokes - b.strokes)
  const selected = [...shuffle(due), ...shuffle(learning), ...fresh].slice(0, HANZI_PRACTICE_SIZE)
  return shuffle(selected).map(ch => ({ ch, trace: getCharProgress(progressMap, ch).successCount === 0 }))
}

// ── Clés ───────────────────────────────────────────────────────────────────

export const radicalKey = n => `rad_${n}`

/** Clés testées : celles d'au moins 3 caractères des HSK 1 à 6, les plus fréquentes d'abord. */
export const QUIZ_RADICALS = [...CHARS_BY_RADICAL.entries()]
  .filter(([, chars]) => chars.length >= 3)
  .sort((a, b) => b[1].length - a[1].length)
  .map(([n]) => RADICALS.get(n))

export function getRadicalProgress(progressMap, radical) {
  const key = radicalKey(radical.n)
  return progressMap?.get(key) || createInitialProgress(key, RADICAL_LEVEL)
}

/** Formes d'une clé hors contexte : la simplifiée d'abord (讠 言), deux au plus. */
export const displayForms = radical => radicalForms(radical.n, true).slice(0, 2)

const sameLabel = (a, b) => LANGS.some(lang => a.meaning[lang].toLowerCase() === b.meaning[lang].toLowerCase())

/** 3 autres clés testées, de sens différents entre elles et de la bonne réponse. */
function wrongRadicals(radical) {
  const chosen = []
  for (const r of shuffle(QUIZ_RADICALS)) {
    if (chosen.length === CHOICES - 1) break
    if (r.n === radical.n || [radical, ...chosen].some(o => sameLabel(o, r))) continue
    chosen.push(r)
  }
  return chosen
}

function meaningQuestion(radical) {
  const options = shuffle([radical, ...wrongRadicals(radical)])
    .map(r => ({ key: r.n, label: r.meaning, correct: r === radical }))
  return { radical, type: 'meaning', options }
}

/** Un caractère qui contient la clé (pas la clé elle-même) → choisir sa clé. */
function charQuestion(radical) {
  const candidates = CHARS_BY_RADICAL.get(radical.n).filter(ch => !radical.forms.includes(ch.c) && ch.c !== radical.simplified)
  if (!candidates.length) return meaningQuestion(radical)
  const ch = pick(candidates.slice(0, 12)) // parmi les plus courants (ordre des listes HSK)
  const forms = r => (r === radical ? radicalForms(r.n, ch.simplifiedRadical) : displayForms(r)).slice(0, 2).join(' ')
  const options = shuffle([radical, ...wrongRadicals(radical)])
    .map(r => ({ key: r.n, label: forms(r), correct: r === radical }))
  return { radical, type: 'char', ch, options }
}

/** Clés à réviser, puis en cours d'apprentissage, puis nouvelles par fréquence ; complété par les autres. */
export function buildRadicalQuiz(progressMap) {
  const due = []
  const learning = []
  const fresh = []
  const rest = []
  for (const r of QUIZ_RADICALS) {
    const p = getRadicalProgress(progressMap, r)
    if (p.known && isDueForReview(p)) due.push(r)
    else if (p.known) rest.push(r)
    else if (p.successCount > 0) learning.push(r)
    else fresh.push(r)
  }
  const selected = [...shuffle(due), ...shuffle(learning), ...fresh, ...shuffle(rest)].slice(0, RADICAL_QUIZ_SIZE)
  return shuffle(selected).map(r => (Math.random() < 0.5 ? meaningQuestion(r) : charQuestion(r)))
}
