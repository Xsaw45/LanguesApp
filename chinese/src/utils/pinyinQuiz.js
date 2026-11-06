import manifest from '../data/audio.json'
import {
  PINYIN_LESSONS, TONES, TONE_BASES, PLACEMENT_BASES, INITIAL_GROUPS, FINAL_PAIRS, RULE_QUESTIONS, SANDHI_ITEMS,
} from '../data/pinyinLessons.js'
import { getWordsForLevel } from '../data/index.js'
import { syllableSrc, recordedWordSrc } from './audio.js'
import { parseSyllable, splitPinyin, splitInitial, withTone, markIndex, vowelIndexes } from './pinyin.js'
import { REVIEW_INTERVALS, addDays, today, isDueForReview } from './spacedrep.js'

export const LESSON_QUIZ_SIZE = 10
export const PASS_THRESHOLD = 0.8

/*
 * Question :
 *   prompt        consigne
 *   display       texte affiché en grand (displayChinese : en caractères chinois)
 *   audio         son joué à l'affichage (bouton « réécouter »)
 *   revealAudio   son joué après la réponse
 *   layout        'tones' (4 tons) | 'grid' (syllabes) | 'list' (phrases)
 *   options       [{ key, label, correct, audio? }] : après la réponse, toucher une option joue son son
 *   answer        rappel de la bonne réponse ; explanation : règle
 */

const SYLLABLES = new Set(manifest.syllables) // syllabes réelles (présentes dans le vocabulaire HSK)
const has = (base, tone) => SYLLABLES.has(`${base}${tone}`)
const toBase = s => s.replaceAll('ü', 'v')

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const pick = arr => arr[Math.floor(Math.random() * arr.length)]
const tonesOf = base => [1, 2, 3, 4].filter(t => has(base, t))

// (syllabe, ton) pour les exercices de tons, par ton : chaque ton a autant de chances de sortir.
const TONE_SYLLABLES = [1, 2, 3, 4].map(t => TONE_BASES.filter(b => has(b, t)))
const pickToneSyllable = () => {
  const tone = pick([1, 2, 3, 4])
  return [pick(TONE_SYLLABLES[tone - 1]), tone]
}
const PLACEMENT = PLACEMENT_BASES.map(toBase).filter(b => tonesOf(b).length > 0)
const FINAL_SETS = FINAL_PAIRS.map(pair => pair.map(toBase))
  .map(pair => ({ pair, tones: [1, 2, 3, 4].filter(t => pair.every(b => has(b, t))) }))
  .filter(({ tones }) => tones.length > 0)

function toneOptions(base, tone) {
  return TONES.map(t => ({
    key: `t${t.tone}`,
    label: t.name,
    tone: t.tone,
    correct: t.tone === tone,
    audio: syllableSrc(`${base}${t.tone}`),
  }))
}

function syllableOptions(bases, tone, target) {
  return shuffle(bases).map(b => ({
    key: b,
    label: withTone(b, tone),
    correct: b === target,
    audio: syllableSrc(`${b}${tone}`),
  }))
}

const TONE_NAMES = Object.fromEntries(TONES.map(t => [t.tone, t.name]))

