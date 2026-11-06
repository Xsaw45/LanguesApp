// Parcours pinyin : leçons débloquées l'une après l'autre (80 % de bonnes réponses).
// intro : blocs affichés avant le test
//   { p }                     paragraphe
//   { tones: true }           les 4 tons (courbe, accent, description, son)
//   { sounds: [{ label, note, syl | word }] }  exemples à écouter (syl : syllabe "ba1", word : mot enregistré)
// exercise : type(s) de questions (utils/pinyinQuiz.js)

export const TONES = [
  { tone: 1, name: '1er ton', mark: 'ā', description: 'Haut et plat, tenu comme une note chantée.' },
  { tone: 2, name: '2e ton', mark: 'á', description: 'Monte, comme une question étonnée : « Hein ? »' },
  { tone: 3, name: '3e ton', mark: 'ǎ', description: 'Descend tout bas puis remonte un peu.' },
  { tone: 4, name: '4e ton', mark: 'à', description: 'Descend vite et fort, comme un ordre : « Stop ! »' },
]

export const PINYIN_LESSONS = [
  {
    id: 'tons',
    title: 'Les 4 tons',
    subtitle: 'Entendre la mélodie de chaque syllabe',
    intro: [
      { p: 'En chinois, chaque syllabe a une mélodie : son ton. Changer le ton change le mot : mā (妈) veut dire « maman », mǎ (马) « cheval ».' },
      { tones: true },
      { p: 'Le ton neutre (pas d\'accent) est court et léger. On le trouve surtout sur la 2e syllabe de certains mots :' },
      {
        sounds: [
          { label: 'māma', note: '妈妈 maman', word: '妈妈' },
          { label: 'bàba', note: '爸爸 papa', word: '爸爸' },
          { label: 'xièxie', note: '谢谢 merci', word: '谢谢' },
        ],
      },
      { p: 'Astuce : dans une phrase, le 3e ton reste souvent juste bas, sans remonter. Les enregistrements de syllabes seules le font en entier.' },
    ],
    exercise: ['listen-tone'],
  },
  {
    id: 'accents',
    title: 'Lire les accents',
    subtitle: 'Reconnaître un ton écrit et placer l\'accent',
    intro: [
      { p: 'L\'accent posé sur la voyelle indique le ton : ā (1, plat), á (2, monte), ǎ (3, descend puis remonte), à (4, descend). Pas d\'accent : ton neutre.' },
      { p: 'Sans accents (au clavier par exemple), on écrit le ton en chiffre : ma1, ma2, ma3, ma4.' },
      { p: 'Quand la syllabe a plusieurs voyelles, l\'accent va :' },
      {
        sounds: [
          { label: 'hǎo, mèi, xué', note: 'sur le a ou le e s\'il y en a un', syl: 'hao3' },
          { label: 'gǒu, dōu', note: 'sur le o dans « ou »', syl: 'gou3' },
          { label: 'liù, guì, duō', note: 'sinon sur la dernière voyelle', syl: 'liu4' },
        ],
      },
    ],
    exercise: ['read-tone', 'placement'],
  },
  {
    id: 'consonnes-faciles',
    title: 'Consonnes faciles',
    subtitle: 'b p m f d t n l g k h',
    intro: [
      { p: 'Elles se lisent presque comme en français. Le piège : b, d, g ne vibrent pas comme en français. Ce qui les distingue de p, t, k, c\'est le souffle : une feuille de papier devant la bouche bouge pour p, t, k, pas pour b, d, g.' },
      {
        sounds: [
          { label: 'b', note: 'bā : un « p » français, sans souffle', syl: 'ba1' },
          { label: 'p', note: 'pā : « p » avec une bouffée d\'air', syl: 'pa1' },
          { label: 'd', note: 'dā : un « t » sans souffle', syl: 'da1' },
          { label: 't', note: 'tā : « t » avec souffle', syl: 'ta1' },
          { label: 'g', note: 'gē : un « k » sans souffle (jamais « j »)', syl: 'ge1' },
          { label: 'k', note: 'kē : « k » avec souffle', syl: 'ke1' },
          { label: 'h', note: 'hā : raclé au fond de la gorge, comme la jota espagnole', syl: 'ha1' },
          { label: 'm f n l', note: 'mā, fā, nā, lā : comme en français', syl: 'ma1' },
        ],
      },
    ],
    exercise: ['listen-initial-easy'],
  },
  {
    id: 'consonnes-difficiles',
    title: 'Consonnes difficiles',
    subtitle: 'j q x · zh ch sh r · z c s',
    intro: [
      { p: 'Trois familles qui se ressemblent pour une oreille française. Écoute-les côte à côte.' },
      {
        sounds: [
          { label: 'j', note: 'jī : « dji » léger, pointe de la langue contre les dents du bas', syl: 'ji1' },
          { label: 'q', note: 'qī : « tchi » avec souffle, langue en bas', syl: 'qi1' },
          { label: 'x', note: 'xī : entre « si » et « chi », en souriant', syl: 'xi1' },
          { label: 'zh', note: 'zhī : « dj » avec la langue retroussée vers le palais', syl: 'zhi1' },
          { label: 'ch', note: 'chī : « tch » avec souffle, langue retroussée', syl: 'chi1' },
          { label: 'sh', note: 'shī : « ch » français, langue retroussée', syl: 'shi1' },
          { label: 'r', note: 'rì : entre le « j » de « jour » et le r anglais', syl: 'ri4' },
          { label: 'z', note: 'zī : « dz »', syl: 'zi1' },
          { label: 'c', note: 'cī : « ts » avec souffle, comme « tsé-tsé »', syl: 'ci1' },
          { label: 's', note: 'sī : « s »', syl: 'si1' },
        ],
      },
      { p: 'Après zh, ch, sh, r, z, c, s, le i n\'est pas un vrai « i » : c\'est la consonne qui se prolonge (shì, zì). Après j, q, x, c\'est un vrai « i » (jī, xī).' },
    ],
    exercise: ['listen-initial-hard'],
  },
  {
    id: 'voyelles',
    title: 'Voyelles et finales',
    subtitle: 'ü, -n / -ng et les abréviations écrites',
    intro: [
      {
        sounds: [
          { label: 'a', note: 'ā : « a »', syl: 'a1' },
          { label: 'e', note: 'hē : le « e » de « le », plus au fond de la gorge', syl: 'he1' },
          { label: 'u', note: 'wū : « ou »', syl: 'wu1' },
          { label: 'ü', note: 'yú : le « u » français de « lune »', syl: 'yu2' },
          { label: 'an', note: 'bān : finit sur la pointe de la langue, comme « bane »', syl: 'ban1' },
          { label: 'ang', note: 'bāng : finit au fond du nez, sans prononcer le g', syl: 'bang1' },
          { label: 'in', note: 'xīn : finit sur la pointe de la langue', syl: 'xin1' },
          { label: 'ing', note: 'xīng : finit au fond du nez, comme « sing » en anglais', syl: 'xing1' },
          { label: 'ong', note: 'dōng : « oung »', syl: 'dong1' },
          { label: 'ian', note: 'tiān : « tiène », pas « tiane »', syl: 'tian1' },
        ],
      },
      { p: 'Abréviations écrites : iu = iou (liù), ui = uei (guì), un = uen (lùn).' },
      { p: 'Après j, q, x et y, le u s\'écrit sans points mais se prononce ü : jù, qù, xué, yú. Après n et l on garde les points, car nu et lu existent aussi : nǚ (femme), lǜ (vert).' },
      { p: 'En début de syllabe, y et w remplacent i et u : yī = ī, wǔ = ǔ, yǒu = iǒu.' },
    ],
    exercise: ['listen-final', 'rule'],
  },
  {
    id: 'changements',
    title: 'Les changements de ton',
    subtitle: '3e + 3e, 不 et 一',
    intro: [
      { p: 'Trois règles changent le ton à l\'oral. Les dictionnaires (et le vocabulaire de cette app) écrivent souvent le ton d\'origine : c\'est à toi de faire le changement en parlant.' },
      { p: '1. Deux 3e tons de suite : le premier devient un 2e ton. 你好 nǐ hǎo se dit ní hǎo, 可以 kě yǐ se dit ké yǐ.' },
      { p: '2. 不 bù devient bú devant un 4e ton : 不要 bú yào, 不对 bú duì. Ailleurs il reste bù : 不好 bù hǎo.' },
      { p: '3. 一 yī devient yí devant un 4e ton (一样 yí yàng, 一定 yí dìng) et yì devant les tons 1, 2 et 3 (一起 yì qǐ, 一般 yì bān). Il reste yī seul, en comptant ou à la fin d\'un mot : 第一 dì yī, 十一 shí yī.' },
      {
        sounds: [
          { label: 'ké yǐ', note: '可以 pouvoir', word: '可以' },
          { label: 'bú yào', note: '不要 ne pas vouloir', word: '不要' },
          { label: 'yí yàng', note: '一样 pareil', word: '一样' },
          { label: 'yì qǐ', note: '一起 ensemble', word: '一起' },
        ],
      },
    ],
    exercise: ['sandhi'],
  },
  {
    id: 'mots',
    title: 'Vrais mots HSK 1',
    subtitle: 'Écouter un mot et retrouver son pinyin',
    intro: [
      { p: 'Pour finir, de vrais mots du HSK 1. Écoute le mot et choisis son pinyin parmi quatre propositions qui ne diffèrent que par les tons.' },
      { p: 'Les mots concernés par les changements de ton (3e + 3e, 不, 一) ne sont pas proposés ici : le pinyin écrit ne correspondrait pas à ce que tu entends.' },
    ],
    exercise: ['listen-word'],
  },
]

