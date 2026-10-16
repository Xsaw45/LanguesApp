import { LevelCard } from './LevelCard.jsx'
import { ALL_LEVELS, getWordsForLevel } from '../data/index.js'
import { isActive, createInitialProgress } from '../utils/spacedrep.js'

function countActiveWords(progressMap, unlockedLevels) {
  if (!progressMap) return 0
  return unlockedLevels.flatMap(l => getWordsForLevel(l)).filter(w => {
    const p = progressMap.get(w.id) || createInitialProgress(w.id, w.level)
    return isActive(p)
  }).length
}

export function Dashboard({ levelStats, unlockedLevels, progressMap, onStartQuiz, onOpenVocabulary }) {
  const activeCount = countActiveWords(progressMap, unlockedLevels)
  const canStart = activeCount > 0

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="px-4 pt-8 pb-4 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          HSK 汉语水平考试
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Vocabulaire chinois HSK 1–9</p>
      </header>

      {/* Start button */}
      <div className="px-4 mb-6">
        <button
          onClick={onStartQuiz}
          disabled={!canStart}
          className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all ${
            canStart
              ? 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-900/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {canStart
            ? `Commencer le test · ${Math.min(activeCount, 20)} mots`
            : 'Aucun mot à apprendre pour l\'instant'}
        </button>
        {!canStart && (
          <p className="text-center text-slate-500 text-xs mt-2">
            Tous les mots connus sont en révision. Revenez plus tard.
          </p>
        )}
        <button
          onClick={onOpenVocabulary}
          className="w-full mt-2 py-3 rounded-2xl text-sm font-medium text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition-all"
        >
          Voir le vocabulaire →
        </button>
      </div>

      {/* Level grid */}
      <div className="px-4 pb-8 flex-1">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Progression par niveau
        </h2>
        <div className="flex flex-col gap-3">
          {(levelStats || ALL_LEVELS.map(l => ({ level: l, total: getWordsForLevel(l).length, known: 0, pct: 0 }))).map(stat => (
            <LevelCard
              key={stat.level}
              stat={stat}
              unlocked={unlockedLevels.includes(stat.level)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
