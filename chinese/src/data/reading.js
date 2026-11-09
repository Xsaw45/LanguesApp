// Lecture : petits textes et dialogues du quotidien, gradués par niveau HSK (vocabulaire HSK 1–2 pour l'essentiel).
// Textes affichés : { fr, en } (langue de l'utilisateur).
//
// Texte : { id, level, kind: 'dialogue' | 'text', title, zh (titre chinois), speakers?, lines, questions }
//   speakers  { A: { zh, pinyin }, B: … } : qui parle (dialogues)
//   (GLOSSARY : mots des textes absents des listes HSK, noms propres compris : { mot: { pinyin, tr } })
//   lines     [{ s?: 'A' | 'B', zh, pinyin, tr, reorder?, alt? }]
//             zh : mots séparés par des espaces, la ponctuation collée au mot qui la précède (affiché sans espaces ;
//             chaque mot se touche pour voir son sens).
//             reorder : la phrase sert d'exercice « remettre dans l'ordre » ; alt : autres ordres corrects (sans espaces).
//   questions [{ q, a: [bonne réponse, 3 mauvaises], line }] : compréhension ; line = réplique qui donne la réponse.

export const GLOSSARY = {
  王明: { pinyin: 'Wáng Míng', tr: { fr: 'Wang Ming (prénom et nom)', en: 'Wang Ming (name)' } },
  大卫: { pinyin: 'Dàwèi', tr: { fr: 'David', en: 'David' } },
  马丽: { pinyin: 'Mǎ Lì', tr: { fr: 'Ma Li (prénom et nom)', en: 'Ma Li (name)' } },
  小王: { pinyin: 'Xiǎo Wáng', tr: { fr: 'Xiao Wang (« petit Wang », entre amis)', en: 'Xiao Wang ("little Wang", between friends)' } },
  小白: { pinyin: 'Xiǎobái', tr: { fr: 'Xiaobai (nom du chat, « petit blanc »)', en: 'Xiaobai (the cat\'s name, "little white")' } },
  你好: { pinyin: 'nǐ hǎo', tr: { fr: 'bonjour', en: 'hello' } },
  好的: { pinyin: 'hǎo de', tr: { fr: 'd\'accord, très bien', en: 'OK, all right' } },
  法国: { pinyin: 'Fǎguó', tr: { fr: 'France', en: 'France' } },
  上海: { pinyin: 'Shànghǎi', tr: { fr: 'Shanghai', en: 'Shanghai' } },
  火车站: { pinyin: 'huǒchēzhàn', tr: { fr: 'gare', en: 'train station' } },
  每天: { pinyin: 'měitiān', tr: { fr: 'tous les jours', en: 'every day' } },
  星期六: { pinyin: 'xīngqīliù', tr: { fr: 'samedi', en: 'Saturday' } },
  聊天: { pinyin: 'liáotiān', tr: { fr: 'bavarder, discuter', en: 'to chat' } },
  羊肉: { pinyin: 'yángròu', tr: { fr: 'viande de mouton, d\'agneau', en: 'mutton, lamb' } },
  烤鸭: { pinyin: 'kǎoyā', tr: { fr: 'canard laqué', en: 'roast duck' } },
}

