export function QuestionCard({ question }) {
  const { word, type } = question

  if (type === 'char-to-def') {
    return (
      <div className="py-10 text-center">
        <p className="mb-6 text-[15px] text-fg-2">Que veut dire ce mot ?</p>
        <div className="hanzi-display text-[72px] leading-none text-fg">{word.simplified}</div>
        <p className="mt-6 text-sm text-fg-3">HSK {word.level}</p>
      </div>
    )
  }

  // def-to-char
  return (
    <div className="py-10 text-center">
      <p className="mb-6 text-[15px] text-fg-2">Écris ce mot en caractères ou en pinyin avec les tons</p>
      <div className="text-2xl font-medium leading-snug text-fg">{word.definition}</div>
      <p className="mt-6 text-sm text-fg-3">HSK {word.level}</p>
    </div>
  )
}
