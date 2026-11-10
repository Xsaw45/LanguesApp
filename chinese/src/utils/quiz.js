import { getWordsForLevel } from '../data/index.js'
import { isDueForReview, createInitialProgress } from './spacedrep.js'
import { parseSyllable, splitPinyin, withTone } from './pinyin.js'
import { stripParens } from './validate.js'
import { wordSrc } from './audio.js'
import { LANGS, perLang } from '../i18n/text.js'

const QUIZ_SIZE = 20
/** Mots en cours d'apprentissage à la fois, au plus : de nouveaux mots n'arrivent que quand des mots sont maîtrisés. */
export const LEARNING_LIMIT = 20
const CHOICES = 4

/*
 * Le type de question suit la progression du mot (3 bonnes réponses d'affilée pour le maîtriser) :
 *   0 bonne réponse  QCM de sens : 'meaning-choice' (caractère → sens), 'char-choice' (sens → caractère)
 *   1 bonne réponse  QCM de son : 'pinyin-choice' (caractère → pinyin avec tons), 'listen-choice' (écoute → caractère)
 *   2 et révisions   saisie : 'char-to-def' (caractère → sens), 'def-to-char' (sens → caractère ou pinyin)
 * QCM : options [{ key, label, correct, sub? }] ; label : texte, ou { fr, en } pour un sens.
 */

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

/**
 * Mots d'un test de QUIZ_SIZE, dans cet ordre de priorité :
 *   1. révisions arrivées à échéance, les plus en retard d'abord ;
 *   2. mots en cours d'apprentissage (déjà vus, pas encore maîtrisés) ;
 *   3. mots nouveaux, du niveau débloqué le plus bas d'abord, tant que moins de LEARNING_LIMIT mots sont en cours.
 * Le rythme s'adapte ainsi à l'utilisateur : qui retient vite maîtrise ses mots et en reçoit d'autres ; qui
 * a du mal retravaille les mêmes ; quand les révisions s'accumulent, elles passent avant tout le reste.
 */
export function selectQuizWords(progressMap, unlockedLevels) {
  const due = []
  const learning = []
  const fresh = new Map() // niveau → mots jamais vus
  for (const level of unlockedLevels) {
    for (const word of getWordsForLevel(level)) {
      const progress = progressMap.get(word.id)
      if (!progress) (fresh.get(level) || fresh.set(level, []).get(level)).push(word)
      else if (progress.known) { if (isDueForReview(progress)) due.push({ word, nextReview: progress.nextReview }) }
      else learning.push(word)
    }
  }
  const reviews = shuffle(due).sort((a, b) => a.nextReview.localeCompare(b.nextReview)).map(d => d.word)
  const newSlots = Math.max(0, LEARNING_LIMIT - learning.length)
  const newWords = [...fresh.keys()].sort((a, b) => a - b).flatMap(level => shuffle(fresh.get(level))).slice(0, newSlots)
  return shuffle([...reviews, ...shuffle(learning), ...newWords].slice(0, QUIZ_SIZE))
}

// --- Mauvaises réponses ---

const senseKey = s => stripParens(s).toLowerCase() || s.toLowerCase()
const firstSense = (word, lang) => (word.senses[lang] || word.senses.en)[0]

const senseCache = new WeakMap() // mot → { fr: Set, en: Set }
function sensesOf(word, lang) {
  let cached = senseCache.get(word)
  if (!cached) senseCache.set(word, (cached = {}))
  return (cached[lang] ||= new Set((word.senses[lang] || word.senses.en).map(senseKey)))
}

/** Deux mots qui partagent un sens (爸 / 爸爸, 看见 / 见) ne servent pas de mauvaise réponse l'un pour l'autre. */
function sameMeaning(a, b) {
  return LANGS.some(lang => {
    const x = sensesOf(a, lang)
    return [...sensesOf(b, lang)].some(s => x.has(s))
  })
}

const toneless = p => p.toLowerCase().replace(/\s+/g, '')
const length = w => [...w.simplified].length

/**
 * 3 autres mots du même niveau, de même longueur si possible, sans sens commun avec le mot ni entre eux ;
 * distinct(candidat, autre) : condition supplémentaire (premier sens différent, prononciation différente…).
 * Les candidats sont tirés au hasard et testés un par un : pas de parcours complet des 5 600 mots du HSK 7.
 */
