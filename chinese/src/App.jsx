import { useCallback, useEffect, useMemo, useState } from 'react'
import { withActivity, markStepDone, addPracticeTime } from './utils/activity.js'
import { PLACEMENT_KEY } from './utils/levelTest.js'
import { VocabLevelTest } from './components/VocabLevelTest.jsx'
import { LanguageChoice } from './components/LanguageChoice.jsx'
import { useProgress } from './hooks/useProgress.js'
import { useLevels } from './hooks/useLevels.js'
import { usePracticeTime } from './hooks/usePracticeTime.js'
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
import { ReadingPage } from './components/ReadingPage.jsx'
import { TodayPage } from './components/TodayPage.jsx'
import { SettingsPage } from './components/SettingsPage.jsx'

export default function App() {
  // 'home' (choix du module) | 'hsk' (vocabulaire : tests et niveaux) | 'vocabulary' (liste des mots) | 'classifiers'
  // | 'pinyin' | 'hanzi' | 'grammar' | 'reading' | 'today' (séance du jour) | 'settings'
  const [screen, setScreen] = useState('home')
  const { progressMap, latestMap, getProgress, applyUpdates: saveUpdates, loading } = useProgress()
  const { levelStats, unlockedLevels } = useLevels(progressMap)
  // Toute progression enregistrée compte aussi dans l'activité du jour (série, éléments maîtrisés).
  const applyUpdates = useCallback(updates => saveUpdates(withActivity(latestMap(), updates)), [saveUpdates, latestMap])

  // Réglages synchronisés (enregistrement « settings ») : langue, premier lancement fait, test de niveau fait.
  const saveSetting = useCallback(
    patch => applyUpdates([{ ...latestMap()?.get(SETTINGS_KEY), wordId: SETTINGS_KEY, level: 'settings', ...patch }]),
    [applyUpdates, latestMap],
  )
  const settings = progressMap?.get(SETTINGS_KEY)
  // Langue : réglage synchronisé, sinon celle du navigateur.
  const lang = settings?.lang || defaultLang()
  const setLang = useCallback(next => saveSetting({ lang: next }), [saveSetting])
  const placementDone = !!settings?.[PLACEMENT_KEY]
  const newLearner = !placementDone && ![...(progressMap?.keys() || [])].some(k => k.startsWith('hsk'))
  // Premier lancement : choix de la langue, puis directement le test de niveau (une seule fois, même s'il est quitté).
  const onboarding = newLearner && !settings?.onboarded
  // Test de niveau du vocabulaire en cours : { mode: 'placement', from? } | { mode: 'unlock', level }
  // from 'onboarding' : on revient ensuite à l'accueil, pas à la page Vocabulaire.
  const [levelTest, setLevelTest] = useState(null)
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

  // Temps de pratique : dans un module ou un test, pas sur l'accueil ni dans les paramètres.
  const practicing = !loading && (state !== QUIZ_STATES.IDLE || !['home', 'settings'].includes(screen))
  usePracticeTime(practicing, seconds => saveUpdates([addPracticeTime(latestMap(), seconds)]))

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
        onHome={() => {
          if (screen === 'today') applyUpdates([markStepDone(progressMap, 'vocab')])
          resetQuiz()
        }}
        homeLabel={translate(lang, screen === 'today' ? 'today.back' : 'vocab.backToVocab')}
      />
    )
  } else if (levelTest) {
    content = (
      <VocabLevelTest
        mode={levelTest.mode}
        level={levelTest.level}
        progressMap={progressMap}
        applyUpdates={applyUpdates}
        onPlaced={reached => saveSetting({ [PLACEMENT_KEY]: { level: reached, date: new Date().toISOString() } })}
        onExit={() => {
          setScreen(levelTest.from === 'onboarding' ? 'home' : 'hsk')
          setLevelTest(null)
        }}
      />
    )
  } else if (onboarding) {
    content = (
      <LanguageChoice
        onChoose={code => {
          saveSetting({ lang: code, onboarded: true })
          setLevelTest({ mode: 'placement', from: 'onboarding' })
        }}
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
  } else if (screen === 'reading') {
    content = <ReadingPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={home} />
  } else if (screen === 'settings') {
    content = <SettingsPage onBack={home} />
  } else if (screen === 'today') {
    content = <TodayPage progressMap={progressMap} applyUpdates={applyUpdates} onBack={home} onStartVocab={() => startQuiz(unlockedLevels)} />
  } else if (screen === 'hsk') {
    content = (
      <Dashboard
        levelStats={levelStats}
        unlockedLevels={unlockedLevels}
        progressMap={progressMap}
        placementDone={placementDone}
        onStartPlacement={() => setLevelTest({ mode: 'placement' })}
        onStartUnlockTest={level => setLevelTest({ mode: 'unlock', level })}
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
        showPlacement={newLearner}
        onStartPlacement={() => setLevelTest({ mode: 'placement' })}
        onOpenToday={() => setScreen('today')}
        onOpenPinyin={() => setScreen('pinyin')}
        onOpenVocabulary={() => setScreen('hsk')}
        onOpenCharacters={() => setScreen('hanzi')}
        onOpenGrammar={() => setScreen('grammar')}
        onOpenReading={() => setScreen('reading')}
        onOpenClassifiers={() => setScreen('classifiers')}
        onOpenSettings={() => setScreen('settings')}
      />
    )
  }

  return <LangContext.Provider value={langValue}>{content}</LangContext.Provider>
}
