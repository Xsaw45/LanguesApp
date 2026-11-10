import { useState } from 'react'
import {
  PLACEMENT_LEVELS, PLACEMENT_PASS, PLACEMENT_PER_LEVEL, UNLOCK_PASS, UNLOCK_TEST_SIZE, levelTestQuestions, levelUpdates,
} from '../utils/levelTest.js'
import { unlockAudio } from '../utils/audio.js'
import { useLang } from '../i18n/useLang.js'
import { QuestionCard } from './QuestionCard.jsx'
import { Choices } from './QuizScreen.jsx'
import { Button, ProgressBar, Score, Screen, TopBar } from './ui.jsx'

/**
 * Test de niveau du vocabulaire, sans correction question par question (on avance tout de suite).
 * mode 'placement' : du HSK 1 vers le haut, tant que le niveau est réussi ; onPlaced(niveau atteint, 0 si aucun).
 * mode 'unlock' : mots du niveau `level - 1`, pour débloquer `level`.
 */
export function VocabLevelTest({ mode, level, progressMap, applyUpdates, onPlaced, onExit }) {
  const { t, pct } = useLang()
  const placement = mode === 'placement'
  const firstLevel = placement ? PLACEMENT_LEVELS[0] : level - 1
  const size = placement ? PLACEMENT_PER_LEVEL : UNLOCK_TEST_SIZE
  const [block, setBlock] = useState(() => ({ level: firstLevel, questions: levelTestQuestions(firstLevel, size, progressMap) }))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => new Map()) // wordId → bonne réponse, niveau en cours
  const [done, setDone] = useState([]) // [{ level, answers, passed, ratio }]
  const [result, setResult] = useState(null) // { reached } (placement) ou { ratio, passed } (déblocage)

  function finish(blocks) {
    const updates = blocks.flatMap(b => levelUpdates(b.level, b.answers, b.passed, progressMap))
    if (placement) {
      const reached = blocks.filter(b => b.passed).at(-1)?.level ?? 0
      if (updates.length) applyUpdates(updates)
      onPlaced(reached)
      setResult({ reached })
    } else {
      const { ratio, passed } = blocks[0]
      if (passed && updates.length) applyUpdates(updates)
      setResult({ ratio, passed })
    }
  }

  function answer(correct) {
    unlockAudio()
    const { word } = block.questions[index]
    const next = new Map(answers).set(word.id, correct)
    if (index + 1 < block.questions.length) {
      setAnswers(next)
      setIndex(index + 1)
      return
    }
    const ratio = [...next.values()].filter(Boolean).length / next.size
    const passed = ratio >= (placement ? PLACEMENT_PASS : UNLOCK_PASS)
    const blocks = [...done, { level: block.level, answers: next, passed, ratio }]
    const nextLevel = PLACEMENT_LEVELS[PLACEMENT_LEVELS.indexOf(block.level) + 1]
    if (placement && passed && nextLevel) {
      setDone(blocks)
      setBlock({ level: nextLevel, questions: levelTestQuestions(nextLevel, size, progressMap) })
      setAnswers(new Map())
      setIndex(0)
      return
    }
    finish(blocks)
  }

  if (result) {
    const value = placement ? (result.reached ? `HSK ${result.reached}` : t('lt.beginner')) : pct(result.ratio)
    const caption = placement
      ? (result.reached ? t('lt.placedCaption', { level: result.reached, next: result.reached + 1 }) : t('lt.beginnerCaption'))
      : t(result.passed ? 'lt.unlockPassed' : 'lt.unlockFailed', { level, pct: pct(UNLOCK_PASS) })
    return (
      <Screen className="px-5 pb-8">
        <div className="my-auto">
          <Score value={value} label={t(placement ? 'lt.placedLabel' : 'lt.unlockLabel', { level })} caption={caption} good={placement ? result.reached > 0 : result.passed} />
          <p className="text-center text-sm text-fg-3">{t('lt.howReviewed')}</p>
        </div>
        <Button onClick={onExit}>{t('lt.continue')}</Button>
      </Screen>
    )
  }

  const question = block.questions[index]
  return (
    <Screen>
      <TopBar onBack={onExit} backLabel={t('nav.quit')} aside={`HSK ${block.level} · ${index + 1} / ${block.questions.length}`} />
      <ProgressBar value={index / block.questions.length} className="mx-5" />
      <div className="flex flex-1 flex-col px-5 pb-8">
        <QuestionCard question={question} />
        <Choices
          key={question.word.id}
          question={question}
          answered={false}
          chosen={null}
          onChoose={key => answer(!!question.options.find(o => o.key === key)?.correct)}
        />
        <Button variant="secondary" onClick={() => answer(false)}>{t('lt.dontKnow')}</Button>
        <p className="mt-4 text-center text-sm text-fg-3">{t(placement ? 'lt.placementHint' : 'lt.unlockHint', { level, prev: level - 1, pct: pct(UNLOCK_PASS) })}</p>
      </div>
    </Screen>
  )
}
