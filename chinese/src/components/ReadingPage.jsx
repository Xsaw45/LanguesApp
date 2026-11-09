import { useState } from 'react'
import { READINGS } from '../data/reading.js'
import { getReadingProgress } from '../utils/readingQuiz.js'
import { PASS_THRESHOLD } from '../utils/lessonProgress.js'
import { useLang } from '../i18n/useLang.js'
import { LessonStatus } from './LessonStatus.jsx'
import { ReadingText } from './ReadingText.jsx'
import { Screen, SectionLabel, TopBar } from './ui.jsx'

const LEVELS = [...new Set(READINGS.map(r => r.level))]

/** Textes et dialogues par niveau HSK, tous ouverts : on choisit son sujet. */
export function ReadingPage({ progressMap, applyUpdates, onBack }) {
  const { t, l, pct } = useLang()
  const [openId, setOpenId] = useState(null)
  const open = READINGS.find(r => r.id === openId)

  if (open) {
    return <ReadingText key={open.id} reading={open} progressMap={progressMap} applyUpdates={applyUpdates} onExit={() => setOpenId(null)} />
  }

  return (
    <Screen>
      <TopBar onBack={onBack} title={<>{t('rd.title')} <span className="chinese-text text-fg-2">阅读</span></>} bordered />

      <div className="flex flex-col px-5 py-6">
        <p className="text-[15px] leading-relaxed text-fg">{t('rd.intro', { pct: pct(PASS_THRESHOLD) })}</p>

        {LEVELS.map(level => (
          <section key={level} className="mt-8">
            <SectionLabel>HSK {level}</SectionLabel>
            <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
              {READINGS.filter(r => r.level === level).map(reading => (
                <li key={reading.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(reading.id)}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 ease-out hover:bg-raised"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-medium text-fg">
                        {l(reading.title)} <span className="chinese-text font-normal text-fg-2">{reading.zh}</span>
                      </span>
                      <span className="mt-0.5 block text-sm text-fg-2">{t(reading.kind === 'dialogue' ? 'rd.dialogue' : 'rd.text')}</span>
                    </span>
                    <LessonStatus progress={getReadingProgress(progressMap, reading)} unlocked />
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Screen>
  )
}
