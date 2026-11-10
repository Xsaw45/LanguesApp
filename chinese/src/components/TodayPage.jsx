import { useRef, useState } from 'react'
import { Check, ChevronRight, Flame } from 'lucide-react'
import { activityStats, markStepDone } from '../utils/activity.js'
import { dueLessons, dueReadings, todayPlan } from '../utils/today.js'
import { buildClassifierQuiz } from '../utils/classifierQuiz.js'
import { buildHanziPractice, buildRadicalQuiz, currentHanziLevel } from '../utils/hanziQuiz.js'
import { useLang } from '../i18n/useLang.js'
import { CharacterPractice } from './CharacterPractice.jsx'
import { ClassifierQuiz } from './ClassifierQuiz.jsx'
import { GrammarReview } from './GrammarPage.jsx'
import { PinyinLesson } from './PinyinLesson.jsx'
import { RadicalQuiz } from './RadicalsPage.jsx'
import { ReadingText } from './ReadingText.jsx'
import { Button, Screen, SectionLabel, Seal, TopBar } from './ui.jsx'
import { ICON, ICON_SM } from './uiStyles.js'

const STEP_INFO = {
  pinyin: { seal: '拼', title: 'module.pinyin.title', fresh: null },
  vocab: { seal: '词', title: 'module.vocab.title', fresh: 'today.vocabNew' },
  hanzi: { seal: '字', title: 'module.hanzi.title', fresh: 'today.hanziNew' },
  radicals: { seal: '部', title: 'rad.title', fresh: null },
  grammar: { seal: '语', title: 'module.grammar.title', fresh: null },
  reading: { seal: '读', title: 'module.reading.title', fresh: null },
  classifiers: { seal: '量', title: 'module.classifiers.title', fresh: null },
}

/** Contenu d'une étape, figé à son lancement (la leçon à revoir ne change pas pendant qu'on la fait). */
function buildStep(id, progressMap) {
  if (id === 'hanzi') return buildHanziPractice(progressMap, currentHanziLevel(progressMap))
  if (id === 'radicals') return buildRadicalQuiz(progressMap)
  if (id === 'classifiers') return buildClassifierQuiz(progressMap)
  if (id === 'pinyin') return dueLessons(progressMap)[0]
  if (id === 'reading') return dueReadings(progressMap)[0]
  return null
}