const GENERATORS = {
  'listen-tone'() {
    const [base, tone] = pickToneSyllable()
    return {
      key: `${base}${tone}`,
      prompt: 'Quel ton entends-tu ?',
      audio: syllableSrc(`${base}${tone}`),
      layout: 'tones',
      options: toneOptions(base, tone),
      answer: `${withTone(base, tone)} : ${TONE_NAMES[tone]}`,
    }
  },

  'read-tone'() {
    const [base, tone] = pickToneSyllable()
    return {
      key: `${base}${tone}`,
      prompt: 'Quel ton indique cet accent ?',
      display: withTone(base, tone),
      revealAudio: syllableSrc(`${base}${tone}`),
      layout: 'tones',
      options: toneOptions(base, tone),
      answer: `${withTone(base, tone)} : ${TONE_NAMES[tone]}`,
    }
  },

  placement() {
    const base = pick(PLACEMENT)
    const tone = pick(tonesOf(base))
    const right = markIndex(base)
    const labels = new Map(vowelIndexes(base).map(i => [withTone(base, tone, i), i]))
    const explanation = /[ae]/.test(base)
      ? 'S\'il y a un a ou un e, c\'est lui qui porte l\'accent.'
      : base.includes('ou') ? 'Dans « ou », l\'accent va sur le o.' : 'Sinon, l\'accent va sur la dernière voyelle.'
    return {
      key: `${base}${tone}`,
      prompt: 'Où se place l\'accent ?',
      display: `${base.replaceAll('v', 'ü')}${tone}`,
      revealAudio: syllableSrc(`${base}${tone}`),
      layout: 'grid',
      options: shuffle([...labels].map(([label, i]) => ({ key: label, label, correct: i === right }))),
      answer: withTone(base, tone),
      explanation,
    }
  },

  'listen-initial-easy'() { return listenInitial(INITIAL_GROUPS['listen-initial-easy']) },
  'listen-initial-hard'() { return listenInitial(INITIAL_GROUPS['listen-initial-hard']) },

  'listen-final'() {
    const { pair, tones } = pick(FINAL_SETS)
    const tone = pick(tones)
    const target = pick(pair)
    return {
      key: `${target}${tone}`,
      prompt: 'Quelle syllabe entends-tu ?',
      audio: syllableSrc(`${target}${tone}`),
      layout: 'grid',
      options: syllableOptions(pair, tone, target),
      answer: withTone(target, tone),
    }
  },

  rule() {
    const item = pick(RULE_QUESTIONS)
    return {
      key: item.q,
      prompt: item.q,
      revealAudio: syllableSrc(item.syl),
      layout: 'list',
      options: shuffle(item.options.map((label, i) => ({ key: label, label, correct: i === 0 }))),
      answer: item.options[0],
    }
  },

  sandhi() {
    const item = pick(SANDHI_ITEMS)
    return {
      key: item.hanzi,
      prompt: `Comment se dit « ${item.fr} » ?`,
      display: item.hanzi,
      displayChinese: true,
      revealAudio: recordedWordSrc(item.hanzi),
      layout: 'list',
      options: shuffle([item.said, ...item.options].map(label => ({ key: label, label, correct: label === item.said }))),
      answer: `${item.hanzi} se dit ${item.said}`,
      explanation: item.explanation,
    }
  },

  'listen-word'() {
    const word = pick(listenWords())
    const syllables = splitPinyin(word.pinyin.toLowerCase()).map(parseSyllable)
    const correct = syllables.map(s => withTone(s.base, s.tone)).join(' ')
    const variants = new Set()
    syllables.forEach((s, i) => {
      if (!s.tone) return
      for (const t of [1, 2, 3, 4]) {
        if (t !== s.tone) variants.add(syllables.map((x, j) => withTone(x.base, j === i ? t : x.tone)).join(' '))
      }
    })
    const wrong = shuffle([...variants]).slice(0, 3)
    const meaning = word.definition.split(';')[0].trim()
    return {
      key: word.id,
      prompt: 'Quel est le pinyin de ce mot ?',
      audio: recordedWordSrc(word.simplified),
      layout: 'list',
      options: shuffle([correct, ...wrong].map(label => ({ key: label, label, correct: label === correct }))),
      answer: `${word.simplified} ${correct} : ${meaning}`,
    }
  },
}

function listenInitial(groups) {
  for (;;) {
    const group = pick(groups)
    const tone = pick([1, 2, 3, 4])
    const candidates = FINALS
      .map(f => group.filter(i => has(i + f, tone)).map(i => i + f))
      .filter(bases => bases.length >= 2)
    if (!candidates.length) continue
    const bases = pick(candidates)
    const target = pick(bases)
    return {
      key: `${target}${tone}`,
      prompt: 'Quelle syllabe entends-tu ?',
      audio: syllableSrc(`${target}${tone}`),
      layout: 'grid',
      options: syllableOptions(bases, tone, target),
      answer: withTone(target, tone),
    }
  }
}

const FINALS = [...new Set(manifest.syllables.map(s => splitInitial(s.slice(0, -1)).final))].filter(Boolean)

// Mots HSK 1 enregistrés, de 2 ou 3 syllabes, sans changement de ton à l'oral (le pinyin écrit = ce qu'on entend).
let cachedListenWords = null
function listenWords() {
  if (!cachedListenWords) {
    cachedListenWords = getWordsForLevel(1).filter(w => {
      if (!recordedWordSrc(w.simplified) || /[不一]/.test(w.simplified)) return false
      const syllables = splitPinyin(w.pinyin.toLowerCase()).map(parseSyllable)
      if (syllables.length < 2 || syllables.length > 3) return false
      if (!syllables.every(s => /^[a-z]+$/.test(s.base) && tonesOf(s.base).length > 0)) return false
      return !syllables.some((s, i) => s.tone === 3 && syllables[i + 1]?.tone === 3)
    })
  }
  return cachedListenWords
}

export function buildLessonQuiz(lesson) {
  const questions = []
  const seen = new Set()
  for (let attempt = 0; questions.length < LESSON_QUIZ_SIZE && attempt < 200; attempt++) {
    const type = pick(lesson.exercise)
    const q = GENERATORS[type]()
    if (seen.has(q.key)) continue
    seen.add(q.key)
    questions.push(q)
  }
  return questions
}

// --- Progression : un enregistrement synchronisé par leçon (py_<id>) ---

export const lessonKey = lesson => `py_${lesson.id}`

export function getLessonProgress(progressMap, lesson) {
  return progressMap?.get(lessonKey(lesson)) || {
    wordId: lessonKey(lesson),
    level: 'py',
    bestPct: 0,
    passes: 0,
    known: false,
    nextReview: null,
    reviewInterval: null,
  }
}

export function isLessonUnlocked(progressMap, index) {
  return index === 0 || getLessonProgress(progressMap, PINYIN_LESSONS[index - 1]).bestPct >= PASS_THRESHOLD
}

export const isLessonDue = progress => isDueForReview(progress)

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
