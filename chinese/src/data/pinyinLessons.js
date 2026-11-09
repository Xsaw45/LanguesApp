// Parcours pinyin : leçons débloquées l'une après l'autre (80 % de bonnes réponses).
// Textes affichés : { fr, en } (langue de l'utilisateur) ; tr : traduction d'un mot ou d'une phrase chinoise.
// intro : blocs affichés avant le test
//   { p }                     paragraphe
//   { tones: true }           les 4 tons (courbe, accent, description, son)
//   { sounds: [{ label, note, syl | word }] }  exemples à écouter (syl : syllabe "ba1", word : mot enregistré)
// exercise : type(s) de questions (utils/pinyinQuiz.js)

export const TONES = [
  {
    tone: 1,
    name: { fr: '1er ton', en: '1st tone' },
    mark: 'ā',
    description: { fr: 'Haut et plat, tenu comme une note chantée.', en: 'High and flat, held like a sung note.' },
  },
  {
    tone: 2,
    name: { fr: '2e ton', en: '2nd tone' },
    mark: 'á',
    description: { fr: 'Monte, comme une question étonnée : « Hein ? »', en: 'Rises, like a surprised question: "Huh?"' },
  },
  {
    tone: 3,
    name: { fr: '3e ton', en: '3rd tone' },
    mark: 'ǎ',
    description: { fr: 'Descend tout bas puis remonte un peu.', en: 'Dips low, then rises a little.' },
  },
  {
    tone: 4,
    name: { fr: '4e ton', en: '4th tone' },
    mark: 'à',
    description: { fr: 'Descend vite et fort, comme un ordre : « Stop ! »', en: 'Falls fast and hard, like a command: "Stop!"' },
  },
]

