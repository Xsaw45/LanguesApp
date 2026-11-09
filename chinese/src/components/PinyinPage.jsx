import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { PINYIN_LESSONS } from '../data/pinyinLessons.js'
import { getLessonProgress, isLessonUnlocked } from '../utils/pinyinQuiz.js'
import { PASS_THRESHOLD } from '../utils/lessonProgress.js'
import { PinyinLesson } from './PinyinLesson.jsx'
import { PinyinChart } from './PinyinChart.jsx'
import { LessonStatus } from './LessonStatus.jsx'
import { useLang } from '../i18n/useLang.js'
import { Screen, TopBar } from './ui.jsx'
import { ICON } from './uiStyles.js'

export function PinyinPage({ progressMap, applyUpdates, onBack }) {
  const { t, l, pct } = useLang()
  const [view, setView] = useState(null) // null | 'chart' | index de leçon

  if (view === 'chart') return <PinyinChart onBack={() => setView(null)} />

  if (typeof view === 'number') {
    return (
      <PinyinLesson
        key={view}
        lesson={PINYIN_LESSONS[view]}
        hasNext={view + 1 < PINYIN_LESSONS.length}
        progressMap={progressMap}
        applyUpdates={applyUpdates}
        onExit={() => setView(null)}
        onNextLesson={() => setView(view + 1)}
      />
    )
  }

  return (
    <Screen>
      <TopBar onBack={onBack} title={<>{t('py.title')} <span className="chinese-text text-fg-2">拼音</span></>} bordered />

      <div className="flex flex-col px-5 py-6">
        <p className="text-[15px] leading-relaxed text-fg">{t('py.intro', { pct: pct(PASS_THRESHOLD) })}</p>

        <ol className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {PINYIN_LESSONS.map((lesson, i) => {
            const unlocked = isLessonUnlocked(progressMap, i)
            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => setView(i)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 ease-out hover:bg-raised disabled:hover:bg-transparent"
                >
                  <span className={`w-5 shrink-0 text-right text-[15px] tabular-nums ${unlocked ? 'text-fg-3' : 'text-fg-3/60'}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-base font-medium ${unlocked ? 'text-fg' : 'text-fg-3'}`}>{l(lesson.title)}</span>
                    <span className={`mt-0.5 block text-sm ${unlocked ? 'text-fg-2' : 'text-fg-3/70'}`}>{l(lesson.subtitle)}</span>
                  </span>
                  <LessonStatus progress={getLessonProgress(progressMap, lesson)} unlocked={unlocked} />
                </button>
              </li>
            )
          })}
        </ol>

        <button
          type="button"
          onClick={() => setView('chart')}
          className="mt-3 flex items-center gap-4 rounded-2xl border border-line bg-card px-4 py-4 text-left transition-colors duration-150 ease-out hover:bg-raised"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-base font-medium text-fg">{t('py.chart')}</span>
            <span className="mt-0.5 block text-sm text-fg-2">{t('py.chartDesc')}</span>
          </span>
          <ChevronRight {...ICON} className="text-fg-3" />
        </button>

        <p className="mt-8 text-sm text-fg-3">
          <a href="https://github.com/hugolpz/audio-cmn" className="underline decoration-line-2 underline-offset-2 hover:text-fg-2">{t('py.credits')}</a>
        </p>
      </div>
    </Screen>
  )
}
