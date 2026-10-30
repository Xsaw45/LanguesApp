import { useState } from 'react'
import { getClassifierProgress } from '../utils/classifierQuiz.js'
import { applySuccess, applyFailure, isActive } from '../utils/spacedrep.js'

function Phrase({ example, char, revealed }) {
  const i = example.zh.indexOf(char)
  return (
    <span className="chinese-text">
      {example.zh.slice(0, i)}
      <span className={`inline-block min-w-[1.2em] mx-1 border-b-4 ${revealed ? 'text-green-400 border-green-500' : 'text-transparent border-slate-500'}`}>
        {char}
      </span>
      {example.zh.slice(i + char.length)}
    </span>
  )
}

export function Examples({ cl, highlight }) {
  return (
    <ul className="space-y-0.5">
      {cl.examples.map(ex => (
        <li key={ex.zh} className={`text-sm ${ex === highlight ? 'text-white' : 'text-slate-400'}`}>
          <span className="chinese-text text-base text-slate-200">{ex.zh}</span>
          <span className="text-slate-500 mx-1.5">{ex.pinyin}</span>
          <span>— {ex.fr}</span>
        </li>
      ))}
    </ul>
  )
}

export function ClassifierQuiz({ questions, progressMap, applyUpdates, onExit, onRestart }) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [results, setResults] = useState([])

  if (index >= questions.length) {
    const correct = results.filter(r => r.correct).length
    const pct = Math.round((correct / results.length) * 100)
    const missed = results.filter(r => !r.correct).map(r => r.cl)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
          <div className={`text-7xl font-bold mb-2 ${pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {correct}/{results.length}
          </div>
          <p className="text-slate-400 text-lg">{pct}% de réussite</p>
        </div>
        {missed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              À retravailler ({missed.length})
            </h2>
            <div className="flex flex-col gap-2">
              {missed.map(cl => (
                <div key={cl.char} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3">
                  <p className="mb-1">
                    <span className="chinese-text text-2xl text-white mr-2">{cl.char}</span>
                    <span className="text-slate-400 text-sm">{cl.pinyin}</span>
                  </p>
                  <p className="text-slate-300 text-sm mb-2">{cl.usage}</p>
                  <Examples cl={cl} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 mt-auto">
          <button onClick={onRestart} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-semibold transition-all">
            Nouveau test
          </button>
          <button onClick={onExit} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all">
            Retour aux classificateurs
          </button>
        </div>
      </div>
    )
  }

  const question = questions[index]
  const { cl, type, example, options } = question
  const answered = chosen !== null
  const lastCorrect = answered && options.find(o => o.key === chosen).correct

  function choose(option) {
    if (answered) return
    setChosen(option.key)
    setResults(prev => [...prev, { cl, correct: option.correct }])
    const progress = getClassifierProgress(progressMap, cl)
    // Hors échéance (test complété avec des classificateurs déjà maîtrisés) : seule une erreur compte.
    const updated = !option.correct ? applyFailure(progress) : isActive(progress) ? applySuccess(progress) : null
    if (updated) applyUpdates([updated])
  }

  function next() {
    setChosen(null)
    setIndex(i => i + 1)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors text-sm">
          ← Quitter
        </button>
        <span className="text-slate-400 text-sm font-medium">{index + 1} / {questions.length}</span>
        <div className="w-12" />
      </div>
      <div className="px-4 mb-2">
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col">
        {type === 'fill' ? (
          <div className="text-center py-6">
            <p className="text-slate-400 text-sm mb-4 uppercase tracking-wider">Quel classificateur ?</p>
            <div className={`${example.zh.length > 5 ? 'text-3xl' : 'text-5xl'} font-bold text-white mb-4 leading-tight`}>
              <Phrase example={example} char={cl.char} revealed={answered} />
            </div>
            <p className="text-slate-400">{example.fr}</p>
            {answered && <p className="text-slate-500 text-sm mt-1">{example.pinyin}</p>}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-400 text-sm mb-4 uppercase tracking-wider">À quoi sert ce classificateur ?</p>
            <div className="chinese-text text-7xl font-bold text-white mb-2 leading-none">{cl.char}</div>
            <p className="text-slate-400">{cl.pinyin}</p>
          </div>
        )}

        <div className={type === 'fill' ? 'grid grid-cols-2 gap-3 mb-4' : 'flex flex-col gap-2 mb-4'}>
          {options.map(o => {
            const style = !answered
              ? 'border-slate-600 bg-slate-800 hover:border-slate-400 text-white'
              : o.correct
                ? 'border-green-600 bg-green-900/40 text-green-300'
                : o.key === chosen
                  ? 'border-red-600 bg-red-900/40 text-red-300'
                  : 'border-slate-800 bg-slate-900 text-slate-500'
            return (
              <button
                key={o.key}
                onClick={() => choose(o)}
                disabled={answered}
                className={`rounded-xl border transition-all ${style} ${type === 'fill' ? 'py-4' : 'px-4 py-3 text-left text-sm'}`}
              >
                {type === 'fill' ? (
                  <>
                    <span className="chinese-text text-3xl font-bold block">{o.label}</span>
                    {answered && <span className="text-xs opacity-80">{o.sub}</span>}
                  </>
                ) : o.label}
              </button>
            )
          })}
        </div>

        {answered && (
          <>
            <div className={`rounded-2xl p-4 mb-4 ${lastCorrect ? 'bg-green-900/40 border border-green-700' : 'bg-red-900/40 border border-red-700'}`}>
              <p className={`font-semibold text-lg mb-2 ${lastCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {lastCorrect ? '✓ Correct !' : '✗ Incorrect'}
              </p>
              <p className="text-slate-300 text-sm mb-2">
                <span className="chinese-text text-xl text-white mr-2">{cl.char}</span>
                <span className="text-slate-400 mr-2">{cl.pinyin}</span>
                {cl.usage}
              </p>
              {cl.note && <p className="text-slate-400 text-xs mb-2">{cl.note}</p>}
              <Examples cl={cl} highlight={example} />
            </div>
            <button
              onClick={next}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all mb-6"
            >
              {index + 1 < questions.length ? 'Suivant →' : 'Voir le résultat'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
