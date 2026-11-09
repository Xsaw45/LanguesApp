import { createContext, useContext } from 'react'
import { defaultLang, formatPercent, frSpacing, localize, translate } from './text.js'

/**
 * Langue de l'utilisateur, fournie par App (enregistrement de progression « settings », synchronisé).
 *   t(key, params) : texte d'interface ; l(value) : chaîne ou { fr, en } ; pct(ratio) : pourcentage
 * En français, les espaces insécables sont ajoutées.
 */
export function makeLang(lang, setLang) {
  const finish = text => (lang === 'fr' && typeof text === 'string' ? frSpacing(text) : text)
  return {
    lang,
    setLang,
    t: (key, params) => finish(translate(lang, key, params)),
    l: value => finish(localize(value, lang)),
    pct: ratio => formatPercent(ratio, lang),
  }
}

export const LangContext = createContext(makeLang(defaultLang(), () => {}))

export const useLang = () => useContext(LangContext)

// Réglages de l'utilisateur : un enregistrement du magasin de progression (synchronisé comme le reste).
export const SETTINGS_KEY = 'settings'
