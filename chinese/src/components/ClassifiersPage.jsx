import { useState } from 'react'
import { CLASSIFIER_GROUPS, CLASSIFIERS } from '../data/classifiers.js'
import { buildClassifierQuiz, getClassifierProgress, CLASSIFIER_QUIZ_SIZE } from '../utils/classifierQuiz.js'
import { isDueForReview } from '../utils/spacedrep.js'
import { ClassifierQuiz, Examples } from './ClassifierQuiz.jsx'

function StatusBadge({ progress }) {
  if (progress.known && isDueForReview(progress)) {
    return <span className="text-xs text-yellow-400">à réviser</span>
  }
  if (progress.known) return <span className="text-xs text-green-500">✓ maîtrisé</span>
  if (progress.successCount > 0) return <span className="text-xs text-slate-400">{progress.successCount}/3</span>
  return null
}

export function ClassifiersPage({ progressMap, applyUpdates, onBack }) {
  const [quiz, setQuiz] = useState(null) // { id, questions } pendant un test
  const startQuiz = () => setQuiz(q => ({ id: (q?.id ?? 0) + 1, questions: buildClassifierQuiz(progressMap) }))

  if (quiz) {
    return (
      <ClassifierQuiz
        key={quiz.id}
        questions={quiz.questions}
        progressMap={progressMap}
        applyUpdates={applyUpdates}
        onExit={() => setQuiz(null)}
        onRestart={startQuiz}
      />
    )
  }

  const known = CLASSIFIERS.filter(cl => getClassifierProgress(progressMap, cl).known).length

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-sm shrink-0">
          ← Retour
        </button>
        <h1 className="text-white font-bold text-lg flex-1 text-center">
          Classificateurs <span className="chinese-text">量词</span>
        </h1>
        <div className="w-14 shrink-0" />
      </div>

      <div className="px-4 py-4 border-b border-slate-800">
        <p className="text-slate-300 text-sm mb-3">
          Entre un nombre (ou <span className="chinese-text">这 / 那 / 几</span>) et un nom, le chinois exige un
          classificateur choisi selon la nature de l'objet : <span className="chinese-text">一本书</span>,{' '}
          <span className="chinese-text">两张票</span>, <span className="chinese-text">这只猫</span>.{' '}
          <span className="chinese-text">个</span> dépanne, le bon classificateur rend le chinois naturel.
        </p>
        <button
          onClick={startQuiz}
          className="w-full py-4 rounded-2xl text-lg font-semibold bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-900/30 transition-all"
        >
          Tester · {CLASSIFIER_QUIZ_SIZE} questions
        </button>
        <p className="text-center text-slate-500 text-xs mt-2">
          {known}/{CLASSIFIERS.length} maîtrisés · 3 bonnes réponses d'affilée pour maîtriser, puis révisions espacées
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {CLASSIFIER_GROUPS.map(group => (
          <section key={group.title} className="mt-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{group.title}</h2>
            {group.note && <p className="text-slate-500 text-xs mb-1">{group.note}</p>}
            <div className="flex flex-col divide-y divide-slate-800">
              {group.items.map(cl => (
                <div key={cl.char} className="py-3 flex gap-3 items-start">
                  <div className="shrink-0 w-14 text-center">
                    <span className="chinese-text text-3xl font-bold text-white">{cl.char}</span>
                    <p className="text-slate-500 text-xs mt-0.5">{cl.pinyin}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="text-slate-200 text-sm">{cl.usage}</p>
                      <StatusBadge progress={getClassifierProgress(progressMap, cl)} />
                    </div>
                    {cl.note && <p className="text-slate-500 text-xs mt-0.5">{cl.note}</p>}
                    <div className="mt-1">
                      <Examples cl={cl} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
