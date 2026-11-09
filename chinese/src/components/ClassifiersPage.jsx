import { useState } from 'react'
import { Check } from 'lucide-react'
import { CLASSIFIER_GROUPS, CLASSIFIERS } from '../data/classifiers.js'
import { buildClassifierQuiz, getClassifierProgress, CLASSIFIER_QUIZ_SIZE } from '../utils/classifierQuiz.js'
import { isDueForReview } from '../utils/spacedrep.js'
import { ClassifierQuiz, Examples } from './ClassifierQuiz.jsx'
import { useLang } from '../i18n/useLang.js'
import { Button, Screen, SectionLabel, TopBar } from './ui.jsx'
import { ICON_SM } from './uiStyles.js'

function Status({ progress }) {
  const { t } = useLang()
  if (progress.known && isDueForReview(progress)) return <span className="text-sm text-accent">{t('common.toReview')}</span>
  if (progress.known) return <span className="inline-flex items-center gap-1 text-sm text-good"><Check {...ICON_SM} />{t('common.mastered')}</span>
  if (progress.successCount > 0) return <span className="text-sm tabular-nums text-fg-3">{progress.successCount} / 3</span>
  return null
}

export function ClassifiersPage({ progressMap, applyUpdates, onBack }) {
  const { t, l } = useLang()
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
    <Screen>
      <TopBar onBack={onBack} title={<>{t('cl.title')} <span className="chinese-text text-fg-2">量词</span></>} bordered />

      <div className="border-b border-line px-5 py-6">
        <p className="text-[15px] leading-relaxed text-fg">{t('cl.intro')}</p>
        <Button onClick={startQuiz} className="mt-5">{t('cl.test', { n: CLASSIFIER_QUIZ_SIZE })}</Button>
        <p className="mt-3 text-center text-sm tabular-nums text-fg-3">{t('cl.progress', { known, total: CLASSIFIERS.length })}</p>
      </div>

      <div className="flex-1 px-5 pb-8">
        {CLASSIFIER_GROUPS.map(group => (
          <section key={group.title.fr} className="mt-8">
            <SectionLabel className={group.note ? 'mb-1' : ''}>{l(group.title)}</SectionLabel>
            {group.note && <p className="mb-3 text-sm text-fg-3">{l(group.note)}</p>}
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
              {group.items.map(cl => (
                <li key={cl.char} className="flex items-start gap-4 p-4">
                  <div className="w-12 shrink-0 text-center">
                    <p className="hanzi-display text-[32px] leading-none text-fg">{cl.char}</p>
                    <p className="mt-2 text-sm text-fg-3">{cl.pinyin}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[15px] text-fg">{l(cl.usage)}</p>
                      <Status progress={getClassifierProgress(progressMap, cl)} />
                    </div>
                    {cl.note && <p className="mt-1 text-sm text-fg-3">{l(cl.note)}</p>}
                    <div className="mt-2">
                      <Examples cl={cl} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Screen>
  )
}
