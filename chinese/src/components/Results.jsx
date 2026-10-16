export function Results({ results, onRestart, onHome }) {
  const correct = results.filter(r => r.correct).length
  const total = results.length
  const pct = Math.round((correct / total) * 100)

  const wrongWords = results.filter(r => !r.correct)

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col px-4 py-8">
      {/* Score */}
      <div className="text-center mb-8">
        <div className={`text-7xl font-bold mb-2 ${pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
          {correct}/{total}
        </div>
        <p className="text-slate-400 text-lg">{pct}% de réussite</p>
        <p className="text-slate-500 text-sm mt-2">
          {pct >= 80
            ? '🎉 Excellent travail !'
            : pct >= 50
            ? '👍 Continuez ainsi !'
            : '💪 Entraînez-vous encore !'}
        </p>
      </div>

      {/* Wrong words */}
      {wrongWords.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Mots à retravailler ({wrongWords.length})
          </h2>
          <div className="flex flex-col gap-2">
            {wrongWords.map(({ word }) => (
              <div key={word.id} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="chinese-text text-xl text-white">{word.simplified}</span>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">{word.pinyin}</p>
                  <p className="text-slate-300 text-xs">{word.definition.slice(0, 40)}{word.definition.length > 40 ? '…' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={onRestart}
          className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-semibold transition-all"
        >
          Nouveau test
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  )
}
