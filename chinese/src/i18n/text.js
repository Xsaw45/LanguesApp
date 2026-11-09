import { STRINGS } from './strings.js'

// Langues de l'utilisateur (interface, explications, définitions). La première est la langue par défaut des contenus.
export const LANGS = ['fr', 'en']
export const LANG_NAMES = { fr: 'Français', en: 'English' }

/** Langue du navigateur si elle est proposée, sinon l'anglais. */
export function defaultLang() {
  const preferred = (navigator.languages || [navigator.language]).map(l => (l || '').slice(0, 2).toLowerCase())
  return preferred.find(l => LANGS.includes(l)) || 'en'
}

/** Espaces insécables du français : « mot », mot :, mot ? — la ponctuation ne passe pas seule à la ligne. */
export const frSpacing = text => text.replace(/« /g, '«\u00a0').replace(/ ([»:?!;%])/g, '\u00a0$1')

const fill = (text, params) => text.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m))

/** Texte d'interface dans une langue. */
export function translate(lang, key, params = {}) {
  const text = STRINGS[lang]?.[key] ?? STRINGS.fr[key] ?? key
  return fill(text, params)
}

/** Texte d'interface dans toutes les langues : { fr, en } (pour les questions construites hors de React). */
export const message = (key, params = {}) => Object.fromEntries(LANGS.map(lang => [lang, translate(lang, key, params)]))

/** { fr, en } construit langue par langue. */
export const perLang = fn => Object.fromEntries(LANGS.map(lang => [lang, fn(lang)]))

/** Valeur affichée : chaîne telle quelle, ou { fr, en } dans la langue demandée (français à défaut). */
export function localize(value, lang) {
  if (value == null || typeof value !== 'object') return value
  return value[lang] ?? value.fr
}

export const formatPercent = (ratio, lang) => (lang === 'fr' ? `${Math.round(ratio * 100)}\u00a0%` : `${Math.round(ratio * 100)}%`)
