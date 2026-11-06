import { QuestionCard } from './QuestionCard.jsx'
import { AnswerInput } from './AnswerInput.jsx'
import { QUIZ_STATES } from '../hooks/useQuiz.js'
import { SpeakButton } from './SpeakButton.jsx'
import { wordSrc } from '../utils/audio.js'

function FeedbackBanner({ correct, word }) {
  const senses = word.definition.split(/[;|]/).map(s => s.trim()).filter(Boolean)

  return (
    <div className={`rounded-2xl p-4 mb-4 ${correct ? 'bg-green-900/40 border border-green-700' : 'bg-red-900/40 border border-red-700'}`}>
      <p className={`font-semibold text-lg mb-2 ${correct ? 'text-green-400' : 'text-red-400'}`}>
        {correct ? '✓ Correct !' : '✗ Incorrect'}
      </p>
      <div className="text-slate-300 text-sm space-y-1">
        <p className="flex items-center gap-2">
          <span className="text-slate-400">Caractère : </span>
          <span className="chinese-text font-medium text-base">{word.simplified}</span>
          <span className="text-slate-400">[{word.pinyin}]</span>
          <SpeakButton src={wordSrc(word)} text={word.simplified} className="w-8 h-8 text-sm" />
        </p>
        <div>
          <span className="text-slate-400">Définitions :</span>
          <ul className="mt-1 space-y-0.5 pl-3">
            {senses.map((s, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-slate-600 shrink-0">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function QuizScreen({ quizState, currentQuestion, currentIndex, totalQuestions, lastCorrect, onSubmit, onNext, onQuit }) {
  const inFeedback = quizState === QUIZ_STATES.FEEDBACK
  const { word, type } = currentQuestion

  const placeholder = type === 'char-to-def'
    ? 'Définition en français…'
    : 'Caractère chinois ou pinyin avec tons…'

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={onQuit}
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← Quitter
        </button>
        <span className="text-slate-400 text-sm font-medium">
          {currentIndex + 1} / {totalQuestions}
        </span>
        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-2">
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + (inFeedback ? 1 : 0)) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 flex flex-col">
        <QuestionCard question={currentQuestion} />

        {/* Feedback */}
        {inFeedback && (
          <FeedbackBanner correct={lastCorrect} word={word} />
        )}

        {/* Input — key forces remount (and clear) on each new question */}
        {!inFeedback && (
          <AnswerInput
            key={currentIndex}
            onSubmit={onSubmit}
            disabled={false}
            placeholder={placeholder}
          />
        )}

        {/* Next button */}
        {inFeedback && (
          <button
            onClick={onNext}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all mt-2"
          >
            Suivant →
          </button>
        )}
      </div>
    </div>
  )
}
