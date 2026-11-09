import { ChevronRight, Settings } from 'lucide-react'
import { CLASSIFIERS } from '../data/classifiers.js'
import { PINYIN_LESSONS } from '../data/pinyinLessons.js'
import { GRAMMAR_POINTS } from '../data/grammar.js'
import { HANZI } from '../data/hanzi.js'
import { READINGS } from '../data/reading.js'
import { getClassifierProgress } from '../utils/classifierQuiz.js'
import { getLessonProgress } from '../utils/pinyinQuiz.js'
import { getPointProgress } from '../utils/grammarQuiz.js'
import { getCharProgress } from '../utils/hanziQuiz.js'
import { getReadingProgress } from '../utils/readingQuiz.js'
import { isLessonPassed } from '../utils/lessonProgress.js'
import { useLang } from '../i18n/useLang.js'
import { ProgressBar, Screen, Seal, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

function ModuleCard({ id, seal, chinese, known, total, onOpen }) {
  const { t } = useLang()
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-line bg-card p-5 text-left transition-colors duration-150 ease-out hover:bg-raised active:bg-raised"
    >
      <div className="flex items-center gap-3">
        <Seal>{seal}</Seal>
        <span className="flex-1 text-lg font-medium text-fg">
          {t(`module.${id}.title`)} <span className="chinese-text text-fg-2">{chinese}</span>
        </span>
        <ChevronRight {...ICON} className="text-fg-3" />
      </div>
      <p className="mt-3 text-[15px] leading-snug text-fg-2">{t(`module.${id}.desc`)}</p>
      <ProgressBar value={total ? known / total : 0} className="mt-4" />
      <p className="mt-2 text-sm tabular-nums text-fg-3">{known} / {total} {t(`module.${id}.unit`)}</p>
    </button>
  )
}

export function ModulesHome({ levelStats, progressMap, onOpenPinyin, onOpenVocabulary, onOpenCharacters, onOpenGrammar, onOpenReading, onOpenClassifiers, onOpenSettings }) {
  const { t } = useLang()
  const wordsKnown = (levelStats || []).reduce((n, s) => n + s.known, 0)
  const wordsTotal = (levelStats || []).reduce((n, s) => n + s.total, 0)
  const classifiersKnown = CLASSIFIERS.filter(cl => getClassifierProgress(progressMap, cl).known).length
  const lessonsPassed = PINYIN_LESSONS.filter(l => isLessonPassed(getLessonProgress(progressMap, l))).length
  const pointsPassed = GRAMMAR_POINTS.filter(p => isLessonPassed(getPointProgress(progressMap, p))).length
  const charsKnown = HANZI.filter(ch => getCharProgress(progressMap, ch).known).length
  const textsPassed = READINGS.filter(r => isLessonPassed(getReadingProgress(progressMap, r))).length

  const settings = (
    <button
      type="button"
      onClick={onOpenSettings}
      aria-label={t('home.settings')}
      title={t('home.settings')}
      className="-mr-2 inline-flex size-9 items-center justify-center rounded-lg text-fg-2 transition-colors duration-150 ease-out hover:bg-raised hover:text-fg"
    >
      <Settings {...ICON} />
    </button>
  )

  return (
    <Screen>
      <TopBar backHref="/" backLabel={t('nav.languages')} aside={settings} />

      <div className="px-5 pb-8">
        <header className="pt-4 pb-8">
          <h1 className="text-[32px] font-medium leading-tight text-fg">
            {t('home.title')} <span className="hanzi-display text-fg-2">中文</span>
          </h1>
          <p className="mt-1 text-[17px] text-fg-2">{t('home.subtitle')}</p>
        </header>

        <div className="flex flex-col gap-3">
          <ModuleCard id="pinyin" seal="拼" chinese="拼音" known={lessonsPassed} total={PINYIN_LESSONS.length} onOpen={onOpenPinyin} />
          <ModuleCard id="vocab" seal="词" chinese="词汇" known={wordsKnown} total={wordsTotal} onOpen={onOpenVocabulary} />
          <ModuleCard id="hanzi" seal="字" chinese="汉字" known={charsKnown} total={HANZI.length} onOpen={onOpenCharacters} />
          <ModuleCard id="grammar" seal="语" chinese="语法" known={pointsPassed} total={GRAMMAR_POINTS.length} onOpen={onOpenGrammar} />
          <ModuleCard id="reading" seal="读" chinese="阅读" known={textsPassed} total={READINGS.length} onOpen={onOpenReading} />
          <ModuleCard id="classifiers" seal="量" chinese="量词" known={classifiersKnown} total={CLASSIFIERS.length} onOpen={onOpenClassifiers} />
        </div>
      </div>
    </Screen>
  )
}
