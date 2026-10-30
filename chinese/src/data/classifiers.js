// Classificateurs (量词) courants, par famille.
// Chaque exemple contient le classificateur ; le test le remplace par un blanc.
// alt : autres classificateurs qui donneraient aussi une phrase correcte (jamais proposés comme mauvaise réponse).
// generic : s'emploie avec presque tous les noms (个, 种, 些, récipients) : jamais proposé comme mauvaise réponse.

export const CLASSIFIER_GROUPS = [
  {
    title: 'Personnes & général',
    items: [
      {
        char: '个', pinyin: 'gè', generic: true,
        usage: 'Passe-partout : personnes, objets et notions sans classificateur propre',
        note: 'Le plus fréquent et souvent compris, mais le classificateur spécifique sonne plus naturel.',
        examples: [
          { zh: '一个人', pinyin: 'yí gè rén', fr: 'une personne', alt: ['群'] },
          { zh: '三个星期', pinyin: 'sān gè xīngqī', fr: 'trois semaines' },
          { zh: '这个问题', pinyin: 'zhè gè wèntí', fr: 'cette question', alt: ['道'] },
        ],
      },
      {
        char: '位', pinyin: 'wèi',
        usage: 'Personnes, avec respect (forme polie)',
        examples: [
          { zh: '一位老师', pinyin: 'yí wèi lǎoshī', fr: 'un professeur', alt: ['名', '群'] },
          { zh: '三位客人', pinyin: 'sān wèi kèrén', fr: 'trois invités', alt: ['名', '群'] },
          { zh: '这位先生', pinyin: 'zhè wèi xiānsheng', fr: 'ce monsieur', alt: ['名'] },
        ],
      },
      {
        char: '名', pinyin: 'míng',
        usage: 'Personnes, registre formel (métiers, rôles, classements)',
        examples: [
          { zh: '一名学生', pinyin: 'yì míng xuésheng', fr: 'un étudiant', alt: ['位', '群'] },
          { zh: '两名医生', pinyin: 'liǎng míng yīshēng', fr: 'deux médecins', alt: ['位', '群'] },
        ],
      },
      {
        char: '口', pinyin: 'kǒu',
        usage: 'Membres d\'une famille (avec 人) ; bouchées, gorgées ; puits',
        examples: [
          { zh: '我家有四口人', pinyin: 'wǒ jiā yǒu sì kǒu rén', fr: 'nous sommes quatre dans ma famille' },
          { zh: '喝一口水', pinyin: 'hē yì kǒu shuǐ', fr: 'boire une gorgée d\'eau' },
          { zh: '一口井', pinyin: 'yì kǒu jǐng', fr: 'un puits' },
        ],
      },
      {
        char: '群', pinyin: 'qún',
        usage: 'Groupes : foules, troupeaux, bandes',
        examples: [
          { zh: '一群人', pinyin: 'yì qún rén', fr: 'une foule, un groupe de gens' },
          { zh: '一群羊', pinyin: 'yì qún yáng', fr: 'un troupeau de moutons', alt: ['只', '头', '对'] },
          { zh: '一群学生', pinyin: 'yì qún xuésheng', fr: 'un groupe d\'étudiants', alt: ['名', '位'] },
        ],
      },
    ],
  },
  {
    title: 'Objets selon leur forme',
    items: [
      {
        char: '张', pinyin: 'zhāng',
        usage: 'Objets plats : papier, table, lit, photo, billet',
        examples: [
          { zh: '一张纸', pinyin: 'yì zhāng zhǐ', fr: 'une feuille de papier', alt: ['片', '块'] },
          { zh: '两张桌子', pinyin: 'liǎng zhāng zhuōzi', fr: 'deux tables' },
          { zh: '一张床', pinyin: 'yì zhāng chuáng', fr: 'un lit' },
          { zh: '三张票', pinyin: 'sān zhāng piào', fr: 'trois billets' },
          { zh: '一张照片', pinyin: 'yì zhāng zhàopiàn', fr: 'une photo', alt: ['幅'] },
        ],
      },
      {
        char: '条', pinyin: 'tiáo',
        usage: 'Objets longs et souples : rivière, route, poisson, pantalon ; nouvelles',
        examples: [
          { zh: '一条河', pinyin: 'yì tiáo hé', fr: 'une rivière' },
          { zh: '一条路', pinyin: 'yì tiáo lù', fr: 'une route', alt: ['段'] },
          { zh: '两条鱼', pinyin: 'liǎng tiáo yú', fr: 'deux poissons', alt: ['只', '群', '对'] },
          { zh: '一条裤子', pinyin: 'yì tiáo kùzi', fr: 'un pantalon' },
          { zh: '一条新闻', pinyin: 'yì tiáo xīnwén', fr: 'une nouvelle (info)', alt: ['篇'] },
        ],
      },
      {
        char: '支', pinyin: 'zhī',
        usage: 'Objets fins et rigides : stylos, cigarettes ; chansons, équipes',
        examples: [
          { zh: '一支笔', pinyin: 'yì zhī bǐ', fr: 'un stylo', alt: ['根'] },
          { zh: '一支烟', pinyin: 'yì zhī yān', fr: 'une cigarette', alt: ['根', '条', '口'] },
          { zh: '一支歌', pinyin: 'yì zhī gē', fr: 'une chanson', alt: ['首'] },
          { zh: '一支队伍', pinyin: 'yì zhī duìwu', fr: 'une équipe, une troupe' },
        ],
      },
      {
        char: '根', pinyin: 'gēn',
        usage: 'Objets longs et fins : bâtons, cheveux, cordes, aiguilles',
        examples: [
          { zh: '一根头发', pinyin: 'yì gēn tóufa', fr: 'un cheveu', alt: ['头'] },
          { zh: '一根绳子', pinyin: 'yì gēn shéngzi', fr: 'une corde', alt: ['条', '段'] },
          { zh: '一根针', pinyin: 'yì gēn zhēn', fr: 'une aiguille' },
        ],
      },
      {
        char: '块', pinyin: 'kuài',
        usage: 'Morceaux, blocs ; montres ; yuans (à l\'oral)',
        examples: [
          { zh: '一块蛋糕', pinyin: 'yí kuài dàngāo', fr: 'un morceau de gâteau', alt: ['片', '口'] },
          { zh: '一块手表', pinyin: 'yí kuài shǒubiǎo', fr: 'une montre', alt: ['只'] },
          { zh: '十块钱', pinyin: 'shí kuài qián', fr: 'dix yuans' },
        ],
      },
      {
        char: '片', pinyin: 'piàn',
        usage: 'Tranches, choses fines et plates ; comprimés ; étendues',
        examples: [
          { zh: '一片面包', pinyin: 'yí piàn miànbāo', fr: 'une tranche de pain', alt: ['块', '口'] },
          { zh: '两片药', pinyin: 'liǎng piàn yào', fr: 'deux comprimés', alt: ['颗', '口'] },
          { zh: '一片叶子', pinyin: 'yí piàn yèzi', fr: 'une feuille (d\'arbre)' },
        ],
      },
      {
        char: '颗', pinyin: 'kē',
        usage: 'Petits objets ronds : étoiles, dents, graines, bonbons',
        examples: [
          { zh: '一颗星星', pinyin: 'yì kē xīngxing', fr: 'une étoile' },
          { zh: '一颗牙', pinyin: 'yì kē yá', fr: 'une dent', alt: ['口'] },
          { zh: '一颗种子', pinyin: 'yì kē zhǒngzi', fr: 'une graine' },
        ],
      },
      {
        char: '把', pinyin: 'bǎ',
        usage: 'Objets qu\'on tient par une poignée : chaise, couteau, parapluie, clé',
        examples: [
          { zh: '一把椅子', pinyin: 'yì bǎ yǐzi', fr: 'une chaise' },
          { zh: '一把刀', pinyin: 'yì bǎ dāo', fr: 'un couteau' },
          { zh: '一把雨伞', pinyin: 'yì bǎ yǔsǎn', fr: 'un parapluie' },
          { zh: '一把钥匙', pinyin: 'yì bǎ yàoshi', fr: 'une clé' },
        ],
      },
    ],
  },
  {
    title: 'Vêtements, paires & ensembles',
    items: [
      {
        char: '件', pinyin: 'jiàn',
        usage: 'Vêtements (hauts), affaires, événements, bagages',
        examples: [
          { zh: '一件衣服', pinyin: 'yí jiàn yīfu', fr: 'un vêtement', alt: ['套'] },
          { zh: '一件事', pinyin: 'yí jiàn shì', fr: 'une affaire, une chose' },
          { zh: '两件行李', pinyin: 'liǎng jiàn xíngli', fr: 'deux bagages' },
        ],
      },
      {
        char: '双', pinyin: 'shuāng',
        usage: 'Paires (choses qui vont par deux) : chaussures, chaussettes, baguettes',
        examples: [
          { zh: '一双鞋', pinyin: 'yì shuāng xié', fr: 'une paire de chaussures', alt: ['只'] },
          { zh: '一双袜子', pinyin: 'yì shuāng wàzi', fr: 'une paire de chaussettes', alt: ['只'] },
          { zh: '一双筷子', pinyin: 'yì shuāng kuàizi', fr: 'une paire de baguettes', alt: ['只', '根', '支'] },
        ],
      },
      {
        char: '对', pinyin: 'duì',
        usage: 'Couples, paires assorties (personnes ou objets symétriques)',
        examples: [
          { zh: '一对夫妻', pinyin: 'yí duì fūqī', fr: 'un couple marié', alt: ['群'] },
          { zh: '一对耳环', pinyin: 'yí duì ěrhuán', fr: 'une paire de boucles d\'oreilles', alt: ['双', '只'] },
        ],
      },
      {
        char: '套', pinyin: 'tào',
        usage: 'Ensembles, séries complètes ; appartements',
        examples: [
          { zh: '一套衣服', pinyin: 'yí tào yīfu', fr: 'une tenue, un costume', alt: ['件'] },
          { zh: '一套房子', pinyin: 'yí tào fángzi', fr: 'un appartement', alt: ['所', '间', '座'] },
          { zh: '一套书', pinyin: 'yí tào shū', fr: 'une collection de livres', alt: ['本', '部'] },
        ],
      },
      {
        char: '顶', pinyin: 'dǐng',
        usage: 'Chapeaux, tentes (choses avec un sommet)',
        examples: [
          { zh: '一顶帽子', pinyin: 'yì dǐng màozi', fr: 'un chapeau' },
          { zh: '一顶帐篷', pinyin: 'yì dǐng zhàngpeng', fr: 'une tente' },
        ],
      },
    ],
  },
  {
    title: 'Animaux & plantes',
    items: [
      {
        char: '只', pinyin: 'zhī',
        usage: 'La plupart des animaux ; un élément d\'une paire (main, chaussure)',
        examples: [
          { zh: '一只猫', pinyin: 'yì zhī māo', fr: 'un chat', alt: ['群', '对'] },
          { zh: '三只鸟', pinyin: 'sān zhī niǎo', fr: 'trois oiseaux', alt: ['群', '对'] },
          { zh: '一只狗', pinyin: 'yì zhī gǒu', fr: 'un chien', alt: ['条', '群', '对'] },
          { zh: '一只手', pinyin: 'yì zhī shǒu', fr: 'une main', alt: ['双', '把'] },
        ],
      },
      {
        char: '头', pinyin: 'tóu',
        usage: 'Gros animaux, bétail : vache, cochon, éléphant',
        examples: [
          { zh: '一头牛', pinyin: 'yì tóu niú', fr: 'une vache, un bœuf', alt: ['只', '群', '对'] },
          { zh: '两头猪', pinyin: 'liǎng tóu zhū', fr: 'deux cochons', alt: ['只', '群', '对'] },
          { zh: '一头大象', pinyin: 'yì tóu dàxiàng', fr: 'un éléphant', alt: ['只', '群', '对'] },
        ],
      },
      {
        char: '匹', pinyin: 'pǐ',
        usage: 'Chevaux ; rouleaux de tissu',
        examples: [
          { zh: '一匹马', pinyin: 'yì pǐ mǎ', fr: 'un cheval', alt: ['群', '对'] },
          { zh: '一匹布', pinyin: 'yì pǐ bù', fr: 'un rouleau de tissu', alt: ['块', '片'] },
        ],
      },
      {
        char: '棵', pinyin: 'kē',
        usage: 'Arbres, plantes, choux',
        examples: [
          { zh: '一棵树', pinyin: 'yì kē shù', fr: 'un arbre' },
          { zh: '一棵白菜', pinyin: 'yì kē báicài', fr: 'un chou chinois', alt: ['颗'] },
          { zh: '一棵草', pinyin: 'yì kē cǎo', fr: 'un brin d\'herbe', alt: ['根', '片', '块'] },
        ],
      },
      {
        char: '朵', pinyin: 'duǒ',
        usage: 'Fleurs, nuages',
        examples: [
          { zh: '一朵花', pinyin: 'yì duǒ huā', fr: 'une fleur', alt: ['把', '片', '支'] },
          { zh: '一朵云', pinyin: 'yì duǒ yún', fr: 'un nuage', alt: ['片', '块'] },
        ],
      },
    ],
  },
  {
    title: 'Récipients & portions',
    items: [
      {
        char: '杯', pinyin: 'bēi', generic: true,
        usage: 'Tasses, verres : « une tasse de, un verre de »',
        examples: [
          { zh: '一杯茶', pinyin: 'yì bēi chá', fr: 'une tasse de thé', alt: ['口'] },
          { zh: '两杯咖啡', pinyin: 'liǎng bēi kāfēi', fr: 'deux cafés', alt: ['口'] },
        ],
      },
      {
        char: '瓶', pinyin: 'píng', generic: true,
        usage: 'Bouteilles : « une bouteille de »',
        examples: [
          { zh: '一瓶啤酒', pinyin: 'yì píng píjiǔ', fr: 'une bouteille de bière', alt: ['口'] },
          { zh: '两瓶水', pinyin: 'liǎng píng shuǐ', fr: 'deux bouteilles d\'eau', alt: ['口'] },
        ],
      },
      {
        char: '碗', pinyin: 'wǎn', generic: true,
        usage: 'Bols : « un bol de »',
        examples: [
          { zh: '一碗米饭', pinyin: 'yì wǎn mǐfàn', fr: 'un bol de riz', alt: ['口'] },
          { zh: '一碗汤', pinyin: 'yì wǎn tāng', fr: 'un bol de soupe', alt: ['口'] },
        ],
      },
      {
        char: '盒', pinyin: 'hé', generic: true,
        usage: 'Boîtes : « une boîte de »',
        examples: [
          { zh: '一盒巧克力', pinyin: 'yì hé qiǎokèlì', fr: 'une boîte de chocolats', alt: ['块', '口'] },
          { zh: '一盒牛奶', pinyin: 'yì hé niúnǎi', fr: 'une brique de lait', alt: ['口'] },
        ],
      },
      {
        char: '包', pinyin: 'bāo', generic: true,
        usage: 'Paquets, sachets : « un paquet de »',
        examples: [
          { zh: '一包烟', pinyin: 'yì bāo yān', fr: 'un paquet de cigarettes', alt: ['支', '根', '条', '口'] },
          { zh: '一包饼干', pinyin: 'yì bāo bǐnggān', fr: 'un paquet de biscuits', alt: ['块', '片', '口'] },
        ],
      },
      {
        char: '份', pinyin: 'fèn', generic: true,
        usage: 'Portions, parts ; exemplaires (journal, document) ; cadeaux, emplois',
        examples: [
          { zh: '一份报纸', pinyin: 'yí fèn bàozhǐ', fr: 'un journal', alt: ['张'] },
          { zh: '一份工作', pinyin: 'yí fèn gōngzuò', fr: 'un emploi' },
          { zh: '一份礼物', pinyin: 'yí fèn lǐwù', fr: 'un cadeau', alt: ['件'] },
        ],
      },
    ],
  },
  {
    title: 'Véhicules & appareils',
    items: [
      {
        char: '辆', pinyin: 'liàng',
        usage: 'Véhicules terrestres : voitures, vélos, bus',
        examples: [
          { zh: '一辆车', pinyin: 'yí liàng chē', fr: 'une voiture', alt: ['台', '部'] },
          { zh: '两辆自行车', pinyin: 'liǎng liàng zìxíngchē', fr: 'deux vélos', alt: ['部'] },
          { zh: '一辆公共汽车', pinyin: 'yí liàng gōnggòng qìchē', fr: 'un bus', alt: ['部'] },
        ],
      },
      {
        char: '台', pinyin: 'tái',
        usage: 'Machines, appareils : ordinateur, télévision, machine',
        examples: [
          { zh: '一台电脑', pinyin: 'yì tái diànnǎo', fr: 'un ordinateur', alt: ['部'] },
          { zh: '两台电视', pinyin: 'liǎng tái diànshì', fr: 'deux télévisions', alt: ['部'] },
          { zh: '一台机器', pinyin: 'yì tái jīqì', fr: 'une machine', alt: ['部', '架'] },
        ],
      },
      {
        char: '部', pinyin: 'bù',
        usage: 'Films, œuvres, ouvrages ; téléphones',
        examples: [
          { zh: '一部电影', pinyin: 'yí bù diànyǐng', fr: 'un film', alt: ['场'] },
          { zh: '一部手机', pinyin: 'yí bù shǒujī', fr: 'un téléphone portable', alt: ['台', '只'] },
          { zh: '一部小说', pinyin: 'yí bù xiǎoshuō', fr: 'un roman', alt: ['本', '篇', '套'] },
        ],
      },
      {
        char: '架', pinyin: 'jià',
        usage: 'Avions ; pianos, objets à armature',
        examples: [
          { zh: '一架飞机', pinyin: 'yí jià fēijī', fr: 'un avion' },
          { zh: '一架钢琴', pinyin: 'yí jià gāngqín', fr: 'un piano', alt: ['台'] },
        ],
      },
    ],
  },
  {
    title: 'Lieux & bâtiments',
    items: [
      {
        char: '家', pinyin: 'jiā',
        usage: 'Établissements : entreprises, magasins, restaurants, banques',
        examples: [
          { zh: '一家公司', pinyin: 'yì jiā gōngsī', fr: 'une entreprise' },
          { zh: '两家商店', pinyin: 'liǎng jiā shāngdiàn', fr: 'deux magasins', alt: ['间'] },
          { zh: '一家银行', pinyin: 'yì jiā yínháng', fr: 'une banque', alt: ['座'] },
        ],
      },
      {
        char: '所', pinyin: 'suǒ',
        usage: 'Institutions : écoles, universités, hôpitaux ; maisons',
        examples: [
          { zh: '一所学校', pinyin: 'yì suǒ xuéxiào', fr: 'une école', alt: ['座'] },
          { zh: '一所大学', pinyin: 'yì suǒ dàxué', fr: 'une université', alt: ['座'] },
          { zh: '一所医院', pinyin: 'yì suǒ yīyuàn', fr: 'un hôpital', alt: ['家', '座'] },
        ],
      },
      {
        char: '座', pinyin: 'zuò',
        usage: 'Grandes constructions fixes : montagnes, ponts, bâtiments, villes',
        examples: [
          { zh: '一座山', pinyin: 'yí zuò shān', fr: 'une montagne' },
          { zh: '一座桥', pinyin: 'yí zuò qiáo', fr: 'un pont' },
          { zh: '一座城市', pinyin: 'yí zuò chéngshì', fr: 'une ville' },
        ],
      },
      {
        char: '间', pinyin: 'jiān',
        usage: 'Pièces, salles',
        examples: [
          { zh: '一间卧室', pinyin: 'yì jiān wòshì', fr: 'une chambre' },
          { zh: '两间教室', pinyin: 'liǎng jiān jiàoshì', fr: 'deux salles de classe' },
          { zh: '一间办公室', pinyin: 'yì jiān bàngōngshì', fr: 'un bureau (pièce)' },
        ],
      },
      {
        char: '层', pinyin: 'céng',
        usage: 'Étages ; couches',
        examples: [
          { zh: '我住在五层', pinyin: 'wǒ zhù zài wǔ céng', fr: 'j\'habite au cinquième étage' },
          { zh: '一层灰', pinyin: 'yì céng huī', fr: 'une couche de poussière', alt: ['片'] },
        ],
      },
      {
        char: '扇', pinyin: 'shàn',
        usage: 'Portes, fenêtres',
        examples: [
          { zh: '一扇门', pinyin: 'yí shàn mén', fr: 'une porte', alt: ['道'] },
          { zh: '两扇窗户', pinyin: 'liǎng shàn chuānghu', fr: 'deux fenêtres' },
        ],
      },
    ],
  },
  {
    title: 'Textes, paroles & cours',
    items: [
      {
        char: '本', pinyin: 'běn',
        usage: 'Livres, cahiers, magazines (choses reliées)',
        examples: [
          { zh: '一本书', pinyin: 'yì běn shū', fr: 'un livre', alt: ['套', '部'] },
          { zh: '两本杂志', pinyin: 'liǎng běn zázhì', fr: 'deux magazines' },
          { zh: '一本词典', pinyin: 'yì běn cídiǎn', fr: 'un dictionnaire', alt: ['部'] },
        ],
      },
      {
        char: '封', pinyin: 'fēng',
        usage: 'Lettres, e-mails',
        examples: [
          { zh: '一封信', pinyin: 'yì fēng xìn', fr: 'une lettre' },
          { zh: '一封邮件', pinyin: 'yì fēng yóujiàn', fr: 'un e-mail', alt: ['条'] },
        ],
      },
      {
        char: '首', pinyin: 'shǒu',
        usage: 'Chansons, poèmes',
        examples: [
          { zh: '一首歌', pinyin: 'yì shǒu gē', fr: 'une chanson', alt: ['支'] },
          { zh: '一首诗', pinyin: 'yì shǒu shī', fr: 'un poème', alt: ['篇', '句'] },
        ],
      },
      {
        char: '篇', pinyin: 'piān',
        usage: 'Textes écrits : articles, essais, rédactions',
        examples: [
          { zh: '一篇文章', pinyin: 'yì piān wénzhāng', fr: 'un article', alt: ['段'] },
          { zh: '一篇日记', pinyin: 'yì piān rìjì', fr: 'une page de journal intime', alt: ['本', '段'] },
          { zh: '一篇论文', pinyin: 'yì piān lùnwén', fr: 'un mémoire, une thèse' },
        ],
      },
      {
        char: '句', pinyin: 'jù',
        usage: 'Phrases, paroles, vers',
        examples: [
          { zh: '一句话', pinyin: 'yí jù huà', fr: 'une phrase', alt: ['段'] },
          { zh: '他会说几句汉语', pinyin: 'tā huì shuō jǐ jù Hànyǔ', fr: 'il sait dire quelques phrases de chinois' },
        ],
      },
      {
        char: '幅', pinyin: 'fú',
        usage: 'Peintures, tableaux, cartes',
        examples: [
          { zh: '一幅画', pinyin: 'yì fú huà', fr: 'un tableau, une peinture', alt: ['张'] },
          { zh: '一幅地图', pinyin: 'yì fú dìtú', fr: 'une carte (géographique)', alt: ['张', '本'] },
        ],
      },
      {
        char: '段', pinyin: 'duàn',
        usage: 'Segments : période de temps, passage de texte, tronçon',
        examples: [
          { zh: '一段时间', pinyin: 'yí duàn shíjiān', fr: 'un certain temps' },
          { zh: '一段话', pinyin: 'yí duàn huà', fr: 'un passage, quelques mots', alt: ['句'] },
          { zh: '一段路', pinyin: 'yí duàn lù', fr: 'un bout de chemin', alt: ['条'] },
        ],
      },
      {
        char: '节', pinyin: 'jié',
        usage: 'Séances de cours ; sections ; piles',
        examples: [
          { zh: '一节课', pinyin: 'yì jié kè', fr: 'une heure de cours', alt: ['门'] },
          { zh: '两节电池', pinyin: 'liǎng jié diànchí', fr: 'deux piles', alt: ['块'] },
        ],
      },
      {
        char: '门', pinyin: 'mén',
        usage: 'Matières, disciplines, langues',
        examples: [
          { zh: '一门课', pinyin: 'yì mén kè', fr: 'une matière, un cours', alt: ['节'] },
          { zh: '两门外语', pinyin: 'liǎng mén wàiyǔ', fr: 'deux langues étrangères' },
        ],
      },
      {
        char: '道', pinyin: 'dào',
        usage: 'Plats d\'un repas ; questions d\'exercice ; portes, murs',
        examples: [
          { zh: '一道菜', pinyin: 'yí dào cài', fr: 'un plat', alt: ['口'] },
          { zh: '三道题', pinyin: 'sān dào tí', fr: 'trois questions (exercice)', alt: ['套'] },
        ],
      },
    ],
  },
  {
    title: 'Sortes & quantités vagues',
    items: [
      {
        char: '种', pinyin: 'zhǒng', generic: true,
        usage: 'Sortes, types, espèces',
        examples: [
          { zh: '三种颜色', pinyin: 'sān zhǒng yánsè', fr: 'trois (sortes de) couleurs' },
          { zh: '一种语言', pinyin: 'yì zhǒng yǔyán', fr: 'une langue', alt: ['门'] },
          { zh: '这种情况', pinyin: 'zhè zhǒng qíngkuàng', fr: 'ce genre de situation' },
        ],
      },
      {
        char: '些', pinyin: 'xiē', generic: true,
        usage: 'Quelques, un certain nombre (pluriel indéfini, avec 一/这/那/有)',
        examples: [
          { zh: '一些人', pinyin: 'yì xiē rén', fr: 'quelques personnes', alt: ['群'] },
          { zh: '这些天', pinyin: 'zhè xiē tiān', fr: 'ces jours-ci' },
          { zh: '有些问题', pinyin: 'yǒu xiē wèntí', fr: 'certains problèmes', alt: ['道'] },
        ],
      },
    ],
  },
  {
    title: 'Actions (classificateurs verbaux)',
    note: 'Ils se placent après le verbe et comptent combien de fois l\'action a lieu.',
    items: [
      {
        char: '次', pinyin: 'cì',
        usage: 'Nombre de fois (une action, un événement)',
        examples: [
          { zh: '我去过北京两次', pinyin: 'wǒ qù guo Běijīng liǎng cì', fr: 'je suis allé deux fois à Pékin', alt: ['趟'] },
          { zh: '我看过这部电影三次', pinyin: 'wǒ kàn guo zhè bù diànyǐng sān cì', fr: 'j\'ai vu ce film trois fois', alt: ['遍'] },
        ],
      },
      {
        char: '遍', pinyin: 'biàn',
        usage: 'Fois, du début à la fin (lire, écouter, répéter en entier)',
        examples: [
          { zh: '请再说一遍', pinyin: 'qǐng zài shuō yí biàn', fr: 'répétez, s\'il vous plaît', alt: ['次'] },
          { zh: '这本书我看了三遍', pinyin: 'zhè běn shū wǒ kàn le sān biàn', fr: 'j\'ai lu ce livre trois fois', alt: ['次'] },
        ],
      },
      {
        char: '趟', pinyin: 'tàng',
        usage: 'Trajets, allers-retours',
        examples: [
          { zh: '我去了一趟超市', pinyin: 'wǒ qù le yí tàng chāoshì', fr: 'j\'ai fait un saut au supermarché', alt: ['次'] },
          { zh: '他来了两趟', pinyin: 'tā lái le liǎng tàng', fr: 'il est venu deux fois', alt: ['次'] },
        ],
      },
      {
        char: '场', pinyin: 'chǎng',
        usage: 'Événements, séances : match, film, pluie, spectacle',
        examples: [
          { zh: '一场比赛', pinyin: 'yì chǎng bǐsài', fr: 'un match', alt: ['次'] },
          { zh: '一场大雨', pinyin: 'yì chǎng dà yǔ', fr: 'une grosse averse', alt: ['次'] },
          { zh: '看一场电影', pinyin: 'kàn yì chǎng diànyǐng', fr: 'voir une séance de cinéma', alt: ['部'] },
        ],
      },
      {
        char: '顿', pinyin: 'dùn',
        usage: 'Repas ; (familier) une engueulade, une raclée',
        examples: [
          { zh: '一顿饭', pinyin: 'yí dùn fàn', fr: 'un repas', alt: ['次', '口'] },
          { zh: '他被骂了一顿', pinyin: 'tā bèi mà le yí dùn', fr: 'il s\'est fait engueuler', alt: ['次', '场'] },
        ],
      },
    ],
  },
]

export const CLASSIFIERS = CLASSIFIER_GROUPS.flatMap(g => g.items.map(item => ({ ...item, group: g.title })))

// Clé de progression (même magasin IndexedDB / synchronisation que les mots HSK).
export const classifierKey = cl => `cl_${cl.char}`
