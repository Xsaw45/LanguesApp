// Module Grammaire : points du HSK 1 et 2, dans l'ordre d'apprentissage (un point se débloque avec 80 % au précédent).
// Données pures, sans import. Progression : clé gr_<id>.
// Textes affichés : { fr, en } (langue de l'utilisateur) ; tr : traduction de la phrase chinoise.
//
// Point :
//   id, level (1 | 2), title, pattern (structure), explanation [paragraphes], examples [{ zh, pinyin, tr }],
//   pitfall (erreur courante)
//   order      [{ words, pinyin, tr, alt? }]  remettre les mots dans l'ordre ; alt : autres ordres acceptés
//   fill       [{ before, after, answer, wrong, pinyin, tr }]  compléter le trou (phrase = before + answer + after)
//   judge      [{ zh, pinyin, tr, ok: true } | { zh, tr, ok: false, fix, fixPinyin, why }]  phrase correcte ou pas
//   translate  [{ tr, answer, pinyin, wrong }]  choisir la bonne phrase chinoise
// Les mauvaises réponses (wrong) sont incorrectes ou veulent dire autre chose : jamais une deuxième bonne réponse.
// Pinyin : comme classifiers.js (mots soudés, 一 et 不 avec leur ton parlé, 3e + 3e non modifié).

