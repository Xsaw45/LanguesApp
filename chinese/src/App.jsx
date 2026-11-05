import { useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import { useLevels } from './hooks/useLevels.js'
import { useQuiz, QUIZ_STATES } from './hooks/useQuiz.js'
import { Dashboard } from './components/Dashboard.jsx'
import { QuizScreen } from './components/QuizScreen.jsx'
import { Results } from './components/Results.jsx'
import { VocabularyPage } from './components/VocabularyPage.jsx'
import { ClassifiersPage } from './components/ClassifiersPage.jsx'
import { ModulesHome } from './components/ModulesHome.jsx'

export default function App() {
  // 'home' (choix du module) | 'hsk' (vocabulaire : tests et niveaux) | 'vocabulary' (liste des mots) | 'classifiers'
  const [screen, setScreen] = useState('home')
  const { progressMap, getProgress, applyUpdates, loading } = useProgress()
  const { levelStats, unlockedLevels } = useLevels(progressMap)
  const {
    state,
    currentQuestion,
    currentIndex,
    totalQuestions,
    lastCorrect,
    results,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuiz(progressMap, getProgress, applyUpdates)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Chargement…</p>
      </div>
    )
  }

  if (state === QUIZ_STATES.FINISHED) {
    return (
      <Results
        results={results}
        onRestart={() => {
          resetQuiz()
          setTimeout(() => startQuiz(unlockedLevels), 0)
        }}
        onHome={resetQuiz}
      />
    )
  }

  if (state === QUIZ_STATES.QUESTION || state === QUIZ_STATES.FEEDBACK) {
    return (
      <QuizScreen
        quizState={state}
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        lastCorrect={lastCorrect}
        onSubmit={submitAnswer}
        onNext={nextQuestion}
        onQuit={resetQuiz}
      />
    )
  }

  if (screen === 'vocabulary') {
    return <VocabularyPage onBack={() => setScreen('hsk')} />
  }

  if (screen === 'classifiers') {
    return (
      <ClassifiersPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={() => setScreen('home')} />
    )
  }

  if (screen === 'hsk') {
    return (
      <Dashboard
        levelStats={levelStats}
        unlockedLevels={unlockedLevels}
        progressMap={progressMap}
        onStartQuiz={() => startQuiz(unlockedLevels)}
        onOpenVocabulary={() => setScreen('vocabulary')}
        onBack={() => setScreen('home')}
      />
    )
  }

  return (
    <ModulesHome
      levelStats={levelStats}
      progressMap={progressMap}
      onOpenVocabulary={() => setScreen('hsk')}
      onOpenClassifiers={() => setScreen('classifiers')}
    />
  )
}
