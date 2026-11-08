import { useState } from 'react'
import { getClassifierProgress } from '../utils/classifierQuiz.js'
import { applySuccess, applyFailure, isActive } from '../utils/spacedrep.js'
import { Button, Feedback, ProgressBar, Score, Screen, SectionLabel, TopBar } from './ui.jsx'
import { optionClass, percent } from './uiStyles.js'

function Phrase({ example, char, revealed }) {
  const i = example.zh.indexOf(char)
  return (
    <span className="hanzi-display">
      {example.zh.slice(0, i)}
      <span className={`mx-1 inline-block min-w-[1.1em] border-b-2 ${revealed ? 'border-accent text-accent' : 'border-fg-3 text-transparent'}`}>
        {char}
      </span>
      {example.zh.slice(i + char.length)}
    </span>
  )
}

export function Examples({ cl, highlight }) {
  return (
    <ul className="space-y-1">
      {cl.examples.map(ex => (
        <li key={ex.zh} className={`text-[15px] leading-snug ${ex === highlight ? 'text-fg' : 'text-fg-2'}`}>
          <span className="chinese-text text-fg">{ex.zh}</span>
          <span className="ml-2 text-fg-3">{ex.pinyin}</span>
          <span className="mx-1.5 text-fg-3">—</span>
          <span>{ex.fr}</span>
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
    const ratio = correct / results.length
    const missed = results.filter(r => !r.correct).map(r => r.cl)
    return (
      <Screen className="px-5 pb-8">
        <div className="my-auto">
          <Score value={`${correct} / ${results.length}`} label={`${percent(ratio)} de réussite`} good={ratio >= 0.8} />
          {missed.length > 0 && (
            <section className="mb-8">
              <SectionLabel>À retravailler · {missed.length}</SectionLabel>
              <div className="flex flex-col gap-3">
                {missed.map(cl => (
                  <div key={cl.char} className="rounded-2xl border border-line bg-card p-4">
                    <p className="flex items-baseline gap-2">
                      <span className="hanzi-display text-2xl text-fg">{cl.char}</span>
                      <span className="text-sm text-fg-2">{cl.pinyin}</span>
                    </p>
                    <p className="mt-1 mb-3 text-[15px] text-fg">{cl.usage}</p>
                    <Examples cl={cl} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={onRestart}>Nouveau test</Button>
          <Button variant="secondary" onClick={onExit}>Retour aux classificateurs</Button>
        </div>
      </Screen>
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
    <Screen>
      <TopBar onBack={onExit} backLabel="Quitter" aside={`${index + 1} / ${questions.length}`} />
      <ProgressBar value={(index + (answered ? 1 : 0)) / questions.length} className="mx-5" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        {type === 'fill' ? (
          <div className="py-10 text-center">
            <p className="mb-6 text-[15px] text-fg-2">Quel classificateur ?</p>
            <div className={`${example.zh.length > 5 ? 'text-[32px]' : 'text-5xl'} leading-tight text-fg`}>
              <Phrase example={example} char={cl.char} revealed={answered} />
            </div>
            <p className="mt-4 text-[17px] text-fg-2">{example.fr}</p>
            {answered && <p className="mt-1 text-[15px] text-fg-3">{example.pinyin}</p>}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="mb-6 text-[15px] text-fg-2">À quoi sert ce classificateur ?</p>
            <div className="hanzi-display text-[72px] leading-none text-fg">{cl.char}</div>
            <p className="mt-4 text-[17px] text-fg-2">{cl.pinyin}</p>
          </div>
        )}

        <div className={type === 'fill' ? 'mb-4 grid grid-cols-2 gap-3' : 'mb-4 flex flex-col gap-2'}>
          {options.map(o => (
            <button
              key={o.key}
              type="button"
              onClick={() => choose(o)}
              disabled={answered}
              className={`rounded-xl border transition-colors duration-150 ease-out ${optionClass({ answered, correct: o.correct, chosen: o.key === chosen })} ${
                type === 'fill' ? 'flex h-20 flex-col items-center justify-center' : 'min-h-12 px-4 py-3 text-left text-[15px]'
              }`}
            >
              {type === 'fill' ? (
                <>
                  <span className="hanzi-display text-[32px] leading-none">{o.label}</span>
                  {answered && <span className="mt-1 text-sm text-fg-2">{o.sub}</span>}
                </>
              ) : o.label}
            </button>
          ))}
        </div>

        {answered && (
          <div className="flex flex-col gap-4">
            <Feedback correct={lastCorrect}>
              <p className="flex items-baseline gap-2">
                <span className="hanzi-display text-2xl text-fg">{cl.char}</span>
                <span className="text-[15px] text-fg-2">{cl.pinyin}</span>
              </p>
              <p className="mt-1 text-[15px] text-fg">{cl.usage}</p>
              {cl.note && <p className="mt-1 text-sm text-fg-3">{cl.note}</p>}
              <div className="mt-3">
                <Examples cl={cl} highlight={example} />
              </div>
            </Feedback>
            <Button onClick={next}>{index + 1 < questions.length ? 'Suivant' : 'Voir le résultat'}</Button>
          </div>
        )}
      </div>
    </Screen>
  )
}
