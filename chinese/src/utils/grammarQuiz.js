import { GRAMMAR_POINTS } from '../data/grammar.js'
import { lessonProgress, PASS_THRESHOLD, isLessonDue, isLessonPassed } from './lessonProgress.js'
import { message } from '../i18n/text.js'

export const POINT_QUIZ_SIZE = 8
export const REVIEW_QUIZ_SIZE = 10
const REVIEW_POINTS = 5

/*
 * Question (textes affichés : { fr, en }, voir i18n/text.js) :
 *   type        'order' (remettre les mots dans l'ordre) | 'choice' (QCM)
 *   key         unique dans un test ; pointId : point de grammaire testé
 *   prompt      consigne ; tr : traduction affichée sous la phrase
 *   order       tokens [{ id, text }] mélangés ; answers : phrases acceptées (mots collés)
 *   choice      layout 'grid3' (trou à compléter, gap { before, after }) | 'two' (correcte ou pas) | 'list' (traduction)
 *               | 'text' (réponses en français ou en anglais : compréhension d'un texte, voir readingQuiz.js) ;
 *               display (displayChinese) ; options [{ key, label, correct }]
 *   solution    { zh, pinyin, tr } affichée après la réponse ; explanation : règle (phrase incorrecte)
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

/** Point ouvert : le premier, celui qui suit un point réussi, ou un point déjà réussi (test de niveau). */
export function isPointUnlocked(progressMap, index) {
  if (index === 0) return true
  const passed = point => getPointProgress(progressMap, point).bestPct >= PASS_THRESHOLD
  return passed(GRAMMAR_POINTS[index - 1]) || passed(GRAMMAR_POINTS[index])
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
      prompt: message('gr.q.order'),
      tr: item.tr,
      tokens: order,
      answers,
      solution: { zh: item.words.join(''), pinyin: item.pinyin, tr: item.tr },
    }
  },

  fill(point, item, index) {
    return {
      type: 'choice',
      layout: 'grid3',
      key: `${point.id}:fill:${index}`,
      pointId: point.id,
      prompt: message('gr.q.fill'),
      gap: { before: item.before, after: item.after },
      tr: item.tr,
      options: choices(item.answer, item.wrong),
      solution: { zh: item.before + item.answer + item.after, pinyin: item.pinyin, tr: item.tr },
    }
  },

  judge(point, item, index) {
    return {
      type: 'choice',
      layout: 'two',
      key: `${point.id}:judge:${index}`,
      pointId: point.id,
      prompt: message('gr.q.judge'),
      display: item.zh,
      displayChinese: true,
      tr: item.tr,
      options: [
        { key: 'ok', label: message('gr.ok'), correct: item.ok },
        { key: 'ko', label: message('gr.ko'), correct: !item.ok },
      ],
      solution: item.ok
        ? { zh: item.zh, pinyin: item.pinyin, tr: item.tr }
        : { zh: item.fix, pinyin: item.fixPinyin, tr: item.tr },
      explanation: item.ok ? null : item.why,
    }
  },

  translate(point, item, index) {
    return {
      type: 'choice',
      layout: 'list',
      key: `${point.id}:translate:${index}`,
      pointId: point.id,
      prompt: message('gr.q.translate'),
      display: item.tr,
      options: choices(item.answer, item.wrong),
      solution: { zh: item.answer, pinyin: item.pinyin, tr: item.tr },
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

export const LEVEL_TEST_PER_POINT = 2

/**
 * Test d'un niveau de grammaire pour qui le connaît déjà : LEVEL_TEST_PER_POINT questions par point pas encore
 * réussi, sans « correcte ou pas » (une chance sur deux de deviner). Un point réussi sans faute est validé.
 */
export function buildLevelTest(progressMap, level) {
  const points = GRAMMAR_POINTS.filter(p => p.level === level && !isLessonPassed(getPointProgress(progressMap, p)))
  return shuffle(points.flatMap(point => shuffle(allQuestions(point).filter(q => q.layout !== 'two')).slice(0, LEVEL_TEST_PER_POINT)))
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
