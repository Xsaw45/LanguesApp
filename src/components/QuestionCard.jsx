export function QuestionCard({ question }) {
  const { word, type } = question

  if (type === 'char-to-def') {
    return (
      <div className="text-center py-6">
        <p className="text-slate-400 text-sm mb-4 uppercase tracking-wider">
          Quelle est la définition ?
        </p>
        <div className="chinese-text text-7xl font-bold text-white mb-4 leading-none">
          {word.simplified}
        </div>
        <p className="text-slate-600 text-sm">HSK {word.level}</p>
      </div>
    )
  }

  // def-to-char
  return (
    <div className="text-center py-6">
      <p className="text-slate-400 text-sm mb-4 uppercase tracking-wider">
        Écrivez le caractère ou le pinyin (avec tons)
      </p>
      <div className="text-2xl font-medium text-white mb-4 px-4 leading-snug">
        {word.definition}
      </div>
      <p className="text-slate-600 text-sm">HSK {word.level}</p>
    </div>
  )
}
