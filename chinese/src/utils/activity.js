import { addDays, today } from './spacedrep.js'

// Activité : un enregistrement synchronisé par jour pratiqué, act_AAAA-MM-JJ → { learned, done }.
//   learned : éléments devenus maîtrisés ce jour-là (mots, caractères, classificateurs, clés)
//   done    : étapes de la séance « Aujourd'hui » terminées ce jour-là (voir today.js)
// Un enregistrement par jour : deux appareils qui pratiquent des jours différents ne s'écrasent pas.

const PREFIX = 'act_'
const LEVEL = 'activity'
const ITEMS = /^(hsk|hz_|cl_|rad_)/

export const activityKey = day => `${PREFIX}${day}`
const isTracked = update => update.level !== LEVEL && update.level !== 'settings'

function dayRecord(progressMap, day) {
  return progressMap?.get(activityKey(day)) || { wordId: activityKey(day), level: LEVEL, learned: 0, done: [] }
}

/**
 * Ajoute aux modifications de progression celle du jour : le jour devient actif et compte ce qui vient d'être
 * maîtrisé. Rien n'est ajouté pour un réglage ou quand le jour est déjà actif sans rien de nouveau.
 */
export function withActivity(progressMap, updates) {
  const tracked = updates.filter(isTracked)
  if (!tracked.length) return updates
  const learned = tracked.filter(u => ITEMS.test(u.wordId) && u.known && !progressMap?.get(u.wordId)?.known).length
  const day = today()
  if (progressMap?.has(activityKey(day)) && !learned) return updates
  const record = dayRecord(progressMap, day)
  return [...updates, { ...record, learned: record.learned + learned }]
}

/** Étape de la séance du jour terminée. */
export function markStepDone(progressMap, step) {
  const record = dayRecord(progressMap, today())
  return { ...record, done: [...new Set([...record.done, step])] }
}

export const doneToday = progressMap => new Set(dayRecord(progressMap, today()).done)

/**
 * streak : jours pratiqués d'affilée jusqu'à aujourd'hui (ou hier, tant qu'aujourd'hui n'est pas encore pratiqué) ;
 * week : les 7 derniers jours (le plus ancien d'abord) ; learnedThisWeek : éléments maîtrisés sur ces 7 jours.
 */
export function activityStats(progressMap) {
  const day = today()
  const active = d => !!progressMap?.has(activityKey(d))
  let streak = 0
  for (let d = active(day) ? day : addDays(day, -1); active(d); d = addDays(d, -1)) streak++
  const week = Array.from({ length: 7 }, (_, i) => addDays(day, i - 6)).map(d => ({ day: d, active: active(d) }))
  const learnedThisWeek = week.reduce((n, d) => n + (progressMap?.get(activityKey(d.day))?.learned || 0), 0)
  return { streak, activeToday: active(day), week, learnedThisWeek }
}
