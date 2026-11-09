import { GRAMMAR_POINTS } from '../data/grammar.js'
import { lessonProgress, PASS_THRESHOLD, isLessonDue, isLessonPassed } from './lessonProgress.js'

export const POINT_QUIZ_SIZE = 8
export const REVIEW_QUIZ_SIZE = 10
const REVIEW_POINTS = 5

/*
 * Question :
 *   type        'order' (remettre les mots dans l'ordre) | 'choice' (QCM)
 *   key         unique dans un test ; pointId : point de grammaire testé
 *   prompt      consigne ; fr : traduction affichée sous la phrase
 *   order       tokens [{ id, text }] mélangés ; answers : phrases acceptées (mots collés)
 *   choice      layout 'grid3' (trou à compléter, gap { before, after }) | 'two' (correcte ou pas) | 'list' (traduction) ;
 *               display (displayChinese) ; options [{ key, label, correct }]
 *   solution    { zh, pinyin, fr } affichée après la réponse ; explanation : règle (phrase incorrecte)
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

export const grammarKey = point => `gr_${point.id}`
export const getPointProgress = (progressMap, point) => lessonProgress(progressMap, grammarKey(point), 'gr')

export function isPointUnlocked(progressMap, index) {
  return index === 0 || getPointProgress(progressMap, GRAMMAR_POINTS[index - 1]).bestPct >= PASS_THRESHOLD
}

const choices = (answer, wrong) =>
  shuffle([answer, ...wrong]).map(text => ({ key: text, label: text, correct: text === answer }))

const BUILDERS = {
  order(point, item, index) {
    const answers = [item.words, ...(item.alt || [])].map(words => words.join(''))
    let order = shuffle(item.words.map((text, id) => ({ id, text })))
    // Jamais déjà dans un ordre accepté (sauf si impossible)
    for (let tries = 0; tries < 10 && answers.includes(order.map(t => t.text).join('')); tries++) order = shuffle(order)
    return {
      type: 'order',
      key: `${point.id}:order:${index}`,
      pointId: point.id,
      prompt: 'Remets les mots dans l\'ordre',
      fr: item.fr,
      tokens: order,
      answers,
      solution: { zh: item.words.join(''), pinyin: item.pinyin, fr: item.fr },
    }
  },

  fill(point, item, index) {
    return {
      type: 'choice',
      layout: 'grid3',
      key: `${point.id}:fill:${index}`,
      pointId: point.id,
      prompt: 'Complète la phrase',
      gap: { before: item.before, after: item.after },
      fr: item.fr,
      options: choices(item.answer, item.wrong),
      solution: { zh: item.before + item.answer + item.after, pinyin: item.pinyin, fr: item.fr },
    }
  },

  judge(point, item, index) {
    return {
      type: 'choice',
      layout: 'two',
      key: `${point.id}:judge:${index}`,
      pointId: point.id,
      prompt: 'Cette phrase est-elle correcte ?',
      display: item.zh,
      displayChinese: true,
      fr: item.fr,
      options: [
        { key: 'ok', label: 'Correcte', correct: item.ok },
        { key: 'ko', label: 'Incorrecte', correct: !item.ok },
      ],
      solution: item.ok
        ? { zh: item.zh, pinyin: item.pinyin, fr: item.fr }
        : { zh: item.fix, pinyin: item.fixPinyin, fr: item.fr },
      explanation: item.ok ? null : item.why,
    }
  },

  translate(point, item, index) {
    return {
      type: 'choice',
      layout: 'list',
      key: `${point.id}:translate:${index}`,
      pointId: point.id,
      prompt: 'Comment dit-on en chinois ?',
      display: item.fr,
      options: choices(item.answer, item.wrong),
      solution: { zh: item.answer, pinyin: item.pinyin, fr: item.fr },
    }
  },
}

const TYPES = ['order', 'fill', 'judge', 'translate']

/** Toutes les questions d'un point (une par exercice). */
function allQuestions(point) {
  return TYPES.flatMap(type => point[type].map((item, i) => BUILDERS[type](point, item, i)))
}

/** 2 questions de chaque type ; pour « correcte ou pas », une phrase correcte et une incorrecte. */
export function buildPointQuiz(point) {
  const questions = []
  for (const type of TYPES) {
    const indexed = point[type].map((item, i) => ({ item, i }))
    const chosen = type === 'judge'
      ? [pick(indexed.filter(x => x.item.ok)), pick(indexed.filter(x => !x.item.ok))]
      : shuffle(indexed).slice(0, 2)
    for (const { item, i } of chosen) questions.push(BUILDERS[type](point, item, i))
  }
  return shuffle(questions).slice(0, POINT_QUIZ_SIZE)
}

/**
 * Révision : jusqu'à 5 points réussis (ceux à revoir d'abord), une question par point à tour de rôle jusqu'à 10.
 * Vide si aucun point n'est réussi.
 */
export function buildReviewQuiz(progressMap) {
  const passed = GRAMMAR_POINTS.filter(p => isLessonPassed(getPointProgress(progressMap, p)))
  const due = passed.filter(p => isLessonDue(getPointProgress(progressMap, p)))
  const points = [...shuffle(due), ...shuffle(passed.filter(p => !due.includes(p)))].slice(0, REVIEW_POINTS)
  const pools = points.map(p => shuffle(allQuestions(p)))
  const questions = []
  while (questions.length < REVIEW_QUIZ_SIZE && pools.some(pool => pool.length)) {
    for (const pool of pools) {
      if (pool.length && questions.length < REVIEW_QUIZ_SIZE) questions.push(pool.pop())
    }
  }
  return shuffle(questions)
}

export function isOrderCorrect(question, placedTexts) {
  return question.answers.includes(placedTexts.join(''))
}

/** results [{ pointId, correct }] → Map pointId → part de bonnes réponses */
export function scoreByPoint(results) {
  const totals = new Map()
  for (const { pointId, correct } of results) {
    const t = totals.get(pointId) || { ok: 0, n: 0 }
    t.n++
    if (correct) t.ok++
    totals.set(pointId, t)
  }
  return new Map([...totals].map(([id, t]) => [id, t.ok / t.n]))
}
