export function LevelCard({ stat, unlocked }) {
  const pct = Math.round(stat.pct * 100)

  return (
    <div className={`rounded-2xl border p-4 transition-all ${
      unlocked
        ? 'border-slate-700 bg-slate-900'
        : 'border-slate-800 bg-slate-950 opacity-50'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">HSK {stat.level}</span>
          {!unlocked && (
            <span className="text-slate-500 text-sm">🔒</span>
          )}
        </div>
        <span className="text-sm text-slate-400">{stat.known}/{stat.total}</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
        <div
          className="bg-red-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span>{pct}% maîtrisés</span>
        {unlocked && pct < 80 && (
          <span className="text-slate-400">{Math.ceil(stat.total * 0.8) - stat.known} restants pour débloquer le suivant</span>
        )}
        {unlocked && pct >= 80 && stat.level < 9 && (
          <span className="text-green-500">✓ Niveau suivant débloqué</span>
        )}
      </div>
    </div>
  )
}
