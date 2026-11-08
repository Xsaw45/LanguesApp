// Courbe mélodique d'un ton sur l'échelle de hauteur 1 (grave) à 5 (aigu).
const CONTOURS = { 1: [5, 5], 2: [3, 5], 3: [2, 1, 4], 4: [5, 1] }

// La courbe prend la couleur du texte (currentColor) ; la grille reste neutre.
export function ToneCurve({ tone, className = 'w-9 h-7' }) {
  const levels = CONTOURS[tone]
  if (!levels) return null
  const points = levels.map((level, i) => `${4 + (i * 28) / (levels.length - 1)},${26 - (level - 1) * 5.5}`).join(' ')
  return (
    <svg viewBox="0 0 36 30" className={className} aria-hidden="true">
      {[4, 15, 26].map(y => <line key={y} x1="2" x2="34" y1={y} y2={y} stroke="#ededed" strokeOpacity="0.1" />)}
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
