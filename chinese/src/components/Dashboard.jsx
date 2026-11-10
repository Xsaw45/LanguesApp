import { LevelCard } from './LevelCard.jsx'
import { ALL_LEVELS, getWordsForLevel } from '../data/index.js'
import { isActive, isDueForReview, createInitialProgress } from '../utils/spacedrep.js'
import { LEARNING_LIMIT } from '../utils/quiz.js'
import { useLang } from '../i18n/useLang.js'
import { Button, Screen, SectionLabel, TopBar } from './ui.jsx'
import { PlacementInvite } from './PlacementInvite.jsx'

/** active : mots à proposer (nouveaux, en cours, à réviser) ; learning : en cours ; due : à réviser. */
function countWords(progressMap, unlockedLevels) {
  const counts = { active: 0, learning: 0, due: 0 }
  if (!progressMap) return counts
  for (const w of unlockedLevels.flatMap(l => getWordsForLevel(l))) {
    const p = progressMap.get(w.id) || createInitialProgress(w.id, w.level)
    if (isActive(p)) counts.active++
    if (progressMap.has(w.id) && !p.known) counts.learning++
    if (isDueForReview(p)) counts.due++
  }
  return counts
}

/** placementDone : test de niveau déjà fait ; sinon une invitation à le faire s'affiche en haut. */
export function Dashboard({ levelStats, unlockedLevels, progressMap, placementDone, onStartPlacement, onStartUnlockTest, onStartQuiz, onOpenVocabulary, onBack }) {
  const { t } = useLang()
  const counts = countWords(progressMap, unlockedLevels)
  const activeCount = counts.active
  const canStart = activeCount > 0
  const stats = levelStats || ALL_LEVELS.map(l => ({ level: l, total: getWordsForLevel(l).length, known: 0, pct: 0 }))
  const firstLocked = stats.find(s => !unlockedLevels.includes(s.level))?.level

  return (
    <Screen>
      <TopBar onBack={onBack} backLabel={t('nav.modules')} />

      <div className="px-5 pb-8">
        <header className="pt-4 pb-6">
          <h1 className="text-[28px] font-medium leading-tight text-fg">{t('vocab.title')}</h1>
          <p className="mt-1 text-[15px] text-fg-2">
            {t('vocab.levels', { from: ALL_LEVELS[0], to: ALL_LEVELS.at(-1) })} · <span className="chinese-text">汉语水平考试</span>
          </p>
        </header>

        {!placementDone && <PlacementInvite onStart={onStartPlacement} className="mb-6" />}
        <div className="flex flex-col gap-2">
          <Button onClick={onStartQuiz} disabled={!canStart}>
            {canStart ? t('vocab.start', { n: Math.min(activeCount, 20) }) : t('vocab.nothing')}
          </Button>
          {!canStart && <p className="text-center text-sm text-fg-3">{t('vocab.nothingHint')}</p>}
          <Button variant="secondary" onClick={onOpenVocabulary}>{t('vocab.list')}</Button>
          <p className="mt-1 text-center text-sm tabular-nums text-fg-2">
            {t('vocab.status', { learning: counts.learning, limit: LEARNING_LIMIT, due: counts.due })}
          </p>
          <p className="text-center text-sm text-fg-3">{t('vocab.howItWorks', { limit: LEARNING_LIMIT })}</p>
        </div>

        <SectionLabel className="mt-10">{t('vocab.progress')}</SectionLabel>
        <div className="flex flex-col gap-3">
          {stats.map(stat => (
            <LevelCard
              key={stat.level}
              stat={stat}
              unlocked={unlockedLevels.includes(stat.level)}
              last={stat.level === ALL_LEVELS.at(-1)}
              onUnlockTest={stat.level === firstLocked ? () => onStartUnlockTest(stat.level) : null}
            />
          ))}
        </div>
      </div>
    </Screen>
  )
}