function distractors(word, distinct = () => true) {
  const level = getWordsForLevel(word.level)
  const candidates = [...shuffle(level.filter(w => length(w) === length(word))), ...shuffle(level.filter(w => length(w) !== length(word)))]
  const chosen = []
  for (const w of candidates) {
    if (chosen.length === CHOICES - 1) break
    if (w.simplified === word.simplified || sameMeaning(w, word) || !distinct(w, word)) continue
    if (chosen.some(c => c.simplified === w.simplified || sameMeaning(c, w) || !distinct(w, c))) continue
    chosen.push(w)
  }
  return chosen
}

/** Les sens affichés comme options ne se ressemblent pas entre eux (même premier sens dans une langue). */
const distinctFirstSense = (w, other) => LANGS.every(lang =>
  senseKey(firstSense(w, lang)) !== senseKey(firstSense(other, lang)))

// --- Variantes de tons ---

/** "Běi jīng" → autres tons sur une syllabe (la majuscule des noms propres est gardée). */
function toneVariants(pinyin) {
  const syllables = splitPinyin(pinyin).map(s => ({ ...parseSyllable(s), upper: /^[A-ZĀÁǍÀĒÉĚÈŌÓǑÒ]/.test(s) }))
  const write = list => list.map(s => {
    const text = withTone(s.base, s.tone)
    return s.upper ? text[0].toUpperCase() + text.slice(1) : text
  }).join(' ')
  const correct = write(syllables)
  const variants = new Set()
  syllables.forEach((s, i) => {
    if (!s.tone) return
    for (const tone of [1, 2, 3, 4]) {
      if (tone !== s.tone) variants.add(write(syllables.map((x, j) => (j === i ? { ...x, tone } : x))))
    }
  })
  return { correct, variants: [...variants] }
}

// --- Questions ---

const BUILDERS = {
  'meaning-choice'(word) {
    const wrong = distractors(word, distinctFirstSense)
    if (wrong.length < CHOICES - 1) return null
    const options = shuffle([word, ...wrong]).map(w => ({
      key: w.id,
      label: perLang(lang => firstSense(w, lang)),
      correct: w === word,
    }))
    return { options }
  },

  'char-choice'(word) {
    const wrong = distractors(word)
    if (wrong.length < CHOICES - 1) return null
    return { options: shuffle([word, ...wrong]).map(w => ({ key: w.id, label: w.simplified, sub: w.pinyin, correct: w === word })) }
  },

  'pinyin-choice'(word) {
    const { correct, variants } = toneVariants(word.pinyin)
    if (variants.length < CHOICES - 1) return null
    const labels = [correct, ...shuffle(variants).slice(0, CHOICES - 1)]
    return { options: shuffle(labels).map(label => ({ key: label, label, correct: label === correct })) }
  },

  'listen-choice'(word) {
    const audio = wordSrc(word)
    if (!audio) return null
    // Pas d'homophone parmi les options : on ne pourrait pas les distinguer à l'oreille.
    const wrong = distractors(word, (w, other) => toneless(w.pinyin) !== toneless(other.pinyin))
    if (wrong.length < CHOICES - 1) return null
    return {
      audio,
      options: shuffle([word, ...wrong]).map(w => ({ key: w.id, label: w.simplified, sub: w.pinyin, correct: w === word })),
    }
  },
}

const STAGES = [
  ['meaning-choice', 'char-choice'],
  ['pinyin-choice', 'listen-choice'],
  ['char-to-def', 'def-to-char'],
]

/** Question adaptée à la progression ; si le QCM tiré est impossible pour ce mot, un autre du même niveau, sinon la saisie. */
export function buildQuestion(word, progress) {
  const stage = progress.known ? 2 : Math.min(progress.successCount, 2)
  for (const type of shuffle(STAGES[stage])) {
    if (!BUILDERS[type]) return { word, type }
    const built = BUILDERS[type](word)
    if (built) return { word, type, ...built }
  }
  return { word, type: pick(STAGES[2]) }
}

export function buildQuiz(progressMap, unlockedLevels) {
  return selectQuizWords(progressMap, unlockedLevels)
    .map(word => buildQuestion(word, progressMap.get(word.id) || createInitialProgress(word.id, word.level)))
}
