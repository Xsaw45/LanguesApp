import hsk1 from './hsk1.json'
import hsk2 from './hsk2.json'
import hsk3 from './hsk3.json'
import hsk4 from './hsk4.json'
import hsk5 from './hsk5.json'
import hsk6 from './hsk6.json'
import hsk7 from './hsk7.json'
import hsk8 from './hsk8.json'
import hsk9 from './hsk9.json'

export const HSK_DATA = { 1: hsk1, 2: hsk2, 3: hsk3, 4: hsk4, 5: hsk5, 6: hsk6, 7: hsk7, 8: hsk8, 9: hsk9 }

export const ALL_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(l => HSK_DATA[l].length > 0)

export function getWordsForLevel(level) {
  return HSK_DATA[level] || []
}

export function getWordById(id) {
  const level = parseInt(id.split('_')[0].replace('hsk', ''))
  return (HSK_DATA[level] || []).find(w => w.id === id) || null
}
