import { useState } from 'react'
import { lineText, lineVoice, lineWords } from '../data/reading.js'
import { ttsSrc } from '../utils/audio.js'
import { buildReadingQuiz, getReadingProgress, lookupWord, readingQuizSize } from '../utils/readingQuiz.js'
import { applyLessonResult, PASS_THRESHOLD } from '../utils/lessonProgress.js'
import { useLang } from '../i18n/useLang.js'
import { GrammarQuiz } from './GrammarQuiz.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Button, Score, Screen, TopBar } from './ui.jsx'

function Toggle({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`h-9 shrink-0 rounded-full border px-4 text-sm transition-colors duration-150 ease-out ${
        pressed ? 'border-seal bg-seal text-white' : 'border-line bg-card text-fg-2 hover:bg-raised'
      }`}
    >
      {children}
    </button>
  )
}

/** Une réplique ou une phrase : chaque mot se touche ; le mot touché s'explique sous la ligne. */
function Line({ reading, line, index, showPinyin, showTr, selected, onSelect }) {
  const { l, lang } = useLang()
  const speaker = line.s && reading.speakers[line.s]
  const entry = selected?.line === index ? lookupWord(lineWords(line)[selected.word], lang) : null
  return (
    <li className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        {speaker && <p className="chinese-text text-sm text-fg-3">{speaker.zh}</p>}
        <p className="chinese-text text-[22px] leading-relaxed text-fg">
          {lineWords(line).map((word, i) => {
            const active = selected?.line === index && selected.word === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(active ? null : { line: index, word: i })}
                className={`rounded px-px transition-colors duration-150 ease-out ${active ? 'bg-raised-2 text-accent' : 'hover:bg-raised'}`}
              >
                {word}
              </button>
            )
          })}
        </p>
        {showPinyin && <p className="mt-0.5 text-[15px] text-fg-2">{line.pinyin}</p>}
        {showTr && <p className="mt-0.5 text-[15px] text-fg-3">{l(line.tr)}</p>}
        {entry && (
          <div className="mt-2 rounded-xl border border-line bg-card px-3 py-2">
            <p className="flex items-baseline gap-2">
              <span className="chinese-text text-lg text-fg">{entry.zh}</span>
              <span className="text-[15px] text-fg-2">{entry.pinyin}</span>
            </p>
            {entry.parts ? (
              <ul className="mt-1 space-y-0.5 text-sm text-fg">
                {entry.parts.map((p, i) => (
                  <li key={i}><span className="chinese-text text-fg-2">{p.zh}</span> {p.senses[0]}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-fg">{entry.senses.join('; ')}</p>
            )}
          </div>
        )}
      </div>
      <SpeakButton text={lineText(line)} voice={lineVoice(reading, line)} />
    </li>
  )
}

/** Tout le texte enregistré, chaque ligne avec sa voix ; null s'il manque une ligne (voix du téléphone). */
function allRecorded(reading) {
  const srcs = reading.lines.map(line => ttsSrc(lineText(line), lineVoice(reading, line)))
  return srcs.every(Boolean) ? srcs : null
}

function Reader({ reading, onStart, onBack, backLabel }) {
  const { t, l } = useLang()
  const [showPinyin, setShowPinyin] = useState(false)
  const [showTr, setShowTr] = useState(false)
  const [selected, setSelected] = useState(null) // { line, word }

  return (
    <Screen>
      <TopBar onBack={onBack} backLabel={backLabel ?? t('rd.texts')} aside={`HSK ${reading.level}`} />
      <div className="flex flex-1 flex-col px-5 pb-8">
        <header className="pt-4 pb-5">
          <h1 className="text-[28px] font-medium leading-tight text-fg">
            {l(reading.title)} <span className="chinese-text whitespace-nowrap text-fg-2">{reading.zh}</span>
          </h1>
          <p className="mt-1 text-[15px] text-fg-2">{t(reading.kind === 'dialogue' ? 'rd.dialogue' : 'rd.text')} · {t('rd.tapHint')}</p>
        </header>

        <div className="flex items-center gap-2">
          <Toggle pressed={showPinyin} onClick={() => setShowPinyin(v => !v)}>{t('rd.pinyin')}</Toggle>
          <Toggle pressed={showTr} onClick={() => setShowTr(v => !v)}>{t('rd.translation')}</Toggle>
          <span className="flex-1" />
          <SpeakButton src={allRecorded(reading)} text={reading.lines.map(lineText)} />
        </div>

        <ol className="mt-6 mb-8 flex flex-col gap-5">
          {reading.lines.map((line, i) => (
            <Line key={i} reading={reading} line={line} index={i} showPinyin={showPinyin} showTr={showTr} selected={selected} onSelect={setSelected} />
          ))}
        </ol>

        <Button onClick={onStart} className="mt-auto">{t('rd.start', { n: readingQuizSize(reading) })}</Button>
      </div>
    </Screen>
  )
}

function Results({ score, title, onRetry, onRead, onExit, exitLabel }) {
  const { t, l, pct } = useLang()
  const passed = score >= PASS_THRESHOLD
  return (
    <Screen className="px-5 pb-8">
      <div className="my-auto">
        <Score value={pct(score)} label={l(title)} caption={passed ? t('rd.passed') : t('rd.failed', { pct: pct(PASS_THRESHOLD) })} good={passed} />
      </div>
      <div className="flex flex-col gap-2">
        {!passed && <Button onClick={onRead}>{t('rd.readAgain')}</Button>}
        <Button variant={passed ? 'primary' : 'secondary'} onClick={onRetry}>{t('common.retry')}</Button>
        <Button variant="secondary" onClick={onExit}>{exitLabel ?? t('rd.back')}</Button>
      </div>
    </Screen>
  )
}

/**
 * Un texte : lecture, questions, résultat (enregistré comme une leçon : 80 % pour réussir, puis révisions).
 * backLabel / exitLabel : retour ailleurs que vers la liste des textes (séance du jour).
 */
export function ReadingText({ reading, progressMap, applyUpdates, onExit, backLabel, exitLabel }) {
  const [quiz, setQuiz] = useState(null) // { id, questions }
  const [score, setScore] = useState(null)

  function start() {
    setScore(null)
    setQuiz(q => ({ id: (q?.id ?? 0) + 1, questions: buildReadingQuiz(reading) }))
  }

  function finish(results) {
    const result = results.filter(r => r.correct).length / results.length
    applyUpdates([applyLessonResult(getReadingProgress(progressMap, reading), result)])
    setQuiz(null)
    setScore(result)
  }

  if (score !== null) {
    return <Results score={score} title={reading.title} onRetry={start} onRead={() => setScore(null)} onExit={onExit} exitLabel={exitLabel} />
  }
  if (quiz) return <GrammarQuiz key={quiz.id} questions={quiz.questions} onExit={() => setQuiz(null)} onFinish={finish} />
  return <Reader reading={reading} onStart={start} onBack={onExit} backLabel={backLabel} />
}