// --- Données des exercices ---

// Syllabes courantes pour les exercices de tons (toutes enregistrées aux 4 tons).
export const TONE_BASES = ['ma', 'ba', 'da', 'yi', 'wu', 'mi', 'shi', 'tang', 'guo', 'lai', 'hao', 'fei', 'qing', 'shu',
  'yu', 'bao', 'mai', 'tian', 'dong', 'xie', 'li', 'tu', 'zhu', 'chi', 'fu', 'ni', 'ji', 'qi', 'xi', 'hu']

// Syllabes à plusieurs voyelles pour la place de l'accent.
export const PLACEMENT_BASES = ['hao', 'mei', 'gou', 'liu', 'gui', 'duo', 'xue', 'jia', 'xiao', 'huai', 'dui', 'jiu',
  'zhou', 'lai', 'tian', 'guo', 'shui', 'niu', 'lou', 'kuai', 'xie', 'yue', 'bei', 'dou', 'jiao', 'zuo', 'lüe']

// Consonnes à distinguer à l'oreille (même finale, même ton).
export const INITIAL_GROUPS = {
  'listen-initial-easy': [['b', 'p'], ['d', 't'], ['g', 'k'], ['n', 'l'], ['f', 'h'], ['b', 'p', 'm'], ['d', 't', 'n', 'l'], ['g', 'k', 'h']],
  'listen-initial-hard': [['j', 'zh', 'z'], ['q', 'ch', 'c'], ['x', 'sh', 's'], ['zh', 'ch', 'sh', 'r'], ['z', 'c', 's'],
    ['j', 'q', 'x'], ['r', 'l'], ['zh', 'j'], ['sh', 'x'], ['ch', 'q']],
}