export const PINYIN_LESSONS = [
  {
    id: 'tons',
    title: { fr: 'Les 4 tons', en: 'The 4 tones' },
    subtitle: { fr: 'Entendre la mélodie de chaque syllabe', en: 'Hear the melody of each syllable' },
    intro: [
      {
        p: {
          fr: 'En chinois, chaque syllabe a une mélodie : son ton. Changer le ton change le mot : mā (妈) veut dire « maman », mǎ (马) « cheval ».',
          en: 'In Chinese, every syllable has a melody: its tone. Changing the tone changes the word: mā (妈) means "mom", mǎ (马) means "horse".',
        },
      },
      { tones: true },
      {
        p: {
          fr: 'Le ton neutre (pas d\'accent) est court et léger. On le trouve surtout sur la 2e syllabe de certains mots :',
          en: 'The neutral tone (no mark) is short and light. You hear it mostly on the 2nd syllable of some words:',
        },
      },
      {
        sounds: [
          { label: 'māma', note: { fr: '妈妈 maman', en: '妈妈 mom' }, word: '妈妈' },
          { label: 'bàba', note: { fr: '爸爸 papa', en: '爸爸 dad' }, word: '爸爸' },
          { label: 'xièxie', note: { fr: '谢谢 merci', en: '谢谢 thank you' }, word: '谢谢' },
        ],
      },
      {
        p: {
          fr: 'Astuce : dans une phrase, le 3e ton reste souvent juste bas, sans remonter. Les enregistrements de syllabes seules le font en entier.',
          en: 'Tip: in a sentence, the 3rd tone often just stays low without rising. Recordings of single syllables say it in full.',
        },
      },
    ],
    exercise: ['listen-tone'],
  },
  {
    id: 'accents',
    title: { fr: 'Lire les accents', en: 'Reading tone marks' },
    subtitle: { fr: 'Reconnaître un ton écrit et placer l\'accent', en: 'Recognize a written tone and place the mark' },
    intro: [
      {
        p: {
          fr: 'L\'accent posé sur la voyelle indique le ton : ā (1, plat), á (2, monte), ǎ (3, descend puis remonte), à (4, descend). Pas d\'accent : ton neutre.',
          en: 'The mark on the vowel shows the tone: ā (1, flat), á (2, rising), ǎ (3, dips then rises), à (4, falling). No mark: neutral tone.',
        },
      },
      {
        p: {
          fr: 'Sans accents (au clavier par exemple), on écrit le ton en chiffre : ma1, ma2, ma3, ma4.',
          en: 'Without marks (when typing, for example), the tone is written as a number: ma1, ma2, ma3, ma4.',
        },
      },
      {
        p: {
          fr: 'Quand la syllabe a plusieurs voyelles, l\'accent va :',
          en: 'When a syllable has several vowels, the mark goes:',
        },
      },
      {
        sounds: [
          {
            label: 'hǎo, mèi, xué',
            note: { fr: 'sur le a ou le e s\'il y en a un', en: 'on the a or the e if there is one' },
            syl: 'hao3',
          },
          { label: 'gǒu, dōu', note: { fr: 'sur le o dans « ou »', en: 'on the o in "ou"' }, syl: 'gou3' },
          {
            label: 'liù, guì, duō',
            note: { fr: 'sinon sur la dernière voyelle', en: 'otherwise on the last vowel' },
            syl: 'liu4',
          },
        ],
      },
    ],
    exercise: ['read-tone', 'placement'],
  },
  {
    id: 'consonnes-faciles',
    title: { fr: 'Consonnes faciles', en: 'Easy consonants' },
    subtitle: { fr: 'b p m f d t n l g k h', en: 'b p m f d t n l g k h' },
    intro: [
      {
        p: {
          fr: 'Elles se lisent presque comme en français. Le piège : b, d, g ne vibrent pas comme en français. Ce qui les distingue de p, t, k, c\'est le souffle : une feuille de papier devant la bouche bouge pour p, t, k, pas pour b, d, g.',
          en: 'They sound almost like in English. The catch is the puff of air: it is what tells p, t, k apart from b, d, g. Hold a sheet of paper in front of your mouth: it moves for p, t, k, not for b, d, g, which sound like the p in "spin" or the t in "stop".',
        },
      },
      {
        sounds: [
          {
            label: 'b',
            note: { fr: 'bā : un « p » français, sans souffle', en: 'bā: like the p in "spin", no puff of air' },
            syl: 'ba1',
          },
          {
            label: 'p',
            note: { fr: 'pā : « p » avec une bouffée d\'air', en: 'pā: p with a strong puff of air, as in "pop"' },
            syl: 'pa1',
          },
          {
            label: 'd',
            note: { fr: 'dā : un « t » sans souffle', en: 'dā: like the t in "stop", no puff of air' },
            syl: 'da1',
          },
          {
            label: 't',
            note: { fr: 'tā : « t » avec souffle', en: 'tā: t with a puff of air, as in "top"' },
            syl: 'ta1',
          },
          {
            label: 'g',
            note: {
              fr: 'gē : un « k » sans souffle (jamais « j »)',
              en: 'gē: like the k in "skin", no puff of air (never a soft g)',
            },
            syl: 'ge1',
          },
          {
            label: 'k',
            note: { fr: 'kē : « k » avec souffle', en: 'kē: k with a puff of air, as in "kite"' },
            syl: 'ke1',
          },
          {
            label: 'h',
            note: {
              fr: 'hā : raclé au fond de la gorge, comme la jota espagnole',
              en: 'hā: rougher than English h, from the back of the throat, like "loch" in Scottish',
            },
            syl: 'ha1',
          },
          {
            label: 'm f n l',
            note: { fr: 'mā, fā, nā, lā : comme en français', en: 'mā, fā, nā, lā: as in English' },
            syl: 'ma1',
          },
        ],
      },
    ],
    exercise: ['listen-initial-easy'],
  },
  {
    id: 'consonnes-difficiles',
    title: { fr: 'Consonnes difficiles', en: 'Tricky consonants' },
    subtitle: { fr: 'j q x · zh ch sh r · z c s', en: 'j q x · zh ch sh r · z c s' },
    intro: [
      {
        p: {
          fr: 'Trois familles qui se ressemblent pour une oreille française. Écoute-les côte à côte.',
          en: 'Three families that sound alike to an English ear. Listen to them side by side.',
        },
      },
      {
        sounds: [
          {
            label: 'j',
            note: {
              fr: 'jī : « dji » léger, pointe de la langue contre les dents du bas',
              en: 'jī: a light "jee", tongue tip against the lower teeth',
            },
            syl: 'ji1',
          },
          {
            label: 'q',
            note: { fr: 'qī : « tchi » avec souffle, langue en bas', en: 'qī: "chee" with a puff of air, tongue down' },
            syl: 'qi1',
          },
          {
            label: 'x',
            note: { fr: 'xī : entre « si » et « chi », en souriant', en: 'xī: between "see" and "she", while smiling' },
            syl: 'xi1',
          },
          {
            label: 'zh',
            note: {
              fr: 'zhī : « dj » avec la langue retroussée vers le palais',
              en: 'zhī: like the j in "jerk", tongue curled back toward the palate',
            },
            syl: 'zhi1',
          },
          {
            label: 'ch',
            note: {
              fr: 'chī : « tch » avec souffle, langue retroussée',
              en: 'chī: like the ch in "church" with a puff of air, tongue curled back',
            },
            syl: 'chi1',
          },
          {
            label: 'sh',
            note: { fr: 'shī : « ch » français, langue retroussée', en: 'shī: like the sh in "shirt", tongue curled back' },
            syl: 'shi1',
          },
          {
            label: 'r',
            note: {
              fr: 'rì : entre le « j » de « jour » et le r anglais',
              en: 'rì: between the s in "measure" and English r',
            },
            syl: 'ri4',
          },
          { label: 'z', note: { fr: 'zī : « dz »', en: 'zī: "dz", as in "kids"' }, syl: 'zi1' },
          {
            label: 'c',
            note: { fr: 'cī : « ts » avec souffle, comme « tsé-tsé »', en: 'cī: "ts" with a puff of air, as in "cats"' },
            syl: 'ci1',
          },
          { label: 's', note: { fr: 'sī : « s »', en: 'sī: "s"' }, syl: 'si1' },
        ],
      },
      {
        p: {
          fr: 'Après zh, ch, sh, r, z, c, s, le i n\'est pas un vrai « i » : c\'est la consonne qui se prolonge (shì, zì). Après j, q, x, c\'est un vrai « i » (jī, xī).',
          en: 'After zh, ch, sh, r, z, c, s, the i is not a real "ee": the consonant just keeps buzzing (shì, zì). After j, q, x, it is a real "ee" (jī, xī).',
        },
      },
    ],
    exercise: ['listen-initial-hard'],
  },
  {
    id: 'voyelles',
    title: { fr: 'Voyelles et finales', en: 'Vowels and finals' },
    subtitle: { fr: 'ü, -n / -ng et les abréviations écrites', en: 'ü, -n / -ng and written shortcuts' },
    intro: [
      {
        sounds: [
          { label: 'a', note: { fr: 'ā : « a »', en: 'ā: "ah", as in "father"' }, syl: 'a1' },
          {
            label: 'e',
            note: {
              fr: 'hē : le « e » de « le », plus au fond de la gorge',
              en: 'hē: like the u in "duh", further back in the throat',
            },
            syl: 'he1',
          },
          { label: 'u', note: { fr: 'wū : « ou »', en: 'wū: "oo", as in "food"' }, syl: 'wu1' },
          {
            label: 'ü',
            note: { fr: 'yú : le « u » français de « lune »', en: 'yú: ü, say "ee" with rounded lips, like German ü' },
            syl: 'yu2',
          },
          {
            label: 'an',
            note: {
              fr: 'bān : finit sur la pointe de la langue, comme « bane »',
              en: 'bān: ends on the tip of the tongue, like "ban" said with "ah"',
            },
            syl: 'ban1',
          },
          {
            label: 'ang',
            note: {
              fr: 'bāng : finit au fond du nez, sans prononcer le g',
              en: 'bāng: ends at the back of the mouth, like "-ang" without a hard g',
            },
            syl: 'bang1',
          },
          {
            label: 'in',
            note: { fr: 'xīn : finit sur la pointe de la langue', en: 'xīn: ends on the tip of the tongue' },
            syl: 'xin1',
          },
          {
            label: 'ing',
            note: {
              fr: 'xīng : finit au fond du nez, comme « sing » en anglais',
              en: 'xīng: ends at the back, like "sing"',
            },
            syl: 'xing1',
          },
          {
            label: 'ong',
            note: { fr: 'dōng : « oung »', en: 'dōng: like "doong", ending with the -ng of "song"' },
            syl: 'dong1',
          },
          {
            label: 'ian',
            note: { fr: 'tiān : « tiène », pas « tiane »', en: 'tiān: "tyen", not "tyahn"' },
            syl: 'tian1',
          },
        ],
      },
      {
        p: {
          fr: 'Abréviations écrites : iu = iou (liù), ui = uei (guì), un = uen (lùn).',
          en: 'Written shortcuts: iu = iou (liù), ui = uei (guì), un = uen (lùn).',
        },
      },
      {
        p: {
          fr: 'Après j, q, x et y, le u s\'écrit sans points mais se prononce ü : jù, qù, xué, yú. Après n et l on garde les points, car nu et lu existent aussi : nǚ (femme), lǜ (vert).',
          en: 'After j, q, x and y, u is written without dots but pronounced ü: jù, qù, xué, yú. After n and l the dots stay, because nu and lu also exist: nǚ (woman), lǜ (green).',
        },
      },
      {
        p: {
          fr: 'En début de syllabe, y et w remplacent i et u : yī = ī, wǔ = ǔ, yǒu = iǒu.',
          en: 'At the start of a syllable, y and w replace i and u: yī = ī, wǔ = ǔ, yǒu = iǒu.',
        },
      },
    ],
    exercise: ['listen-final', 'rule'],
  },
  {
    id: 'changements',
    title: { fr: 'Les changements de ton', en: 'Tone changes' },
    subtitle: { fr: '3e + 3e, 不 et 一', en: '3rd + 3rd, 不 and 一' },
    intro: [
      {
        p: {
          fr: 'Trois règles changent le ton à l\'oral. Les dictionnaires (et le vocabulaire de cette app) écrivent souvent le ton d\'origine : c\'est à toi de faire le changement en parlant.',
          en: 'Three rules change the tone in speech. Dictionaries (and the vocabulary in this app) usually write the original tone: it is up to you to make the change when you speak.',
        },
      },
      {
        p: {
          fr: '1. Deux 3e tons de suite : le premier devient un 2e ton. 你好 nǐ hǎo se dit ní hǎo, 可以 kě yǐ se dit ké yǐ.',
          en: '1. Two 3rd tones in a row: the first becomes a 2nd tone. 你好 nǐ hǎo is said ní hǎo, 可以 kě yǐ is said ké yǐ.',
        },
      },
      {
        p: {
          fr: '2. 不 bù devient bú devant un 4e ton : 不要 bú yào, 不对 bú duì. Ailleurs il reste bù : 不好 bù hǎo.',
          en: '2. 不 bù becomes bú before a 4th tone: 不要 bú yào, 不对 bú duì. Elsewhere it stays bù: 不好 bù hǎo.',
        },
      },
      {
        p: {
          fr: '3. 一 yī devient yí devant un 4e ton (一样 yí yàng, 一定 yí dìng) et yì devant les tons 1, 2 et 3 (一起 yì qǐ, 一般 yì bān). Il reste yī seul, en comptant ou à la fin d\'un mot : 第一 dì yī, 十一 shí yī.',
          en: '3. 一 yī becomes yí before a 4th tone (一样 yí yàng, 一定 yí dìng) and yì before tones 1, 2 and 3 (一起 yì qǐ, 一般 yì bān). It stays yī on its own, when counting or at the end of a word: 第一 dì yī, 十一 shí yī.',
        },
      },
      {
        sounds: [
          { label: 'ké yǐ', note: { fr: '可以 pouvoir', en: '可以 can' }, word: '可以' },
          { label: 'bú yào', note: { fr: '不要 ne pas vouloir', en: '不要 don\'t want' }, word: '不要' },
          { label: 'yí yàng', note: { fr: '一样 pareil', en: '一样 the same' }, word: '一样' },
          { label: 'yì qǐ', note: { fr: '一起 ensemble', en: '一起 together' }, word: '一起' },
        ],
      },
    ],
    exercise: ['sandhi'],
  },
  {
    id: 'mots',
    title: { fr: 'Vrais mots HSK 1', en: 'Real HSK 1 words' },
    subtitle: { fr: 'Écouter un mot et retrouver son pinyin', en: 'Listen to a word and find its pinyin' },
    intro: [
      {
        p: {
          fr: 'Pour finir, de vrais mots du HSK 1. Écoute le mot et choisis son pinyin parmi quatre propositions qui ne diffèrent que par les tons.',
          en: 'To finish, real HSK 1 words. Listen to the word and pick its pinyin among four options that differ only in their tones.',
        },
      },
      {
        p: {
          fr: 'Les mots concernés par les changements de ton (3e + 3e, 不, 一) ne sont pas proposés ici : le pinyin écrit ne correspondrait pas à ce que tu entends.',
          en: 'Words affected by tone changes (3rd + 3rd, 不, 一) are left out here: the written pinyin would not match what you hear.',
        },
      },
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
  {
    q: { fr: 'Dans « jù », le u se prononce…', en: 'In "jù", the u is pronounced…' },
    options: [{ fr: 'ü, le « u » français de « lune »', en: 'ü, "ee" with rounded lips' }, { fr: '« ou »', en: '"oo"' }],
    syl: 'ju4',
  },
  {
    q: { fr: 'Dans « lù », le u se prononce…', en: 'In "lù", the u is pronounced…' },
    options: [{ fr: '« ou »', en: '"oo"' }, { fr: 'ü, le « u » français de « lune »', en: 'ü, "ee" with rounded lips' }],
    syl: 'lu4',
  },
  {
    q: { fr: '« liù » est l\'écriture abrégée de…', en: '"liù" is the short spelling of…' },
    options: [
      { fr: 'l + iou (le o est sous-entendu)', en: 'l + iou (the o is implied)' },
      { fr: 'l + ü', en: 'l + ü' },
      { fr: 'l, i, u lus comme en français', en: 'l, i, u read as in English' },
    ],
    syl: 'liu4',
  },
  {
    q: { fr: '« guì » est l\'écriture abrégée de…', en: '"guì" is the short spelling of…' },
    options: [
      { fr: 'g + uei (« gouéï »)', en: 'g + uei ("gway")' },
      { fr: 'g + i, comme « gui » en français', en: 'g + i, like "ghee"' },
      { fr: 'g + ü', en: 'g + ü' },
    ],
    syl: 'gui4',
  },
  {
    q: { fr: '« lùn » est l\'écriture abrégée de…', en: '"lùn" is the short spelling of…' },
    options: [
      { fr: 'l + uen (« louène »)', en: 'l + uen ("lwun")' },
      { fr: 'l + un, comme « un » en français', en: 'l + un, like the "lun" in "lunch"' },
      { fr: 'l + ün', en: 'l + ün' },
    ],
    syl: 'lun4',
  },
  {
    q: { fr: 'Dans « yī », le y…', en: 'In "yī", the y…' },
    options: [
      { fr: 'ne se prononce pas : yī = ī', en: 'is silent: yī = ī' },
      { fr: 'se prononce comme dans « yoyo »', en: 'is pronounced as in "yo-yo"' },
      { fr: 'allonge le son', en: 'lengthens the sound' },
    ],
    syl: 'yi1',
  },
  {
    q: { fr: 'Dans « wǔ », le w…', en: 'In "wǔ", the w…' },
    options: [
      { fr: 'ne se prononce pas : wǔ = ǔ (« ou »)', en: 'is silent: wǔ = ǔ ("oo")' },
      { fr: 'se prononce comme le w anglais', en: 'is a "wh" with a puff of air' },
      { fr: 'se prononce « v »', en: 'is pronounced like a v' },
    ],
    syl: 'wu3',
  },
  {
    q: { fr: 'Le e de « hē » se prononce…', en: 'The e in "hē" is pronounced…' },
    options: [
      {
        fr: 'comme le « e » de « le », plus au fond de la gorge',
        en: 'like the u in "duh", further back in the throat',
      },
      { fr: '« é »', en: 'like the e in "hey"' },
      { fr: '« è »', en: 'like the e in "bed"' },
    ],
    syl: 'he1',
  },
  {
    q: { fr: 'Le i de « shì » ou de « zì »…', en: 'The i in "shì" or "zì"…' },
    options: [
      { fr: 'n\'est pas un vrai i : la consonne se prolonge', en: 'is not a real "ee": the consonant keeps buzzing' },
      { fr: 'se prononce « i » comme en français', en: 'is a clear "ee", as in "see"' },
      { fr: 'se prononce « é »', en: 'is pronounced like the e in "hey"' },
    ],
    syl: 'shi4',
  },
  {
    q: { fr: '« ian » (tiān, jiàn) se prononce…', en: '"ian" (tiān, jiàn) is pronounced…' },
    options: [{ fr: '« iène »', en: '"yen"' }, { fr: '« iane »', en: '"yahn"' }],
    syl: 'tian1',
  },
  {
    q: { fr: '« xué » se prononce…', en: '"xué" is pronounced…' },
    options: [{ fr: 'x + üé (u de « lune »)', en: 'x + üé (ü: "ee" with rounded lips)' }, { fr: 'x + oué', en: 'x + "way"' }],
    syl: 'xue2',
  },
  {
    q: {
      fr: 'Pourquoi « nǚ » garde ses deux points, mais pas « jù » ?',
      en: 'Why does "nǚ" keep its dots, but not "jù"?',
    },
    options: [
      {
        fr: 'nu existe aussi, il faut distinguer nǔ et nǚ ; après j, q, x le u est toujours ü',
        en: 'nu also exists, so nǔ and nǚ must be told apart; after j, q, x the u is always ü',
      },
      { fr: 'c\'est une erreur d\'écriture', en: 'it\'s a spelling mistake' },
      { fr: 'les deux points indiquent un ton différent', en: 'the dots mark a different tone' },
    ],
    syl: 'nv3',
  },
]

// Changements de ton : forme écrite, forme dite, règle.
const RULE_TEXT = {
  '33': {
    fr: 'Deux 3e tons de suite : le premier devient un 2e ton.',
    en: 'Two 3rd tones in a row: the first becomes a 2nd tone.',
  },
  bu: {
    fr: '不 devient bú devant un 4e ton, et reste bù ailleurs.',
    en: '不 becomes bú before a 4th tone and stays bù elsewhere.',
  },
  yi: {
    fr: '一 devient yí devant un 4e ton, yì devant les tons 1, 2, 3, et reste yī seul ou à la fin.',
    en: '一 becomes yí before a 4th tone, yì before tones 1, 2, 3, and stays yī on its own or at the end.',
  },
}
export const SANDHI_ITEMS = [
  { hanzi: '你好', said: 'ní hǎo', options: ['nǐ hǎo', 'nǐ háo'], rule: '33', tr: { fr: 'bonjour', en: 'hello' } },
  { hanzi: '可以', said: 'ké yǐ', options: ['kě yǐ', 'kě yí'], rule: '33', tr: { fr: 'pouvoir', en: 'can' } },
  {
    hanzi: '很好',
    said: 'hén hǎo',
    options: ['hěn hǎo', 'hěn háo'],
    rule: '33',
    tr: { fr: 'très bien', en: 'very good' },
  },
  { hanzi: '水果', said: 'shuí guǒ', options: ['shuǐ guǒ', 'shuǐ guó'], rule: '33', tr: { fr: 'fruit', en: 'fruit' } },
  { hanzi: '所以', said: 'suó yǐ', options: ['suǒ yǐ', 'suǒ yí'], rule: '33', tr: { fr: 'donc', en: 'so' } },
  {
    hanzi: '洗澡',
    said: 'xí zǎo',
    options: ['xǐ zǎo', 'xǐ záo'],
    rule: '33',
    tr: { fr: 'se laver', en: 'to take a bath' },
  },
  {
    hanzi: '手表',
    said: 'shóu biǎo',
    options: ['shǒu biǎo', 'shǒu biáo'],
    rule: '33',
    tr: { fr: 'montre', en: 'watch' },
  },
  { hanzi: '不要', said: 'bú yào', options: ['bù yào'], rule: 'bu', tr: { fr: 'ne pas vouloir', en: 'don\'t want' } },
  { hanzi: '不对', said: 'bú duì', options: ['bù duì'], rule: 'bu', tr: { fr: 'pas correct', en: 'not right' } },
  { hanzi: '不是', said: 'bú shì', options: ['bù shì'], rule: 'bu', tr: { fr: 'ne pas être', en: 'not to be' } },
  { hanzi: '不用', said: 'bú yòng', options: ['bù yòng'], rule: 'bu', tr: { fr: 'pas besoin', en: 'no need' } },
  { hanzi: '不客气', said: 'bú kè qi', options: ['bù kè qi'], rule: 'bu', tr: { fr: 'de rien', en: 'you\'re welcome' } },
  { hanzi: '不好', said: 'bù hǎo', options: ['bú hǎo'], rule: 'bu', tr: { fr: 'pas bien', en: 'not good' } },
  { hanzi: '不来', said: 'bù lái', options: ['bú lái'], rule: 'bu', tr: { fr: 'ne pas venir', en: 'not to come' } },
  { hanzi: '不吃', said: 'bù chī', options: ['bú chī'], rule: 'bu', tr: { fr: 'ne pas manger', en: 'not to eat' } },
  { hanzi: '一样', said: 'yí yàng', options: ['yī yàng', 'yì yàng'], rule: 'yi', tr: { fr: 'pareil', en: 'the same' } },
  { hanzi: '一定', said: 'yí dìng', options: ['yī dìng', 'yì dìng'], rule: 'yi', tr: { fr: 'sûrement', en: 'surely' } },
  {
    hanzi: '一个',
    said: 'yí gè',
    options: ['yī gè', 'yì gè'],
    rule: 'yi',
    tr: { fr: 'un (+ classificateur)', en: 'one (+ classifier)' },
  },
  {
    hanzi: '一下',
    said: 'yí xià',
    options: ['yī xià', 'yì xià'],
    rule: 'yi',
    tr: { fr: 'un peu, un coup', en: 'a bit, once' },
  },
  { hanzi: '一起', said: 'yì qǐ', options: ['yī qǐ', 'yí qǐ'], rule: 'yi', tr: { fr: 'ensemble', en: 'together' } },
  {
    hanzi: '一般',
    said: 'yì bān',
    options: ['yī bān', 'yí bān'],
    rule: 'yi',
    tr: { fr: 'en général', en: 'generally' },
  },
  { hanzi: '一天', said: 'yì tiān', options: ['yī tiān', 'yí tiān'], rule: 'yi', tr: { fr: 'un jour', en: 'one day' } },
  { hanzi: '一年', said: 'yì nián', options: ['yī nián', 'yí nián'], rule: 'yi', tr: { fr: 'un an', en: 'one year' } },
  { hanzi: '第一', said: 'dì yī', options: ['dì yí', 'dì yì'], rule: 'yi', tr: { fr: 'premier', en: 'first' } },
  { hanzi: '十一', said: 'shí yī', options: ['shí yí', 'shí yì'], rule: 'yi', tr: { fr: 'onze', en: 'eleven' } },
].map(item => ({ ...item, explanation: RULE_TEXT[item.rule] }))
