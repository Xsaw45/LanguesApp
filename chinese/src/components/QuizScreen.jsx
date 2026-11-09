import { useEffect } from 'react'
import { QuestionCard } from './QuestionCard.jsx'
import { AnswerInput } from './AnswerInput.jsx'
import { QUIZ_STATES } from '../hooks/useQuiz.js'
import { SpeakButton } from './SpeakButton.jsx'
import { play, preload, wordSrc } from '../utils/audio.js'
import { wordSenses } from '../data/index.js'
import { useLang } from '../i18n/useLang.js'
import { Button, Feedback, ProgressBar, Screen, TopBar } from './ui.jsx'
import { optionClass } from './uiStyles.js'

function FeedbackBanner({ correct, word }) {
  const { lang } = useLang()
  return (
    <Feedback correct={correct} aside={<SpeakButton src={wordSrc(word)} text={word.simplified} />}>
      <p className="flex items-baseline gap-3">
        <span className="chinese-text text-2xl text-fg">{word.simplified}</span>
        <span className="text-[15px] text-fg-2">{word.pinyin}</span>
      </p>
      <ul className="mt-3 space-y-1 text-[15px] text-fg">
        {wordSenses(word, lang).map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="shrink-0 text-fg-3">·</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </Feedback>
  )
}

// Caractères : grille, pinyin révélé après la réponse ; pinyin : grille ; sens : liste.
const LAYOUT = {
  'char-choice': { list: 'grid grid-cols-2 gap-3', option: 'flex h-24 flex-col items-center justify-center gap-1', label: 'hanzi-display text-[32px] leading-none' },
  'listen-choice': { list: 'grid grid-cols-2 gap-3', option: 'flex h-24 flex-col items-center justify-center gap-1', label: 'hanzi-display text-[32px] leading-none' },
  'pinyin-choice': { list: 'grid grid-cols-2 gap-3', option: 'h-16 px-2', label: 'text-xl font-medium' },
  'meaning-choice': { list: 'flex flex-col gap-2', option: 'min-h-12 px-4 py-3 text-left', label: 'text-base' },
}

function Choices({ question, answered, chosen, onChoose }) {
  const { l } = useLang()
  const layout = LAYOUT[question.type]
  return (
    <div className={`mb-4 ${layout.list}`}>
      {question.options.map(o => (
        <button
          key={o.key}
          type="button"
          disabled={answered}
          onClick={() => onChoose(o.key)}
          className={`rounded-xl border transition-colors duration-150 ease-out ${optionClass({ answered, correct: o.correct, chosen: o.key === chosen })} ${layout.option}`}
        >
          <span className={layout.label}>{l(o.label)}</span>
          {answered && o.sub && <span className="text-sm text-fg-2">{o.sub}</span>}
        </button>
      ))}
    </div>
  )
}

export function QuizScreen({ quizState, currentQuestion, currentIndex, totalQuestions, lastCorrect, lastAnswer, onSubmit, onNext, onQuit, upcoming }) {
  const { t } = useLang()
  const inFeedback = quizState === QUIZ_STATES.FEEDBACK
  const { word, type, options, audio } = currentQuestion
  const placeholder = t(type === 'char-to-def' ? 'vocab.placeholderMeaning' : 'vocab.placeholderWord')

  // Question d'écoute : le son part à l'affichage ; le suivant est préchargé.
  useEffect(() => {
    if (audio) play(audio)
  }, [audio, currentIndex])
  useEffect(() => {
    if (upcoming?.audio) preload([upcoming.audio])
  }, [upcoming])

  return (
    <Screen>
      <TopBar onBack={onQuit} backLabel={t('nav.quit')} aside={`${currentIndex + 1} / ${totalQuestions}`} />
      <ProgressBar value={(currentIndex + (inFeedback ? 1 : 0)) / totalQuestions} className="mx-5" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        <QuestionCard question={currentQuestion} />

        {options && <Choices question={currentQuestion} answered={inFeedback} chosen={lastAnswer} onChoose={onSubmit} />}

        {inFeedback ? (
          <div className="flex flex-col gap-4">
            <FeedbackBanner correct={lastCorrect} word={word} />
            <Button onClick={onNext}>{t('common.next')}</Button>
          </div>
        ) : !options && (
          // key : nouveau champ (vide) à chaque question
          <AnswerInput key={currentIndex} onSubmit={onSubmit} disabled={false} placeholder={placeholder} />
        )}
      </div>
    </Screen>
  )
}
