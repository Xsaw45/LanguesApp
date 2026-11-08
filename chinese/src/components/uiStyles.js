// Icônes : lucide, une taille et un trait partout.
export const ICON = { size: 18, strokeWidth: 1.5, 'aria-hidden': true }
export const ICON_SM = { size: 16, strokeWidth: 1.5, 'aria-hidden': true }

/** Choix d'un QCM : neutre avant la réponse, puis bonne réponse, choix faux, ou estompé. */
export function optionClass({ answered, correct, chosen }) {
  if (!answered) return 'border-line bg-card text-fg hover:bg-raised'
  if (correct) return 'border-good/40 bg-good/10 text-fg'
  if (chosen) return 'border-bad/40 bg-bad/10 text-fg'
  return 'border-line bg-card text-fg-3'
}

export const percent = ratio => `${Math.round(ratio * 100)}\u00a0%`

/** Espaces insécables du français : « mot », mot :, mot ? — pour que la ponctuation ne passe pas seule à la ligne. */
export const fr = text => text.replace(/« /g, '«\u00a0').replace(/ ([»:?!;])/g, '\u00a0$1')
