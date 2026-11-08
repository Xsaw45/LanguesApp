import { QuestionCard } from './QuestionCard.jsx'
import { AnswerInput } from './AnswerInput.jsx'
import { QUIZ_STATES } from '../hooks/useQuiz.js'
import { SpeakButton } from './SpeakButton.jsx'
import { wordSrc } from '../utils/audio.js'
import { Button, Feedback, ProgressBar, Screen, TopBar } from './ui.jsx'

function senses(word) {
  return word.definition.split(/[;|]/).map(s => s.trim()).filter(Boolean)
}

function FeedbackBanner({ correct, word }) {
  return (
    <Feedback correct={correct} aside={<SpeakButton src={wordSrc(word)} text={word.simplified} />}>
      <p className="flex items-baseline gap-3">
        <span className="chinese-text text-2xl text-fg">{word.simplified}</span>
        <span className="text-[15px] text-fg-2">{word.pinyin}</span>
      </p>
      <ul className="mt-3 space-y-1 text-[15px] text-fg">
        {senses(word).map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="shrink-0 text-fg-3">·</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </Feedback>
  )
}

export function QuizScreen({ quizState, currentQuestion, currentIndex, totalQuestions, lastCorrect, onSubmit, onNext, onQuit }) {
  const inFeedback = quizState === QUIZ_STATES.FEEDBACK
  const { word, type } = currentQuestion

  // Les définitions viennent d'un dictionnaire anglais (CC-CEDICT) : la réponse se tape en anglais.
  const placeholder = type === 'char-to-def' ? 'Sens en anglais' : 'Caractères ou pinyin : nǐ hǎo, ni3 hao3'

  return (
    <Screen>
      <TopBar onBack={onQuit} backLabel="Quitter" aside={`${currentIndex + 1} / ${totalQuestions}`} />
      <ProgressBar value={(currentIndex + (inFeedback ? 1 : 0)) / totalQuestions} className="mx-5" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        <QuestionCard question={currentQuestion} />

        {inFeedback ? (
          <div className="flex flex-col gap-4">
            <FeedbackBanner correct={lastCorrect} word={word} />
            <Button onClick={onNext}>Suivant</Button>
          </div>
        ) : (
          // key : nouveau champ (vide) à chaque question
          <AnswerInput key={currentIndex} onSubmit={onSubmit} disabled={false} placeholder={placeholder} />
        )}
      </div>
    </Screen>
  )
}
