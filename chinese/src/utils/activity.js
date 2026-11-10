import { addDays, today } from './spacedrep.js'

// Activité : un enregistrement synchronisé par jour, act_AAAA-MM-JJ → { practiced, learned, done, seconds }.
//   practiced : au moins une réponse enregistrée ce jour-là (le jour compte pour la série). Absent : enregistrement
//               d'avant ce champ, toujours créé par une réponse, donc pratiqué.
//   learned   : éléments devenus maîtrisés ce jour-là (mots, caractères, classificateurs, clés)
//   done      : étapes de la séance « Aujourd'hui » terminées ce jour-là (voir today.js)
//   seconds   : temps passé à pratiquer (voir hooks/usePracticeTime.js)
// Un enregistrement par jour : deux appareils qui pratiquent des jours différents ne s'écrasent pas.

const PREFIX = 'act_'
const LEVEL = 'activity'
const ITEMS = /^(hsk|hz_|cl_|rad_)/

export const activityKey = day => `${PREFIX}${day}`
const isTracked = update => update.level !== LEVEL && update.level !== 'settings'

function dayRecord(progressMap, day) {
  return progressMap?.get(activityKey(day)) || { wordId: activityKey(day), level: LEVEL, practiced: false, learned: 0, done: [], seconds: 0 }
}

const isPracticed = record => !!record && record.practiced !== false

/**
 * Ajoute aux modifications de progression celle du jour : le jour devient pratiqué et compte ce qui vient d'être
 * maîtrisé. Rien n'est ajouté pour un réglage ou quand le jour est déjà pratiqué sans rien de nouveau.
 */
export function withActivity(progressMap, updates) {
  const tracked = updates.filter(isTracked)
  if (!tracked.length) return updates
  const learned = tracked.filter(u => ITEMS.test(u.wordId) && u.known && !progressMap?.get(u.wordId)?.known).length
  const record = dayRecord(progressMap, today())
  if (isPracticed(progressMap?.get(record.wordId)) && !learned) return updates
  return [...updates, { ...record, practiced: true, learned: record.learned + learned }]
}

/** Étape de la séance du jour terminée (on y a répondu : le jour est pratiqué). */
export function markStepDone(progressMap, step) {
  const record = dayRecord(progressMap, today())
  return { ...record, practiced: true, done: [...new Set([...record.done, step])] }
}

/** Temps de pratique à ajouter à aujourd'hui (ne rend pas le jour pratiqué à lui seul). */
export function addPracticeTime(progressMap, seconds) {
  const record = dayRecord(progressMap, today())
  return { ...record, seconds: (record.seconds || 0) + seconds }
}

export const doneToday = progressMap => new Set(dayRecord(progressMap, today()).done)

/**
 * streak : jours pratiqués d'affilée jusqu'à aujourd'hui (ou hier, tant qu'aujourd'hui n'est pas encore pratiqué) ;
 * week : les 7 derniers jours (le plus ancien d'abord) ; learnedThisWeek : éléments maîtrisés sur ces 7 jours ;
 * secondsToday / secondsThisWeek : temps de pratique.
 */
export function activityStats(progressMap) {
  const day = today()
  const record = d => progressMap?.get(activityKey(d))
  const active = d => isPracticed(record(d))
  let streak = 0
  for (let d = active(day) ? day : addDays(day, -1); active(d); d = addDays(d, -1)) streak++
  const week = Array.from({ length: 7 }, (_, i) => addDays(day, i - 6)).map(d => ({ day: d, active: active(d) }))
  const sum = field => week.reduce((n, d) => n + (record(d.day)?.[field] || 0), 0)
  return {
    streak,
    activeToday: active(day),
    week,
    learnedThisWeek: sum('learned'),
    secondsToday: record(day)?.seconds || 0,
    secondsThisWeek: sum('seconds'),
  }
}
