import { CLASSIFIERS, classifierKey } from '../data/classifiers.js'
import { isDueForReview, createInitialProgress } from './spacedrep.js'

export const CLASSIFIER_QUIZ_SIZE = 10
export const CLASSIFIER_LEVEL = 'cl'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

export function getClassifierProgress(progressMap, cl) {
  const key = classifierKey(cl)
  return progressMap?.get(key) || createInitialProgress(key, CLASSIFIER_LEVEL)
}

// Jusqu'à 3 candidats : 2 de la même famille en priorité (les confusions utiles), le reste ailleurs.
function pickWrong(cl, candidates) {
  const others = shuffle(candidates.filter(c => c.char !== cl.char))
  const same = others.filter(c => c.group === cl.group).slice(0, 2)
  return [...same, ...others.filter(c => !same.includes(c))].slice(0, 3)
}

function fillQuestion(cl) {
  const example = pick(cl.examples)
  const valid = new Set([cl.char, ...(example.alt || [])])
  const wrong = pickWrong(cl, CLASSIFIERS.filter(c => !c.generic && !valid.has(c.char)))
  const options = shuffle([cl, ...wrong]).map(c => ({ key: c.char, label: c.char, sub: c.pinyin, correct: c === cl }))
  return { cl, type: 'fill', example, options }
}

function usageQuestion(cl) {
  const wrong = pickWrong(cl, CLASSIFIERS)
  const options = shuffle([cl, ...wrong]).map(c => ({ key: c.char, label: c.usage, correct: c === cl }))
  return { cl, type: 'usage', options }
}

/**
 * Classificateurs à réviser en priorité (échéance passée, puis en cours d'apprentissage), complétés au hasard
 * par les autres pour toujours proposer un test complet.
 */
export function buildClassifierQuiz(progressMap) {
  const due = []
  const learning = []
  const rest = []
  for (const cl of CLASSIFIERS) {
    const p = getClassifierProgress(progressMap, cl)
    if (p.known && isDueForReview(p)) due.push(cl)
    else if (!p.known) learning.push(cl)
    else rest.push(cl)
  }
  const selected = [...shuffle(due), ...shuffle(learning), ...shuffle(rest)].slice(0, CLASSIFIER_QUIZ_SIZE)
  return shuffle(selected).map(cl => (Math.random() < 0.65 ? fillQuestion(cl) : usageQuestion(cl)))
}