// Finales à distinguer à l'oreille.
export const FINAL_PAIRS = [['lu', 'lü'], ['nu', 'nü'], ['ban', 'bang'], ['fen', 'feng'], ['xin', 'xing'], ['lin', 'ling'],
  ['shan', 'shang'], ['chuan', 'chuang'], ['jian', 'jiang'], ['qin', 'qing'], ['ren', 'reng'], ['wan', 'wang'],
  ['bai', 'bei'], ['dao', 'dou'], ['hen', 'heng'], ['dan', 'dang'], ['yu', 'yi'], ['ju', 'zhu']]

// Règles d'écriture et de prononciation (le premier choix est le bon, l'ordre est mélangé à l'affichage).
export const RULE_QUESTIONS = [
  { q: 'Dans « jù », le u se prononce…', options: ['ü, le « u » français de « lune »', '« ou »'], syl: 'ju4' },
  { q: 'Dans « lù », le u se prononce…', options: ['« ou »', 'ü, le « u » français de « lune »'], syl: 'lu4' },
  { q: '« liù » est l\'écriture abrégée de…', options: ['l + iou (le o est sous-entendu)', 'l + ü', 'l, i, u lus comme en français'], syl: 'liu4' },
  { q: '« guì » est l\'écriture abrégée de…', options: ['g + uei (« gouéï »)', 'g + i, comme « gui » en français', 'g + ü'], syl: 'gui4' },
  { q: '« lùn » est l\'écriture abrégée de…', options: ['l + uen (« louène »)', 'l + un, comme « un » en français', 'l + ün'], syl: 'lun4' },
  { q: 'Dans « yī », le y…', options: ['ne se prononce pas : yī = ī', 'se prononce comme dans « yoyo »', 'allonge le son'], syl: 'yi1' },
  { q: 'Dans « wǔ », le w…', options: ['ne se prononce pas : wǔ = ǔ (« ou »)', 'se prononce comme le w anglais', 'se prononce « v »'], syl: 'wu3' },
  { q: 'Le e de « hē » se prononce…', options: ['comme le « e » de « le », plus au fond de la gorge', '« é »', '« è »'], syl: 'he1' },
  { q: 'Le i de « shì » ou de « zì »…', options: ['n\'est pas un vrai i : la consonne se prolonge', 'se prononce « i » comme en français', 'se prononce « é »'], syl: 'shi4' },
  { q: '« ian » (tiān, jiàn) se prononce…', options: ['« iène »', '« iane »'], syl: 'tian1' },
  { q: '« xué » se prononce…', options: ['x + üé (u de « lune »)', 'x + oué'], syl: 'xue2' },
  { q: 'Pourquoi « nǚ » garde ses deux points, mais pas « jù » ?', options: ['nu existe aussi, il faut distinguer nǔ et nǚ ; après j, q, x le u est toujours ü', 'c\'est une erreur d\'écriture', 'les deux points indiquent un ton différent'], syl: 'nv3' },
]

