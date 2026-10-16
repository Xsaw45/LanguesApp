import { getWordsForLevel } from '../data/index.js'
import { isActive, isDueForReview, createInitialProgress } from './spacedrep.js'

const QUIZ_SIZE = 20
const QUESTION_TYPES = ['char-to-def', 'def-to-char']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Selects up to QUIZ_SIZE words from unlocked levels.
 * Priority: due reviews first, then unseen/in-progress words.
 * progressMap: Map<wordId, progressObject>
 * unlockedLevels: number[]
 */
export function selectQuizWords(progressMap, unlockedLevels) {
  const allWords = unlockedLevels.flatMap(l => getWordsForLevel(l))

  const dueReviews = []
  const learning = []

  for (const word of allWords) {
    const progress = progressMap.get(word.id) || createInitialProgress(word.id, word.level)
    if (!isActive(progress)) continue
    if (progress.known && isDueForReview(progress)) {
      dueReviews.push(word)
    } else if (!progress.known) {
      learning.push(word)
    }
  }

  const shuffledReviews = shuffle(dueReviews)
  const shuffledLearning = shuffle(learning)

  const selected = [
    ...shuffledReviews.slice(0, QUIZ_SIZE),
    ...shuffledLearning,
  ].slice(0, QUIZ_SIZE)

  return shuffle(selected)
}

export function buildQuestion(word) {
  const type = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)]
  return { word, type }
}

export function buildQuiz(progressMap, unlockedLevels) {
  const words = selectQuizWords(progressMap, unlockedLevels)
  return words.map(buildQuestion)
}