/** 75 s → « 1 min » ; 3 900 s → « 1 h 05 » (minutes entières). */
function duration(seconds) {
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`
}

function Streak({ stats }) {
  const { t, lang } = useLang()
  const weekday = new Intl.DateTimeFormat(lang, { weekday: 'narrow', timeZone: 'UTC' })
  const caption = stats.streak === 0 ? t('today.streakNone')
    : !stats.activeToday ? t('today.keepStreak')
      : stats.learnedThisWeek === 0 ? t('today.practiced')
        : stats.learnedThisWeek === 1 ? t('today.learnedOne') : t('today.learned', { n: stats.learnedThisWeek })
  const title = stats.streak === 0 ? t('today.streakZero') : stats.streak === 1 ? t('today.streakOne') : t('today.streak', { n: stats.streak })
  return (
    <section className="rounded-2xl border border-line bg-card p-4">
      <div className="flex items-center gap-3">
        <Flame {...ICON} className={stats.streak > 0 ? 'text-accent' : 'text-fg-3'} />
        <p className="flex-1 text-lg font-medium text-fg">
          {title}
        </p>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-2">
        {stats.week.map((d, i) => (
          <li key={d.day} className="flex flex-col items-center gap-1.5">
            <span className={`size-3 rounded-full ${d.active ? 'bg-seal' : 'border border-line-2'}`} />
            <span className={`text-xs ${i === 6 ? 'font-medium text-fg' : 'text-fg-3'}`}>{weekday.format(new Date(`${d.day}T12:00:00Z`))}</span>
          </li>
        ))}
      </ol>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
        <div>
          <dt className="text-xs text-fg-3">{t('today.timeToday')}</dt>
          <dd className="text-base font-medium tabular-nums text-fg">{duration(stats.secondsToday)}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-3">{t('today.timeWeek')}</dt>
          <dd className="text-base font-medium tabular-nums text-fg">{duration(stats.secondsThisWeek)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-fg-2">{caption}</p>
    </section>
  )
}

/**
 * Séance du jour : toutes les révisions arrivées à échéance, module par module, puis des mots nouveaux.
 * Chaque étape ouvre le test habituel de son module et revient ici ; elle est finie quand on l'a faite aujourd'hui
 * et qu'il ne reste rien à réviser.
 */
export function TodayPage({ progressMap, applyUpdates, onBack, onStartVocab }) {
  const { t } = useLang()
  const [active, setActive] = useState(null) // { id, run, content }
  const touched = useRef(false) // l'étape en cours a enregistré au moins une réponse

  const plan = todayPlan(progressMap)
  const next = plan.find(s => !s.done)

  function launch(id) {
    if (id === 'vocab') {
      onStartVocab()
      return
    }
    touched.current = false
    setActive({ id, run: 1, content: buildStep(id, progressMap) })
  }

  const stepApply = updates => {
    touched.current = true
    return applyUpdates(updates)
  }
  const exit = () => {
    if (touched.current) applyUpdates([markStepDone(progressMap, active.id)])
    setActive(null)
  }
  const restart = () => setActive(a => ({ ...a, run: a.run + 1, content: buildStep(a.id, progressMap) }))

  if (active) {
    const common = { progressMap, applyUpdates: stepApply, onExit: exit, exitLabel: t('today.back') }
    const key = active.run
    if (active.id === 'hanzi') return <CharacterPractice key={key} {...common} items={active.content} onRestart={restart} />
    if (active.id === 'radicals') return <RadicalQuiz key={key} {...common} questions={active.content} onRestart={restart} />
    if (active.id === 'classifiers') return <ClassifierQuiz key={key} {...common} questions={active.content} onRestart={restart} />
    if (active.id === 'grammar') return <GrammarReview key={key} {...common} />
    if (active.id === 'reading') return <ReadingText key={key} {...common} reading={active.content} backLabel={t('today.title')} />
    if (active.id === 'pinyin') {
      return <PinyinLesson key={key} {...common} lesson={active.content} hasNext={false} onNextLesson={exit} backLabel={t('today.title')} />
    }
  }

  const doneCount = plan.filter(s => s.done).length

  return (
    <Screen>
      <TopBar onBack={onBack} title={<>{t('today.title')} <span className="chinese-text text-fg-2">今天</span></>} bordered />

      <div className="flex flex-1 flex-col px-5 py-6">
        <Streak stats={activityStats(progressMap)} />

        <SectionLabel className="mt-8">{t('today.plan', { done: doneCount, total: plan.length })}</SectionLabel>
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {plan.map(step => {
            const info = STEP_INFO[step.id]
            const subtitle = step.due > 0 ? t('today.due', { n: step.due }) : step.done ? t('today.stepDone') : t(info.fresh)
            const clickable = !step.done || info.fresh
            return (
              <li key={step.id}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => launch(step.id)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 ease-out hover:bg-raised disabled:hover:bg-transparent"
                >
                  <Seal className={step.done ? 'opacity-40' : ''}>{info.seal}</Seal>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-base font-medium ${step.done ? 'text-fg-2' : 'text-fg'}`}>{t(info.title)}</span>
                    <span className="mt-0.5 block text-sm tabular-nums text-fg-2">{subtitle}</span>
                  </span>
                  {step.done ? <Check {...ICON_SM} className="text-good" /> : <ChevronRight {...ICON} className="text-fg-3" />}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="mt-auto pt-8">
          {next ? (
            <Button onClick={() => launch(next.id)}>{t(doneCount > 0 ? 'today.continue' : 'today.start')}</Button>
          ) : (
            <>
              <p className="mb-4 text-center text-[15px] text-fg-2">{t('today.allDone')}</p>
              <Button variant="secondary" onClick={onStartVocab}>{t('today.moreWords')}</Button>
            </>
          )}
        </div>
      </div>
    </Screen>
  )
}

/** Carte de l'accueil : où en est la séance du jour, et la série de jours. */
export function TodayCard({ progressMap, onOpen }) {
  const { t } = useLang()
  const plan = todayPlan(progressMap)
  const left = plan.filter(s => !s.done).length
  const { streak } = activityStats(progressMap)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-seal/40 bg-card p-5 text-left transition-colors duration-150 ease-out hover:bg-raised active:bg-raised"
    >
      <div className="flex items-center gap-3">
        <Seal>今</Seal>
        <span className="flex-1 text-lg font-medium text-fg">{t('today.title')}</span>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 text-sm tabular-nums text-fg-2">
            <Flame {...ICON_SM} className="text-accent" />{streak}
          </span>
        )}
        <ChevronRight {...ICON} className="text-fg-3" />
      </div>
      <p className="mt-3 text-[15px] leading-snug text-fg-2">
        {left === 0 ? t('today.cardDone') : left === 1 ? t('today.cardOne') : t('today.cardLeft', { n: left })}
      </p>
    </button>
  )
}