// Changements de ton : forme écrite, forme dite, règle.
const RULE_TEXT = {
  '33': 'Deux 3e tons de suite : le premier devient un 2e ton.',
  bu: '不 devient bú devant un 4e ton, et reste bù ailleurs.',
  yi: '一 devient yí devant un 4e ton, yì devant les tons 1, 2, 3, et reste yī seul ou à la fin.',
}
export const SANDHI_ITEMS = [
  { hanzi: '你好', fr: 'bonjour', said: 'ní hǎo', options: ['nǐ hǎo', 'nǐ háo'], rule: '33' },
  { hanzi: '可以', fr: 'pouvoir', said: 'ké yǐ', options: ['kě yǐ', 'kě yí'], rule: '33' },
  { hanzi: '很好', fr: 'très bien', said: 'hén hǎo', options: ['hěn hǎo', 'hěn háo'], rule: '33' },
  { hanzi: '水果', fr: 'fruit', said: 'shuí guǒ', options: ['shuǐ guǒ', 'shuǐ guó'], rule: '33' },
  { hanzi: '所以', fr: 'donc', said: 'suó yǐ', options: ['suǒ yǐ', 'suǒ yí'], rule: '33' },
  { hanzi: '洗澡', fr: 'se laver', said: 'xí zǎo', options: ['xǐ zǎo', 'xǐ záo'], rule: '33' },
  { hanzi: '手表', fr: 'montre', said: 'shóu biǎo', options: ['shǒu biǎo', 'shǒu biáo'], rule: '33' },
  { hanzi: '不要', fr: 'ne pas vouloir', said: 'bú yào', options: ['bù yào'], rule: 'bu' },
  { hanzi: '不对', fr: 'pas correct', said: 'bú duì', options: ['bù duì'], rule: 'bu' },
  { hanzi: '不是', fr: 'ne pas être', said: 'bú shì', options: ['bù shì'], rule: 'bu' },
  { hanzi: '不用', fr: 'pas besoin', said: 'bú yòng', options: ['bù yòng'], rule: 'bu' },
  { hanzi: '不客气', fr: 'de rien', said: 'bú kè qi', options: ['bù kè qi'], rule: 'bu' },
  { hanzi: '不好', fr: 'pas bien', said: 'bù hǎo', options: ['bú hǎo'], rule: 'bu' },
  { hanzi: '不来', fr: 'ne pas venir', said: 'bù lái', options: ['bú lái'], rule: 'bu' },
  { hanzi: '不吃', fr: 'ne pas manger', said: 'bù chī', options: ['bú chī'], rule: 'bu' },
  { hanzi: '一样', fr: 'pareil', said: 'yí yàng', options: ['yī yàng', 'yì yàng'], rule: 'yi' },
  { hanzi: '一定', fr: 'sûrement', said: 'yí dìng', options: ['yī dìng', 'yì dìng'], rule: 'yi' },
  { hanzi: '一个', fr: 'un (+ classificateur)', said: 'yí gè', options: ['yī gè', 'yì gè'], rule: 'yi' },
  { hanzi: '一下', fr: 'un peu, un coup', said: 'yí xià', options: ['yī xià', 'yì xià'], rule: 'yi' },
  { hanzi: '一起', fr: 'ensemble', said: 'yì qǐ', options: ['yī qǐ', 'yí qǐ'], rule: 'yi' },
  { hanzi: '一般', fr: 'en général', said: 'yì bān', options: ['yī bān', 'yí bān'], rule: 'yi' },
  { hanzi: '一天', fr: 'un jour', said: 'yì tiān', options: ['yī tiān', 'yí tiān'], rule: 'yi' },
  { hanzi: '一年', fr: 'un an', said: 'yì nián', options: ['yī nián', 'yí nián'], rule: 'yi' },
  { hanzi: '第一', fr: 'premier', said: 'dì yī', options: ['dì yí', 'dì yì'], rule: 'yi' },
  { hanzi: '十一', fr: 'onze', said: 'shí yī', options: ['shí yí', 'shí yì'], rule: 'yi' },
].map(item => ({ ...item, explanation: RULE_TEXT[item.rule] }))