export const READINGS = [
  {
    id: 'jieshao',
    level: 1,
    kind: 'dialogue',
    title: { fr: 'Se présenter', en: 'Introducing yourself' },
    zh: '自我介绍',
    speakers: { A: { zh: '王明', pinyin: 'Wáng Míng' }, B: { zh: '大卫', pinyin: 'Dàwèi' } },
    lines: [
      { s: 'A', zh: '你好！ 我 叫 王明。 你 叫 什么 名字？', pinyin: 'Nǐ hǎo! Wǒ jiào Wáng Míng. Nǐ jiào shénme míngzi?', tr: { fr: 'Bonjour, je m\'appelle Wang Ming. Et toi, comment tu t\'appelles ?', en: 'Hi, my name is Wang Ming. What\'s your name?' } },
      { s: 'B', zh: '你好！ 我 叫 大卫。', pinyin: 'Nǐ hǎo! Wǒ jiào Dàwèi.', tr: { fr: 'Bonjour, je m\'appelle David.', en: 'Hi, my name is David.' } },
      { s: 'A', zh: '你 是 哪 国 人？', pinyin: 'Nǐ shì nǎ guó rén?', tr: { fr: 'Tu viens de quel pays ?', en: 'Which country are you from?' }, reorder: true },
      { s: 'B', zh: '我 是 法国 人。 你 呢？', pinyin: 'Wǒ shì Fǎguó rén. Nǐ ne?', tr: { fr: 'Je suis français. Et toi ?', en: 'I\'m French. And you?' } },
      { s: 'A', zh: '我 是 中国 人， 我 是 北京 人。', pinyin: 'Wǒ shì Zhōngguó rén, wǒ shì Běijīng rén.', tr: { fr: 'Je suis chinois, je suis de Pékin.', en: 'I\'m Chinese, I\'m from Beijing.' } },
      { s: 'B', zh: '你 是 学生 吗？', pinyin: 'Nǐ shì xuésheng ma?', tr: { fr: 'Tu es étudiant ?', en: 'Are you a student?' }, reorder: true },
      { s: 'A', zh: '不 是， 我 是 老师。 你 呢？', pinyin: 'Bú shì, wǒ shì lǎoshī. Nǐ ne?', tr: { fr: 'Non, je suis professeur. Et toi ?', en: 'No, I\'m a teacher. And you?' } },
      { s: 'B', zh: '我 是 学生， 我 在 北京 学习 汉语。', pinyin: 'Wǒ shì xuésheng, wǒ zài Běijīng xuéxí Hànyǔ.', tr: { fr: 'Je suis étudiant, j\'apprends le chinois à Pékin.', en: 'I\'m a student, I\'m studying Chinese in Beijing.' } },
      { s: 'A', zh: '认识 你 很 高兴！', pinyin: 'Rènshi nǐ hěn gāoxìng!', tr: { fr: 'Ravi de te connaître.', en: 'Nice to meet you!' } },
    ],
    questions: [
      { q: { fr: 'De quel pays vient David ?', en: 'Which country is David from?' }, a: [{ fr: 'De France', en: 'France' }, { fr: 'De Chine', en: 'China' }, { fr: 'D\'Angleterre', en: 'England' }, { fr: 'Des États-Unis', en: 'The United States' }], line: 3 },
      { q: { fr: 'Que fait Wang Ming ?', en: 'What does Wang Ming do?' }, a: [{ fr: 'Il est professeur', en: 'He is a teacher' }, { fr: 'Il est étudiant', en: 'He is a student' }, { fr: 'Il est médecin', en: 'He is a doctor' }, { fr: 'Il travaille dans un restaurant', en: 'He works in a restaurant' }], line: 6 },
      { q: { fr: 'Où David apprend-il le chinois ?', en: 'Where is David studying Chinese?' }, a: [{ fr: 'À Pékin', en: 'In Beijing' }, { fr: 'À Paris', en: 'In Paris' }, { fr: 'À Shanghai', en: 'In Shanghai' }, { fr: 'Chez lui, en ligne', en: 'At home, online' }], line: 7 },
    ],
  },

  {
    id: 'fanguan',
    level: 1,
    kind: 'dialogue',
    title: { fr: 'Au restaurant', en: 'At the restaurant' },
    zh: '在饭馆',
    speakers: { A: { zh: '服务员', pinyin: 'fúwùyuán' }, B: { zh: '马丽', pinyin: 'Mǎ Lì' } },
    lines: [
      { s: 'A', zh: '你好， 你 想 吃 什么？', pinyin: 'Nǐ hǎo, nǐ xiǎng chī shénme?', tr: { fr: 'Bonjour, qu\'est-ce que vous voulez manger ?', en: 'Hello, what would you like to eat?' } },
      { s: 'B', zh: '我 想 吃 米饭 和 鸡蛋。', pinyin: 'Wǒ xiǎng chī mǐfàn hé jīdàn.', tr: { fr: 'Je voudrais du riz et des œufs.', en: 'I\'d like rice and eggs.' }, reorder: true, alt: ['我想吃鸡蛋和米饭。'] },
      { s: 'A', zh: '你 想 喝 什么？', pinyin: 'Nǐ xiǎng hē shénme?', tr: { fr: 'Et qu\'est-ce que vous voulez boire ?', en: 'What would you like to drink?' }, reorder: true },
      { s: 'B', zh: '有 茶 吗？', pinyin: 'Yǒu chá ma?', tr: { fr: 'Vous avez du thé ?', en: 'Do you have tea?' } },
      { s: 'A', zh: '有。 你 要 几 杯？', pinyin: 'Yǒu. Nǐ yào jǐ bēi?', tr: { fr: 'Oui. Combien de tasses ?', en: 'Yes. How many cups?' } },
      { s: 'B', zh: '一 杯。 多少 钱？', pinyin: 'Yì bēi. Duōshao qián?', tr: { fr: 'Une. C\'est combien ?', en: 'One. How much is it?' } },
      { s: 'A', zh: '三十五 块。', pinyin: 'Sānshíwǔ kuài.', tr: { fr: 'Trente-cinq yuans.', en: 'Thirty-five yuan.' } },
      { s: 'B', zh: '好， 谢谢！', pinyin: 'Hǎo, xièxie!', tr: { fr: 'D\'accord, merci.', en: 'OK, thank you!' } },
      { s: 'A', zh: '不 客气。', pinyin: 'Bú kèqi.', tr: { fr: 'De rien.', en: 'You\'re welcome.' } },
    ],
    questions: [
      { q: { fr: 'Que veut manger Ma Li ?', en: 'What does Ma Li want to eat?' }, a: [{ fr: 'Du riz et des œufs', en: 'Rice and eggs' }, { fr: 'Des nouilles', en: 'Noodles' }, { fr: 'Du riz et du poisson', en: 'Rice and fish' }, { fr: 'Des fruits', en: 'Fruit' }], line: 1 },
      { q: { fr: 'Que boit-elle ?', en: 'What does she drink?' }, a: [{ fr: 'Du thé', en: 'Tea' }, { fr: 'De l\'eau', en: 'Water' }, { fr: 'Du café', en: 'Coffee' }, { fr: 'Du lait', en: 'Milk' }], line: 3 },
      { q: { fr: 'Combien coûte le repas ?', en: 'How much is the meal?' }, a: [{ fr: '35 yuans', en: '35 yuan' }, { fr: '13 yuans', en: '13 yuan' }, { fr: '53 yuans', en: '53 yuan' }, { fr: '30 yuans', en: '30 yuan' }], line: 6 },
    ],
  },

  {
    id: 'wenlu',
    level: 1,
    kind: 'dialogue',
    title: { fr: 'Demander son chemin', en: 'Asking the way' },
    zh: '问路',
    speakers: { A: { zh: '大卫', pinyin: 'Dàwèi' }, B: { zh: '先生', pinyin: 'xiānsheng' } },
    lines: [
      { s: 'A', zh: '先生， 你好！ 请问， 火车站 在 哪儿？', pinyin: 'Xiānsheng, nǐ hǎo! Qǐngwèn, huǒchēzhàn zài nǎr?', tr: { fr: 'Bonjour monsieur. Excusez-moi, où est la gare ?', en: 'Hello, sir. Excuse me, where is the train station?' } },
      { s: 'B', zh: '火车站 在 前面。', pinyin: 'Huǒchēzhàn zài qiánmiàn.', tr: { fr: 'La gare est tout droit, devant.', en: 'The train station is straight ahead.' }, reorder: true },
      { s: 'A', zh: '远 不 远？', pinyin: 'Yuǎn bu yuǎn?', tr: { fr: 'C\'est loin ?', en: 'Is it far?' } },
      { s: 'B', zh: '不 太 远， 走路 十 分钟。', pinyin: 'Bú tài yuǎn, zǒulù shí fēnzhōng.', tr: { fr: 'Pas très loin, dix minutes à pied.', en: 'Not too far, ten minutes on foot.' } },
      { s: 'A', zh: '我 能 坐 出租车 去 吗？', pinyin: 'Wǒ néng zuò chūzūchē qù ma?', tr: { fr: 'Je peux y aller en taxi ?', en: 'Can I go by taxi?' }, reorder: true },
      { s: 'B', zh: '可以， 坐 出租车 五 分钟。', pinyin: 'Kěyǐ, zuò chūzūchē wǔ fēnzhōng.', tr: { fr: 'Oui, cinq minutes en taxi.', en: 'Yes, five minutes by taxi.' } },
      { s: 'A', zh: '谢谢 你！', pinyin: 'Xièxie nǐ!', tr: { fr: 'Merci.', en: 'Thank you!' } },
      { s: 'B', zh: '不 客气。', pinyin: 'Bú kèqi.', tr: { fr: 'De rien.', en: 'You\'re welcome.' } },
    ],
    questions: [
      { q: { fr: 'Où David veut-il aller ?', en: 'Where does David want to go?' }, a: [{ fr: 'À la gare', en: 'To the train station' }, { fr: 'À l\'aéroport', en: 'To the airport' }, { fr: 'À l\'hôpital', en: 'To the hospital' }, { fr: 'À l\'école', en: 'To school' }], line: 0 },
      { q: { fr: 'Combien de temps faut-il à pied ?', en: 'How long does it take on foot?' }, a: [{ fr: '10 minutes', en: '10 minutes' }, { fr: '5 minutes', en: '5 minutes' }, { fr: '15 minutes', en: '15 minutes' }, { fr: '30 minutes', en: '30 minutes' }], line: 3 },
      { q: { fr: 'Et en taxi ?', en: 'And by taxi?' }, a: [{ fr: '5 minutes', en: '5 minutes' }, { fr: '10 minutes', en: '10 minutes' }, { fr: '3 minutes', en: '3 minutes' }, { fr: '20 minutes', en: '20 minutes' }], line: 5 },
    ],
  },

  {
    id: 'jiating',
    level: 1,
    kind: 'text',
    title: { fr: 'Ma famille', en: 'My family' },
    zh: '我的家',
    lines: [
      { zh: '我 叫 马丽， 今年 二十 岁。', pinyin: 'Wǒ jiào Mǎ Lì, jīnnián èrshí suì.', tr: { fr: 'Je m\'appelle Ma Li, j\'ai vingt ans.', en: 'My name is Ma Li, I\'m twenty.' } },
      { zh: '我 家 有 四 口 人： 爸爸、 妈妈、 哥哥 和 我。', pinyin: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.', tr: { fr: 'Nous sommes quatre dans ma famille : papa, maman, mon grand frère et moi.', en: 'There are four of us in my family: dad, mom, my older brother and me.' } },
      { zh: '我 爸爸 是 医生， 他 在 医院 工作。', pinyin: 'Wǒ bàba shì yīshēng, tā zài yīyuàn gōngzuò.', tr: { fr: 'Mon père est médecin, il travaille à l\'hôpital.', en: 'My dad is a doctor, he works at the hospital.' } },
      { zh: '我 妈妈 是 老师。', pinyin: 'Wǒ māma shì lǎoshī.', tr: { fr: 'Ma mère est professeure.', en: 'My mom is a teacher.' }, reorder: true, alt: ['老师是我妈妈。'] },
      { zh: '我 哥哥 二十五 岁， 他 在 北京 工作。', pinyin: 'Wǒ gēge èrshíwǔ suì, tā zài Běijīng gōngzuò.', tr: { fr: 'Mon frère a vingt-cinq ans, il travaille à Pékin.', en: 'My brother is twenty-five, he works in Beijing.' } },
      { zh: '我 是 大学生。', pinyin: 'Wǒ shì dàxuéshēng.', tr: { fr: 'Je suis étudiante.', en: 'I\'m a university student.' } },
      { zh: '我 很 喜欢 学习 英语。', pinyin: 'Wǒ hěn xǐhuan xuéxí Yīngyǔ.', tr: { fr: 'J\'aime beaucoup apprendre l\'anglais.', en: 'I really like studying English.' }, reorder: true },
      { zh: '我们 家 有 一 只 猫， 它 叫 小白。', pinyin: 'Wǒmen jiā yǒu yì zhī māo, tā jiào Xiǎobái.', tr: { fr: 'Nous avons un chat, il s\'appelle Xiaobai.', en: 'We have a cat called Xiaobai.' } },
    ],
    questions: [
      { q: { fr: 'Combien sont-ils dans la famille ?', en: 'How many people are in the family?' }, a: [{ fr: 'Quatre', en: 'Four' }, { fr: 'Trois', en: 'Three' }, { fr: 'Cinq', en: 'Five' }, { fr: 'Six', en: 'Six' }], line: 1 },
      { q: { fr: 'Que fait son père ?', en: 'What does her father do?' }, a: [{ fr: 'Il est médecin', en: 'He is a doctor' }, { fr: 'Il est professeur', en: 'He is a teacher' }, { fr: 'Il est chauffeur de taxi', en: 'He is a taxi driver' }, { fr: 'Il est cuisinier', en: 'He is a cook' }], line: 2 },
      { q: { fr: 'Où travaille son frère ?', en: 'Where does her brother work?' }, a: [{ fr: 'À Pékin', en: 'In Beijing' }, { fr: 'À l\'hôpital', en: 'At the hospital' }, { fr: 'Dans une école', en: 'In a school' }, { fr: 'À Shanghai', en: 'In Shanghai' }], line: 4 },
      { q: { fr: 'Comment s\'appelle le chat ?', en: 'What is the cat\'s name?' }, a: [{ fr: 'Xiaobai', en: 'Xiaobai' }, { fr: 'Xiaohong', en: 'Xiaohong' }, { fr: 'Ma Li', en: 'Ma Li' }, { fr: 'Xiao Wang', en: 'Xiao Wang' }], line: 7 },
    ],
  },

  {
    id: 'yitian',
    level: 1,
    kind: 'text',
    title: { fr: 'Ma journée', en: 'My day' },
    zh: '我的一天',
    lines: [
      { zh: '我 每天 早上 七 点 起床。', pinyin: 'Wǒ měitiān zǎoshang qī diǎn qǐchuáng.', tr: { fr: 'Tous les jours, je me lève à sept heures du matin.', en: 'I get up at seven every morning.' }, reorder: true, alt: ['每天早上七点我起床。'] },
      { zh: '我 喝 一 杯 牛奶， 吃 一点儿 面包。', pinyin: 'Wǒ hē yì bēi niúnǎi, chī yìdiǎnr miànbāo.', tr: { fr: 'Je bois un verre de lait et je mange un peu de pain.', en: 'I drink a glass of milk and eat some bread.' } },
      { zh: '八 点 我 坐 公共汽车 去 学校。', pinyin: 'Bā diǎn wǒ zuò gōnggòng qìchē qù xuéxiào.', tr: { fr: 'À huit heures, je prends le bus pour aller à l\'école.', en: 'At eight I take the bus to school.' } },
      { zh: '上午 我们 学习 汉语， 中午 我 和 同学 一起 吃饭。', pinyin: 'Shàngwǔ wǒmen xuéxí Hànyǔ, zhōngwǔ wǒ hé tóngxué yìqǐ chīfàn.', tr: { fr: 'Le matin, nous étudions le chinois ; à midi, je mange avec mes camarades.', en: 'In the morning we study Chinese; at noon I eat with my classmates.' } },
      { zh: '下午 我 去 商店 买 东西。', pinyin: 'Xiàwǔ wǒ qù shāngdiàn mǎi dōngxi.', tr: { fr: 'L\'après-midi, je vais faire des courses au magasin.', en: 'In the afternoon I go shopping at the store.' }, reorder: true, alt: ['我下午去商店买东西。'] },
      { zh: '晚上 我 看 电视， 十一 点 睡觉。', pinyin: 'Wǎnshang wǒ kàn diànshì, shíyī diǎn shuìjiào.', tr: { fr: 'Le soir, je regarde la télé et je me couche à onze heures.', en: 'In the evening I watch TV and go to bed at eleven.' } },
    ],
    questions: [
      { q: { fr: 'À quelle heure se lève-t-il ?', en: 'What time does he get up?' }, a: [{ fr: 'À 7 heures', en: 'At 7' }, { fr: 'À 6 heures', en: 'At 6' }, { fr: 'À 8 heures', en: 'At 8' }, { fr: 'À 11 heures', en: 'At 11' }], line: 0 },
      { q: { fr: 'Comment va-t-il à l\'école ?', en: 'How does he get to school?' }, a: [{ fr: 'En bus', en: 'By bus' }, { fr: 'À pied', en: 'On foot' }, { fr: 'En taxi', en: 'By taxi' }, { fr: 'En train', en: 'By train' }], line: 2 },
      { q: { fr: 'Avec qui mange-t-il à midi ?', en: 'Who does he eat with at noon?' }, a: [{ fr: 'Avec ses camarades', en: 'With his classmates' }, { fr: 'Avec sa mère', en: 'With his mother' }, { fr: 'Avec son professeur', en: 'With his teacher' }, { fr: 'Seul', en: 'Alone' }], line: 3 },
      { q: { fr: 'Que fait-il le soir ?', en: 'What does he do in the evening?' }, a: [{ fr: 'Il regarde la télé', en: 'He watches TV' }, { fr: 'Il va au magasin', en: 'He goes to the store' }, { fr: 'Il étudie le chinois', en: 'He studies Chinese' }, { fr: 'Il va au cinéma', en: 'He goes to the cinema' }], line: 5 },
    ],
  },

  {
    id: 'mai-yifu',
    level: 2,
    kind: 'dialogue',
    title: { fr: 'Acheter un vêtement', en: 'Buying clothes' },
    zh: '买衣服',
    speakers: { A: { zh: '马丽', pinyin: 'Mǎ Lì' }, B: { zh: '老板', pinyin: 'lǎobǎn' } },
    lines: [
      { s: 'A', zh: '老板， 这 件 衣服 多少 钱？', pinyin: 'Lǎobǎn, zhè jiàn yīfu duōshao qián?', tr: { fr: 'Bonjour monsieur, combien coûte ce haut ?', en: 'Excuse me, how much is this top?' } },
      { s: 'B', zh: '两百 块。', pinyin: 'Liǎngbǎi kuài.', tr: { fr: 'Deux cents yuans.', en: 'Two hundred yuan.' } },
      { s: 'A', zh: '太 贵 了！ 便宜 一点儿 吧。', pinyin: 'Tài guì le! Piányi yìdiǎnr ba.', tr: { fr: 'C\'est trop cher. Faites-moi un petit prix.', en: 'That\'s too expensive! Make it a bit cheaper.' } },
      { s: 'B', zh: '一百八十 块， 怎么样？', pinyin: 'Yìbǎi bāshí kuài, zěnmeyàng?', tr: { fr: 'Cent quatre-vingts yuans, ça vous va ?', en: 'A hundred and eighty yuan, how about that?' } },
      { s: 'A', zh: '有 没有 红色 的？', pinyin: 'Yǒu méiyǒu hóngsè de?', tr: { fr: 'Vous l\'avez en rouge ?', en: 'Do you have it in red?' }, reorder: true },
      { s: 'B', zh: '有。 这 件 红色 的 比 那 件 白色 的 好看。', pinyin: 'Yǒu. Zhè jiàn hóngsè de bǐ nà jiàn báisè de hǎokàn.', tr: { fr: 'Oui. Celui-ci, en rouge, est plus joli que le blanc.', en: 'Yes. This red one looks nicer than the white one.' } },
      { s: 'A', zh: '我 要 这 件 红色 的。', pinyin: 'Wǒ yào zhè jiàn hóngsè de.', tr: { fr: 'Je prends celui en rouge.', en: 'I\'ll take the red one.' }, reorder: true },
      { s: 'B', zh: '好的， 一共 一百八十 块。', pinyin: 'Hǎo de, yígòng yìbǎi bāshí kuài.', tr: { fr: 'Très bien, ça fait cent quatre-vingts yuans en tout.', en: 'All right, that\'s a hundred and eighty yuan in total.' } },
    ],
    questions: [
      { q: { fr: 'Quel était le premier prix ?', en: 'What was the first price?' }, a: [{ fr: '200 yuans', en: '200 yuan' }, { fr: '180 yuans', en: '180 yuan' }, { fr: '100 yuans', en: '100 yuan' }, { fr: '280 yuans', en: '280 yuan' }], line: 1 },
      { q: { fr: 'Quelle couleur Ma Li choisit-elle ?', en: 'Which color does Ma Li choose?' }, a: [{ fr: 'Rouge', en: 'Red' }, { fr: 'Blanc', en: 'White' }, { fr: 'Noir', en: 'Black' }, { fr: 'Jaune', en: 'Yellow' }], line: 6 },
      { q: { fr: 'Combien paie-t-elle ?', en: 'How much does she pay?' }, a: [{ fr: '180 yuans', en: '180 yuan' }, { fr: '200 yuans', en: '200 yuan' }, { fr: '150 yuans', en: '150 yuan' }, { fr: '108 yuans', en: '108 yuan' }], line: 7 },
    ],
  },

  {
    id: 'kanbing',
    level: 2,
    kind: 'dialogue',
    title: { fr: 'Chez le médecin', en: 'At the doctor\'s' },
    zh: '看病',
    speakers: { A: { zh: '医生', pinyin: 'yīshēng' }, B: { zh: '大卫', pinyin: 'Dàwèi' } },
    lines: [
      { s: 'A', zh: '你 哪儿 不 舒服？', pinyin: 'Nǐ nǎr bù shūfu?', tr: { fr: 'Qu\'est-ce qui ne va pas ?', en: 'What seems to be the problem?' }, reorder: true },
      { s: 'B', zh: '我 头 疼， 也 不 想 吃饭。', pinyin: 'Wǒ tóu téng, yě bù xiǎng chīfàn.', tr: { fr: 'J\'ai mal à la tête, et je n\'ai pas envie de manger.', en: 'I have a headache, and I don\'t feel like eating.' } },
      { s: 'A', zh: '从 什么 时候 开始 的？', pinyin: 'Cóng shénme shíhou kāishǐ de?', tr: { fr: 'Depuis quand ?', en: 'Since when?' } },
      { s: 'B', zh: '昨天 晚上 开始 的。', pinyin: 'Zuótiān wǎnshang kāishǐ de.', tr: { fr: 'Depuis hier soir.', en: 'Since last night.' } },
      { s: 'A', zh: '你 昨天 吃 什么 了？', pinyin: 'Nǐ zuótiān chī shénme le?', tr: { fr: 'Qu\'est-ce que tu as mangé hier ?', en: 'What did you eat yesterday?' } },
      { s: 'B', zh: '我 吃 了 很 多 鱼 和 羊肉。', pinyin: 'Wǒ chī le hěn duō yú hé yángròu.', tr: { fr: 'J\'ai mangé beaucoup de poisson et d\'agneau.', en: 'I ate a lot of fish and lamb.' } },
      { s: 'A', zh: '没 什么 问题。 你 要 多 喝 水， 多 休息。', pinyin: 'Méi shénme wèntí. Nǐ yào duō hē shuǐ, duō xiūxi.', tr: { fr: 'Ce n\'est rien de grave. Bois beaucoup d\'eau et repose-toi.', en: 'It\'s nothing serious. Drink plenty of water and get some rest.' } },
      { s: 'B', zh: '我 明天 能 去 上课 吗？', pinyin: 'Wǒ míngtiān néng qù shàngkè ma?', tr: { fr: 'Je pourrai aller en cours demain ?', en: 'Can I go to class tomorrow?' }, reorder: true, alt: ['明天我能去上课吗？'] },
      { s: 'A', zh: '你 在 家 休息 两 天 吧。', pinyin: 'Nǐ zài jiā xiūxi liǎng tiān ba.', tr: { fr: 'Reste plutôt deux jours chez toi pour te reposer.', en: 'Better rest at home for two days.' } },
    ],
    questions: [
      { q: { fr: 'Où David a-t-il mal ?', en: 'Where does David hurt?' }, a: [{ fr: 'À la tête', en: 'His head' }, { fr: 'Au ventre', en: 'His stomach' }, { fr: 'Aux yeux', en: 'His eyes' }, { fr: 'Aux pieds', en: 'His feet' }], line: 1 },
      { q: { fr: 'Depuis quand est-il malade ?', en: 'Since when has he been ill?' }, a: [{ fr: 'Depuis hier soir', en: 'Since last night' }, { fr: 'Depuis ce matin', en: 'Since this morning' }, { fr: 'Depuis hier matin', en: 'Since yesterday morning' }, { fr: 'Depuis trois jours', en: 'For three days' }], line: 3 },
      { q: { fr: 'Que conseille le médecin ?', en: 'What does the doctor advise?' }, a: [{ fr: 'Boire beaucoup d\'eau et se reposer', en: 'Drink plenty of water and rest' }, { fr: 'Manger beaucoup de poisson', en: 'Eat a lot of fish' }, { fr: 'Aller en cours', en: 'Go to class' }, { fr: 'Aller à l\'hôpital', en: 'Go to the hospital' }], line: 6 },
      { q: { fr: 'Combien de jours doit-il rester chez lui ?', en: 'How many days should he stay at home?' }, a: [{ fr: 'Deux', en: 'Two' }, { fr: 'Un', en: 'One' }, { fr: 'Trois', en: 'Three' }, { fr: 'Sept', en: 'Seven' }], line: 8 },
    ],
  },

  {
    id: 'dianhua',
    level: 2,
    kind: 'dialogue',
    title: { fr: 'Un rendez-vous au téléphone', en: 'Making plans on the phone' },
    zh: '打电话',
    speakers: { A: { zh: '小王', pinyin: 'Xiǎo Wáng' }, B: { zh: '马丽', pinyin: 'Mǎ Lì' } },
    lines: [
      { s: 'A', zh: '喂， 马丽， 你 在 做 什么 呢？', pinyin: 'Wéi, Mǎ Lì, nǐ zài zuò shénme ne?', tr: { fr: 'Allô, Ma Li, qu\'est-ce que tu fais ?', en: 'Hello, Ma Li, what are you doing?' } },
      { s: 'B', zh: '我 正在 看 书 呢。 有 什么 事？', pinyin: 'Wǒ zhèngzài kàn shū ne. Yǒu shénme shì?', tr: { fr: 'Je suis en train de lire. Qu\'est-ce qu\'il y a ?', en: 'I\'m reading. What\'s up?' } },
      { s: 'A', zh: '明天 是 星期六， 我们 一起 去 看 电影， 好 吗？', pinyin: 'Míngtiān shì xīngqīliù, wǒmen yìqǐ qù kàn diànyǐng, hǎo ma?', tr: { fr: 'Demain c\'est samedi, on va voir un film ensemble ?', en: 'Tomorrow is Saturday, shall we go see a movie together?' } },
      { s: 'B', zh: '好 啊！ 几 点？', pinyin: 'Hǎo a! Jǐ diǎn?', tr: { fr: 'Avec plaisir. À quelle heure ?', en: 'Sure! What time?' } },
      { s: 'A', zh: '下午 三 点， 在 电影院 门口 见。', pinyin: 'Xiàwǔ sān diǎn, zài diànyǐngyuàn ménkǒu jiàn.', tr: { fr: 'À trois heures de l\'après-midi, devant le cinéma.', en: 'At three in the afternoon, at the cinema entrance.' }, reorder: true },
      { s: 'B', zh: '下午 我 要 去 机场 接 我 妈妈， 晚上 可以 吗？', pinyin: 'Xiàwǔ wǒ yào qù jīchǎng jiē wǒ māma, wǎnshang kěyǐ ma?', tr: { fr: 'L\'après-midi je dois aller chercher ma mère à l\'aéroport. Le soir, ça te va ?', en: 'In the afternoon I have to pick up my mom at the airport. Is the evening OK?' } },
      { s: 'A', zh: '可以， 那 我们 晚上 七 点 见。', pinyin: 'Kěyǐ, nà wǒmen wǎnshang qī diǎn jiàn.', tr: { fr: 'D\'accord, alors rendez-vous à sept heures du soir.', en: 'Sure, then let\'s meet at seven in the evening.' } },
      { s: 'B', zh: '好， 明天 见！', pinyin: 'Hǎo, míngtiān jiàn!', tr: { fr: 'D\'accord, à demain.', en: 'OK, see you tomorrow!' } },
    ],
    questions: [
      { q: { fr: 'Que fait Ma Li quand Xiao Wang appelle ?', en: 'What is Ma Li doing when Xiao Wang calls?' }, a: [{ fr: 'Elle lit', en: 'She is reading' }, { fr: 'Elle regarde un film', en: 'She is watching a movie' }, { fr: 'Elle dort', en: 'She is sleeping' }, { fr: 'Elle mange', en: 'She is eating' }], line: 1 },
      { q: { fr: 'Quel jour vont-ils au cinéma ?', en: 'Which day are they going to the cinema?' }, a: [{ fr: 'Samedi', en: 'Saturday' }, { fr: 'Dimanche', en: 'Sunday' }, { fr: 'Vendredi', en: 'Friday' }, { fr: 'Lundi', en: 'Monday' }], line: 2 },
      { q: { fr: 'Pourquoi Ma Li n\'est-elle pas libre l\'après-midi ?', en: 'Why isn\'t Ma Li free in the afternoon?' }, a: [{ fr: 'Elle va chercher sa mère à l\'aéroport', en: 'She is picking up her mother at the airport' }, { fr: 'Elle travaille', en: 'She is working' }, { fr: 'Elle a cours', en: 'She has class' }, { fr: 'Elle est malade', en: 'She is ill' }], line: 5 },
      { q: { fr: 'À quelle heure se retrouvent-ils ?', en: 'What time do they meet?' }, a: [{ fr: 'À 7 heures du soir', en: 'At 7 p.m.' }, { fr: 'À 3 heures de l\'après-midi', en: 'At 3 p.m.' }, { fr: 'À 5 heures du soir', en: 'At 5 p.m.' }, { fr: 'À 9 heures du soir', en: 'At 9 p.m.' }], line: 6 },
    ],
  },

  {
    id: 'zhoumo',
    level: 2,
    kind: 'text',
    title: { fr: 'Le week-end', en: 'The weekend' },
    zh: '我的周末',
    lines: [
      { zh: '上 个 周末 天气 很 好， 我 和 朋友 去 公园 玩儿 了。', pinyin: 'Shàng ge zhōumò tiānqì hěn hǎo, wǒ hé péngyou qù gōngyuán wánr le.', tr: { fr: 'Le week-end dernier, il faisait très beau : je suis allé au parc avec des amis.', en: 'Last weekend the weather was great, so I went to the park with friends.' } },
      { zh: '公园 里 人 很 多， 有 的 人 在 跑步， 有 的 人 在 唱歌。', pinyin: 'Gōngyuán li rén hěn duō, yǒu de rén zài pǎobù, yǒu de rén zài chànggē.', tr: { fr: 'Il y avait beaucoup de monde au parc : certains couraient, d\'autres chantaient.', en: 'The park was crowded: some people were running, others were singing.' } },
      { zh: '我们 在 公园 里 喝 茶、 聊天， 玩儿 得 很 高兴。', pinyin: 'Wǒmen zài gōngyuán li hē chá, liáotiān, wánr de hěn gāoxìng.', tr: { fr: 'Nous avons bu du thé et discuté au parc, on s\'est bien amusés.', en: 'We drank tea and chatted in the park, and had a great time.' } },
      { zh: '中午 我们 去 一 个 饭馆 吃 了 北京 烤鸭。', pinyin: 'Zhōngwǔ wǒmen qù yí ge fànguǎn chī le Běijīng kǎoyā.', tr: { fr: 'À midi, nous sommes allés manger du canard laqué dans un restaurant.', en: 'At noon we went to a restaurant and had Peking duck.' } },
      { zh: '烤鸭 很 好吃， 但是 有点儿 贵。', pinyin: 'Kǎoyā hěn hǎochī, dànshì yǒudiǎnr guì.', tr: { fr: 'Le canard était délicieux, mais un peu cher.', en: 'The duck was delicious, but a bit expensive.' }, reorder: true },
      { zh: '下午 下雨 了， 我们 就 回家 了。', pinyin: 'Xiàwǔ xià yǔ le, wǒmen jiù huí jiā le.', tr: { fr: 'L\'après-midi, il s\'est mis à pleuvoir, alors nous sommes rentrés.', en: 'In the afternoon it started to rain, so we went home.' }, reorder: true },
    ],
    questions: [
      { q: { fr: 'Avec qui est-il allé au parc ?', en: 'Who did he go to the park with?' }, a: [{ fr: 'Avec des amis', en: 'With friends' }, { fr: 'Avec sa famille', en: 'With his family' }, { fr: 'Avec ses collègues', en: 'With his colleagues' }, { fr: 'Seul', en: 'Alone' }], line: 0 },
      { q: { fr: 'Que faisaient les gens au parc ?', en: 'What were people doing in the park?' }, a: [{ fr: 'Ils couraient et chantaient', en: 'Running and singing' }, { fr: 'Ils dansaient et mangeaient', en: 'Dancing and eating' }, { fr: 'Ils lisaient', en: 'Reading' }, { fr: 'Ils dormaient', en: 'Sleeping' }], line: 1 },
      { q: { fr: 'Qu\'ont-ils mangé à midi ?', en: 'What did they eat at noon?' }, a: [{ fr: 'Du canard laqué', en: 'Peking duck' }, { fr: 'Du poisson', en: 'Fish' }, { fr: 'Des nouilles', en: 'Noodles' }, { fr: 'Du riz aux œufs', en: 'Egg fried rice' }], line: 3 },
      { q: { fr: 'Pourquoi sont-ils rentrés ?', en: 'Why did they go home?' }, a: [{ fr: 'Parce qu\'il pleuvait', en: 'Because it was raining' }, { fr: 'Parce que c\'était trop cher', en: 'Because it was too expensive' }, { fr: 'Parce qu\'ils étaient fatigués', en: 'Because they were tired' }, { fr: 'Parce qu\'il y avait trop de monde', en: 'Because it was too crowded' }], line: 5 },
    ],
  },

  {
    id: 'xue-hanyu',
    level: 2,
    kind: 'text',
    title: { fr: 'J\'apprends le chinois', en: 'Learning Chinese' },
    zh: '学汉语',
    lines: [
      { zh: '我 是 法国 人， 我 来 中国 已经 一 年 了。', pinyin: 'Wǒ shì Fǎguó rén, wǒ lái Zhōngguó yǐjīng yì nián le.', tr: { fr: 'Je suis français, je suis en Chine depuis déjà un an.', en: 'I\'m French, and I\'ve been in China for a year already.' } },
      { zh: '刚 来 的 时候， 我 只 会 说 “你好” 和 “谢谢”。', pinyin: 'Gāng lái de shíhou, wǒ zhǐ huì shuō "nǐ hǎo" hé "xièxie".', tr: { fr: 'Quand je suis arrivé, je savais seulement dire « bonjour » et « merci ».', en: 'When I first arrived, I could only say "hello" and "thank you".' } },
      { zh: '现在 我 能 和 中国 朋友 聊天 了。', pinyin: 'Xiànzài wǒ néng hé Zhōngguó péngyou liáotiān le.', tr: { fr: 'Maintenant, je peux discuter avec des amis chinois.', en: 'Now I can chat with Chinese friends.' }, reorder: true, alt: ['我现在能和中国朋友聊天了。'] },
      { zh: '我 觉得 汉字 比 语法 难， 因为 汉字 太 多 了。', pinyin: 'Wǒ juéde Hànzì bǐ yǔfǎ nán, yīnwèi Hànzì tài duō le.', tr: { fr: 'Je trouve les caractères plus difficiles que la grammaire, parce qu\'il y en a trop.', en: 'I find characters harder than grammar, because there are so many of them.' } },
      { zh: '每天 晚上 我 都 写 半 个 小时 汉字。', pinyin: 'Měitiān wǎnshang wǒ dōu xiě bàn ge xiǎoshí Hànzì.', tr: { fr: 'Tous les soirs, j\'écris des caractères pendant une demi-heure.', en: 'Every evening I spend half an hour writing characters.' } },
      { zh: '老师 说 我 的 汉字 写 得 很 好。', pinyin: 'Lǎoshī shuō wǒ de Hànzì xiě de hěn hǎo.', tr: { fr: 'Mon professeur dit que j\'écris bien les caractères.', en: 'My teacher says I write characters well.' } },
      { zh: '明年 我 想 去 上海 工作。', pinyin: 'Míngnián wǒ xiǎng qù Shànghǎi gōngzuò.', tr: { fr: 'L\'année prochaine, je voudrais aller travailler à Shanghai.', en: 'Next year I\'d like to go and work in Shanghai.' }, reorder: true, alt: ['我明年想去上海工作。'] },
    ],
    questions: [
      { q: { fr: 'Depuis combien de temps est-il en Chine ?', en: 'How long has he been in China?' }, a: [{ fr: 'Un an', en: 'A year' }, { fr: 'Deux ans', en: 'Two years' }, { fr: 'Six mois', en: 'Six months' }, { fr: 'Trois mois', en: 'Three months' }], line: 0 },
      { q: { fr: 'Qu\'est-ce qui est le plus difficile pour lui ?', en: 'What does he find hardest?' }, a: [{ fr: 'Les caractères', en: 'Characters' }, { fr: 'La grammaire', en: 'Grammar' }, { fr: 'La prononciation', en: 'Pronunciation' }, { fr: 'Les tons', en: 'Tones' }], line: 3 },
      { q: { fr: 'Combien de temps écrit-il chaque soir ?', en: 'How long does he write every evening?' }, a: [{ fr: 'Une demi-heure', en: 'Half an hour' }, { fr: 'Une heure', en: 'An hour' }, { fr: 'Deux heures', en: 'Two hours' }, { fr: 'Dix minutes', en: 'Ten minutes' }], line: 4 },
      { q: { fr: 'Que veut-il faire l\'année prochaine ?', en: 'What does he want to do next year?' }, a: [{ fr: 'Travailler à Shanghai', en: 'Work in Shanghai' }, { fr: 'Rentrer en France', en: 'Go back to France' }, { fr: 'Étudier à Pékin', en: 'Study in Beijing' }, { fr: 'Voyager en Chine', en: 'Travel around China' }], line: 6 },
    ],
  },
]

/** Mots d'une ligne (ponctuation comprise) et la ligne telle qu'elle s'affiche. */
export const lineWords = line => line.zh.split(' ')
export const lineText = line => line.zh.replaceAll(' ', '')
