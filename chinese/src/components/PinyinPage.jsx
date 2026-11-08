import { useState } from 'react'
import { Check, ChevronRight, Lock } from 'lucide-react'
import { PINYIN_LESSONS } from '../data/pinyinLessons.js'
import { getLessonProgress, isLessonUnlocked, isLessonDue, PASS_THRESHOLD } from '../utils/pinyinQuiz.js'
import { PinyinLesson } from './PinyinLesson.jsx'
import { PinyinChart } from './PinyinChart.jsx'
import { Screen, TopBar } from './ui.jsx'
import { ICON, ICON_SM, percent } from './uiStyles.js'

function LessonStatus({ progress, unlocked }) {
  if (!unlocked) return <Lock {...ICON_SM} className="text-fg-3" />
  if (progress.known && isLessonDue(progress)) return <span className="text-sm text-accent">À revoir</span>
  if (progress.bestPct >= PASS_THRESHOLD) {
    return <span className="inline-flex items-center gap-1 text-sm tabular-nums text-good"><Check {...ICON_SM} />{percent(progress.bestPct)}</span>
  }
  if (progress.bestPct > 0) return <span className="text-sm tabular-nums text-fg-3">{percent(progress.bestPct)}</span>
  return <span className="text-sm text-accent">À faire</span>
}

export function PinyinPage({ progressMap, applyUpdates, onBack }) {
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
      <TopBar onBack={onBack} title={<>Pinyin et tons <span className="chinese-text text-fg-2">拼音</span></>} bordered />

      <div className="flex flex-col px-5 py-6">
        <p className="text-[15px] leading-relaxed text-fg">
          Le pinyin écrit le chinois en lettres latines, avec un accent pour le ton. Suis les leçons dans l'ordre :
          chacune se débloque avec {percent(PASS_THRESHOLD)} de bonnes réponses à la précédente.
        </p>

        <ol className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
          {PINYIN_LESSONS.map((lesson, i) => {
            const unlocked = isLessonUnlocked(progressMap, i)
            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => setView(i)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 ease-out first:rounded-t-2xl hover:bg-raised disabled:hover:bg-transparent"
                >
                  <span className={`w-5 shrink-0 text-right text-[15px] tabular-nums ${unlocked ? 'text-fg-3' : 'text-fg-3/60'}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-base font-medium ${unlocked ? 'text-fg' : 'text-fg-3'}`}>{lesson.title}</span>
                    <span className={`mt-0.5 block text-sm ${unlocked ? 'text-fg-2' : 'text-fg-3/70'}`}>{lesson.subtitle}</span>
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
            <span className="block text-base font-medium text-fg">Tableau des sons</span>
            <span className="mt-0.5 block text-sm text-fg-2">Écouter chaque syllabe à chaque ton</span>
          </span>
          <ChevronRight {...ICON} className="text-fg-3" />
        </button>

        <p className="mt-8 text-sm text-fg-3">
          Enregistrements : Chen Wang (syllabes), Yue Tan / Shtooka (mots), via{' '}
          <a href="https://github.com/hugolpz/audio-cmn" className="underline decoration-line-2 underline-offset-2 hover:text-fg-2">hugolpz/audio-cmn</a>,
          licence CC BY-SA
        </p>
      </div>
    </Screen>
  )
}
