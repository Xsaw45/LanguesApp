import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import { useLevels } from './hooks/useLevels.js'
import { useQuiz, QUIZ_STATES } from './hooks/useQuiz.js'
import { LangContext, SETTINGS_KEY, makeLang } from './i18n/useLang.js'
import { defaultLang, translate } from './i18n/text.js'
import { Dashboard } from './components/Dashboard.jsx'
import { QuizScreen } from './components/QuizScreen.jsx'
import { Results } from './components/Results.jsx'
import { VocabularyPage } from './components/VocabularyPage.jsx'
import { ClassifiersPage } from './components/ClassifiersPage.jsx'
import { CharactersPage } from './components/CharactersPage.jsx'
import { ModulesHome } from './components/ModulesHome.jsx'
import { PinyinPage } from './components/PinyinPage.jsx'
import { GrammarPage } from './components/GrammarPage.jsx'
import { SettingsPage } from './components/SettingsPage.jsx'

export default function App() {
  // 'home' (choix du module) | 'hsk' (vocabulaire : tests et niveaux) | 'vocabulary' (liste des mots) | 'classifiers'
  // | 'pinyin' | 'hanzi' | 'grammar' | 'settings'
  const [screen, setScreen] = useState('home')
  const { progressMap, getProgress, applyUpdates, loading } = useProgress()
  const { levelStats, unlockedLevels } = useLevels(progressMap)

  // Langue : réglage synchronisé (enregistrement « settings »), sinon celle du navigateur.
  const lang = progressMap?.get(SETTINGS_KEY)?.lang || defaultLang()
  const setLang = useCallback(
    next => applyUpdates([{ ...progressMap?.get(SETTINGS_KEY), wordId: SETTINGS_KEY, level: 'settings', lang: next }]),
    [applyUpdates, progressMap],
  )
  const langValue = useMemo(() => makeLang(lang, setLang), [lang, setLang])
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate(lang, 'home.title')
  }, [lang])

  const {
    state,
    currentQuestion,
    upcoming,
    currentIndex,
    totalQuestions,
    lastCorrect,
    lastAnswer,
    results,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuiz(progressMap, getProgress, applyUpdates, lang)

  const home = () => setScreen('home')
  let content

  if (loading) {
    content = (
      <div className="flex min-h-dvh items-center justify-center bg-page">
        <p className="text-[15px] text-fg-3">{translate(lang, 'app.loading')}</p>
      </div>
    )
  } else if (state === QUIZ_STATES.FINISHED) {
    content = (
      <Results
        results={results}
        onRestart={() => {
          resetQuiz()
          setTimeout(() => startQuiz(unlockedLevels), 0)
        }}
        onHome={resetQuiz}
      />
    )
  } else if (state === QUIZ_STATES.QUESTION || state === QUIZ_STATES.FEEDBACK) {
    content = (
      <QuizScreen
        quizState={state}
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        lastCorrect={lastCorrect}
        lastAnswer={lastAnswer}
        upcoming={upcoming}
        onSubmit={submitAnswer}
        onNext={nextQuestion}
        onQuit={resetQuiz}
      />
    )
  } else if (screen === 'vocabulary') {
    content = <VocabularyPage onBack={() => setScreen('hsk')} />
  } else if (screen === 'classifiers') {
    content = <ClassifiersPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={home} />
  } else if (screen === 'pinyin') {
    content = <PinyinPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={home} />
  } else if (screen === 'hanzi') {
    content = <CharactersPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={home} />
  } else if (screen === 'grammar') {
    content = <GrammarPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={home} />
  } else if (screen === 'settings') {
    content = <SettingsPage onBack={home} />
  } else if (screen === 'hsk') {
    content = (
      <Dashboard
        levelStats={levelStats}
        unlockedLevels={unlockedLevels}
        progressMap={progressMap}
        onStartQuiz={() => startQuiz(unlockedLevels)}
        onOpenVocabulary={() => setScreen('vocabulary')}
        onBack={home}
      />
    )
  } else {
    content = (
      <ModulesHome
        levelStats={levelStats}
        progressMap={progressMap}
        onOpenPinyin={() => setScreen('pinyin')}
        onOpenVocabulary={() => setScreen('hsk')}
        onOpenCharacters={() => setScreen('hanzi')}
        onOpenGrammar={() => setScreen('grammar')}
        onOpenClassifiers={() => setScreen('classifiers')}
        onOpenSettings={() => setScreen('settings')}
      />
    )
  }

  return <LangContext.Provider value={langValue}>{content}</LangContext.Provider>
}
