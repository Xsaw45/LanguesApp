import { useState, useCallback } from 'react'
import { buildQuiz } from '../utils/quiz.js'
import { validateAnswer } from '../utils/validate.js'
import { wordSenses } from '../data/index.js'
import { applySuccess, applyFailure } from '../utils/spacedrep.js'
import { unlockAudio } from '../utils/audio.js'

export const QUIZ_STATES = {
  IDLE: 'idle',
  QUESTION: 'question',
  FEEDBACK: 'feedback',
  FINISHED: 'finished',
}

/** lang : langue de l'utilisateur, celle des définitions attendues. */
export function useQuiz(progressMap, getProgress, applyUpdates, lang) {
  const [state, setState] = useState(QUIZ_STATES.IDLE)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastCorrect, setLastCorrect] = useState(null)
  const [lastAnswer, setLastAnswer] = useState(null) // QCM : clé de l'option choisie
  const [results, setResults] = useState([]) // { word, type, correct }

  const startQuiz = useCallback((unlockedLevels) => {
    unlockAudio() // dans le geste de l'utilisateur : les questions d'écoute peuvent jouer leur son toutes seules
    const qs = buildQuiz(progressMap, unlockedLevels)
    if (qs.length === 0) return false
    setQuestions(qs)
    setCurrentIndex(0)
    setResults([])
    setLastCorrect(null)
    setLastAnswer(null)
    setState(QUIZ_STATES.QUESTION)
    return true
  }, [progressMap])

  /** input : texte tapé, ou clé de l'option choisie (QCM). */
  const submitAnswer = useCallback((input) => {
    const { word, type, options } = questions[currentIndex]
    const correct = options
      ? !!options.find(o => o.key === input)?.correct
      : validateAnswer(input, word, type, wordSenses(word, lang))
    setLastCorrect(correct)
    setLastAnswer(input)
    setResults(prev => [...prev, { word, type, correct }])
    setState(QUIZ_STATES.FEEDBACK)
  }, [questions, currentIndex, lang])

  const nextQuestion = useCallback(async () => {
    // Persist progress for current word
    const { word } = questions[currentIndex]
    const prev = getProgress(word.id, word.level)
    const updated = lastCorrect ? applySuccess(prev) : applyFailure(prev)
    await applyUpdates([updated])

    const next = currentIndex + 1
    if (next >= questions.length) {
      setState(QUIZ_STATES.FINISHED)
    } else {
      setCurrentIndex(next)
      setLastCorrect(null)
      setLastAnswer(null)
      setState(QUIZ_STATES.QUESTION)
    }
  }, [questions, currentIndex, lastCorrect, getProgress, applyUpdates])

  const resetQuiz = useCallback(() => {
    setState(QUIZ_STATES.IDLE)
    setQuestions([])
    setCurrentIndex(0)
    setResults([])
    setLastCorrect(null)
    setLastAnswer(null)
  }, [])

  const currentQuestion = questions[currentIndex] || null

  return {
    state,
    currentQuestion,
    upcoming: questions[currentIndex + 1] || null,
    currentIndex,
    totalQuestions: questions.length,
    lastCorrect,
    lastAnswer,
    results,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  }
}
