import { useState } from 'react'
import { isOrderCorrect } from '../utils/grammarQuiz.js'
import { useLang } from '../i18n/useLang.js'
import { SpeakButton } from './SpeakButton.jsx'
import { Button, Feedback, ProgressBar, Screen, TopBar } from './ui.jsx'
import { optionClass } from './uiStyles.js'

const tokenClass = 'h-11 rounded-lg border border-line bg-raised px-3 chinese-text text-xl text-fg transition-colors duration-150 ease-out hover:bg-raised-2 disabled:hover:bg-raised'

/** Remettre dans l'ordre : toucher les mots pour les placer, toucher un mot placé pour le retirer. */
function OrderQuestion({ question, answered, onAnswer }) {
  const { t } = useLang()
  const [placed, setPlaced] = useState([])
  const remaining = question.tokens.filter(token => !placed.includes(token))

  return (
    <>
      <div className={`flex min-h-14 flex-wrap gap-2 rounded-xl border border-line bg-card p-2 ${answered ? 'mb-4' : 'mb-3'}`}>
        {placed.map(token => (
          <button key={token.id} type="button" disabled={answered} onClick={() => setPlaced(p => p.filter(x => x !== token))} className={tokenClass}>
            {token.text}
          </button>
        ))}
      </div>
      {!answered && (
        <>
          <div className="mb-4 flex min-h-11 flex-wrap justify-center gap-2">
            {remaining.map(token => (
              <button key={token.id} type="button" onClick={() => setPlaced(p => [...p, token])} className={tokenClass}>
                {token.text}
              </button>
            ))}
          </div>
          <Button disabled={remaining.length > 0} onClick={() => onAnswer(isOrderCorrect(question, placed.map(token => token.text)))}>
            {t('common.validate')}
          </Button>
        </>
      )}
    </>
  )
}

function Gap({ gap, answer, revealed }) {
  return (
    <span className="hanzi-display">
      {gap.before}
      <span className={`mx-1 inline-block min-w-[1.1em] border-b-2 ${revealed ? 'border-accent text-accent' : 'border-fg-3 text-transparent'}`}>
        {revealed ? answer : '　'}
      </span>
      {gap.after}
    </span>
  )
}

const OPTIONS_LAYOUT = {
  grid3: { list: 'grid grid-cols-3 gap-3', option: 'h-20 hanzi-display text-[32px]' },
  two: { list: 'grid grid-cols-2 gap-3', option: 'h-14 text-base font-medium' },
  list: { list: 'flex flex-col gap-2', option: 'min-h-12 px-4 py-3 text-left chinese-text text-xl' },
}

function ChoiceQuestion({ question, chosen, onChoose }) {
  const { l } = useLang()
  const answered = chosen !== null
  const layout = OPTIONS_LAYOUT[question.layout]
  return (
    <div className={`mb-4 ${layout.list}`}>
      {question.options.map(o => (
        <button
          key={o.key}
          type="button"
          disabled={answered}
          onClick={() => onChoose(o)}
          className={`rounded-xl border transition-colors duration-150 ease-out ${optionClass({ answered, correct: o.correct, chosen: o.key === chosen })} ${layout.option}`}
        >
          {l(o.label)}
        </button>
      ))}
    </div>
  )
}

/** Énoncé : phrase à compléter, phrase à juger ou phrase à traduire. */
function Prompt({ question, answered }) {
  const { l } = useLang()
  const answer = question.options?.find(o => o.correct)?.label
  return (
    <div className="py-10 text-center">
      <p className="text-[15px] text-fg-2">{l(question.prompt)}</p>
      {question.gap && (
        <div className="mt-6 text-[32px] leading-tight text-fg">
          <Gap gap={question.gap} answer={answer} revealed={answered} />
        </div>
      )}
      {question.display && (
        <div className={`mt-6 leading-tight text-fg ${question.displayChinese ? 'hanzi-display text-[32px]' : 'text-2xl font-medium'}`}>
          {l(question.display)}
        </div>
      )}
      {question.tr && <p className="mt-4 text-[17px] text-fg-2">{l(question.tr)}</p>}
    </div>
  )
}

export function GrammarQuiz({ questions, onExit, onFinish }) {
  const { t, l } = useLang()
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState(null) // QCM : clé du choix
  const [results, setResults] = useState([]) // [{ pointId, correct }]
  const question = questions[index]
  const answered = results.length > index
  const lastCorrect = answered && results[index].correct

  function answer(correct) {
    setResults(prev => [...prev, { pointId: question.pointId, correct }])
  }

  function next() {
    if (index + 1 >= questions.length) {
      onFinish(results)
      return
    }
    setChosen(null)
    setIndex(i => i + 1)
  }

  return (
    <Screen>
      <TopBar onBack={onExit} backLabel={t('nav.quit')} aside={`${index + 1} / ${questions.length}`} />
      <ProgressBar value={(index + (answered ? 1 : 0)) / questions.length} className="mx-5" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        <Prompt question={question} answered={answered} />

        {question.type === 'order' ? (
          <OrderQuestion key={question.key} question={question} answered={answered} onAnswer={answer} />
        ) : (
          <ChoiceQuestion
            question={question}
            chosen={chosen}
            onChoose={o => {
              setChosen(o.key)
              answer(o.correct)
            }}
          />
        )}

        {answered && (
          <div className="flex flex-col gap-4">
            <Feedback correct={lastCorrect} aside={<SpeakButton text={question.solution.zh} />}>
              <p className="chinese-text text-2xl text-fg">{question.solution.zh}</p>
              <p className="mt-1 text-[15px] text-fg-2">{question.solution.pinyin}</p>
              <p className="mt-1 text-[15px] text-fg">{l(question.solution.tr)}</p>
              {question.explanation && <p className="mt-3 text-[15px] text-fg-2">{l(question.explanation)}</p>}
            </Feedback>
            <Button onClick={next}>{t(index + 1 < questions.length ? 'common.next' : 'common.seeResult')}</Button>
          </div>
        )}
      </div>
    </Screen>
  )
}
