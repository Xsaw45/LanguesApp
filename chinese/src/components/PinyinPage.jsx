import { useState } from 'react'
import { PINYIN_LESSONS } from '../data/pinyinLessons.js'
import { getLessonProgress, isLessonUnlocked, isLessonDue, PASS_THRESHOLD } from '../utils/pinyinQuiz.js'
import { PinyinLesson } from './PinyinLesson.jsx'
import { PinyinChart } from './PinyinChart.jsx'

function LessonStatus({ progress, unlocked }) {
  if (!unlocked) return <span className="text-slate-500 text-sm">🔒</span>
  if (progress.known && isLessonDue(progress)) return <span className="text-xs text-yellow-400">à revoir</span>
  if (progress.bestPct >= PASS_THRESHOLD) return <span className="text-xs text-green-500">✓ {Math.round(progress.bestPct * 100)} %</span>
  if (progress.bestPct > 0) return <span className="text-xs text-slate-400">{Math.round(progress.bestPct * 100)} %</span>
  return <span className="text-xs text-red-400">à faire</span>
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-sm shrink-0">← Retour</button>
        <h1 className="text-white font-bold text-lg flex-1 text-center">
          Pinyin et tons <span className="chinese-text">拼音</span>
        </h1>
        <div className="w-14 shrink-0" />
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        <p className="text-slate-400 text-sm">
          Le pinyin écrit le chinois en lettres latines, avec un accent pour le ton. Suis les leçons dans l'ordre :
          chacune se débloque avec {Math.round(PASS_THRESHOLD * 100)} % de bonnes réponses à la précédente.
        </p>
        {PINYIN_LESSONS.map((lesson, i) => {
          const unlocked = isLessonUnlocked(progressMap, i)
          return (
            <button
              key={lesson.id}
              disabled={!unlocked}
              onClick={() => setView(i)}
              className={`w-full text-left rounded-2xl border p-4 transition-all ${
                unlocked ? 'border-slate-700 bg-slate-900 hover:border-slate-500' : 'border-slate-800 bg-slate-950 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-semibold">{i + 1}. {lesson.title}</span>
                <LessonStatus progress={getLessonProgress(progressMap, lesson)} unlocked={unlocked} />
              </div>
              <p className="text-slate-400 text-sm mt-0.5">{lesson.subtitle}</p>
            </button>
          )
        })}
        <button
          onClick={() => setView('chart')}
          className="w-full mt-2 py-3 rounded-2xl text-sm font-medium text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition-all"
        >
          Tableau des sons : écouter toutes les syllabes →
        </button>
        <p className="text-slate-600 text-xs mt-4">
          Enregistrements : Chen Wang (syllabes), Yue Tan / Shtooka (mots), via{' '}
          <a href="https://github.com/hugolpz/audio-cmn" className="underline">hugolpz/audio-cmn</a>, licence CC BY-SA.
        </p>
      </div>
    </div>
  )
}