export const GRAMMAR_POINTS = [
  {
    id: 'shi',
    level: 1,
    title: { fr: '是 : être', en: '是: to be' },
    pattern: { fr: 'A 是 B', en: 'A 是 B' },
    explanation: [
      {
        fr: '是 (shì) relie deux noms : « A est B ». On met le sujet, puis 是, puis ce qu\'il est : 我是学生 veut dire « je suis étudiant ».',
        en: '是 (shì) links two nouns: "A is B". Put the subject, then 是, then what it is: 我是学生 means "I am a student".',
      },
      {
        fr: '是 ne change jamais : il n\'y a pas de conjugaison. Pour la négation, on met 不 devant : 不是 (bú shì).',
        en: '是 never changes: there is no conjugation. For the negative, put 不 in front: 不是 (bú shì).',
      },
      {
        fr: 'Attention : 是 sert avec des noms, pas avec des adjectifs.',
        en: 'Careful: 是 goes with nouns, not with adjectives.',
      },
    ],
    examples: [
      { zh: '我是学生。', pinyin: 'wǒ shì xuésheng', tr: { fr: 'je suis étudiant', en: 'I am a student' } },
      { zh: '他是老师。', pinyin: 'tā shì lǎoshī', tr: { fr: 'il est professeur', en: 'he is a teacher' } },
      { zh: '她是中国人。', pinyin: 'tā shì Zhōngguó rén', tr: { fr: 'elle est chinoise', en: 'she is Chinese' } },
      { zh: '这是我的书。', pinyin: 'zhè shì wǒ de shū', tr: { fr: 'c\'est mon livre', en: 'this is my book' } },
      { zh: '我不是医生。', pinyin: 'wǒ bú shì yīshēng', tr: { fr: 'je ne suis pas médecin', en: 'I am not a doctor' } },
    ],
    pitfall: {
      fr: 'On a envie de dire 我是忙 pour « je suis occupé », mais devant un adjectif on n\'utilise pas 是 : on dit 我很忙.',
      en: 'You want to say 我是忙 for "I am busy", like "am" in English, but before an adjective you don\'t use 是: you say 我很忙.',
    },
    order: [
      { words: ['我', '是', '学生'], pinyin: 'wǒ shì xuésheng', tr: { fr: 'je suis étudiant', en: 'I am a student' } },
      { words: ['她', '是', '老师'], pinyin: 'tā shì lǎoshī', tr: { fr: 'elle est professeure', en: 'she is a teacher' } },
      {
        words: ['这', '是', '我', '的', '书'],
        pinyin: 'zhè shì wǒ de shū',
        tr: { fr: 'c\'est mon livre', en: 'this is my book' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '学生',
        answer: '是',
        wrong: ['很', '在'],
        pinyin: 'wǒ shì xuésheng',
        tr: { fr: 'je suis étudiant', en: 'I am a student' },
      },
      {
        before: '他',
        after: '是老师',
        answer: '不',
        wrong: ['没', '很'],
        pinyin: 'tā bú shì lǎoshī',
        tr: { fr: 'il n\'est pas professeur', en: 'he is not a teacher' },
      },
      {
        before: '这',
        after: '我的书',
        answer: '是',
        wrong: ['在', '很'],
        pinyin: 'zhè shì wǒ de shū',
        tr: { fr: 'c\'est mon livre', en: 'this is my book' },
      },
    ],
    judge: [
      { zh: '他是老师。', pinyin: 'tā shì lǎoshī', ok: true, tr: { fr: 'il est professeur', en: 'he is a teacher' } },
      {
        zh: '我很是学生。',
        ok: false,
        fix: '我是学生。',
        fixPinyin: 'wǒ shì xuésheng',
        why: { fr: 'On ne met pas 很 devant 是.', en: 'You don\'t put 很 before 是.' },
        tr: { fr: 'je suis étudiant', en: 'I am a student' },
      },
      {
        zh: '我是忙。',
        ok: false,
        fix: '我很忙。',
        fixPinyin: 'wǒ hěn máng',
        why: {
          fr: 'Devant un adjectif, on ne met pas 是 : on dit 我很忙.',
          en: 'Before an adjective you don\'t use 是: you say 我很忙.',
        },
        tr: { fr: 'je suis occupé', en: 'I am busy' },
      },
    ],
    translate: [
      {
        answer: '我是学生',
        pinyin: 'wǒ shì xuésheng',
        wrong: ['我很学生', '我在学生'],
        tr: { fr: 'je suis étudiant', en: 'I am a student' },
      },
      {
        answer: '他不是老师',
        pinyin: 'tā bú shì lǎoshī',
        wrong: ['他没是老师', '他是不老师'],
        tr: { fr: 'il n\'est pas professeur', en: 'he is not a teacher' },
      },
      {
        answer: '这是我的书',
        pinyin: 'zhè shì wǒ de shū',
        wrong: ['这在我的书', '这是书的我'],
        tr: { fr: 'c\'est mon livre', en: 'this is my book' },
      },
    ],
  },
  {
    id: 'ma',
    level: 1,
    title: { fr: 'Questions avec 吗', en: 'Questions with 吗' },
    pattern: { fr: 'Phrase + 吗 ?', en: 'Sentence + 吗?' },
    explanation: [
      {
        fr: 'Pour poser une question fermée (réponse oui ou non), tu prends une phrase normale et tu ajoutes 吗 (ma) à la fin.',
        en: 'To ask a yes-or-no question, take a normal sentence and add 吗 (ma) at the end.',
      },
      {
        fr: 'L\'ordre des mots ne change pas : 你是学生 (tu es étudiant) devient 你是学生吗 ? (tu es étudiant ?).',
        en: 'The word order doesn\'t change: 你是学生 (you are a student) becomes 你是学生吗? (are you a student?).',
      },
      {
        fr: 'Pour répondre, on répète le verbe : 是 (oui) ou 不是 (non).',
        en: 'To answer, repeat the verb: 是 (yes) or 不是 (no).',
      },
    ],
    examples: [
      { zh: '你是学生吗？', pinyin: 'nǐ shì xuésheng ma', tr: { fr: 'tu es étudiant ?', en: 'are you a student?' } },
      { zh: '你好吗？', pinyin: 'nǐ hǎo ma', tr: { fr: 'tu vas bien ?', en: 'how are you?' } },
      { zh: '你喜欢茶吗？', pinyin: 'nǐ xǐhuan chá ma', tr: { fr: 'tu aimes le thé ?', en: 'do you like tea?' } },
      { zh: '他是中国人吗？', pinyin: 'tā shì Zhōngguó rén ma', tr: { fr: 'il est chinois ?', en: 'is he Chinese?' } },
      { zh: '你有手机吗？', pinyin: 'nǐ yǒu shǒujī ma', tr: { fr: 'tu as un téléphone ?', en: 'do you have a phone?' } },
    ],
    pitfall: {
      fr: 'En français on inverse parfois le sujet et le verbe pour poser une question, mais en chinois on garde l\'ordre de la phrase et on ajoute seulement 吗 à la fin.',
      en: 'In English you swap the subject and the verb to ask a question ("are you…?"), but in Chinese you keep the sentence order and just add 吗 at the end.',
    },
    order: [
      {
        words: ['你', '是', '老师', '吗'],
        pinyin: 'nǐ shì lǎoshī ma',
        tr: { fr: 'tu es professeur ?', en: 'are you a teacher?' },
      },
      {
        words: ['他', '喜欢', '喝', '茶', '吗'],
        pinyin: 'tā xǐhuan hē chá ma',
        tr: { fr: 'il aime boire du thé ?', en: 'does he like drinking tea?' },
      },
      {
        words: ['你', '有', '手机', '吗'],
        pinyin: 'nǐ yǒu shǒujī ma',
        tr: { fr: 'tu as un téléphone ?', en: 'do you have a phone?' },
      },
    ],
    fill: [
      {
        before: '你是学生',
        after: '',
        answer: '吗',
        wrong: ['很', '在'],
        pinyin: 'nǐ shì xuésheng ma',
        tr: { fr: 'tu es étudiant ?', en: 'are you a student?' },
      },
      {
        before: '他忙',
        after: '',
        answer: '吗',
        wrong: ['是', '很'],
        pinyin: 'tā máng ma',
        tr: { fr: 'il est occupé ?', en: 'is he busy?' },
      },
      {
        before: '你',
        after: '中国人吗',
        answer: '是',
        wrong: ['很', '吗'],
        pinyin: 'nǐ shì Zhōngguó rén ma',
        tr: { fr: 'tu es chinois ?', en: 'are you Chinese?' },
      },
    ],
    judge: [
      {
        zh: '你是老师吗？',
        pinyin: 'nǐ shì lǎoshī ma',
        ok: true,
        tr: { fr: 'tu es professeur ?', en: 'are you a teacher?' },
      },
      {
        zh: '你吗是学生？',
        ok: false,
        fix: '你是学生吗？',
        fixPinyin: 'nǐ shì xuésheng ma',
        why: { fr: '吗 se place toujours à la fin de la phrase.', en: '吗 always goes at the end of the sentence.' },
        tr: { fr: 'tu es étudiant ?', en: 'are you a student?' },
      },
      {
        zh: '是你学生吗？',
        ok: false,
        fix: '你是学生吗？',
        fixPinyin: 'nǐ shì xuésheng ma',
        why: {
          fr: 'On ne change pas l\'ordre des mots : on ajoute seulement 吗 à la fin.',
          en: 'You don\'t change the word order: you just add 吗 at the end.',
        },
        tr: { fr: 'tu es étudiant ?', en: 'are you a student?' },
      },
    ],
    translate: [
      {
        answer: '你是中国人吗',
        pinyin: 'nǐ shì Zhōngguó rén ma',
        wrong: ['是你中国人吗', '你吗是中国人'],
        tr: { fr: 'tu es chinois ?', en: 'are you Chinese?' },
      },
      { answer: '你好吗', pinyin: 'nǐ hǎo ma', wrong: ['好你吗', '你吗好'], tr: { fr: 'tu vas bien ?', en: 'how are you?' } },
      {
        answer: '你有手机吗',
        pinyin: 'nǐ yǒu shǒujī ma',
        wrong: ['有你手机吗', '你有吗手机'],
        tr: { fr: 'tu as un téléphone ?', en: 'do you have a phone?' },
      },
    ],
  },
  {
    id: 'bu',
    level: 1,
    title: { fr: 'La négation 不', en: 'The negative 不' },
    pattern: { fr: '不 + verbe / adjectif', en: '不 + verb / adjective' },
    explanation: [
      {
        fr: 'Pour dire « ne… pas », tu mets 不 (bù) juste devant le verbe ou l\'adjectif : 我不喝咖啡 (je ne bois pas de café), 今天不冷 (il ne fait pas froid aujourd\'hui).',
        en: 'To say "not", put 不 (bù) right before the verb or the adjective: 我不喝咖啡 (I don\'t drink coffee), 今天不冷 (it\'s not cold today).',
      },
      {
        fr: '不 se prononce normalement au 4e ton (bù), mais devant un autre 4e ton il passe au 2e ton : 不是 (bú shì), 不去 (bú qù).',
        en: '不 is normally 4th tone (bù), but before another 4th tone it becomes 2nd tone: 不是 (bú shì), 不去 (bú qù).',
      },
      {
        fr: '不 sert pour le présent, le futur et les habitudes. Il ne s\'utilise jamais avec 有 : on dit 没有.',
        en: '不 is for the present, the future and habits. It is never used with 有: you say 没有.',
      },
    ],
    examples: [
      { zh: '我不喝咖啡。', pinyin: 'wǒ bù hē kāfēi', tr: { fr: 'je ne bois pas de café', en: 'I don\'t drink coffee' } },
      { zh: '他不是老师。', pinyin: 'tā bú shì lǎoshī', tr: { fr: 'il n\'est pas professeur', en: 'he is not a teacher' } },
      {
        zh: '今天不冷。',
        pinyin: 'jīntiān bù lěng',
        tr: { fr: 'il ne fait pas froid aujourd\'hui', en: 'it\'s not cold today' },
      },
      { zh: '我不去。', pinyin: 'wǒ bú qù', tr: { fr: 'je n\'y vais pas', en: 'I\'m not going' } },
      { zh: '这个不贵。', pinyin: 'zhège bú guì', tr: { fr: 'ce n\'est pas cher', en: 'it\'s not expensive' } },
    ],
    pitfall: {
      fr: 'On ne dit jamais 不有 : pour « ne pas avoir », on dit 没有.',
      en: 'You never say 不有: for "not to have", you say 没有.',
    },
    order: [
      {
        words: ['我', '不', '喝', '咖啡'],
        pinyin: 'wǒ bù hē kāfēi',
        tr: { fr: 'je ne bois pas de café', en: 'I don\'t drink coffee' },
      },
      {
        words: ['今天', '不', '冷'],
        pinyin: 'jīntiān bù lěng',
        tr: { fr: 'il ne fait pas froid aujourd\'hui', en: 'it\'s not cold today' },
      },
      {
        words: ['他', '不', '是', '医生'],
        pinyin: 'tā bú shì yīshēng',
        tr: { fr: 'il n\'est pas médecin', en: 'he is not a doctor' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '去学校',
        answer: '不',
        wrong: ['很', '吗'],
        pinyin: 'wǒ bú qù xuéxiào',
        tr: { fr: 'je ne vais pas à l\'école', en: 'I\'m not going to school' },
      },
      {
        before: '今天',
        after: '热',
        answer: '不',
        wrong: ['是', '的'],
        pinyin: 'jīntiān bú rè',
        tr: { fr: 'il ne fait pas chaud aujourd\'hui', en: 'it\'s not hot today' },
      },
      {
        before: '他',
        after: '喜欢喝茶',
        answer: '不',
        wrong: ['吗', '的'],
        pinyin: 'tā bù xǐhuan hē chá',
        tr: { fr: 'il n\'aime pas boire du thé', en: 'he doesn\'t like drinking tea' },
      },
    ],
    judge: [
      {
        zh: '我不喜欢咖啡。',
        pinyin: 'wǒ bù xǐhuan kāfēi',
        ok: true,
        tr: { fr: 'je n\'aime pas le café', en: 'I don\'t like coffee' },
      },
      {
        zh: '我不有钱。',
        ok: false,
        fix: '我没有钱。',
        fixPinyin: 'wǒ méiyǒu qián',
        why: { fr: '有 se nie toujours avec 没 : 没有.', en: '有 is always negated with 没: 没有.' },
        tr: { fr: 'je n\'ai pas d\'argent', en: 'I don\'t have any money' },
      },
      {
        zh: '他是不老师。',
        ok: false,
        fix: '他不是老师。',
        fixPinyin: 'tā bú shì lǎoshī',
        why: { fr: '不 se place devant le verbe 是.', en: '不 goes before the verb 是.' },
        tr: { fr: 'il n\'est pas professeur', en: 'he is not a teacher' },
      },
    ],
    translate: [
      {
        answer: '我不喝茶',
        pinyin: 'wǒ bù hē chá',
        wrong: ['我喝不茶', '不我喝茶'],
        tr: { fr: 'je ne bois pas de thé', en: 'I don\'t drink tea' },
      },
      {
        answer: '今天不冷',
        pinyin: 'jīntiān bù lěng',
        wrong: ['今天冷不', '今天不是冷'],
        tr: { fr: 'il ne fait pas froid aujourd\'hui', en: 'it\'s not cold today' },
      },
      {
        answer: '这个不贵',
        pinyin: 'zhège bú guì',
        wrong: ['这个贵不', '这个不是贵'],
        tr: { fr: 'ce n\'est pas cher', en: 'it\'s not expensive' },
      },
    ],
  },
  {
    id: 'de-possession',
    level: 1,
    title: { fr: '的 : la possession', en: '的: possession' },
    pattern: { fr: 'A 的 B', en: 'A 的 B' },
    explanation: [
      {
        fr: 'Pour dire « le B de A », tu mets d\'abord le possesseur, puis 的 (de), puis l\'objet : 老师的书 = « le livre du professeur ».',
        en: 'To say "A\'s B", put the owner first, then 的 (de), then the thing: 老师的书 = "the teacher\'s book".',
      },
      {
        fr: 'Avec un pronom, c\'est pareil : 我的 (mon), 你的 (ton), 他的 (son).',
        en: 'It works the same with pronouns: 我的 (my), 你的 (your), 他的 (his).',
      },
      {
        fr: 'Pour la famille et les personnes proches, on enlève souvent 的 : 我妈妈 (ma mère).',
        en: 'For family and close people, 的 is often dropped: 我妈妈 (my mom).',
      },
    ],
    examples: [
      { zh: '这是我的书。', pinyin: 'zhè shì wǒ de shū', tr: { fr: 'c\'est mon livre', en: 'this is my book' } },
      { zh: '他是我的朋友。', pinyin: 'tā shì wǒ de péngyou', tr: { fr: 'c\'est mon ami', en: 'he is my friend' } },
      { zh: '我的猫很小。', pinyin: 'wǒ de māo hěn xiǎo', tr: { fr: 'mon chat est petit', en: 'my cat is small' } },
      {
        zh: '这是谁的手机？',
        pinyin: 'zhè shì shéi de shǒujī',
        tr: { fr: 'à qui est ce téléphone ?', en: 'whose phone is this?' },
      },
      { zh: '我妈妈是医生。', pinyin: 'wǒ māma shì yīshēng', tr: { fr: 'ma mère est médecin', en: 'my mother is a doctor' } },
    ],
    pitfall: {
      fr: 'En français on dit « le livre du professeur » avec l\'objet en premier, mais en chinois le possesseur vient toujours avant : 老师的书.',
      en: 'In English you can say "the book of the teacher" with the thing first, but in Chinese the owner always comes first: 老师的书.',
    },
    order: [
      {
        words: ['这', '是', '我', '的', '书'],
        pinyin: 'zhè shì wǒ de shū',
        tr: { fr: 'c\'est mon livre', en: 'this is my book' },
      },
      {
        words: ['她', '是', '我', '的', '朋友'],
        pinyin: 'tā shì wǒ de péngyou',
        tr: { fr: 'c\'est mon amie', en: 'she is my friend' },
      },
      {
        words: ['我', '的', '猫', '很', '小'],
        pinyin: 'wǒ de māo hěn xiǎo',
        tr: { fr: 'mon chat est petit', en: 'my cat is small' },
      },
    ],
    fill: [
      {
        before: '这是老师',
        after: '书',
        answer: '的',
        wrong: ['是', '很'],
        pinyin: 'zhè shì lǎoshī de shū',
        tr: { fr: 'c\'est le livre du professeur', en: 'this is the teacher\'s book' },
      },
      {
        before: '他是我',
        after: '朋友',
        answer: '的',
        wrong: ['了', '吗'],
        pinyin: 'tā shì wǒ de péngyou',
        tr: { fr: 'c\'est mon ami', en: 'he is my friend' },
      },
      {
        before: '这是',
        after: '的手机',
        answer: '谁',
        wrong: ['吗', '很'],
        pinyin: 'zhè shì shéi de shǒujī',
        tr: { fr: 'à qui est ce téléphone ?', en: 'whose phone is this?' },
      },
    ],
    judge: [
      { zh: '这是我的书。', pinyin: 'zhè shì wǒ de shū', ok: true, tr: { fr: 'c\'est mon livre', en: 'this is my book' } },
      {
        zh: '这是书的我。',
        ok: false,
        fix: '这是我的书。',
        fixPinyin: 'zhè shì wǒ de shū',
        why: { fr: 'Le possesseur vient avant 的, l\'objet après.', en: 'The owner comes before 的, the thing after.' },
        tr: { fr: 'c\'est mon livre', en: 'this is my book' },
      },
      {
        zh: '这是老师书。',
        ok: false,
        fix: '这是老师的书。',
        fixPinyin: 'zhè shì lǎoshī de shū',
        why: {
          fr: 'Pour la possession d\'un objet, il faut 的 entre le possesseur et l\'objet.',
          en: 'To show that an object belongs to someone, you need 的 between the owner and the object.',
        },
        tr: { fr: 'c\'est le livre du professeur', en: 'this is the teacher\'s book' },
      },
    ],
    translate: [
      {
        answer: '这是老师的书',
        pinyin: 'zhè shì lǎoshī de shū',
        wrong: ['这是书的老师', '这是的老师书'],
        tr: { fr: 'c\'est le livre du professeur', en: 'this is the teacher\'s book' },
      },
      {
        answer: '他是我的朋友',
        pinyin: 'tā shì wǒ de péngyou',
        wrong: ['他是朋友的我', '他的是我朋友'],
        tr: { fr: 'c\'est mon ami', en: 'he is my friend' },
      },
      {
        answer: '这是谁的手机',
        pinyin: 'zhè shì shéi de shǒujī',
        wrong: ['这是手机的谁', '谁是这的手机'],
        tr: { fr: 'à qui est ce téléphone ?', en: 'whose phone is this?' },
      },
    ],
  },
  {
    id: 'hen-adjectif',
    level: 1,
    title: { fr: '很 + adjectif', en: '很 + adjective' },
    pattern: { fr: 'Sujet + 很 + adjectif', en: 'Subject + 很 + adjective' },
    explanation: [
      {
        fr: 'En chinois, un adjectif fonctionne comme un verbe : il n\'a pas besoin de 是. On dit le sujet, puis 很 (hěn), puis l\'adjectif : 我很忙 = « je suis occupé ».',
        en: 'In Chinese, an adjective works like a verb: it doesn\'t need 是. Say the subject, then 很 (hěn), then the adjective: 我很忙 = "I am busy".',
      },
      {
        fr: '很 veut dire « très », mais ici il sert surtout de lien : 他很高 veut simplement dire « il est grand ».',
        en: '很 means "very", but here it mostly works as a link: 他很高 simply means "he is tall".',
      },
      {
        fr: 'Sans 很, la phrase sonne comme une comparaison. À la négation, on remplace 很 par 不 : 汉语不难.',
        en: 'Without 很, the sentence sounds like a comparison. In the negative, 不 replaces 很: 汉语不难.',
      },
    ],
    examples: [
      { zh: '我很好。', pinyin: 'wǒ hěn hǎo', tr: { fr: 'je vais bien', en: 'I\'m fine' } },
      { zh: '今天很冷。', pinyin: 'jīntiān hěn lěng', tr: { fr: 'il fait froid aujourd\'hui', en: 'it\'s cold today' } },
      { zh: '他很高。', pinyin: 'tā hěn gāo', tr: { fr: 'il est grand', en: 'he is tall' } },
      { zh: '这个苹果很大。', pinyin: 'zhège píngguǒ hěn dà', tr: { fr: 'cette pomme est grosse', en: 'this apple is big' } },
      {
        zh: '汉语不难。',
        pinyin: 'Hànyǔ bù nán',
        tr: { fr: 'le chinois n\'est pas difficile', en: 'Chinese is not difficult' },
      },
    ],
    pitfall: {
      fr: 'Un francophone traduit « être » par 是 et dit 我是忙, alors qu\'avant un adjectif on met 很 et pas 是 : 我很忙.',
      en: 'English speakers translate "to be" as 是 and say 我是忙, but before an adjective you use 很, not 是: 我很忙.',
    },
    order: [
      { words: ['我', '很', '忙'], pinyin: 'wǒ hěn máng', tr: { fr: 'je suis occupé', en: 'I am busy' } },
      {
        words: ['今天', '很', '热'],
        pinyin: 'jīntiān hěn rè',
        tr: { fr: 'il fait chaud aujourd\'hui', en: 'it\'s hot today' },
      },
      {
        words: ['这个', '菜', '很', '好吃'],
        pinyin: 'zhège cài hěn hǎochī',
        tr: { fr: 'ce plat est bon', en: 'this dish is tasty' },
      },
    ],
    fill: [
      {
        before: '他',
        after: '高',
        answer: '很',
        wrong: ['是', '的'],
        pinyin: 'tā hěn gāo',
        tr: { fr: 'il est grand', en: 'he is tall' },
      },
      {
        before: '今天',
        after: '冷',
        answer: '很',
        wrong: ['是', '有'],
        pinyin: 'jīntiān hěn lěng',
        tr: { fr: 'il fait froid aujourd\'hui', en: 'it\'s cold today' },
      },
      {
        before: '我妈妈',
        after: '忙',
        answer: '很',
        wrong: ['是', '吗'],
        pinyin: 'wǒ māma hěn máng',
        tr: { fr: 'ma mère est occupée', en: 'my mother is busy' },
      },
    ],
    judge: [
      { zh: '她很漂亮。', pinyin: 'tā hěn piàoliang', ok: true, tr: { fr: 'elle est belle', en: 'she is beautiful' } },
      {
        zh: '我是忙。',
        ok: false,
        fix: '我很忙。',
        fixPinyin: 'wǒ hěn máng',
        why: { fr: 'Devant un adjectif, on ne met pas 是 mais 很.', en: 'Before an adjective you don\'t use 是 but 很.' },
        tr: { fr: 'je suis occupé', en: 'I am busy' },
      },
      {
        zh: '这个很是贵。',
        ok: false,
        fix: '这个很贵。',
        fixPinyin: 'zhège hěn guì',
        why: {
          fr: '很 se place directement devant l\'adjectif, sans 是.',
          en: '很 goes directly before the adjective, without 是.',
        },
        tr: { fr: 'c\'est cher', en: 'it\'s expensive' },
      },
    ],
    translate: [
      { answer: '我很累', pinyin: 'wǒ hěn lèi', wrong: ['我是累', '我累是'], tr: { fr: 'je suis fatigué', en: 'I\'m tired' } },
      {
        answer: '今天很热',
        pinyin: 'jīntiān hěn rè',
        wrong: ['今天是热', '很今天热'],
        tr: { fr: 'il fait chaud aujourd\'hui', en: 'it\'s hot today' },
      },
      { answer: '他很高', pinyin: 'tā hěn gāo', wrong: ['他是高', '他高很'], tr: { fr: 'il est grand', en: 'he is tall' } },
    ],
  },
  {
    id: 'you',
    level: 1,
    title: { fr: '有 et 没有', en: '有 and 没有' },
    pattern: { fr: 'A 有 B · A 没有 B', en: 'A 有 B · A 没有 B' },
    explanation: [
      {
        fr: '有 (yǒu) veut dire « avoir » : 我有一个哥哥 = « j\'ai un grand frère ».',
        en: '有 (yǒu) means "to have": 我有一个哥哥 = "I have an older brother".',
      },
      {
        fr: 'Avec un lieu au début, 有 veut dire « il y a » : 这儿有一个商店 = « ici, il y a un magasin ».',
        en: 'With a place at the start, 有 means "there is": 这儿有一个商店 = "there is a shop here".',
      },
      {
        fr: 'La négation de 有 est toujours 没有 (méiyǒu) : 我没有钱 = « je n\'ai pas d\'argent ».',
        en: 'The negative of 有 is always 没有 (méiyǒu): 我没有钱 = "I don\'t have any money".',
      },
    ],
    examples: [
      {
        zh: '我有一个哥哥。',
        pinyin: 'wǒ yǒu yí gè gēge',
        tr: { fr: 'j\'ai un grand frère', en: 'I have an older brother' },
      },
      { zh: '他没有钱。', pinyin: 'tā méiyǒu qián', tr: { fr: 'il n\'a pas d\'argent', en: 'he doesn\'t have any money' } },
      { zh: '你有手机吗？', pinyin: 'nǐ yǒu shǒujī ma', tr: { fr: 'tu as un téléphone ?', en: 'do you have a phone?' } },
      {
        zh: '这儿有一个商店。',
        pinyin: 'zhèr yǒu yí gè shāngdiàn',
        tr: { fr: 'ici, il y a un magasin', en: 'there is a shop here' },
      },
      { zh: '我没有时间。', pinyin: 'wǒ méiyǒu shíjiān', tr: { fr: 'je n\'ai pas le temps', en: 'I don\'t have time' } },
    ],
    pitfall: {
      fr: 'Comme 不 est la négation habituelle, on dit souvent 不有 par erreur, alors que la seule forme correcte est 没有.',
      en: 'Since 不 is the usual negative, people often say 不有 by mistake, but the only correct form is 没有.',
    },
    order: [
      {
        words: ['我', '有', '一个', '哥哥'],
        pinyin: 'wǒ yǒu yí gè gēge',
        tr: { fr: 'j\'ai un grand frère', en: 'I have an older brother' },
      },
      {
        words: ['他', '没有', '钱'],
        pinyin: 'tā méiyǒu qián',
        tr: { fr: 'il n\'a pas d\'argent', en: 'he doesn\'t have any money' },
      },
      {
        words: ['你', '有', '时间', '吗'],
        pinyin: 'nǐ yǒu shíjiān ma',
        tr: { fr: 'tu as le temps ?', en: 'do you have time?' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '有钱',
        answer: '没',
        wrong: ['不', '很'],
        pinyin: 'wǒ méiyǒu qián',
        tr: { fr: 'je n\'ai pas d\'argent', en: 'I don\'t have any money' },
      },
      {
        before: '他',
        after: '一个妹妹',
        answer: '有',
        wrong: ['在', '很'],
        pinyin: 'tā yǒu yí gè mèimei',
        tr: { fr: 'il a une petite sœur', en: 'he has a younger sister' },
      },
      {
        before: '桌子上',
        after: '一本书',
        answer: '有',
        wrong: ['在', '很'],
        pinyin: 'zhuōzi shang yǒu yì běn shū',
        tr: { fr: 'il y a un livre sur la table', en: 'there is a book on the table' },
      },
    ],
    judge: [
      {
        zh: '他有两个孩子。',
        pinyin: 'tā yǒu liǎng gè háizi',
        ok: true,
        tr: { fr: 'il a deux enfants', en: 'he has two children' },
      },
      {
        zh: '我不有钱。',
        ok: false,
        fix: '我没有钱。',
        fixPinyin: 'wǒ méiyǒu qián',
        why: { fr: 'La négation de 有 est toujours 没有.', en: 'The negative of 有 is always 没有.' },
        tr: { fr: 'je n\'ai pas d\'argent', en: 'I don\'t have any money' },
      },
      {
        zh: '我没有时间。',
        pinyin: 'wǒ méiyǒu shíjiān',
        ok: true,
        tr: { fr: 'je n\'ai pas le temps', en: 'I don\'t have time' },
      },
    ],
    translate: [
      {
        answer: '我没有车',
        pinyin: 'wǒ méiyǒu chē',
        wrong: ['我不有车', '我有没车'],
        tr: { fr: 'je n\'ai pas de voiture', en: 'I don\'t have a car' },
      },
      {
        answer: '我有一个哥哥',
        pinyin: 'wǒ yǒu yí gè gēge',
        wrong: ['我是一个哥哥', '我在一个哥哥'],
        tr: { fr: 'j\'ai un grand frère', en: 'I have an older brother' },
      },
      {
        answer: '你有时间吗',
        pinyin: 'nǐ yǒu shíjiān ma',
        wrong: ['你不有时间吗', '你时间有吗'],
        tr: { fr: 'tu as le temps ?', en: 'do you have time?' },
      },
    ],
  },
  {
    id: 'zai',
    level: 1,
    title: { fr: '在 : le lieu', en: '在: location' },
    pattern: { fr: 'Sujet + 在 + lieu (+ verbe)', en: 'Subject + 在 + place (+ verb)' },
    explanation: [
      {
        fr: '在 (zài) veut dire « être à, se trouver à » : 我在家 = « je suis à la maison ». Ici, on n\'utilise pas 是.',
        en: '在 (zài) means "to be at, to be in": 我在家 = "I am at home". You don\'t use 是 here.',
      },
      {
        fr: 'Pour dire où se passe une action, tu mets 在 + lieu AVANT le verbe : 我在北京工作 = « je travaille à Pékin ».',
        en: 'To say where an action happens, put 在 + place BEFORE the verb: 我在北京工作 = "I work in Beijing".',
      },
      { fr: 'L\'ordre est donc : sujet, 在, lieu, puis verbe.', en: 'So the order is: subject, 在, place, then verb.' },
    ],
    examples: [
      { zh: '我在家。', pinyin: 'wǒ zài jiā', tr: { fr: 'je suis à la maison', en: 'I am at home' } },
      { zh: '他在学校。', pinyin: 'tā zài xuéxiào', tr: { fr: 'il est à l\'école', en: 'he is at school' } },
      { zh: '我在北京工作。', pinyin: 'wǒ zài Běijīng gōngzuò', tr: { fr: 'je travaille à Pékin', en: 'I work in Beijing' } },
      { zh: '你在哪儿？', pinyin: 'nǐ zài nǎr', tr: { fr: 'où es-tu ?', en: 'where are you?' } },
      {
        zh: '她在饭店吃饭。',
        pinyin: 'tā zài fàndiàn chīfàn',
        tr: { fr: 'elle mange au restaurant', en: 'she eats at the restaurant' },
      },
    ],
    pitfall: {
      fr: 'En français le lieu vient après le verbe (« je travaille à Pékin »), mais en chinois 在 + lieu se place avant le verbe : 我在北京工作.',
      en: 'In English the place comes after the verb ("I work in Beijing"), but in Chinese 在 + place goes before the verb: 我在北京工作.',
    },
    order: [
      {
        words: ['我', '在', '北京', '工作'],
        pinyin: 'wǒ zài Běijīng gōngzuò',
        tr: { fr: 'je travaille à Pékin', en: 'I work in Beijing' },
      },
      {
        words: ['他', '在', '家', '看', '书'],
        pinyin: 'tā zài jiā kàn shū',
        tr: { fr: 'il lit à la maison', en: 'he reads at home' },
      },
      { words: ['她', '在', '学校'], pinyin: 'tā zài xuéxiào', tr: { fr: 'elle est à l\'école', en: 'she is at school' } },
    ],
    fill: [
      {
        before: '我',
        after: '家',
        answer: '在',
        wrong: ['是', '很'],
        pinyin: 'wǒ zài jiā',
        tr: { fr: 'je suis à la maison', en: 'I am at home' },
      },
      {
        before: '我们',
        after: '学校学习汉语',
        answer: '在',
        wrong: ['是', '的'],
        pinyin: 'wǒmen zài xuéxiào xuéxí Hànyǔ',
        tr: { fr: 'nous apprenons le chinois à l\'école', en: 'we study Chinese at school' },
      },
      {
        before: '你',
        after: '哪儿',
        answer: '在',
        wrong: ['是', '有'],
        pinyin: 'nǐ zài nǎr',
        tr: { fr: 'où es-tu ?', en: 'where are you?' },
      },
    ],
    judge: [
      { zh: '他在家。', pinyin: 'tā zài jiā', ok: true, tr: { fr: 'il est à la maison', en: 'he is at home' } },
      {
        zh: '我工作在北京。',
        ok: false,
        fix: '我在北京工作。',
        fixPinyin: 'wǒ zài Běijīng gōngzuò',
        why: { fr: '在 + lieu se place avant le verbe.', en: '在 + place goes before the verb.' },
        tr: { fr: 'je travaille à Pékin', en: 'I work in Beijing' },
      },
      {
        zh: '妈妈在医院。',
        pinyin: 'māma zài yīyuàn',
        ok: true,
        tr: { fr: 'maman est à l\'hôpital', en: 'mom is at the hospital' },
      },
    ],
    translate: [
      {
        answer: '我在北京工作',
        pinyin: 'wǒ zài Běijīng gōngzuò',
        wrong: ['我工作在北京', '我是北京工作'],
        tr: { fr: 'je travaille à Pékin', en: 'I work in Beijing' },
      },
      {
        answer: '你在哪儿',
        pinyin: 'nǐ zài nǎr',
        wrong: ['你是哪儿', '哪儿你在'],
        tr: { fr: 'où es-tu ?', en: 'where are you?' },
      },
      {
        answer: '他在饭店吃饭',
        pinyin: 'tā zài fàndiàn chīfàn',
        wrong: ['他吃饭在饭店', '他是饭店吃饭'],
        tr: { fr: 'il mange au restaurant', en: 'he eats at the restaurant' },
      },
    ],
  },
  {
    id: 'ordre',
    level: 1,
    title: { fr: 'L\'ordre de la phrase', en: 'Word order' },
    pattern: { fr: 'Sujet + temps + lieu + verbe + objet', en: 'Subject + time + place + verb + object' },
    explanation: [
      {
        fr: 'En chinois, le moment (aujourd\'hui, demain, le soir) et le lieu se placent AVANT le verbe, jamais à la fin comme en français.',
        en: 'In Chinese, the time (today, tomorrow, in the evening) and the place come BEFORE the verb, never at the end as in English.',
      },
      {
        fr: 'L\'ordre de base est : sujet, temps, lieu, verbe, objet. Par exemple 他今天在家看书 = « il lit à la maison aujourd\'hui ».',
        en: 'The basic order is: subject, time, place, verb, object. For example, 他今天在家看书 = "he is reading at home today".',
      },
      {
        fr: 'Le mot de temps peut aussi aller tout au début, avant le sujet : 明天我去北京.',
        en: 'The time word can also go at the very beginning, before the subject: 明天我去北京.',
      },
    ],
    examples: [
      {
        zh: '我明天去北京。',
        pinyin: 'wǒ míngtiān qù Běijīng',
        tr: { fr: 'je vais à Pékin demain', en: 'I\'m going to Beijing tomorrow' },
      },
      {
        zh: '他今天在家看书。',
        pinyin: 'tā jīntiān zài jiā kàn shū',
        tr: { fr: 'aujourd\'hui, il lit à la maison', en: 'today, he is reading at home' },
      },
      {
        zh: '我们晚上在饭店吃饭。',
        pinyin: 'wǒmen wǎnshang zài fàndiàn chīfàn',
        tr: { fr: 'ce soir, nous mangeons au restaurant', en: 'tonight, we are eating at a restaurant' },
      },
      {
        zh: '明天我去学校。',
        pinyin: 'míngtiān wǒ qù xuéxiào',
        tr: { fr: 'demain, je vais à l\'école', en: 'tomorrow, I\'m going to school' },
      },
    ],
    pitfall: {
      fr: 'Le francophone met le moment à la fin (我去北京明天), alors qu\'en chinois il vient avant le verbe : 我明天去北京.',
      en: 'English speakers put the time at the end (我去北京明天), but in Chinese it comes before the verb: 我明天去北京.',
    },
    order: [
      {
        words: ['我', '明天', '去', '北京'],
        pinyin: 'wǒ míngtiān qù Běijīng',
        alt: [['明天', '我', '去', '北京']],
        tr: { fr: 'je vais à Pékin demain', en: 'I\'m going to Beijing tomorrow' },
      },
      {
        words: ['他', '今天', '在', '家', '看', '书'],
        pinyin: 'tā jīntiān zài jiā kàn shū',
        alt: [['今天', '他', '在', '家', '看', '书']],
        tr: { fr: 'aujourd\'hui, il lit à la maison', en: 'today, he is reading at home' },
      },
      {
        words: ['我们', '晚上', '看', '电影'],
        pinyin: 'wǒmen wǎnshang kàn diànyǐng',
        alt: [['晚上', '我们', '看', '电影']],
        tr: { fr: 'ce soir, nous regardons un film', en: 'tonight, we are watching a film' },
      },
    ],
    fill: [
      {
        before: '他今天',
        after: '家工作',
        answer: '在',
        wrong: ['是', '有'],
        pinyin: 'tā jīntiān zài jiā gōngzuò',
        tr: { fr: 'aujourd\'hui, il travaille à la maison', en: 'today, he is working at home' },
      },
      {
        before: '我',
        after: '上午去医院',
        answer: '明天',
        wrong: ['的', '很'],
        pinyin: 'wǒ míngtiān shàngwǔ qù yīyuàn',
        tr: { fr: 'demain matin, je vais à l\'hôpital', en: 'tomorrow morning, I\'m going to the hospital' },
      },
      {
        before: '我们',
        after: '在家看电视',
        answer: '晚上',
        wrong: ['很', '吗'],
        pinyin: 'wǒmen wǎnshang zài jiā kàn diànshì',
        tr: { fr: 'le soir, nous regardons la télé à la maison', en: 'in the evening, we watch TV at home' },
      },
    ],
    judge: [
      {
        zh: '明天我去北京。',
        pinyin: 'míngtiān wǒ qù Běijīng',
        ok: true,
        tr: { fr: 'demain, je vais à Pékin', en: 'tomorrow, I\'m going to Beijing' },
      },
      {
        zh: '我去北京明天。',
        ok: false,
        fix: '我明天去北京。',
        fixPinyin: 'wǒ míngtiān qù Běijīng',
        why: {
          fr: 'Le moment se place avant le verbe, jamais à la fin.',
          en: 'The time goes before the verb, never at the end.',
        },
        tr: { fr: 'je vais à Pékin demain', en: 'I\'m going to Beijing tomorrow' },
      },
      {
        zh: '我看书在家。',
        ok: false,
        fix: '我在家看书。',
        fixPinyin: 'wǒ zài jiā kàn shū',
        why: { fr: 'Le lieu avec 在 se place avant le verbe.', en: 'The place with 在 goes before the verb.' },
        tr: { fr: 'je lis à la maison', en: 'I read at home' },
      },
    ],
    translate: [
      {
        answer: '我明天去北京',
        pinyin: 'wǒ míngtiān qù Běijīng',
        wrong: ['我去北京明天', '去北京我明天'],
        tr: { fr: 'je vais à Pékin demain', en: 'I\'m going to Beijing tomorrow' },
      },
      {
        answer: '他在家看书',
        pinyin: 'tā zài jiā kàn shū',
        wrong: ['他看书在家', '他家在看书'],
        tr: { fr: 'il lit à la maison', en: 'he reads at home' },
      },
      {
        answer: '我们今天晚上看电影',
        pinyin: 'wǒmen jīntiān wǎnshang kàn diànyǐng',
        wrong: ['我们看电影今天晚上', '看电影我们今天晚上'],
        tr: { fr: 'ce soir, nous regardons un film', en: 'tonight, we are watching a film' },
      },
    ],
  },
  {
    id: 'interrogatifs',
    level: 1,
    title: { fr: 'Mots interrogatifs', en: 'Question words' },
    pattern: { fr: '什么 · 谁 · 哪儿 · 几 à la place de la réponse', en: '什么 · 谁 · 哪儿 · 几 in place of the answer' },
    explanation: [
      {
        fr: 'Les mots interrogatifs sont : 什么 (shénme, quoi), 谁 (shéi, qui), 哪儿 (nǎr, où) et 几 (jǐ, combien, pour les petits nombres).',
        en: 'The question words are: 什么 (shénme, what), 谁 (shéi, who), 哪儿 (nǎr, where) and 几 (jǐ, how many, for small numbers).',
      },
      {
        fr: 'Tu ne les mets pas au début de la phrase : tu les places exactement là où sera la réponse. 你去哪儿 ? → 我去北京.',
        en: 'You don\'t put them at the start of the sentence: put them exactly where the answer will be. 你去哪儿? → 我去北京.',
      },
      {
        fr: 'Avec un mot interrogatif, on n\'ajoute pas 吗 à la fin.',
        en: 'With a question word, you don\'t add 吗 at the end.',
      },
    ],
    examples: [
      {
        zh: '你叫什么名字？',
        pinyin: 'nǐ jiào shénme míngzi',
        tr: { fr: 'comment tu t\'appelles ?', en: 'what\'s your name?' },
      },
      { zh: '他是谁？', pinyin: 'tā shì shéi', tr: { fr: 'qui est-ce ?', en: 'who is it?' } },
      { zh: '你去哪儿？', pinyin: 'nǐ qù nǎr', tr: { fr: 'où vas-tu ?', en: 'where are you going?' } },
      {
        zh: '你有几个孩子？',
        pinyin: 'nǐ yǒu jǐ gè háizi',
        tr: { fr: 'combien d\'enfants as-tu ?', en: 'how many children do you have?' },
      },
      { zh: '你喜欢什么？', pinyin: 'nǐ xǐhuan shénme', tr: { fr: 'qu\'est-ce que tu aimes ?', en: 'what do you like?' } },
    ],
    pitfall: {
      fr: 'En français le mot interrogatif vient en tête (« où vas-tu ? »), mais en chinois il reste à la place de la réponse : 你去哪儿 ?',
      en: 'In English the question word comes first ("where are you going?"), but in Chinese it stays in place of the answer: 你去哪儿?',
    },
    order: [
      {
        words: ['你', '叫', '什么', '名字'],
        pinyin: 'nǐ jiào shénme míngzi',
        tr: { fr: 'comment tu t\'appelles ?', en: 'what\'s your name?' },
      },
      { words: ['你', '去', '哪儿'], pinyin: 'nǐ qù nǎr', tr: { fr: 'où vas-tu ?', en: 'where are you going?' } },
      {
        words: ['你', '想', '吃', '什么'],
        pinyin: 'nǐ xiǎng chī shénme',
        tr: { fr: 'qu\'est-ce que tu veux manger ?', en: 'what do you want to eat?' },
      },
    ],
    fill: [
      {
        before: '你叫',
        after: '名字',
        answer: '什么',
        wrong: ['谁', '哪儿'],
        pinyin: 'nǐ jiào shénme míngzi',
        tr: { fr: 'comment tu t\'appelles ?', en: 'what\'s your name?' },
      },
      {
        before: '你家有',
        after: '个人',
        answer: '几',
        wrong: ['什么', '谁'],
        pinyin: 'nǐ jiā yǒu jǐ gè rén',
        tr: { fr: 'combien de personnes y a-t-il dans ta famille ?', en: 'how many people are there in your family?' },
      },
      {
        before: '你在',
        after: '',
        answer: '哪儿',
        wrong: ['谁', '几'],
        pinyin: 'nǐ zài nǎr',
        tr: { fr: 'où es-tu ?', en: 'where are you?' },
      },
    ],
    judge: [
      { zh: '她是谁？', pinyin: 'tā shì shéi', ok: true, tr: { fr: 'qui est-ce ?', en: 'who is it?' } },
      {
        zh: '什么你喜欢？',
        ok: false,
        fix: '你喜欢什么？',
        fixPinyin: 'nǐ xǐhuan shénme',
        why: {
          fr: 'Le mot interrogatif reste à la place de la réponse, ici après le verbe.',
          en: 'The question word stays in place of the answer, here after the verb.',
        },
        tr: { fr: 'qu\'est-ce que tu aimes ?', en: 'what do you like?' },
      },
      {
        zh: '你去哪儿吗？',
        ok: false,
        fix: '你去哪儿？',
        fixPinyin: 'nǐ qù nǎr',
        why: { fr: 'Avec un mot interrogatif, on n\'ajoute pas 吗.', en: 'With a question word, you don\'t add 吗.' },
        tr: { fr: 'où vas-tu ?', en: 'where are you going?' },
      },
    ],
    translate: [
      {
        answer: '你去哪儿',
        pinyin: 'nǐ qù nǎr',
        wrong: ['哪儿你去', '你去哪儿吗'],
        tr: { fr: 'où vas-tu ?', en: 'where are you going?' },
      },
      {
        answer: '你吃什么',
        pinyin: 'nǐ chī shénme',
        wrong: ['什么你吃', '你吃什么吗'],
        tr: { fr: 'qu\'est-ce que tu manges ?', en: 'what are you eating?' },
      },
      { answer: '这是谁', pinyin: 'zhè shì shéi', wrong: ['谁这是', '这是谁吗'], tr: { fr: 'qui est-ce ?', en: 'who is it?' } },
    ],
  },
  {
    id: 'ne',
    level: 1,
    title: { fr: '呢 : « et toi ? »', en: '呢: "and you?"' },
    pattern: { fr: '… 呢 ?', en: '… 呢?' },
    explanation: [
      {
        fr: 'Après une réponse, tu peux renvoyer la même question avec juste un nom + 呢 : 我很好，你呢 ? veut dire « je vais bien, et toi ? ».',
        en: 'After an answer, you can bounce the same question back with just a noun + 呢: 我很好，你呢? means "I\'m fine, and you?".',
      },
      {
        fr: 'Seul après un nom, 呢 sert aussi à demander où est quelque chose : 我的手机呢 ? veut dire « où est mon téléphone ? ».',
        en: 'On its own after a noun, 呢 also asks where something is: 我的手机呢? means "where is my phone?".',
      },
      {
        fr: 'On ne met jamais 吗 avec 呢 : la question est déjà posée par 呢.',
        en: 'Never use 吗 together with 呢: 呢 already makes the question.',
      },
    ],
    examples: [
      { zh: '我很好，你呢？', pinyin: 'wǒ hěn hǎo nǐ ne', tr: { fr: 'je vais bien, et toi', en: 'I\'m fine, and you' } },
      {
        zh: '我是法国人，你呢？',
        pinyin: 'wǒ shì Fǎguórén nǐ ne',
        tr: { fr: 'je suis français, et toi', en: 'I\'m French, and you' },
      },
      { zh: '我的手机呢？', pinyin: 'wǒ de shǒujī ne', tr: { fr: 'où est mon téléphone', en: 'where is my phone' } },
      { zh: '妈妈呢？', pinyin: 'māma ne', tr: { fr: 'où est maman', en: 'where is mom' } },
    ],
    pitfall: {
      fr: 'On ajoute souvent 吗 après 呢, alors que 呢 suffit à faire la question.',
      en: 'People often add 吗 after 呢, but 呢 alone is enough to make the question.',
    },
    order: [
      {
        words: ['我', '的', '手机', '呢'],
        pinyin: 'wǒ de shǒujī ne',
        tr: { fr: 'où est mon téléphone', en: 'where is my phone' },
      },
      {
        words: ['你', '的', '朋友', '呢'],
        pinyin: 'nǐ de péngyou ne',
        tr: { fr: 'où est ton ami', en: 'where is your friend' },
      },
      {
        words: ['我', '喜欢', '茶', '你', '呢'],
        pinyin: 'wǒ xǐhuan chá nǐ ne',
        tr: { fr: 'j\'aime le thé, et toi', en: 'I like tea, and you' },
      },
    ],
    fill: [
      {
        before: '我的书',
        after: '',
        answer: '呢',
        wrong: ['了', '得'],
        pinyin: 'wǒ de shū ne',
        tr: { fr: 'où est mon livre', en: 'where is my book' },
      },
      {
        before: '你的手机',
        after: '',
        answer: '呢',
        wrong: ['了', '得'],
        pinyin: 'nǐ de shǒujī ne',
        tr: { fr: 'où est ton téléphone', en: 'where is your phone' },
      },
      {
        before: '爸爸',
        after: '',
        answer: '呢',
        wrong: ['很', '得'],
        pinyin: 'bàba ne',
        tr: { fr: 'où est papa', en: 'where is dad' },
      },
    ],
    judge: [
      {
        zh: '我很好，你呢？',
        pinyin: 'wǒ hěn hǎo nǐ ne',
        ok: true,
        tr: { fr: 'je vais bien, et toi', en: 'I\'m fine, and you' },
      },
      {
        zh: '你呢吗？',
        ok: false,
        fix: '你呢？',
        fixPinyin: 'nǐ ne',
        why: { fr: 'On ne met pas 吗 après 呢.', en: 'You don\'t put 吗 after 呢.' },
        tr: { fr: 'et toi', en: 'and you' },
      },
      {
        zh: '呢你？',
        ok: false,
        fix: '你呢？',
        fixPinyin: 'nǐ ne',
        why: {
          fr: '呢 se place après le nom, à la fin de la phrase.',
          en: '呢 goes after the noun, at the end of the sentence.',
        },
        tr: { fr: 'et toi', en: 'and you' },
      },
    ],
    translate: [
      {
        answer: '我很好你呢',
        pinyin: 'wǒ hěn hǎo nǐ ne',
        wrong: ['我很好你吗', '你很好我呢'],
        tr: { fr: 'je vais bien, et toi ?', en: 'I\'m fine, and you?' },
      },
      {
        answer: '我的书呢',
        pinyin: 'wǒ de shū ne',
        wrong: ['我的书吗', '你的书呢'],
        tr: { fr: 'où est mon livre ?', en: 'where is my book?' },
      },
      { answer: '爸爸呢', pinyin: 'bàba ne', wrong: ['爸爸吗', '妈妈呢'], tr: { fr: 'où est papa ?', en: 'where is dad?' } },
    ],
  },
  {
    id: 'ye-dou',
    level: 1,
    title: { fr: '也 et 都', en: '也 and 都' },
    pattern: { fr: 'Sujet + 也 / 都 + verbe', en: 'Subject + 也 / 都 + verb' },
    explanation: [
      {
        fr: '也 veut dire « aussi » et 都 veut dire « tous » ou « tout ». Les deux se placent toujours après le sujet et avant le verbe : 我也是学生, 我们都喜欢茶.',
        en: '也 means "also" and 都 means "all" or "both". Both always go after the subject and before the verb: 我也是学生, 我们都喜欢茶.',
      },
      {
        fr: 'Si tu as besoin des deux, l\'ordre est toujours 也都 : 他们也都去北京.',
        en: 'If you need both, the order is always 也都: 他们也都去北京.',
      },
    ],
    examples: [
      { zh: '我也是学生。', pinyin: 'wǒ yě shì xuésheng', tr: { fr: 'je suis aussi étudiant', en: 'I am also a student' } },
      { zh: '我们都喜欢茶。', pinyin: 'wǒmen dōu xǐhuan chá', tr: { fr: 'nous aimons tous le thé', en: 'we all like tea' } },
      { zh: '她也很高兴。', pinyin: 'tā yě hěn gāoxìng', tr: { fr: 'elle aussi est contente', en: 'she is happy too' } },
      {
        zh: '他们也都去北京。',
        pinyin: 'tāmen yě dōu qù Běijīng',
        tr: { fr: 'eux aussi vont tous à Pékin', en: 'they are all going to Beijing too' },
      },
    ],
    pitfall: {
      fr: 'On met 也 devant le sujet comme « moi aussi » en français, alors qu\'il faut dire 我也去 et jamais 也我去.',
      en: 'English puts "too" at the end and "also" can even start a sentence, but 也 always goes right after the subject: 我也去, never 也我去.',
    },
    order: [
      {
        words: ['我', '也', '是', '学生'],
        pinyin: 'wǒ yě shì xuésheng',
        tr: { fr: 'je suis aussi étudiant', en: 'I am also a student' },
      },
      {
        words: ['我们', '都', '喜欢', '茶'],
        pinyin: 'wǒmen dōu xǐhuan chá',
        tr: { fr: 'nous aimons tous le thé', en: 'we all like tea' },
      },
      {
        words: ['他们', '也', '都', '去', '北京'],
        pinyin: 'tāmen yě dōu qù Běijīng',
        tr: { fr: 'eux aussi vont tous à Pékin', en: 'they are all going to Beijing too' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '是老师',
        answer: '也',
        wrong: ['吗', '呢'],
        pinyin: 'wǒ yě shì lǎoshī',
        tr: { fr: 'je suis aussi professeur', en: 'I am also a teacher' },
      },
      {
        before: '他们',
        after: '是中国人',
        answer: '都',
        wrong: ['吗', '呢'],
        pinyin: 'tāmen dōu shì Zhōngguó rén',
        tr: { fr: 'ils sont tous chinois', en: 'they are all Chinese' },
      },
      {
        before: '我们',
        after: '喜欢猫',
        answer: '也都',
        wrong: ['都也', '也也'],
        pinyin: 'wǒmen yě dōu xǐhuan māo',
        tr: { fr: 'nous aussi, nous aimons tous les chats', en: 'we all like cats too' },
      },
    ],
    judge: [
      {
        zh: '我也喜欢猫。',
        pinyin: 'wǒ yě xǐhuan māo',
        ok: true,
        tr: { fr: 'moi aussi j\'aime les chats', en: 'I like cats too' },
      },
      {
        zh: '也我喜欢猫。',
        ok: false,
        fix: '我也喜欢猫。',
        fixPinyin: 'wǒ yě xǐhuan māo',
        why: { fr: '也 se place après le sujet, devant le verbe.', en: '也 goes after the subject, before the verb.' },
        tr: { fr: 'moi aussi j\'aime les chats', en: 'I like cats too' },
      },
      {
        zh: '我们都也是学生。',
        ok: false,
        fix: '我们也都是学生。',
        fixPinyin: 'wǒmen yě dōu shì xuésheng',
        why: { fr: 'L\'ordre est toujours 也都.', en: 'The order is always 也都.' },
        tr: { fr: 'nous aussi sommes tous étudiants', en: 'we are all students too' },
      },
    ],
    translate: [
      {
        answer: '我也喝茶',
        pinyin: 'wǒ yě hē chá',
        wrong: ['也我喝茶', '我喝也茶'],
        tr: { fr: 'moi aussi je bois du thé', en: 'I drink tea too' },
      },
      {
        answer: '我们都是学生',
        pinyin: 'wǒmen dōu shì xuésheng',
        wrong: ['都我们是学生', '我们是都学生'],
        tr: { fr: 'nous sommes tous étudiants', en: 'we are all students' },
      },
      {
        answer: '他们也都来',
        pinyin: 'tāmen yě dōu lái',
        wrong: ['他们都也来', '也他们都来'],
        tr: { fr: 'eux aussi viennent tous', en: 'they are all coming too' },
      },
    ],
  },
  {
    id: 'xiang-yao',
    level: 1,
    title: { fr: '想 et 要 : vouloir', en: '想 and 要: to want' },
    pattern: { fr: '想 / 要 + verbe', en: '想 / 要 + verb' },
    explanation: [
      {
        fr: '想 + verbe veut dire « avoir envie de » ou « aimerait » : 我想喝水. 要 + verbe est plus ferme : « vouloir » ou « aller faire » : 我要去北京.',
        en: '想 + verb means "to feel like" or "would like": 我想喝水. 要 + verb is firmer: "to want" or "to be going to": 我要去北京.',
      },
      {
        fr: 'Les deux se placent après le sujet, juste devant le verbe.',
        en: 'Both go after the subject, right before the verb.',
      },
      {
        fr: 'Pour dire « je ne veux pas », on dit 不想 : 我不想去. 不要 sert surtout à interdire : « ne… pas ».',
        en: 'To say "I don\'t want to", you say 不想: 我不想去. 不要 is mostly used to forbid: "don\'t".',
      },
    ],
    examples: [
      {
        zh: '我想喝水。',
        pinyin: 'wǒ xiǎng hē shuǐ',
        tr: { fr: 'j\'ai envie de boire de l\'eau', en: 'I\'d like to drink some water' },
      },
      {
        zh: '你想吃什么？',
        pinyin: 'nǐ xiǎng chī shénme',
        tr: { fr: 'qu\'est-ce que tu as envie de manger', en: 'what do you feel like eating' },
      },
      { zh: '我要去北京。', pinyin: 'wǒ yào qù Běijīng', tr: { fr: 'je vais aller à Pékin', en: 'I\'m going to Beijing' } },
      {
        zh: '我不想去。',
        pinyin: 'wǒ bù xiǎng qù',
        tr: { fr: 'je n\'ai pas envie d\'y aller', en: 'I don\'t feel like going' },
      },
    ],
    pitfall: {
      fr: 'On dit 我不要去 pour « je ne veux pas y aller », alors que la forme naturelle est 我不想去.',
      en: 'People say 我不要去 for "I don\'t want to go", but the natural way is 我不想去.',
    },
    order: [
      {
        words: ['我', '想', '喝', '水'],
        pinyin: 'wǒ xiǎng hē shuǐ',
        tr: { fr: 'j\'ai envie de boire de l\'eau', en: 'I\'d like to drink some water' },
      },
      {
        words: ['你', '想', '吃', '什么'],
        pinyin: 'nǐ xiǎng chī shénme',
        tr: { fr: 'qu\'est-ce que tu as envie de manger', en: 'what do you feel like eating' },
      },
      {
        words: ['我', '明天', '要', '去', '北京'],
        pinyin: 'wǒ míngtiān yào qù Běijīng',
        alt: [['明天', '我', '要', '去', '北京']],
        tr: { fr: 'demain je vais à Pékin', en: 'tomorrow I\'m going to Beijing' },
      },
    ],
    fill: [
      {
        before: '你',
        after: '吃什么',
        answer: '想',
        wrong: ['的', '了'],
        pinyin: 'nǐ xiǎng chī shénme',
        tr: { fr: 'qu\'est-ce que tu as envie de manger', en: 'what do you feel like eating' },
      },
      {
        before: '我',
        after: '喝水',
        answer: '想',
        wrong: ['很', '是'],
        pinyin: 'wǒ xiǎng hē shuǐ',
        tr: { fr: 'j\'ai envie de boire de l\'eau', en: 'I\'d like to drink some water' },
      },
      {
        before: '我',
        after: '买书',
        answer: '要',
        wrong: ['很', '的'],
        pinyin: 'wǒ yào mǎi shū',
        tr: { fr: 'je veux acheter des livres', en: 'I want to buy some books' },
      },
    ],
    judge: [
      {
        zh: '我想喝茶。',
        pinyin: 'wǒ xiǎng hē chá',
        ok: true,
        tr: { fr: 'j\'ai envie de boire du thé', en: 'I\'d like to drink some tea' },
      },
      {
        zh: '我去想北京。',
        ok: false,
        fix: '我想去北京。',
        fixPinyin: 'wǒ xiǎng qù Běijīng',
        why: { fr: '想 se place devant le verbe : 想去, pas 去想.', en: '想 goes before the verb: 想去, not 去想.' },
        tr: { fr: 'j\'ai envie d\'aller à Pékin', en: 'I\'d like to go to Beijing' },
      },
      {
        zh: '我要去中国。',
        pinyin: 'wǒ yào qù Zhōngguó',
        ok: true,
        tr: { fr: 'je vais aller en Chine', en: 'I\'m going to China' },
      },
    ],
    translate: [
      {
        answer: '我不想吃',
        pinyin: 'wǒ bù xiǎng chī',
        wrong: ['我想没吃', '我不吃想'],
        tr: { fr: 'je n\'ai pas envie de manger', en: 'I don\'t feel like eating' },
      },
      {
        answer: '我想睡觉',
        pinyin: 'wǒ xiǎng shuìjiào',
        wrong: ['我睡觉想', '想我睡觉'],
        tr: { fr: 'j\'ai envie de dormir', en: 'I\'d like to sleep' },
      },
      {
        answer: '你要喝什么',
        pinyin: 'nǐ yào hē shénme',
        wrong: ['你喝什么要', '你要什么喝'],
        tr: { fr: 'qu\'est-ce que tu veux boire ?', en: 'what do you want to drink?' },
      },
    ],
  },
  {
    id: 'hui-neng',
    level: 1,
    title: { fr: '会 et 能', en: '会 and 能' },
    pattern: { fr: '会 / 能 + verbe', en: '会 / 能 + verb' },
    explanation: [
      {
        fr: '会 + verbe veut dire « savoir faire » quelque chose qu\'on a appris : 我会说汉语, 他会游泳.',
        en: '会 + verb means "can" in the sense of a skill you have learned: 我会说汉语, 他会游泳.',
      },
      {
        fr: '能 + verbe veut dire « pouvoir » : on en est capable ou on a la permission : 你能来吗 ?',
        en: '能 + verb means "can" in the sense of being able to or being allowed to: 你能来吗?',
      },
      { fr: 'La négation 不 se place devant : 不会, 不能.', en: 'The negative 不 goes in front: 不会, 不能.' },
    ],
    examples: [
      { zh: '我会说汉语。', pinyin: 'wǒ huì shuō Hànyǔ', tr: { fr: 'je sais parler chinois', en: 'I can speak Chinese' } },
      { zh: '她会做饭。', pinyin: 'tā huì zuò fàn', tr: { fr: 'elle sait cuisiner', en: 'she can cook' } },
      { zh: '你能来吗？', pinyin: 'nǐ néng lái ma', tr: { fr: 'tu peux venir', en: 'can you come' } },
      {
        zh: '我今天不能去。',
        pinyin: 'wǒ jīntiān bù néng qù',
        tr: { fr: 'je ne peux pas y aller aujourd\'hui', en: 'I can\'t go today' },
      },
    ],
    pitfall: {
      fr: 'Pour une chose apprise comme une langue ou la nage, on utilise 能 au lieu de 会.',
      en: 'English uses "can" for everything, so people use 能 for a learned skill like a language or swimming, where Chinese uses 会.',
    },
    order: [
      {
        words: ['我', '会', '说', '汉语'],
        pinyin: 'wǒ huì shuō Hànyǔ',
        tr: { fr: 'je sais parler chinois', en: 'I can speak Chinese' },
      },
      { words: ['你', '能', '来', '吗'], pinyin: 'nǐ néng lái ma', tr: { fr: 'tu peux venir', en: 'can you come' } },
      {
        words: ['我', '今天', '不', '能', '去'],
        pinyin: 'wǒ jīntiān bù néng qù',
        alt: [['今天', '我', '不', '能', '去']],
        tr: { fr: 'je ne peux pas y aller aujourd\'hui', en: 'I can\'t go today' },
      },
    ],
    fill: [
      {
        before: '他',
        after: '说汉语',
        answer: '会',
        wrong: ['是', '很'],
        pinyin: 'tā huì shuō Hànyǔ',
        tr: { fr: 'il sait parler chinois', en: 'he can speak Chinese' },
      },
      {
        before: '我明天不',
        after: '来',
        answer: '能',
        wrong: ['很', '吗'],
        pinyin: 'wǒ míngtiān bù néng lái',
        tr: { fr: 'je ne peux pas venir demain', en: 'I can\'t come tomorrow' },
      },
      {
        before: '你',
        after: '游泳吗',
        answer: '会',
        wrong: ['很', '是'],
        pinyin: 'nǐ huì yóuyǒng ma',
        tr: { fr: 'tu sais nager', en: 'can you swim' },
      },
    ],
    judge: [
      {
        zh: '我会说汉语。',
        pinyin: 'wǒ huì shuō Hànyǔ',
        ok: true,
        tr: { fr: 'je sais parler chinois', en: 'I can speak Chinese' },
      },
      {
        zh: '我会不说汉语。',
        ok: false,
        fix: '我不会说汉语。',
        fixPinyin: 'wǒ bú huì shuō Hànyǔ',
        why: { fr: '不 se place devant 会.', en: '不 goes before 会.' },
        tr: { fr: 'je ne sais pas parler chinois', en: 'I can\'t speak Chinese' },
      },
      { zh: '你能来吗？', pinyin: 'nǐ néng lái ma', ok: true, tr: { fr: 'tu peux venir', en: 'can you come' } },
    ],
    translate: [
      {
        answer: '我会说汉语',
        pinyin: 'wǒ huì shuō Hànyǔ',
        wrong: ['我说会汉语', '会我说汉语'],
        tr: { fr: 'je sais parler chinois', en: 'I can speak Chinese' },
      },
      {
        answer: '我不能来',
        pinyin: 'wǒ bù néng lái',
        wrong: ['我能没来', '我不来能'],
        tr: { fr: 'je ne peux pas venir', en: 'I can\'t come' },
      },
      {
        answer: '他不会游泳',
        pinyin: 'tā bú huì yóuyǒng',
        wrong: ['他会不游泳', '他不游泳会'],
        tr: { fr: 'il ne sait pas nager', en: 'he can\'t swim' },
      },
    ],
  },
  {
    id: 'tai-le',
    level: 1,
    title: { fr: '太…了', en: '太…了' },
    pattern: { fr: '太 + adjectif + 了', en: '太 + adjective + 了' },
    explanation: [
      {
        fr: '太 + adjectif + 了 veut dire « trop » ou « tellement » : 太贵了, « c\'est trop cher », 太好了, « c\'est super ».',
        en: '太 + adjective + 了 means "too" or "so": 太贵了, "it\'s too expensive", 太好了, "that\'s great".',
      },
      {
        fr: 'Pour dire « pas très », on dit 不太 + adjectif, sans 了 : 这个不太好.',
        en: 'For "not very", say 不太 + adjective, without 了: 这个不太好.',
      },
    ],
    examples: [
      { zh: '太好了。', pinyin: 'tài hǎo le', tr: { fr: 'c\'est super', en: 'that\'s great' } },
      { zh: '这个太贵了。', pinyin: 'zhège tài guì le', tr: { fr: 'c\'est trop cher', en: 'it\'s too expensive' } },
      {
        zh: '今天太热了。',
        pinyin: 'jīntiān tài rè le',
        tr: { fr: 'il fait trop chaud aujourd\'hui', en: 'it\'s too hot today' },
      },
      { zh: '这个不太好。', pinyin: 'zhège bú tài hǎo', tr: { fr: 'ce n\'est pas très bien', en: 'it\'s not very good' } },
    ],
    pitfall: {
      fr: 'On ajoute 了 après 不太 + adjectif, alors que « pas très » se dit sans 了.',
      en: 'People add 了 after 不太 + adjective, but "not very" is said without 了.',
    },
    order: [
      {
        words: ['今天', '太', '热', '了'],
        pinyin: 'jīntiān tài rè le',
        tr: { fr: 'il fait trop chaud aujourd\'hui', en: 'it\'s too hot today' },
      },
      {
        words: ['这个', '太', '贵', '了'],
        pinyin: 'zhège tài guì le',
        tr: { fr: 'c\'est trop cher', en: 'it\'s too expensive' },
      },
      {
        words: ['我', '太', '高兴', '了'],
        pinyin: 'wǒ tài gāoxìng le',
        tr: { fr: 'je suis tellement content', en: 'I\'m so happy' },
      },
    ],
    fill: [
      {
        before: '这个太贵',
        after: '',
        answer: '了',
        wrong: ['很', '得'],
        pinyin: 'zhège tài guì le',
        tr: { fr: 'c\'est trop cher', en: 'it\'s too expensive' },
      },
      {
        before: '今天',
        after: '冷了',
        answer: '太',
        wrong: ['吗', '的'],
        pinyin: 'jīntiān tài lěng le',
        tr: { fr: 'il fait trop froid aujourd\'hui', en: 'it\'s too cold today' },
      },
      {
        before: '这个菜',
        after: '好吃',
        answer: '不太',
        wrong: ['不了', '了不'],
        pinyin: 'zhège cài bú tài hǎochī',
        tr: { fr: 'ce plat n\'est pas très bon', en: 'this dish isn\'t very tasty' },
      },
    ],
    judge: [
      {
        zh: '今天太热了。',
        pinyin: 'jīntiān tài rè le',
        ok: true,
        tr: { fr: 'il fait trop chaud aujourd\'hui', en: 'it\'s too hot today' },
      },
      {
        zh: '这个不太贵了。',
        ok: false,
        fix: '这个不太贵。',
        fixPinyin: 'zhège bú tài guì',
        why: { fr: 'Avec 不太, on ne met pas 了.', en: 'With 不太, you don\'t use 了.' },
        tr: { fr: 'ce n\'est pas très cher', en: 'it\'s not very expensive' },
      },
      {
        zh: '我太高兴了。',
        pinyin: 'wǒ tài gāoxìng le',
        ok: true,
        tr: { fr: 'je suis tellement content', en: 'I\'m so happy' },
      },
    ],
    translate: [
      {
        answer: '太贵了',
        pinyin: 'tài guì le',
        wrong: ['贵太了', '太了贵'],
        tr: { fr: 'c\'est trop cher', en: 'it\'s too expensive' },
      },
      {
        answer: '不太好',
        pinyin: 'bú tài hǎo',
        wrong: ['太不好了', '不好太'],
        tr: { fr: 'pas très bien', en: 'not very good' },
      },
      {
        answer: '今天太冷了',
        pinyin: 'jīntiān tài lěng le',
        wrong: ['今天冷太了', '太今天冷了'],
        tr: { fr: 'il fait trop froid aujourd\'hui', en: 'it\'s too cold today' },
      },
    ],
  },
  {
    id: 'le',
    level: 1,
    title: { fr: '了 : action accomplie', en: '了: completed action' },
    pattern: { fr: 'Verbe + 了', en: 'Verb + 了' },
    explanation: [
      {
        fr: '了 après le verbe (ou en fin de phrase) indique qu\'une action est accomplie : 他来了, « il est venu ». 我买了一本书, « j\'ai acheté un livre ».',
        en: '了 after the verb (or at the end of the sentence) shows that an action is completed: 他来了, "he came". 我买了一本书, "I bought a book".',
      },
      {
        fr: '了 n\'est pas un temps du passé : il marque le fait que l\'action a eu lieu.',
        en: '了 is not a past tense: it marks that the action happened.',
      },
      {
        fr: 'Pour dire qu\'une action n\'a pas eu lieu, on utilise 没 + verbe et on enlève 了 : 我没去.',
        en: 'To say that an action did not happen, use 没 + verb and drop 了: 我没去.',
      },
    ],
    examples: [
      { zh: '他来了。', pinyin: 'tā lái le', tr: { fr: 'il est venu', en: 'he came' } },
      { zh: '我买了一本书。', pinyin: 'wǒ mǎi le yì běn shū', tr: { fr: 'j\'ai acheté un livre', en: 'I bought a book' } },
      {
        zh: '我喝了两杯茶。',
        pinyin: 'wǒ hē le liǎng bēi chá',
        tr: { fr: 'j\'ai bu deux tasses de thé', en: 'I drank two cups of tea' },
      },
      { zh: '妈妈回家了。', pinyin: 'māma huí jiā le', tr: { fr: 'maman est rentrée à la maison', en: 'mom went home' } },
    ],
    pitfall: {
      fr: 'On garde 了 dans la négation, alors qu\'on dit 我没去 et jamais 我没去了.',
      en: 'People keep 了 in the negative, but you say 我没去, never 我没去了.',
    },
    order: [
      { words: ['他', '来', '了'], pinyin: 'tā lái le', tr: { fr: 'il est venu', en: 'he came' } },
      {
        words: ['我', '的', '朋友', '来', '了'],
        pinyin: 'wǒ de péngyou lái le',
        tr: { fr: 'mon ami est venu', en: 'my friend came' },
      },
      {
        words: ['妈妈', '回', '家', '了'],
        pinyin: 'māma huí jiā le',
        alt: [['妈妈', '回', '了', '家']],
        tr: { fr: 'maman est rentrée à la maison', en: 'mom went home' },
      },
    ],
    fill: [
      {
        before: '我买',
        after: '一本书',
        answer: '了',
        wrong: ['吗', '得'],
        pinyin: 'wǒ mǎi le yì běn shū',
        tr: { fr: 'j\'ai acheté un livre', en: 'I bought a book' },
      },
      {
        before: '他来',
        after: '',
        answer: '了',
        wrong: ['得', '很'],
        pinyin: 'tā lái le',
        tr: { fr: 'il est venu', en: 'he came' },
      },
      {
        before: '我昨天',
        after: '去',
        answer: '没',
        wrong: ['不', '了'],
        pinyin: 'wǒ zuótiān méi qù',
        tr: { fr: 'je n\'y suis pas allé hier', en: 'I didn\'t go yesterday' },
      },
    ],
    judge: [
      {
        zh: '我买了一本书。',
        pinyin: 'wǒ mǎi le yì běn shū',
        ok: true,
        tr: { fr: 'j\'ai acheté un livre', en: 'I bought a book' },
      },
      {
        zh: '我没去了。',
        ok: false,
        fix: '我没去。',
        fixPinyin: 'wǒ méi qù',
        why: { fr: 'Avec 没, on enlève 了.', en: 'With 没, you drop 了.' },
        tr: { fr: 'je n\'y suis pas allé', en: 'I didn\'t go' },
      },
      { zh: '他来了。', pinyin: 'tā lái le', ok: true, tr: { fr: 'il est venu', en: 'he came' } },
    ],
    translate: [
      {
        answer: '我去北京了',
        pinyin: 'wǒ qù Běijīng le',
        wrong: ['我没去北京', '我要去北京'],
        tr: { fr: 'je suis allé à Pékin', en: 'I went to Beijing' },
      },
      { answer: '他来了', pinyin: 'tā lái le', wrong: ['他没来', '他不来'], tr: { fr: 'il est venu', en: 'he came' } },
      {
        answer: '我没吃',
        pinyin: 'wǒ méi chī',
        wrong: ['我没吃了', '我不吃了'],
        tr: { fr: 'je n\'ai pas mangé', en: 'I didn\'t eat' },
      },
    ],
  },
  {
    id: 'mei',
    level: 1,
    title: { fr: '没 : ne pas avoir fait', en: '没: didn\'t' },
    pattern: { fr: '没 + verbe', en: '没 + verb' },
    explanation: [
      {
        fr: 'Pour dire qu\'une action n\'a pas eu lieu, on met 没 (ou 没有) devant le verbe : 我没去, « je n\'y suis pas allé ».',
        en: 'To say that an action did not happen, put 没 (or 没有) before the verb: 我没去, "I didn\'t go".',
      },
      {
        fr: 'On n\'ajoute jamais 了 avec 没. Et 不 ne sert pas pour le passé : 不 parle d\'habitude ou de volonté.',
        en: 'You never add 了 with 没. And 不 is not for the past: 不 is about habits or will.',
      },
    ],
    examples: [
      { zh: '我没去。', pinyin: 'wǒ méi qù', tr: { fr: 'je n\'y suis pas allé', en: 'I didn\'t go' } },
      {
        zh: '他昨天没来。',
        pinyin: 'tā zuótiān méi lái',
        tr: { fr: 'il n\'est pas venu hier', en: 'he didn\'t come yesterday' },
      },
      {
        zh: '她没买书。',
        pinyin: 'tā méi mǎi shū',
        tr: { fr: 'elle n\'a pas acheté de livre', en: 'she didn\'t buy a book' },
      },
      {
        zh: '我没有看电影。',
        pinyin: 'wǒ méiyǒu kàn diànyǐng',
        tr: { fr: 'je n\'ai pas regardé de film', en: 'I didn\'t watch a film' },
      },
    ],
    pitfall: {
      fr: 'On utilise 不 pour une action passée, alors qu\'il faut 没 : 我昨天没去, pas 我昨天不去.',
      en: 'People use 不 for a past action, but you need 没: 我昨天没去, not 我昨天不去.',
    },
    order: [
      {
        words: ['他', '昨天', '没', '来'],
        pinyin: 'tā zuótiān méi lái',
        alt: [['昨天', '他', '没', '来']],
        tr: { fr: 'il n\'est pas venu hier', en: 'he didn\'t come yesterday' },
      },
      {
        words: ['我', '没', '看', '电影'],
        pinyin: 'wǒ méi kàn diànyǐng',
        tr: { fr: 'je n\'ai pas regardé de film', en: 'I didn\'t watch a film' },
      },
      {
        words: ['我', '今天', '没', '喝', '茶'],
        pinyin: 'wǒ jīntiān méi hē chá',
        alt: [['今天', '我', '没', '喝', '茶']],
        tr: { fr: 'je n\'ai pas bu de thé aujourd\'hui', en: 'I didn\'t drink tea today' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '去过中国',
        answer: '没',
        wrong: ['不', '了'],
        pinyin: 'wǒ méi qù guo Zhōngguó',
        tr: { fr: 'je ne suis jamais allé en Chine', en: 'I have never been to China' },
      },
      {
        before: '他昨天',
        after: '来',
        answer: '没',
        wrong: ['不', '了'],
        pinyin: 'tā zuótiān méi lái',
        tr: { fr: 'il n\'est pas venu hier', en: 'he didn\'t come yesterday' },
      },
      {
        before: '我昨天',
        after: '喝茶',
        answer: '没',
        wrong: ['不', '很'],
        pinyin: 'wǒ zuótiān méi hē chá',
        tr: { fr: 'je n\'ai pas bu de thé hier', en: 'I didn\'t drink tea yesterday' },
      },
    ],
    judge: [
      {
        zh: '我昨天没去。',
        pinyin: 'wǒ zuótiān méi qù',
        ok: true,
        tr: { fr: 'je n\'y suis pas allé hier', en: 'I didn\'t go yesterday' },
      },
      {
        zh: '我没去了。',
        ok: false,
        fix: '我没去。',
        fixPinyin: 'wǒ méi qù',
        why: { fr: 'On ne met jamais 了 avec 没.', en: 'You never use 了 with 没.' },
        tr: { fr: 'je n\'y suis pas allé', en: 'I didn\'t go' },
      },
      {
        zh: '我昨天不去。',
        ok: false,
        fix: '我昨天没去。',
        fixPinyin: 'wǒ zuótiān méi qù',
        why: {
          fr: 'Pour une action passée qui n\'a pas eu lieu, on utilise 没, pas 不.',
          en: 'For a past action that didn\'t happen, you use 没, not 不.',
        },
        tr: { fr: 'je n\'y suis pas allé hier', en: 'I didn\'t go yesterday' },
      },
    ],
    translate: [
      {
        answer: '我没去',
        pinyin: 'wǒ méi qù',
        wrong: ['我不去', '我去了'],
        tr: { fr: 'je ne suis pas allé', en: 'I didn\'t go' },
      },
      {
        answer: '他昨天没来',
        pinyin: 'tā zuótiān méi lái',
        wrong: ['他昨天不来', '他昨天来了'],
        tr: { fr: 'il n\'est pas venu hier', en: 'he didn\'t come yesterday' },
      },
      {
        answer: '我没买书',
        pinyin: 'wǒ méi mǎi shū',
        wrong: ['我不买书', '我买了书'],
        tr: { fr: 'je n\'ai pas acheté de livre', en: 'I didn\'t buy a book' },
      },
    ],
  },
  {
    id: 'guo',
    level: 2,
    title: { fr: '过 : l\'expérience', en: '过: experience' },
    pattern: { fr: 'Verbe + 过', en: 'Verb + 过' },
    explanation: [
      {
        fr: '过 se place juste après le verbe pour dire que tu as déjà fait quelque chose au moins une fois dans ta vie : 我去过北京 veut dire « je suis déjà allé à Pékin ».',
        en: '过 goes right after the verb to say that you have done something at least once in your life: 我去过北京 means "I have been to Beijing".',
      },
      {
        fr: 'Pour dire que tu ne l\'as jamais fait, mets 没 devant le verbe et garde 过 : 我没去过北京.',
        en: 'To say you have never done it, put 没 before the verb and keep 过: 我没去过北京.',
      },
    ],
    examples: [
      {
        zh: '我去过北京。',
        pinyin: 'wǒ qù guo Běijīng',
        tr: { fr: 'je suis déjà allé à Pékin', en: 'I have been to Beijing' },
      },
      {
        zh: '他吃过中国菜。',
        pinyin: 'tā chī guo Zhōngguó cài',
        tr: { fr: 'il a déjà mangé de la cuisine chinoise', en: 'he has eaten Chinese food' },
      },
      {
        zh: '我没看过这个电影。',
        pinyin: 'wǒ méi kàn guo zhège diànyǐng',
        tr: { fr: 'je n\'ai jamais vu ce film', en: 'I have never seen this film' },
      },
      {
        zh: '你学过汉语吗？',
        pinyin: 'nǐ xué guo Hànyǔ ma',
        tr: { fr: 'as-tu déjà étudié le chinois ?', en: 'have you ever studied Chinese?' },
      },
    ],
    pitfall: {
      fr: 'On dit souvent 不 + verbe + 过 par réflexe, mais la négation de 过 est toujours 没.',
      en: 'People often say 不 + verb + 过 by reflex, but the negative of 过 is always 没.',
    },
    order: [
      {
        words: ['我', '去', '过', '北京'],
        pinyin: 'wǒ qù guo Běijīng',
        tr: { fr: 'je suis déjà allé à Pékin', en: 'I have been to Beijing' },
      },
      {
        words: ['他', '没', '吃', '过', '米饭'],
        pinyin: 'tā méi chī guo mǐfàn',
        tr: { fr: 'il n\'a jamais mangé de riz', en: 'he has never eaten rice' },
      },
      {
        words: ['你', '看', '过', '这个', '电影', '吗'],
        pinyin: 'nǐ kàn guo zhège diànyǐng ma',
        tr: { fr: 'as-tu déjà vu ce film ?', en: 'have you ever seen this film?' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '去过中国',
        answer: '没',
        wrong: ['不', '了'],
        pinyin: 'wǒ méi qù guo Zhōngguó',
        tr: { fr: 'je ne suis jamais allé en Chine', en: 'I have never been to China' },
      },
      {
        before: '他学',
        after: '汉语',
        answer: '过',
        wrong: ['在', '吗'],
        pinyin: 'tā xué guo Hànyǔ',
        tr: { fr: 'il a déjà étudié le chinois', en: 'he has studied Chinese before' },
      },
      {
        before: '你见',
        after: '我的朋友吗',
        answer: '过',
        wrong: ['得', '很'],
        pinyin: 'nǐ jiàn guo wǒ de péngyou ma',
        tr: { fr: 'as-tu déjà rencontré mon ami ?', en: 'have you ever met my friend?' },
      },
    ],
    judge: [
      {
        zh: '我去过上海。',
        pinyin: 'wǒ qù guo Shànghǎi',
        ok: true,
        tr: { fr: 'je suis déjà allé à Shanghai', en: 'I have been to Shanghai' },
      },
      {
        zh: '我不去过北京。',
        ok: false,
        fix: '我没去过北京。',
        fixPinyin: 'wǒ méi qù guo Běijīng',
        why: { fr: 'Avec 过, la négation est 没, pas 不.', en: 'With 过, the negative is 没, not 不.' },
        tr: { fr: 'je ne suis jamais allé à Pékin', en: 'I have never been to Beijing' },
      },
      {
        zh: '他过吃中国菜。',
        ok: false,
        fix: '他吃过中国菜。',
        fixPinyin: 'tā chī guo Zhōngguó cài',
        why: { fr: '过 se place juste après le verbe.', en: '过 goes right after the verb.' },
        tr: { fr: 'il a déjà mangé de la cuisine chinoise', en: 'he has eaten Chinese food' },
      },
    ],
    translate: [
      {
        answer: '我去过中国',
        pinyin: 'wǒ qù guo Zhōngguó',
        wrong: ['我没去过中国', '我过去中国'],
        tr: { fr: 'je suis déjà allé en Chine', en: 'I have been to China' },
      },
      {
        answer: '他没学过汉语',
        pinyin: 'tā méi xué guo Hànyǔ',
        wrong: ['他不学过汉语', '他学过汉语'],
        tr: { fr: 'il n\'a jamais étudié le chinois', en: 'he has never studied Chinese' },
      },
      {
        answer: '你看过这个电影吗',
        pinyin: 'nǐ kàn guo zhège diànyǐng ma',
        wrong: ['你看这个电影吗', '你过看这个电影吗'],
        tr: { fr: 'as-tu déjà vu ce film ?', en: 'have you ever seen this film?' },
      },
    ],
  },
  {
    id: 'zhengzai',
    level: 2,
    title: { fr: '正在…呢 : en train de', en: '正在…呢: in the middle of' },
    pattern: { fr: '正在 + verbe (+ 呢)', en: '正在 + verb (+ 呢)' },
    explanation: [
      {
        fr: 'Pour dire qu\'une action est en cours, mets 正在 devant le verbe : 我正在吃饭 veut dire « je suis en train de manger ».',
        en: 'To say an action is in progress, put 正在 before the verb: 我正在吃饭 means "I\'m eating (right now)".',
      },
      {
        fr: 'Tu peux aussi dire simplement 在 + verbe, et ajouter 呢 à la fin de la phrase : 他在看书呢. Les trois formes 正在, 在 et 呢 peuvent se combiner.',
        en: 'You can also just say 在 + verb, and add 呢 at the end of the sentence: 他在看书呢. The three forms 正在, 在 and 呢 can be combined.',
      },
      { fr: 'Pour la négation, dis 没在 + verbe : 他没在睡觉.', en: 'For the negative, say 没在 + verb: 他没在睡觉.' },
    ],
    examples: [
      { zh: '我正在吃饭。', pinyin: 'wǒ zhèngzài chī fàn', tr: { fr: 'je suis en train de manger', en: 'I\'m eating' } },
      { zh: '他在看书呢。', pinyin: 'tā zài kàn shū ne', tr: { fr: 'il est en train de lire', en: 'he is reading' } },
      {
        zh: '妈妈正在做饭呢。',
        pinyin: 'māma zhèngzài zuò fàn ne',
        tr: { fr: 'maman est en train de faire à manger', en: 'mom is cooking' },
      },
      {
        zh: '你在做什么呢？',
        pinyin: 'nǐ zài zuò shénme ne',
        tr: { fr: 'qu\'est-ce que tu es en train de faire ?', en: 'what are you doing?' },
      },
      {
        zh: '他没在睡觉。',
        pinyin: 'tā méi zài shuì jiào',
        tr: { fr: 'il n\'est pas en train de dormir', en: 'he is not sleeping' },
      },
    ],
    pitfall: {
      fr: 'On termine souvent la phrase par 了 comme pour une action finie, alors qu\'une action en cours se termine par 呢 ou par rien.',
      en: 'People often end the sentence with 了 as for a finished action, but an action in progress ends with 呢 or nothing.',
    },
    order: [
      {
        words: ['我', '正在', '吃饭'],
        pinyin: 'wǒ zhèngzài chī fàn',
        tr: { fr: 'je suis en train de manger', en: 'I\'m eating' },
      },
      {
        words: ['他', '在', '看', '书', '呢'],
        pinyin: 'tā zài kàn shū ne',
        tr: { fr: 'il est en train de lire', en: 'he is reading' },
      },
      {
        words: ['妈妈', '正在', '做饭', '呢'],
        pinyin: 'māma zhèngzài zuò fàn ne',
        tr: { fr: 'maman est en train de faire à manger', en: 'mom is cooking' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '看电视呢',
        answer: '正在',
        wrong: ['过', '得'],
        pinyin: 'wǒ zhèngzài kàn diànshì ne',
        tr: { fr: 'je suis en train de regarder la télé', en: 'I\'m watching TV' },
      },
      {
        before: '他在睡觉',
        after: '',
        answer: '呢',
        wrong: ['过', '得'],
        pinyin: 'tā zài shuì jiào ne',
        tr: { fr: 'il est en train de dormir', en: 'he is sleeping' },
      },
      {
        before: '他',
        after: '在学习',
        answer: '没',
        wrong: ['了', '很'],
        pinyin: 'tā méi zài xuéxí',
        tr: { fr: 'il n\'est pas en train d\'étudier', en: 'he is not studying' },
      },
    ],
    judge: [
      {
        zh: '我正在打电话呢。',
        pinyin: 'wǒ zhèngzài dǎ diànhuà ne',
        ok: true,
        tr: { fr: 'je suis en train de téléphoner', en: 'I\'m on the phone' },
      },
      {
        zh: '我正在吃饭了。',
        ok: false,
        fix: '我正在吃饭呢。',
        fixPinyin: 'wǒ zhèngzài chī fàn ne',
        why: {
          fr: 'Pour une action en cours, on termine par 呢, pas par 了.',
          en: 'For an action in progress, end with 呢, not 了.',
        },
        tr: { fr: 'je suis en train de manger', en: 'I\'m eating' },
      },
      {
        zh: '他在看电视。',
        pinyin: 'tā zài kàn diànshì',
        ok: true,
        tr: { fr: 'il est en train de regarder la télé', en: 'he is watching TV' },
      },
    ],
    translate: [
      {
        answer: '我正在看书',
        pinyin: 'wǒ zhèngzài kàn shū',
        wrong: ['我看过书', '我看书了'],
        tr: { fr: 'je suis en train de lire', en: 'I\'m reading' },
      },
      {
        answer: '你在做什么呢',
        pinyin: 'nǐ zài zuò shénme ne',
        wrong: ['你做过什么', '你做了什么'],
        tr: { fr: 'qu\'est-ce que tu es en train de faire ?', en: 'what are you doing?' },
      },
      {
        answer: '他没在睡觉',
        pinyin: 'tā méi zài shuì jiào',
        wrong: ['他在睡觉呢', '他没睡过觉'],
        tr: { fr: 'il n\'est pas en train de dormir', en: 'he is not sleeping' },
      },
    ],
  },
  {
    id: 'bi',
    level: 2,
    title: { fr: '比 : la comparaison', en: '比: comparison' },
    pattern: { fr: 'A 比 B + adjectif', en: 'A 比 B + adjective' },
    explanation: [
      {
        fr: 'Pour dire que A est plus … que B, la structure est A + 比 + B + adjectif : 他比我高 veut dire « il est plus grand que moi ».',
        en: 'To say that A is more … than B, the structure is A + 比 + B + adjective: 他比我高 means "he is taller than me".',
      },
      {
        fr: 'Après 比, n\'utilise pas 很 ni 非常. Pour insister, mets 更 devant l\'adjectif, ou ajoute une quantité après : 大两岁, 贵一点儿.',
        en: 'After 比, don\'t use 很 or 非常. To insist, put 更 before the adjective, or add an amount after it: 大两岁, 贵一点儿.',
      },
      {
        fr: 'Pour dire que A n\'est pas aussi … que B, dis A + 没有 + B + (那么) + adjectif : 我没有他那么高.',
        en: 'To say that A is not as … as B, say A + 没有 + B + (那么) + adjective: 我没有他那么高.',
      },
    ],
    examples: [
      { zh: '他比我高。', pinyin: 'tā bǐ wǒ gāo', tr: { fr: 'il est plus grand que moi', en: 'he is taller than me' } },
      {
        zh: '今天比昨天冷。',
        pinyin: 'jīntiān bǐ zuótiān lěng',
        tr: { fr: 'aujourd\'hui il fait plus froid qu\'hier', en: 'today is colder than yesterday' },
      },
      {
        zh: '哥哥比我大两岁。',
        pinyin: 'gēge bǐ wǒ dà liǎng suì',
        tr: { fr: 'mon grand frère a deux ans de plus que moi', en: 'my older brother is two years older than me' },
      },
      {
        zh: '这个比那个更好。',
        pinyin: 'zhège bǐ nàge gèng hǎo',
        tr: { fr: 'celui-ci est encore mieux que celui-là', en: 'this one is even better than that one' },
      },
      {
        zh: '我没有他那么高。',
        pinyin: 'wǒ méiyǒu tā nàme gāo',
        tr: { fr: 'je ne suis pas aussi grand que lui', en: 'I\'m not as tall as him' },
      },
    ],
    pitfall: {
      fr: 'On ajoute souvent 很 comme dans une phrase simple (他比我很高), mais 很 est interdit après 比.',
      en: 'People add 很 as in a simple sentence ("he is very taller than me": 他比我很高), but 很 is not allowed after 比.',
    },
    order: [
      {
        words: ['他', '比', '我', '高'],
        pinyin: 'tā bǐ wǒ gāo',
        tr: { fr: 'il est plus grand que moi', en: 'he is taller than me' },
      },
      {
        words: ['今天', '比', '昨天', '冷'],
        pinyin: 'jīntiān bǐ zuótiān lěng',
        tr: { fr: 'aujourd\'hui il fait plus froid qu\'hier', en: 'today is colder than yesterday' },
      },
      {
        words: ['这个', '比', '那个', '贵', '一点儿'],
        pinyin: 'zhège bǐ nàge guì yìdiǎnr',
        tr: { fr: 'celui-ci est un peu plus cher que celui-là', en: 'this one is a bit more expensive than that one' },
      },
    ],
    fill: [
      {
        before: '他比我',
        after: '高',
        answer: '更',
        wrong: ['很', '非常'],
        pinyin: 'tā bǐ wǒ gèng gāo',
        tr: { fr: 'il est encore plus grand que moi', en: 'he is even taller than me' },
      },
      {
        before: '我',
        after: '你大',
        answer: '比',
        wrong: ['的', '很'],
        pinyin: 'wǒ bǐ nǐ dà',
        tr: { fr: 'je suis plus âgé que toi', en: 'I\'m older than you' },
      },
      {
        before: '我',
        after: '他那么高',
        answer: '没有',
        wrong: ['不', '比'],
        pinyin: 'wǒ méiyǒu tā nàme gāo',
        tr: { fr: 'je ne suis pas aussi grand que lui', en: 'I\'m not as tall as him' },
      },
    ],
    judge: [
      {
        zh: '他比我很高。',
        ok: false,
        fix: '他比我高。',
        fixPinyin: 'tā bǐ wǒ gāo',
        why: { fr: 'Après 比, on ne met pas 很 devant l\'adjectif.', en: 'After 比, you don\'t put 很 before the adjective.' },
        tr: { fr: 'il est plus grand que moi', en: 'he is taller than me' },
      },
      {
        zh: '姐姐比我大三岁。',
        pinyin: 'jiějie bǐ wǒ dà sān suì',
        ok: true,
        tr: { fr: 'ma grande sœur a trois ans de plus que moi', en: 'my older sister is three years older than me' },
      },
      {
        zh: '我比他不高。',
        ok: false,
        fix: '我没有他高。',
        fixPinyin: 'wǒ méiyǒu tā gāo',
        why: {
          fr: 'Pour nier une comparaison, on dit A 没有 B + adjectif.',
          en: 'To deny a comparison, you say A 没有 B + adjective.',
        },
        tr: { fr: 'je ne suis pas plus grand que lui', en: 'I\'m not taller than him' },
      },
    ],
    translate: [
      {
        answer: '他比我高',
        pinyin: 'tā bǐ wǒ gāo',
        wrong: ['我比他高', '他比我很高'],
        tr: { fr: 'il est plus grand que moi', en: 'he is taller than me' },
      },
      {
        answer: '今天比昨天热',
        pinyin: 'jīntiān bǐ zuótiān rè',
        wrong: ['昨天比今天热', '今天比昨天很热'],
        tr: { fr: 'aujourd\'hui il fait plus chaud qu\'hier', en: 'today is hotter than yesterday' },
      },
      {
        answer: '我没有他那么高',
        pinyin: 'wǒ méiyǒu tā nàme gāo',
        wrong: ['我比他高', '他没有我那么高'],
        tr: { fr: 'je ne suis pas aussi grand que lui', en: 'I\'m not as tall as him' },
      },
    ],
  },
  {
    id: 'de-complement',
    level: 2,
    title: { fr: '得 : la manière', en: '得: manner' },
    pattern: { fr: 'Verbe + 得 + adjectif', en: 'Verb + 得 + adjective' },
    explanation: [
      {
        fr: 'Pour dire comment on fait une action (bien, vite, tôt…), mets 得 juste après le verbe, puis l\'adjectif : 他说得很好 veut dire « il parle bien ».',
        en: 'To say how an action is done (well, fast, early…), put 得 right after the verb, then the adjective: 他说得很好 means "he speaks well".',
      },
      {
        fr: 'Si le verbe a un objet, répète le verbe : verbe + objet + verbe + 得 + adjectif, comme 他说汉语说得很好.',
        en: 'If the verb has an object, repeat the verb: verb + object + verb + 得 + adjective, as in 他说汉语说得很好.',
      },
      { fr: 'Pour la négation, mets 不 après 得 : 我唱得不好.', en: 'For the negative, put 不 after 得: 我唱得不好.' },
    ],
    examples: [
      { zh: '他说得很好。', pinyin: 'tā shuō de hěn hǎo', tr: { fr: 'il parle bien', en: 'he speaks well' } },
      { zh: '你跑得很快。', pinyin: 'nǐ pǎo de hěn kuài', tr: { fr: 'tu cours vite', en: 'you run fast' } },
      {
        zh: '他说汉语说得很好。',
        pinyin: 'tā shuō Hànyǔ shuō de hěn hǎo',
        tr: { fr: 'il parle bien chinois', en: 'he speaks Chinese well' },
      },
      { zh: '我唱得不好。', pinyin: 'wǒ chàng de bù hǎo', tr: { fr: 'je chante mal', en: 'I sing badly' } },
      {
        zh: '你今天起得很早。',
        pinyin: 'nǐ jīntiān qǐ de hěn zǎo',
        tr: { fr: 'tu t\'es levé tôt aujourd\'hui', en: 'you got up early today' },
      },
    ],
    pitfall: {
      fr: 'On place souvent l\'objet entre le verbe et 得 (他说汉语得很好), alors qu\'il faut répéter le verbe avant 得.',
      en: 'People put the object between the verb and 得 (他说汉语得很好), but you have to repeat the verb before 得.',
    },
    order: [
      {
        words: ['他', '跑', '得', '很', '快'],
        pinyin: 'tā pǎo de hěn kuài',
        tr: { fr: 'il court vite', en: 'he runs fast' },
      },
      {
        words: ['我', '写', '得', '不', '好'],
        pinyin: 'wǒ xiě de bù hǎo',
        tr: { fr: 'j\'écris mal', en: 'I write badly' },
      },
      {
        words: ['她', '唱歌', '唱', '得', '很', '好'],
        pinyin: 'tā chàng gē chàng de hěn hǎo',
        tr: { fr: 'elle chante bien', en: 'she sings well' },
      },
    ],
    fill: [
      {
        before: '他说',
        after: '很好',
        answer: '得',
        wrong: ['地', '着'],
        pinyin: 'tā shuō de hěn hǎo',
        tr: { fr: 'il parle bien', en: 'he speaks well' },
      },
      {
        before: '我跑得',
        after: '快',
        answer: '不',
        wrong: ['没', '了'],
        pinyin: 'wǒ pǎo de bú kuài',
        tr: { fr: 'je ne cours pas vite', en: 'I don\'t run fast' },
      },
      {
        before: '她做饭',
        after: '得很好',
        answer: '做',
        wrong: ['是', '在'],
        pinyin: 'tā zuò fàn zuò de hěn hǎo',
        tr: { fr: 'elle cuisine bien', en: 'she cooks well' },
      },
    ],
    judge: [
      { zh: '他写得很好。', pinyin: 'tā xiě de hěn hǎo', ok: true, tr: { fr: 'il écrit bien', en: 'he writes well' } },
      {
        zh: '他说汉语得很好。',
        ok: false,
        fix: '他说汉语说得很好。',
        fixPinyin: 'tā shuō Hànyǔ shuō de hěn hǎo',
        why: {
          fr: 'Avec un objet, il faut répéter le verbe avant 得.',
          en: 'With an object, you have to repeat the verb before 得.',
        },
        tr: { fr: 'il parle bien chinois', en: 'he speaks Chinese well' },
      },
      {
        zh: '他跑得没快。',
        ok: false,
        fix: '他跑得不快。',
        fixPinyin: 'tā pǎo de bú kuài',
        why: {
          fr: 'La négation se place après 得 et c\'est 不, pas 没.',
          en: 'The negative goes after 得 and it is 不, not 没.',
        },
        tr: { fr: 'il ne court pas vite', en: 'he doesn\'t run fast' },
      },
    ],
    translate: [
      {
        answer: '他跑得很快',
        pinyin: 'tā pǎo de hěn kuài',
        wrong: ['他跑了很快', '他跑得不快'],
        tr: { fr: 'il court vite', en: 'he runs fast' },
      },
      {
        answer: '她唱得不好',
        pinyin: 'tā chàng de bù hǎo',
        wrong: ['她不唱歌', '她唱得很好'],
        tr: { fr: 'elle chante mal', en: 'she sings badly' },
      },
      {
        answer: '你说汉语说得很好',
        pinyin: 'nǐ shuō Hànyǔ shuō de hěn hǎo',
        wrong: ['你说汉语得很好', '你说得汉语很好'],
        tr: { fr: 'tu parles bien chinois', en: 'you speak Chinese well' },
      },
    ],
  },
  {
    id: 'yinwei-suoyi',
    level: 2,
    title: { fr: '因为…所以', en: '因为…所以' },
    pattern: { fr: '因为 A，所以 B', en: '因为 A，所以 B' },
    explanation: [
      {
        fr: 'Pour relier une cause et sa conséquence, mets 因为 devant la cause et 所以 devant la conséquence : 因为下雨，所以我不去 veut dire « comme il pleut, je n\'y vais pas ».',
        en: 'To link a cause and its result, put 因为 before the cause and 所以 before the result: 因为下雨，所以我不去 means "because it\'s raining, I\'m not going".',
      },
      {
        fr: 'En chinois, la cause vient d\'abord et la conséquence ensuite. Souvent, on garde les deux mots 因为 et 所以 dans la même phrase, alors qu\'en français on n\'en met qu\'un.',
        en: 'In Chinese, the cause comes first and the result after. Both words 因为 and 所以 are often kept in the same sentence, while English uses only one ("because" or "so").',
      },
    ],
    examples: [
      {
        zh: '因为下雨，所以我不去。',
        pinyin: 'yīnwèi xià yǔ suǒyǐ wǒ bú qù',
        tr: { fr: 'comme il pleut, je n\'y vais pas', en: 'because it\'s raining, I\'m not going' },
      },
      {
        zh: '因为他病了，所以没来。',
        pinyin: 'yīnwèi tā bìng le suǒyǐ méi lái',
        tr: { fr: 'comme il est malade, il n\'est pas venu', en: 'because he is ill, he didn\'t come' },
      },
      {
        zh: '因为太贵了，所以我没买。',
        pinyin: 'yīnwèi tài guì le suǒyǐ wǒ méi mǎi',
        tr: {
          fr: 'comme c\'était trop cher, je ne l\'ai pas acheté',
          en: 'because it was too expensive, I didn\'t buy it',
        },
      },
      {
        zh: '因为我很忙，所以没去。',
        pinyin: 'yīnwèi wǒ hěn máng suǒyǐ méi qù',
        tr: { fr: 'comme j\'étais occupé, je n\'y suis pas allé', en: 'because I was busy, I didn\'t go' },
      },
    ],
    pitfall: {
      fr: 'On inverse souvent les deux parties comme en français (« je ne sors pas parce que… »), alors que la cause avec 因为 vient normalement en premier.',
      en: 'People flip the two parts as in English ("I\'m not going out because…"), but the cause with 因为 normally comes first.',
    },
    order: [
      {
        words: ['因为', '下雨', '所以', '我', '不去'],
        pinyin: 'yīnwèi xià yǔ suǒyǐ wǒ bú qù',
        tr: { fr: 'comme il pleut, je n\'y vais pas', en: 'because it\'s raining, I\'m not going' },
      },
      {
        words: ['因为', '他', '病', '了', '所以', '没来'],
        pinyin: 'yīnwèi tā bìng le suǒyǐ méi lái',
        tr: { fr: 'comme il est malade, il n\'est pas venu', en: 'because he is ill, he didn\'t come' },
      },
      {
        words: ['因为', '太', '贵', '所以', '我', '没买'],
        pinyin: 'yīnwèi tài guì suǒyǐ wǒ méi mǎi',
        tr: {
          fr: 'comme c\'était trop cher, je ne l\'ai pas acheté',
          en: 'because it was too expensive, I didn\'t buy it',
        },
      },
    ],
    fill: [
      {
        before: '因为天气不好',
        after: '我没去',
        answer: '所以',
        wrong: ['但是', '因为'],
        pinyin: 'yīnwèi tiānqì bù hǎo suǒyǐ wǒ méi qù',
        tr: { fr: 'comme il faisait mauvais, je n\'y suis pas allé', en: 'because the weather was bad, I didn\'t go' },
      },
      {
        before: '',
        after: '他病了所以没来',
        answer: '因为',
        wrong: ['所以', '但是'],
        pinyin: 'yīnwèi tā bìng le suǒyǐ méi lái',
        tr: { fr: 'comme il est malade, il n\'est pas venu', en: 'because he is ill, he didn\'t come' },
      },
      {
        before: '因为我很累',
        after: '想睡觉',
        answer: '所以',
        wrong: ['但是', '因为'],
        pinyin: 'yīnwèi wǒ hěn lèi suǒyǐ xiǎng shuì jiào',
        tr: { fr: 'comme je suis fatigué, j\'ai envie de dormir', en: 'because I\'m tired, I want to sleep' },
      },
    ],
    judge: [
      {
        zh: '因为下雨，所以我不去了。',
        pinyin: 'yīnwèi xià yǔ suǒyǐ wǒ bú qù le',
        ok: true,
        tr: { fr: 'comme il pleut, je n\'y vais plus', en: 'because it\'s raining, I\'m not going anymore' },
      },
      {
        zh: '所以下雨，因为我不去。',
        ok: false,
        fix: '因为下雨，所以我不去。',
        fixPinyin: 'yīnwèi xià yǔ suǒyǐ wǒ bú qù',
        why: {
          fr: '因为 introduit la cause et 所以 la conséquence, dans cet ordre.',
          en: '因为 introduces the cause and 所以 the result, in that order.',
        },
        tr: { fr: 'comme il pleut, je n\'y vais pas', en: 'because it\'s raining, I\'m not going' },
      },
      {
        zh: '因为我很忙，所以没去。',
        pinyin: 'yīnwèi wǒ hěn máng suǒyǐ méi qù',
        ok: true,
        tr: { fr: 'comme j\'étais occupé, je n\'y suis pas allé', en: 'because I was busy, I didn\'t go' },
      },
    ],
    translate: [
      {
        answer: '因为下雨所以我不出去',
        pinyin: 'yīnwèi xià yǔ suǒyǐ wǒ bù chūqu',
        wrong: ['因为我不出去所以下雨', '所以下雨因为我不出去'],
        tr: { fr: 'comme il pleut, je ne sors pas', en: 'because it\'s raining, I\'m not going out' },
      },
      {
        answer: '因为太贵了所以我没买',
        pinyin: 'yīnwèi tài guì le suǒyǐ wǒ méi mǎi',
        wrong: ['因为我没买所以太贵了', '所以太贵了因为我没买'],
        tr: {
          fr: 'comme c\'était trop cher, je ne l\'ai pas acheté',
          en: 'because it was too expensive, I didn\'t buy it',
        },
      },
      {
        answer: '因为他病了所以没来',
        pinyin: 'yīnwèi tā bìng le suǒyǐ méi lái',
        wrong: ['因为他没来所以病了', '因为他病了所以来了'],
        tr: { fr: 'comme il est malade, il n\'est pas venu', en: 'because he is ill, he didn\'t come' },
      },
    ],
  },
  {
    id: 'yijing-le',
    level: 2,
    title: { fr: '已经…了', en: '已经…了' },
    pattern: { fr: '已经 + verbe + 了', en: '已经 + verb + 了' },
    explanation: [
      {
        fr: '已经 veut dire « déjà ». Mets-le devant le verbe et termine la phrase par 了 : 我已经吃饭了 veut dire « j\'ai déjà mangé ».',
        en: '已经 means "already". Put it before the verb and end the sentence with 了: 我已经吃饭了 means "I have already eaten".',
      },
      {
        fr: 'Ça marche aussi avec l\'heure ou l\'âge : 已经十点了 veut dire « il est déjà dix heures ».',
        en: 'It also works with the time or age: 已经十点了 means "it\'s already ten o\'clock".',
      },
    ],
    examples: [
      { zh: '我已经吃饭了。', pinyin: 'wǒ yǐjīng chī fàn le', tr: { fr: 'j\'ai déjà mangé', en: 'I have already eaten' } },
      { zh: '他已经走了。', pinyin: 'tā yǐjīng zǒu le', tr: { fr: 'il est déjà parti', en: 'he has already left' } },
      {
        zh: '电影已经开始了。',
        pinyin: 'diànyǐng yǐjīng kāishǐ le',
        tr: { fr: 'le film a déjà commencé', en: 'the film has already started' },
      },
      {
        zh: '已经十点了。',
        pinyin: 'yǐjīng shí diǎn le',
        tr: { fr: 'il est déjà dix heures', en: 'it\'s already ten o\'clock' },
      },
      { zh: '我已经知道了。', pinyin: 'wǒ yǐjīng zhīdào le', tr: { fr: 'je le sais déjà', en: 'I already know' } },
    ],
    pitfall: {
      fr: 'On oublie souvent le 了 final, alors que 已经 s\'accompagne presque toujours de 了 en fin de phrase.',
      en: 'People often forget the final 了, but 已经 almost always comes with 了 at the end of the sentence.',
    },
    order: [
      {
        words: ['我', '已经', '吃饭', '了'],
        pinyin: 'wǒ yǐjīng chī fàn le',
        tr: { fr: 'j\'ai déjà mangé', en: 'I have already eaten' },
      },
      {
        words: ['他', '已经', '回家', '了'],
        pinyin: 'tā yǐjīng huí jiā le',
        tr: { fr: 'il est déjà rentré chez lui', en: 'he has already gone home' },
      },
      {
        words: ['电影', '已经', '开始', '了'],
        pinyin: 'diànyǐng yǐjīng kāishǐ le',
        tr: { fr: 'le film a déjà commencé', en: 'the film has already started' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '到了',
        answer: '已经',
        wrong: ['还没', '正在'],
        pinyin: 'wǒ yǐjīng dào le',
        tr: { fr: 'je suis déjà arrivé', en: 'I have already arrived' },
      },
      {
        before: '他已经睡觉',
        after: '',
        answer: '了',
        wrong: ['呢', '过'],
        pinyin: 'tā yǐjīng shuì jiào le',
        tr: { fr: 'il dort déjà', en: 'he is already asleep' },
      },
      {
        before: '已经十点',
        after: '',
        answer: '了',
        wrong: ['呢', '的'],
        pinyin: 'yǐjīng shí diǎn le',
        tr: { fr: 'il est déjà dix heures', en: 'it\'s already ten o\'clock' },
      },
    ],
    judge: [
      {
        zh: '我已经吃饭了。',
        pinyin: 'wǒ yǐjīng chī fàn le',
        ok: true,
        tr: { fr: 'j\'ai déjà mangé', en: 'I have already eaten' },
      },
      {
        zh: '他已经走。',
        ok: false,
        fix: '他已经走了。',
        fixPinyin: 'tā yǐjīng zǒu le',
        why: { fr: 'Avec 已经, on termine la phrase par 了.', en: 'With 已经, end the sentence with 了.' },
        tr: { fr: 'il est déjà parti', en: 'he has already left' },
      },
      {
        zh: '已经八点了。',
        pinyin: 'yǐjīng bā diǎn le',
        ok: true,
        tr: { fr: 'il est déjà huit heures', en: 'it\'s already eight o\'clock' },
      },
    ],
    translate: [
      {
        answer: '他已经走了',
        pinyin: 'tā yǐjīng zǒu le',
        wrong: ['他还没走', '他要走了'],
        tr: { fr: 'il est déjà parti', en: 'he has already left' },
      },
      {
        answer: '电影已经开始了',
        pinyin: 'diànyǐng yǐjīng kāishǐ le',
        wrong: ['电影要开始了', '电影还没开始'],
        tr: { fr: 'le film a déjà commencé', en: 'the film has already started' },
      },
      {
        answer: '我已经知道了',
        pinyin: 'wǒ yǐjīng zhīdào le',
        wrong: ['我不知道', '我已经知道过'],
        tr: { fr: 'je le sais déjà', en: 'I already know' },
      },
    ],
  },
  {
    id: 'jiu-cai',
    level: 2,
    title: { fr: '就 et 才', en: '就 and 才' },
    pattern: { fr: 'Temps + 就 / 才 + verbe', en: 'Time + 就 / 才 + verb' },
    explanation: [
      {
        fr: '就 et 才 se placent après l\'expression de temps et devant le verbe. 就 montre que c\'est tôt ou facile : 他七点就来了 veut dire « il est arrivé dès sept heures ».',
        en: '就 and 才 go after the time expression and before the verb. 就 shows that it is early or easy: 他七点就来了 means "he came as early as seven".',
      },
      {
        fr: '才 montre que c\'est tard ou difficile : 他十点才来 veut dire « il n\'est arrivé qu\'à dix heures ».',
        en: '才 shows that it is late or difficult: 他十点才来 means "he didn\'t come until ten".',
      },
      {
        fr: 'Avec 就, la phrase se termine souvent par 了. Avec 才, on ne met jamais 了.',
        en: 'With 就, the sentence often ends with 了. With 才, never use 了.',
      },
    ],
    examples: [
      {
        zh: '他七点就来了。',
        pinyin: 'tā qī diǎn jiù lái le',
        tr: { fr: 'il est arrivé dès sept heures', en: 'he came as early as seven' },
      },
      {
        zh: '他十点才来。',
        pinyin: 'tā shí diǎn cái lái',
        tr: { fr: 'il n\'est arrivé qu\'à dix heures', en: 'he didn\'t come until ten' },
      },
      {
        zh: '我六点就起床了。',
        pinyin: 'wǒ liù diǎn jiù qǐ chuáng le',
        tr: { fr: 'je me suis levé dès six heures', en: 'I got up as early as six' },
      },
      {
        zh: '她十一点才睡觉。',
        pinyin: 'tā shíyī diǎn cái shuì jiào',
        tr: { fr: 'elle ne s\'est couchée qu\'à onze heures', en: 'she didn\'t go to bed until eleven' },
      },
    ],
    pitfall: {
      fr: 'On ajoute souvent 了 après une phrase avec 才, alors que 才 ne s\'emploie jamais avec 了.',
      en: 'People often add 了 to a sentence with 才, but 才 is never used with 了.',
    },
    order: [
      {
        words: ['他', '八点', '就', '来', '了'],
        pinyin: 'tā bā diǎn jiù lái le',
        alt: [['八点', '他', '就', '来', '了']],
        tr: { fr: 'il est arrivé dès huit heures', en: 'he came as early as eight' },
      },
      {
        words: ['我', '十点', '才', '起床'],
        pinyin: 'wǒ shí diǎn cái qǐ chuáng',
        alt: [['十点', '我', '才', '起床']],
        tr: { fr: 'je ne me suis levé qu\'à dix heures', en: 'I didn\'t get up until ten' },
      },
      {
        words: ['她', '早上', '六点', '就', '走', '了'],
        pinyin: 'tā zǎoshang liù diǎn jiù zǒu le',
        alt: [['早上', '六点', '她', '就', '走', '了']],
        tr: { fr: 'elle est partie dès six heures du matin', en: 'she left as early as six in the morning' },
      },
    ],
    fill: [
      {
        before: '他十点',
        after: '来',
        answer: '才',
        wrong: ['了', '很'],
        pinyin: 'tā shí diǎn cái lái',
        tr: { fr: 'il n\'est arrivé qu\'à dix heures', en: 'he didn\'t come until ten' },
      },
      {
        before: '我七点',
        after: '起床了',
        answer: '就',
        wrong: ['才', '很'],
        pinyin: 'wǒ qī diǎn jiù qǐ chuáng le',
        tr: { fr: 'je me suis levé dès sept heures', en: 'I got up as early as seven' },
      },
      {
        before: '电影八点开始他九点',
        after: '来',
        answer: '才',
        wrong: ['很', '的'],
        pinyin: 'diànyǐng bā diǎn kāishǐ tā jiǔ diǎn cái lái',
        tr: {
          fr: 'le film commençait à huit heures, il n\'est arrivé qu\'à neuf heures',
          en: 'the film started at eight, he didn\'t come until nine',
        },
      },
    ],
    judge: [
      {
        zh: '他十点才来。',
        pinyin: 'tā shí diǎn cái lái',
        ok: true,
        tr: { fr: 'il n\'est arrivé qu\'à dix heures', en: 'he didn\'t come until ten' },
      },
      {
        zh: '他十点才来了。',
        ok: false,
        fix: '他十点才来。',
        fixPinyin: 'tā shí diǎn cái lái',
        why: { fr: '才 ne s\'emploie pas avec 了.', en: '才 is not used with 了.' },
        tr: { fr: 'il n\'est arrivé qu\'à dix heures', en: 'he didn\'t come until ten' },
      },
      {
        zh: '我六点就起床了。',
        pinyin: 'wǒ liù diǎn jiù qǐ chuáng le',
        ok: true,
        tr: { fr: 'je me suis levé dès six heures', en: 'I got up as early as six' },
      },
    ],
    translate: [
      {
        answer: '他七点就来了',
        pinyin: 'tā qī diǎn jiù lái le',
        wrong: ['他七点才来', '他七点才来了'],
        tr: { fr: 'il est arrivé dès sept heures', en: 'he came as early as seven' },
      },
      {
        answer: '他十一点才来',
        pinyin: 'tā shíyī diǎn cái lái',
        wrong: ['他十一点就来了', '他十一点才来了'],
        tr: { fr: 'il n\'est arrivé qu\'à onze heures', en: 'he didn\'t come until eleven' },
      },
      {
        answer: '我六点就起床了',
        pinyin: 'wǒ liù diǎn jiù qǐ chuáng le',
        wrong: ['我六点才起床', '我六点就起床呢'],
        tr: { fr: 'je me suis levé dès six heures', en: 'I got up as early as six' },
      },
    ],
  },
  {
    id: 'yao-le',
    level: 2,
    title: { fr: '要…了 : bientôt', en: '要…了: soon' },
    pattern: { fr: '要 / 快要 + verbe + 了', en: '要 / 快要 + verb + 了' },
    explanation: [
      {
        fr: 'Pour dire qu\'une chose va bientôt arriver, mets 要 ou 快要 devant le verbe et 了 à la fin : 要下雨了 veut dire « il va bientôt pleuvoir ».',
        en: 'To say that something is about to happen, put 要 or 快要 before the verb and 了 at the end: 要下雨了 means "it\'s going to rain soon".',
      },
      {
        fr: 'Si tu donnes un moment précis (明天, 八点…), utilise 就要 et pas 快要 : 我们明天就要考试了.',
        en: 'If you give a precise time (明天, 八点…), use 就要, not 快要: 我们明天就要考试了.',
      },
    ],
    examples: [
      { zh: '要下雨了。', pinyin: 'yào xià yǔ le', tr: { fr: 'il va bientôt pleuvoir', en: 'it\'s going to rain soon' } },
      {
        zh: '火车快要开了。',
        pinyin: 'huǒchē kuàiyào kāi le',
        tr: { fr: 'le train va bientôt partir', en: 'the train is about to leave' },
      },
      { zh: '他快要到了。', pinyin: 'tā kuàiyào dào le', tr: { fr: 'il va bientôt arriver', en: 'he is about to arrive' } },
      {
        zh: '我们明天就要考试了。',
        pinyin: 'wǒmen míngtiān jiùyào kǎoshì le',
        tr: { fr: 'nous avons un examen dès demain', en: 'we have an exam as soon as tomorrow' },
      },
    ],
    pitfall: {
      fr: 'On lit souvent 了 comme le signe du passé, alors qu\'ici 要…了 annonce une action qui va bientôt arriver.',
      en: 'People read 了 as a sign of the past, but here 要…了 announces something that is about to happen.',
    },
    order: [
      {
        words: ['要', '下雨', '了'],
        pinyin: 'yào xià yǔ le',
        tr: { fr: 'il va bientôt pleuvoir', en: 'it\'s going to rain soon' },
      },
      {
        words: ['火车', '快要', '开', '了'],
        pinyin: 'huǒchē kuàiyào kāi le',
        tr: { fr: 'le train va bientôt partir', en: 'the train is about to leave' },
      },
      {
        words: ['他', '明天', '就要', '走', '了'],
        pinyin: 'tā míngtiān jiùyào zǒu le',
        alt: [['明天', '他', '就要', '走', '了']],
        tr: { fr: 'il part dès demain', en: 'he is leaving tomorrow' },
      },
    ],
    fill: [
      {
        before: '我们明天',
        after: '考试了',
        answer: '就要',
        wrong: ['快要', '已经'],
        pinyin: 'wǒmen míngtiān jiùyào kǎoshì le',
        tr: { fr: 'nous avons un examen dès demain', en: 'we have an exam as soon as tomorrow' },
      },
      {
        before: '快要下雨',
        after: '',
        answer: '了',
        wrong: ['过', '的'],
        pinyin: 'kuàiyào xià yǔ le',
        tr: { fr: 'il va bientôt pleuvoir', en: 'it\'s going to rain soon' },
      },
      {
        before: '电影',
        after: '开始了',
        answer: '要',
        wrong: ['还没', '过'],
        pinyin: 'diànyǐng yào kāishǐ le',
        tr: { fr: 'le film va bientôt commencer', en: 'the film is about to start' },
      },
    ],
    judge: [
      {
        zh: '他快要到了。',
        pinyin: 'tā kuàiyào dào le',
        ok: true,
        tr: { fr: 'il va bientôt arriver', en: 'he is about to arrive' },
      },
      {
        zh: '他明天快要走了。',
        ok: false,
        fix: '他明天就要走了。',
        fixPinyin: 'tā míngtiān jiùyào zǒu le',
        why: {
          fr: 'Avec un moment précis comme 明天, on utilise 就要, pas 快要.',
          en: 'With a precise time like 明天, you use 就要, not 快要.',
        },
        tr: { fr: 'il part dès demain', en: 'he is leaving tomorrow' },
      },
      {
        zh: '快要上课。',
        ok: false,
        fix: '快要上课了。',
        fixPinyin: 'kuàiyào shàng kè le',
        why: { fr: 'La structure 快要…了 doit se terminer par 了.', en: 'The pattern 快要…了 must end with 了.' },
        tr: { fr: 'le cours va bientôt commencer', en: 'the class is about to start' },
      },
    ],
    translate: [
      {
        answer: '要下雨了',
        pinyin: 'yào xià yǔ le',
        wrong: ['下雨了', '下过雨'],
        tr: { fr: 'il va bientôt pleuvoir', en: 'it\'s going to rain soon' },
      },
      {
        answer: '火车快要开了',
        pinyin: 'huǒchē kuàiyào kāi le',
        wrong: ['火车已经开了', '火车开过'],
        tr: { fr: 'le train va bientôt partir', en: 'the train is about to leave' },
      },
      {
        answer: '我明天就要走了',
        pinyin: 'wǒ míngtiān jiùyào zǒu le',
        wrong: ['我明天快要走了', '我昨天走了'],
        tr: { fr: 'je pars dès demain', en: 'I\'m leaving tomorrow' },
      },
    ],
  },
  {
    id: 'hai-mei',
    level: 2,
    title: { fr: '还没…呢 : pas encore', en: '还没…呢: not yet' },
    pattern: { fr: '还没 + verbe + 呢', en: '还没 + verb + 呢' },
    explanation: [
      {
        fr: 'Pour dire qu\'une action n\'a pas encore eu lieu, mets 还没 devant le verbe et 呢 à la fin : 我还没吃饭呢 veut dire « je n\'ai pas encore mangé ».',
        en: 'To say that an action has not happened yet, put 还没 before the verb and 呢 at the end: 我还没吃饭呢 means "I haven\'t eaten yet".',
      },
      {
        fr: 'C\'est le contraire de 已经…了. Avec 还没, on ne met jamais 了.',
        en: 'It is the opposite of 已经…了. With 还没, you never use 了.',
      },
    ],
    examples: [
      {
        zh: '我还没吃饭呢。',
        pinyin: 'wǒ hái méi chī fàn ne',
        tr: { fr: 'je n\'ai pas encore mangé', en: 'I haven\'t eaten yet' },
      },
      {
        zh: '他还没来呢。',
        pinyin: 'tā hái méi lái ne',
        tr: { fr: 'il n\'est pas encore arrivé', en: 'he hasn\'t arrived yet' },
      },
      {
        zh: '电影还没开始呢。',
        pinyin: 'diànyǐng hái méi kāishǐ ne',
        tr: { fr: 'le film n\'a pas encore commencé', en: 'the film hasn\'t started yet' },
      },
      {
        zh: '我还没做作业呢。',
        pinyin: 'wǒ hái méi zuò zuòyè ne',
        tr: { fr: 'je n\'ai pas encore fait mes devoirs', en: 'I haven\'t done my homework yet' },
      },
    ],
    pitfall: {
      fr: 'On termine souvent par 了 comme pour une action passée, alors qu\'avec 还没 la phrase se termine par 呢.',
      en: 'People often end with 了 as for a past action, but with 还没 the sentence ends with 呢.',
    },
    order: [
      {
        words: ['我', '还没', '吃饭', '呢'],
        pinyin: 'wǒ hái méi chī fàn ne',
        tr: { fr: 'je n\'ai pas encore mangé', en: 'I haven\'t eaten yet' },
      },
      {
        words: ['他', '还没', '起床', '呢'],
        pinyin: 'tā hái méi qǐ chuáng ne',
        tr: { fr: 'il ne s\'est pas encore levé', en: 'he hasn\'t got up yet' },
      },
      {
        words: ['电影', '还没', '开始', '呢'],
        pinyin: 'diànyǐng hái méi kāishǐ ne',
        tr: { fr: 'le film n\'a pas encore commencé', en: 'the film hasn\'t started yet' },
      },
    ],
    fill: [
      {
        before: '我',
        after: '做作业呢',
        answer: '还没',
        wrong: ['已经', '过'],
        pinyin: 'wǒ hái méi zuò zuòyè ne',
        tr: { fr: 'je n\'ai pas encore fait mes devoirs', en: 'I haven\'t done my homework yet' },
      },
      {
        before: '他还没来',
        after: '',
        answer: '呢',
        wrong: ['了', '的'],
        pinyin: 'tā hái méi lái ne',
        tr: { fr: 'il n\'est pas encore arrivé', en: 'he hasn\'t arrived yet' },
      },
      {
        before: '火车',
        after: '没到呢',
        answer: '还',
        wrong: ['已经', '就'],
        pinyin: 'huǒchē hái méi dào ne',
        tr: { fr: 'le train n\'est pas encore arrivé', en: 'the train hasn\'t arrived yet' },
      },
    ],
    judge: [
      {
        zh: '我还没吃饭呢。',
        pinyin: 'wǒ hái méi chī fàn ne',
        ok: true,
        tr: { fr: 'je n\'ai pas encore mangé', en: 'I haven\'t eaten yet' },
      },
      {
        zh: '他还没来了。',
        ok: false,
        fix: '他还没来呢。',
        fixPinyin: 'tā hái méi lái ne',
        why: { fr: 'Avec 还没, on termine par 呢, jamais par 了.', en: 'With 还没, end with 呢, never with 了.' },
        tr: { fr: 'il n\'est pas encore arrivé', en: 'he hasn\'t arrived yet' },
      },
      {
        zh: '他还没起床呢。',
        pinyin: 'tā hái méi qǐ chuáng ne',
        ok: true,
        tr: { fr: 'il ne s\'est pas encore levé', en: 'he hasn\'t got up yet' },
      },
    ],
    translate: [
      {
        answer: '我还没吃饭呢',
        pinyin: 'wǒ hái méi chī fàn ne',
        wrong: ['我已经吃饭了', '我不吃饭'],
        tr: { fr: 'je n\'ai pas encore mangé', en: 'I haven\'t eaten yet' },
      },
      {
        answer: '他还没到呢',
        pinyin: 'tā hái méi dào ne',
        wrong: ['他已经到了', '他还没到了'],
        tr: { fr: 'il n\'est pas encore arrivé', en: 'he hasn\'t arrived yet' },
      },
      {
        answer: '电影还没开始呢',
        pinyin: 'diànyǐng hái méi kāishǐ ne',
        wrong: ['电影开始了', '电影还没开始了'],
        tr: { fr: 'le film n\'a pas encore commencé', en: 'the film hasn\'t started yet' },
      },
    ],
  },
]
