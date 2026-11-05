import { CLASSIFIERS } from '../data/classifiers.js'
import { getClassifierProgress } from '../utils/classifierQuiz.js'

function ModuleCard({ title, chinese, description, known, total, onOpen }) {
  const pct = total > 0 ? Math.round((known / total) * 100) : 0
  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-2xl border border-slate-700 bg-slate-900 hover:border-slate-500 active:bg-slate-800 p-5 transition-all"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xl font-bold text-white">
          {title} <span className="chinese-text">{chinese}</span>
        </span>
        <span className="text-slate-400 text-xl">→</span>
      </div>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
        <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-500">{known}/{total} maîtrisés · {pct}%</p>
    </button>
  )
}

export function ModulesHome({ levelStats, progressMap, onOpenVocabulary, onOpenClassifiers }) {
  const wordsKnown = (levelStats || []).reduce((n, s) => n + s.known, 0)
  const wordsTotal = (levelStats || []).reduce((n, s) => n + s.total, 0)
  const classifiersKnown = CLASSIFIERS.filter(cl => getClassifierProgress(progressMap, cl).known).length

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="relative px-4 pt-8 pb-6 text-center">
        <a href="/" className="absolute left-4 top-4 text-sm text-slate-400 hover:text-white transition-colors">
          ← Langues
        </a>
        <h1 className="chinese-text text-4xl font-bold text-white tracking-tight">中文</h1>
        <p className="text-slate-400 mt-1 text-sm">Que veux-tu travailler ?</p>
      </header>

      <div className="px-4 pb-8 flex flex-col gap-4">
        <ModuleCard
          title="Vocabulaire"
          chinese="词汇"
          description="Mots HSK 1–9 : tests, liste des mots, progression par niveau"
          known={wordsKnown}
          total={wordsTotal}
          onOpen={onOpenVocabulary}
        />
        <ModuleCard
          title="Classificateurs"
          chinese="量词"
          description="Les classificateurs courants (个, 张, 本, 只…) : liste par famille et tests"
          known={classifiersKnown}
          total={CLASSIFIERS.length}
          onOpen={onOpenClassifiers}
        />
      </div>
    </div>
  )
}
