// Classificateurs (量词) courants, par famille.
// Textes affichés : { fr, en } (langue de l'utilisateur) ; examples[].tr : traduction de la phrase chinoise.
// Chaque exemple contient le classificateur ; le test le remplace par un blanc.
// alt : autres classificateurs qui donneraient aussi une phrase correcte (jamais proposés comme mauvaise réponse).
// generic : s'emploie avec presque tous les noms (个, 种, 些, récipients) : jamais proposé comme mauvaise réponse.

export const CLASSIFIER_GROUPS = [
  {
    title: { fr: 'Personnes & général', en: 'People & general' },
    items: [
      {
        char: '个',
        pinyin: 'gè',
        generic: true,
        usage: {
          fr: 'Passe-partout : personnes, objets et notions sans classificateur propre',
          en: 'All-purpose: people, objects and ideas with no classifier of their own',
        },
        note: {
          fr: 'Le plus fréquent et souvent compris, mais le classificateur spécifique sonne plus naturel.',
          en: 'The most common and widely understood, but the specific classifier sounds more natural.',
        },
        examples: [
          { zh: '一个人', pinyin: 'yí gè rén', alt: ['群'], tr: { fr: 'une personne', en: 'a person' } },
          { zh: '三个星期', pinyin: 'sān gè xīngqī', tr: { fr: 'trois semaines', en: 'three weeks' } },
          { zh: '这个问题', pinyin: 'zhè gè wèntí', alt: ['道'], tr: { fr: 'cette question', en: 'this question' } },
        ],
      },
      {
        char: '位',
        pinyin: 'wèi',
        usage: { fr: 'Personnes, avec respect (forme polie)', en: 'People, respectfully (polite form)' },
        examples: [
          { zh: '一位老师', pinyin: 'yí wèi lǎoshī', alt: ['名', '群'], tr: { fr: 'un professeur', en: 'a teacher' } },
          { zh: '三位客人', pinyin: 'sān wèi kèrén', alt: ['名', '群'], tr: { fr: 'trois invités', en: 'three guests' } },
          { zh: '这位先生', pinyin: 'zhè wèi xiānsheng', alt: ['名'], tr: { fr: 'ce monsieur', en: 'this gentleman' } },
        ],
      },
      {
        char: '名',
        pinyin: 'míng',
        usage: {
          fr: 'Personnes, registre formel (métiers, rôles, classements)',
          en: 'People, formal register (jobs, roles, rankings)',
        },
        examples: [
          { zh: '一名学生', pinyin: 'yì míng xuésheng', alt: ['位', '群'], tr: { fr: 'un étudiant', en: 'a student' } },
          {
            zh: '两名医生',
            pinyin: 'liǎng míng yīshēng',
            alt: ['位', '群'],
            tr: { fr: 'deux médecins', en: 'two doctors' },
          },
        ],
      },
      {
        char: '口',
        pinyin: 'kǒu',
        usage: {
          fr: 'Membres d\'une famille (avec 人) ; bouchées, gorgées ; puits',
          en: 'Family members (with 人); bites, sips; wells',
        },
        examples: [
          {
            zh: '我家有四口人',
            pinyin: 'wǒ jiā yǒu sì kǒu rén',
            tr: { fr: 'nous sommes quatre dans ma famille', en: 'there are four of us in my family' },
          },
          { zh: '喝一口水', pinyin: 'hē yì kǒu shuǐ', tr: { fr: 'boire une gorgée d\'eau', en: 'drink a sip of water' } },
          { zh: '一口井', pinyin: 'yì kǒu jǐng', tr: { fr: 'un puits', en: 'a well' } },
        ],
      },
      {
        char: '群',
        pinyin: 'qún',
        usage: { fr: 'Groupes : foules, troupeaux, bandes', en: 'Groups: crowds, herds, gangs' },
        examples: [
          {
            zh: '一群人',
            pinyin: 'yì qún rén',
            tr: { fr: 'une foule, un groupe de gens', en: 'a crowd, a group of people' },
          },
          {
            zh: '一群羊',
            pinyin: 'yì qún yáng',
            alt: ['只', '头', '对'],
            tr: { fr: 'un troupeau de moutons', en: 'a flock of sheep' },
          },
          {
            zh: '一群学生',
            pinyin: 'yì qún xuésheng',
            alt: ['名', '位'],
            tr: { fr: 'un groupe d\'étudiants', en: 'a group of students' },
          },
        ],
      },
    ],
  },
  {
    title: { fr: 'Objets selon leur forme', en: 'Objects by shape' },
    items: [
      {
        char: '张',
        pinyin: 'zhāng',
        usage: {
          fr: 'Objets plats : papier, table, lit, photo, billet',
          en: 'Flat objects: paper, tables, beds, photos, tickets',
        },
        examples: [
          {
            zh: '一张纸',
            pinyin: 'yì zhāng zhǐ',
            alt: ['片', '块'],
            tr: { fr: 'une feuille de papier', en: 'a sheet of paper' },
          },
          { zh: '两张桌子', pinyin: 'liǎng zhāng zhuōzi', tr: { fr: 'deux tables', en: 'two tables' } },
          { zh: '一张床', pinyin: 'yì zhāng chuáng', tr: { fr: 'un lit', en: 'a bed' } },
          { zh: '三张票', pinyin: 'sān zhāng piào', tr: { fr: 'trois billets', en: 'three tickets' } },
          { zh: '一张照片', pinyin: 'yì zhāng zhàopiàn', alt: ['幅'], tr: { fr: 'une photo', en: 'a photo' } },
        ],
      },
      {
        char: '条',
        pinyin: 'tiáo',
        usage: {
          fr: 'Objets longs et souples : rivière, route, poisson, pantalon ; nouvelles',
          en: 'Long, flexible objects: rivers, roads, fish, trousers; news items',
        },
        examples: [
          { zh: '一条河', pinyin: 'yì tiáo hé', tr: { fr: 'une rivière', en: 'a river' } },
          { zh: '一条路', pinyin: 'yì tiáo lù', alt: ['段'], tr: { fr: 'une route', en: 'a road' } },
          { zh: '两条鱼', pinyin: 'liǎng tiáo yú', alt: ['只', '群', '对'], tr: { fr: 'deux poissons', en: 'two fish' } },
          { zh: '一条裤子', pinyin: 'yì tiáo kùzi', tr: { fr: 'un pantalon', en: 'a pair of trousers' } },
          { zh: '一条新闻', pinyin: 'yì tiáo xīnwén', alt: ['篇'], tr: { fr: 'une nouvelle (info)', en: 'a news item' } },
        ],
      },
      {
        char: '支',
        pinyin: 'zhī',
        usage: {
          fr: 'Objets fins et rigides : stylos, cigarettes ; chansons, équipes',
          en: 'Thin, stiff objects: pens, cigarettes; songs, teams',
        },
        examples: [
          { zh: '一支笔', pinyin: 'yì zhī bǐ', alt: ['根'], tr: { fr: 'un stylo', en: 'a pen' } },
          { zh: '一支烟', pinyin: 'yì zhī yān', alt: ['根', '条', '口'], tr: { fr: 'une cigarette', en: 'a cigarette' } },
          { zh: '一支歌', pinyin: 'yì zhī gē', alt: ['首'], tr: { fr: 'une chanson', en: 'a song' } },
          { zh: '一支队伍', pinyin: 'yì zhī duìwu', tr: { fr: 'une équipe, une troupe', en: 'a team, a troop' } },
        ],
      },
      {
        char: '根',
        pinyin: 'gēn',
        usage: {
          fr: 'Objets longs et fins : bâtons, cheveux, cordes, aiguilles',
          en: 'Long, thin objects: sticks, hairs, ropes, needles',
        },
        examples: [
          { zh: '一根头发', pinyin: 'yì gēn tóufa', alt: ['头'], tr: { fr: 'un cheveu', en: 'a hair' } },
          { zh: '一根绳子', pinyin: 'yì gēn shéngzi', alt: ['条', '段'], tr: { fr: 'une corde', en: 'a rope' } },
          { zh: '一根针', pinyin: 'yì gēn zhēn', tr: { fr: 'une aiguille', en: 'a needle' } },
        ],
      },
      {
        char: '块',
        pinyin: 'kuài',
        usage: { fr: 'Morceaux, blocs ; montres ; yuans (à l\'oral)', en: 'Pieces, chunks; watches; yuan (spoken)' },
        examples: [
          {
            zh: '一块蛋糕',
            pinyin: 'yí kuài dàngāo',
            alt: ['片', '口'],
            tr: { fr: 'un morceau de gâteau', en: 'a piece of cake' },
          },
          { zh: '一块手表', pinyin: 'yí kuài shǒubiǎo', alt: ['只'], tr: { fr: 'une montre', en: 'a watch' } },
          { zh: '十块钱', pinyin: 'shí kuài qián', tr: { fr: 'dix yuans', en: 'ten yuan' } },
        ],
      },
      {
        char: '片',
        pinyin: 'piàn',
        usage: {
          fr: 'Tranches, choses fines et plates ; comprimés ; étendues',
          en: 'Slices, thin flat things; pills; expanses',
        },
        examples: [
          {
            zh: '一片面包',
            pinyin: 'yí piàn miànbāo',
            alt: ['块', '口'],
            tr: { fr: 'une tranche de pain', en: 'a slice of bread' },
          },
          { zh: '两片药', pinyin: 'liǎng piàn yào', alt: ['颗', '口'], tr: { fr: 'deux comprimés', en: 'two pills' } },
          { zh: '一片叶子', pinyin: 'yí piàn yèzi', tr: { fr: 'une feuille (d\'arbre)', en: 'a leaf' } },
        ],
      },
      {
        char: '颗',
        pinyin: 'kē',
        usage: {
          fr: 'Petits objets ronds : étoiles, dents, graines, bonbons',
          en: 'Small round objects: stars, teeth, seeds, sweets',
        },
        examples: [
          { zh: '一颗星星', pinyin: 'yì kē xīngxing', tr: { fr: 'une étoile', en: 'a star' } },
          { zh: '一颗牙', pinyin: 'yì kē yá', alt: ['口'], tr: { fr: 'une dent', en: 'a tooth' } },
          { zh: '一颗种子', pinyin: 'yì kē zhǒngzi', tr: { fr: 'une graine', en: 'a seed' } },
        ],
      },
      {
        char: '把',
        pinyin: 'bǎ',
        usage: {
          fr: 'Objets qu\'on tient par une poignée : chaise, couteau, parapluie, clé',
          en: 'Objects held by a handle: chairs, knives, umbrellas, keys',
        },
        examples: [
          { zh: '一把椅子', pinyin: 'yì bǎ yǐzi', tr: { fr: 'une chaise', en: 'a chair' } },
          { zh: '一把刀', pinyin: 'yì bǎ dāo', tr: { fr: 'un couteau', en: 'a knife' } },
          { zh: '一把雨伞', pinyin: 'yì bǎ yǔsǎn', tr: { fr: 'un parapluie', en: 'an umbrella' } },
          { zh: '一把钥匙', pinyin: 'yì bǎ yàoshi', tr: { fr: 'une clé', en: 'a key' } },
        ],
      },
    ],
  },
  {
    title: { fr: 'Vêtements, paires & ensembles', en: 'Clothes, pairs & sets' },
    items: [
      {
        char: '件',
        pinyin: 'jiàn',
        usage: { fr: 'Vêtements (hauts), affaires, événements, bagages', en: 'Clothes (tops), matters, events, luggage' },
        examples: [
          { zh: '一件衣服', pinyin: 'yí jiàn yīfu', alt: ['套'], tr: { fr: 'un vêtement', en: 'a piece of clothing' } },
          { zh: '一件事', pinyin: 'yí jiàn shì', tr: { fr: 'une affaire, une chose', en: 'a matter, a thing' } },
          { zh: '两件行李', pinyin: 'liǎng jiàn xíngli', tr: { fr: 'deux bagages', en: 'two pieces of luggage' } },
        ],
      },
      {
        char: '双',
        pinyin: 'shuāng',
        usage: {
          fr: 'Paires (choses qui vont par deux) : chaussures, chaussettes, baguettes',
          en: 'Pairs (things that come in twos): shoes, socks, chopsticks',
        },
        examples: [
          {
            zh: '一双鞋',
            pinyin: 'yì shuāng xié',
            alt: ['只'],
            tr: { fr: 'une paire de chaussures', en: 'a pair of shoes' },
          },
          {
            zh: '一双袜子',
            pinyin: 'yì shuāng wàzi',
            alt: ['只'],
            tr: { fr: 'une paire de chaussettes', en: 'a pair of socks' },
          },
          {
            zh: '一双筷子',
            pinyin: 'yì shuāng kuàizi',
            alt: ['只', '根', '支'],
            tr: { fr: 'une paire de baguettes', en: 'a pair of chopsticks' },
          },
        ],
      },
      {
        char: '对',
        pinyin: 'duì',
        usage: {
          fr: 'Couples, paires assorties (personnes ou objets symétriques)',
          en: 'Couples, matching pairs (people or symmetrical objects)',
        },
        examples: [
          { zh: '一对夫妻', pinyin: 'yí duì fūqī', alt: ['群'], tr: { fr: 'un couple marié', en: 'a married couple' } },
          {
            zh: '一对耳环',
            pinyin: 'yí duì ěrhuán',
            alt: ['双', '只'],
            tr: { fr: 'une paire de boucles d\'oreilles', en: 'a pair of earrings' },
          },
        ],
      },
      {
        char: '套',
        pinyin: 'tào',
        usage: { fr: 'Ensembles, séries complètes ; appartements', en: 'Sets, complete series; apartments' },
        examples: [
          {
            zh: '一套衣服',
            pinyin: 'yí tào yīfu',
            alt: ['件'],
            tr: { fr: 'une tenue, un costume', en: 'an outfit, a suit' },
          },
          {
            zh: '一套房子',
            pinyin: 'yí tào fángzi',
            alt: ['所', '间', '座'],
            tr: { fr: 'un appartement', en: 'an apartment' },
          },
          {
            zh: '一套书',
            pinyin: 'yí tào shū',
            alt: ['本', '部'],
            tr: { fr: 'une collection de livres', en: 'a set of books' },
          },
        ],
      },
      {
        char: '顶',
        pinyin: 'dǐng',
        usage: { fr: 'Chapeaux, tentes (choses avec un sommet)', en: 'Hats, tents (things with a top)' },
        examples: [
          { zh: '一顶帽子', pinyin: 'yì dǐng màozi', tr: { fr: 'un chapeau', en: 'a hat' } },
          { zh: '一顶帐篷', pinyin: 'yì dǐng zhàngpeng', tr: { fr: 'une tente', en: 'a tent' } },
        ],
      },
    ],
  },
  {
    title: { fr: 'Animaux & plantes', en: 'Animals & plants' },
    items: [
      {
        char: '只',
        pinyin: 'zhī',
        usage: {
          fr: 'La plupart des animaux ; un élément d\'une paire (main, chaussure)',
          en: 'Most animals; one of a pair (hand, shoe)',
        },
        examples: [
          { zh: '一只猫', pinyin: 'yì zhī māo', alt: ['群', '对'], tr: { fr: 'un chat', en: 'a cat' } },
          { zh: '三只鸟', pinyin: 'sān zhī niǎo', alt: ['群', '对'], tr: { fr: 'trois oiseaux', en: 'three birds' } },
          { zh: '一只狗', pinyin: 'yì zhī gǒu', alt: ['条', '群', '对'], tr: { fr: 'un chien', en: 'a dog' } },
          { zh: '一只手', pinyin: 'yì zhī shǒu', alt: ['双', '把'], tr: { fr: 'une main', en: 'a hand' } },
        ],
      },
      {
        char: '头',
        pinyin: 'tóu',
        usage: {
          fr: 'Gros animaux, bétail : vache, cochon, éléphant',
          en: 'Large animals, livestock: cows, pigs, elephants',
        },
        examples: [
          {
            zh: '一头牛',
            pinyin: 'yì tóu niú',
            alt: ['只', '群', '对'],
            tr: { fr: 'une vache, un bœuf', en: 'a cow, an ox' },
          },
          { zh: '两头猪', pinyin: 'liǎng tóu zhū', alt: ['只', '群', '对'], tr: { fr: 'deux cochons', en: 'two pigs' } },
          { zh: '一头大象', pinyin: 'yì tóu dàxiàng', alt: ['只', '群', '对'], tr: { fr: 'un éléphant', en: 'an elephant' } },
        ],
      },
      {
        char: '匹',
        pinyin: 'pǐ',
        usage: { fr: 'Chevaux ; rouleaux de tissu', en: 'Horses; bolts of cloth' },
        examples: [
          { zh: '一匹马', pinyin: 'yì pǐ mǎ', alt: ['群', '对'], tr: { fr: 'un cheval', en: 'a horse' } },
          { zh: '一匹布', pinyin: 'yì pǐ bù', alt: ['块', '片'], tr: { fr: 'un rouleau de tissu', en: 'a bolt of cloth' } },
        ],
      },
      {
        char: '棵',
        pinyin: 'kē',
        usage: { fr: 'Arbres, plantes, choux', en: 'Trees, plants, cabbages' },
        examples: [
          { zh: '一棵树', pinyin: 'yì kē shù', tr: { fr: 'un arbre', en: 'a tree' } },
          { zh: '一棵白菜', pinyin: 'yì kē báicài', alt: ['颗'], tr: { fr: 'un chou chinois', en: 'a Chinese cabbage' } },
          {
            zh: '一棵草',
            pinyin: 'yì kē cǎo',
            alt: ['根', '片', '块'],
            tr: { fr: 'un brin d\'herbe', en: 'a blade of grass' },
          },
        ],
      },
      {
        char: '朵',
        pinyin: 'duǒ',
        usage: { fr: 'Fleurs, nuages', en: 'Flowers, clouds' },
        examples: [
          { zh: '一朵花', pinyin: 'yì duǒ huā', alt: ['把', '片', '支'], tr: { fr: 'une fleur', en: 'a flower' } },
          { zh: '一朵云', pinyin: 'yì duǒ yún', alt: ['片', '块'], tr: { fr: 'un nuage', en: 'a cloud' } },
        ],
      },
    ],
  },
  {
    title: { fr: 'Récipients & portions', en: 'Containers & portions' },
    items: [
      {
        char: '杯',
        pinyin: 'bēi',
        generic: true,
        usage: { fr: 'Tasses, verres : « une tasse de, un verre de »', en: 'Cups, glasses: "a cup of, a glass of"' },
        examples: [
          { zh: '一杯茶', pinyin: 'yì bēi chá', alt: ['口'], tr: { fr: 'une tasse de thé', en: 'a cup of tea' } },
          { zh: '两杯咖啡', pinyin: 'liǎng bēi kāfēi', alt: ['口'], tr: { fr: 'deux cafés', en: 'two coffees' } },
        ],
      },
      {
        char: '瓶',
        pinyin: 'píng',
        generic: true,
        usage: { fr: 'Bouteilles : « une bouteille de »', en: 'Bottles: "a bottle of"' },
        examples: [
          {
            zh: '一瓶啤酒',
            pinyin: 'yì píng píjiǔ',
            alt: ['口'],
            tr: { fr: 'une bouteille de bière', en: 'a bottle of beer' },
          },
          {
            zh: '两瓶水',
            pinyin: 'liǎng píng shuǐ',
            alt: ['口'],
            tr: { fr: 'deux bouteilles d\'eau', en: 'two bottles of water' },
          },
        ],
      },
      {
        char: '碗',
        pinyin: 'wǎn',
        generic: true,
        usage: { fr: 'Bols : « un bol de »', en: 'Bowls: "a bowl of"' },
        examples: [
          { zh: '一碗米饭', pinyin: 'yì wǎn mǐfàn', alt: ['口'], tr: { fr: 'un bol de riz', en: 'a bowl of rice' } },
          { zh: '一碗汤', pinyin: 'yì wǎn tāng', alt: ['口'], tr: { fr: 'un bol de soupe', en: 'a bowl of soup' } },
        ],
      },
      {
        char: '盒',
        pinyin: 'hé',
        generic: true,
        usage: { fr: 'Boîtes : « une boîte de »', en: 'Boxes: "a box of"' },
        examples: [
          {
            zh: '一盒巧克力',
            pinyin: 'yì hé qiǎokèlì',
            alt: ['块', '口'],
            tr: { fr: 'une boîte de chocolats', en: 'a box of chocolates' },
          },
          { zh: '一盒牛奶', pinyin: 'yì hé niúnǎi', alt: ['口'], tr: { fr: 'une brique de lait', en: 'a carton of milk' } },
        ],
      },
      {
        char: '包',
        pinyin: 'bāo',
        generic: true,
        usage: { fr: 'Paquets, sachets : « un paquet de »', en: 'Packets, bags: "a pack of"' },
        examples: [
          {
            zh: '一包烟',
            pinyin: 'yì bāo yān',
            alt: ['支', '根', '条', '口'],
            tr: { fr: 'un paquet de cigarettes', en: 'a pack of cigarettes' },
          },
          {
            zh: '一包饼干',
            pinyin: 'yì bāo bǐnggān',
            alt: ['块', '片', '口'],
            tr: { fr: 'un paquet de biscuits', en: 'a packet of biscuits' },
          },
        ],
      },
      {
        char: '份',
        pinyin: 'fèn',
        generic: true,
        usage: {
          fr: 'Portions, parts ; exemplaires (journal, document) ; cadeaux, emplois',
          en: 'Portions, shares; copies (newspaper, document); gifts, jobs',
        },
        examples: [
          { zh: '一份报纸', pinyin: 'yí fèn bàozhǐ', alt: ['张'], tr: { fr: 'un journal', en: 'a newspaper' } },
          { zh: '一份工作', pinyin: 'yí fèn gōngzuò', tr: { fr: 'un emploi', en: 'a job' } },
          { zh: '一份礼物', pinyin: 'yí fèn lǐwù', alt: ['件'], tr: { fr: 'un cadeau', en: 'a gift' } },
        ],
      },
    ],
  },
  {
    title: { fr: 'Véhicules & appareils', en: 'Vehicles & devices' },
    items: [
      {
        char: '辆',
        pinyin: 'liàng',
        usage: { fr: 'Véhicules terrestres : voitures, vélos, bus', en: 'Land vehicles: cars, bikes, buses' },
        examples: [
          { zh: '一辆车', pinyin: 'yí liàng chē', alt: ['台', '部'], tr: { fr: 'une voiture', en: 'a car' } },
          { zh: '两辆自行车', pinyin: 'liǎng liàng zìxíngchē', alt: ['部'], tr: { fr: 'deux vélos', en: 'two bikes' } },
          { zh: '一辆公共汽车', pinyin: 'yí liàng gōnggòng qìchē', alt: ['部'], tr: { fr: 'un bus', en: 'a bus' } },
        ],
      },
      {
        char: '台',
        pinyin: 'tái',
        usage: {
          fr: 'Machines, appareils : ordinateur, télévision, machine',
          en: 'Machines, devices: computers, TVs, machines',
        },
        examples: [
          { zh: '一台电脑', pinyin: 'yì tái diànnǎo', alt: ['部'], tr: { fr: 'un ordinateur', en: 'a computer' } },
          { zh: '两台电视', pinyin: 'liǎng tái diànshì', alt: ['部'], tr: { fr: 'deux télévisions', en: 'two TVs' } },
          { zh: '一台机器', pinyin: 'yì tái jīqì', alt: ['部', '架'], tr: { fr: 'une machine', en: 'a machine' } },
        ],
      },
      {
        char: '部',
        pinyin: 'bù',
        usage: { fr: 'Films, œuvres, ouvrages ; téléphones', en: 'Films, works, books; phones' },
        examples: [
          { zh: '一部电影', pinyin: 'yí bù diànyǐng', alt: ['场'], tr: { fr: 'un film', en: 'a film' } },
          {
            zh: '一部手机',
            pinyin: 'yí bù shǒujī',
            alt: ['台', '只'],
            tr: { fr: 'un téléphone portable', en: 'a mobile phone' },
          },
          { zh: '一部小说', pinyin: 'yí bù xiǎoshuō', alt: ['本', '篇', '套'], tr: { fr: 'un roman', en: 'a novel' } },
        ],
      },
      {
        char: '架',
        pinyin: 'jià',
        usage: { fr: 'Avions ; pianos, objets à armature', en: 'Planes; pianos, objects with a frame' },
        examples: [
          { zh: '一架飞机', pinyin: 'yí jià fēijī', tr: { fr: 'un avion', en: 'a plane' } },
          { zh: '一架钢琴', pinyin: 'yí jià gāngqín', alt: ['台'], tr: { fr: 'un piano', en: 'a piano' } },
        ],
      },
    ],
  },
  {
    title: { fr: 'Lieux & bâtiments', en: 'Places & buildings' },
    items: [
      {
        char: '家',
        pinyin: 'jiā',
        usage: {
          fr: 'Établissements : entreprises, magasins, restaurants, banques',
          en: 'Businesses: companies, shops, restaurants, banks',
        },
        examples: [
          { zh: '一家公司', pinyin: 'yì jiā gōngsī', tr: { fr: 'une entreprise', en: 'a company' } },
          { zh: '两家商店', pinyin: 'liǎng jiā shāngdiàn', alt: ['间'], tr: { fr: 'deux magasins', en: 'two shops' } },
          { zh: '一家银行', pinyin: 'yì jiā yínháng', alt: ['座'], tr: { fr: 'une banque', en: 'a bank' } },
        ],
      },
      {
        char: '所',
        pinyin: 'suǒ',
        usage: {
          fr: 'Institutions : écoles, universités, hôpitaux ; maisons',
          en: 'Institutions: schools, universities, hospitals; houses',
        },
        examples: [
          { zh: '一所学校', pinyin: 'yì suǒ xuéxiào', alt: ['座'], tr: { fr: 'une école', en: 'a school' } },
          { zh: '一所大学', pinyin: 'yì suǒ dàxué', alt: ['座'], tr: { fr: 'une université', en: 'a university' } },
          { zh: '一所医院', pinyin: 'yì suǒ yīyuàn', alt: ['家', '座'], tr: { fr: 'un hôpital', en: 'a hospital' } },
        ],
      },
      {
        char: '座',
        pinyin: 'zuò',
        usage: {
          fr: 'Grandes constructions fixes : montagnes, ponts, bâtiments, villes',
          en: 'Large fixed structures: mountains, bridges, buildings, cities',
        },
        examples: [
          { zh: '一座山', pinyin: 'yí zuò shān', tr: { fr: 'une montagne', en: 'a mountain' } },
          { zh: '一座桥', pinyin: 'yí zuò qiáo', tr: { fr: 'un pont', en: 'a bridge' } },
          { zh: '一座城市', pinyin: 'yí zuò chéngshì', tr: { fr: 'une ville', en: 'a city' } },
        ],
      },
      {
        char: '间',
        pinyin: 'jiān',
        usage: { fr: 'Pièces, salles', en: 'Rooms' },
        examples: [
          { zh: '一间卧室', pinyin: 'yì jiān wòshì', tr: { fr: 'une chambre', en: 'a bedroom' } },
          { zh: '两间教室', pinyin: 'liǎng jiān jiàoshì', tr: { fr: 'deux salles de classe', en: 'two classrooms' } },
          { zh: '一间办公室', pinyin: 'yì jiān bàngōngshì', tr: { fr: 'un bureau (pièce)', en: 'an office (room)' } },
        ],
      },
      {
        char: '层',
        pinyin: 'céng',
        usage: { fr: 'Étages ; couches', en: 'Floors; layers' },
        examples: [
          {
            zh: '我住在五层',
            pinyin: 'wǒ zhù zài wǔ céng',
            tr: { fr: 'j\'habite au cinquième étage', en: 'I live on the fifth floor' },
          },
          {
            zh: '一层灰',
            pinyin: 'yì céng huī',
            alt: ['片'],
            tr: { fr: 'une couche de poussière', en: 'a layer of dust' },
          },
        ],
      },
      {
        char: '扇',
        pinyin: 'shàn',
        usage: { fr: 'Portes, fenêtres', en: 'Doors, windows' },
        examples: [
          { zh: '一扇门', pinyin: 'yí shàn mén', alt: ['道'], tr: { fr: 'une porte', en: 'a door' } },
          { zh: '两扇窗户', pinyin: 'liǎng shàn chuānghu', tr: { fr: 'deux fenêtres', en: 'two windows' } },
        ],
      },
    ],
  },
  {
    title: { fr: 'Textes, paroles & cours', en: 'Texts, speech & classes' },
    items: [
      {
        char: '本',
        pinyin: 'běn',
        usage: { fr: 'Livres, cahiers, magazines (choses reliées)', en: 'Books, notebooks, magazines (bound things)' },
        examples: [
          { zh: '一本书', pinyin: 'yì běn shū', alt: ['套', '部'], tr: { fr: 'un livre', en: 'a book' } },
          { zh: '两本杂志', pinyin: 'liǎng běn zázhì', tr: { fr: 'deux magazines', en: 'two magazines' } },
          { zh: '一本词典', pinyin: 'yì běn cídiǎn', alt: ['部'], tr: { fr: 'un dictionnaire', en: 'a dictionary' } },
        ],
      },
      {
        char: '封',
        pinyin: 'fēng',
        usage: { fr: 'Lettres, e-mails', en: 'Letters, emails' },
        examples: [
          { zh: '一封信', pinyin: 'yì fēng xìn', tr: { fr: 'une lettre', en: 'a letter' } },
          { zh: '一封邮件', pinyin: 'yì fēng yóujiàn', alt: ['条'], tr: { fr: 'un e-mail', en: 'an email' } },
        ],
      },
      {
        char: '首',
        pinyin: 'shǒu',
        usage: { fr: 'Chansons, poèmes', en: 'Songs, poems' },
        examples: [
          { zh: '一首歌', pinyin: 'yì shǒu gē', alt: ['支'], tr: { fr: 'une chanson', en: 'a song' } },
          { zh: '一首诗', pinyin: 'yì shǒu shī', alt: ['篇', '句'], tr: { fr: 'un poème', en: 'a poem' } },
        ],
      },
      {
        char: '篇',
        pinyin: 'piān',
        usage: { fr: 'Textes écrits : articles, essais, rédactions', en: 'Written texts: articles, essays, compositions' },
        examples: [
          { zh: '一篇文章', pinyin: 'yì piān wénzhāng', alt: ['段'], tr: { fr: 'un article', en: 'an article' } },
          {
            zh: '一篇日记',
            pinyin: 'yì piān rìjì',
            alt: ['本', '段'],
            tr: { fr: 'une page de journal intime', en: 'a diary entry' },
          },
          {
            zh: '一篇论文',
            pinyin: 'yì piān lùnwén',
            tr: { fr: 'un mémoire, une thèse', en: 'a thesis, a dissertation' },
          },
        ],
      },
      {
        char: '句',
        pinyin: 'jù',
        usage: { fr: 'Phrases, paroles, vers', en: 'Sentences, words spoken, lines of verse' },
        examples: [
          { zh: '一句话', pinyin: 'yí jù huà', alt: ['段'], tr: { fr: 'une phrase', en: 'a sentence' } },
          {
            zh: '他会说几句汉语',
            pinyin: 'tā huì shuō jǐ jù Hànyǔ',
            tr: { fr: 'il sait dire quelques phrases de chinois', en: 'he can say a few sentences in Chinese' },
          },
        ],
      },
      {
        char: '幅',
        pinyin: 'fú',
        usage: { fr: 'Peintures, tableaux, cartes', en: 'Paintings, pictures, maps' },
        examples: [
          { zh: '一幅画', pinyin: 'yì fú huà', alt: ['张'], tr: { fr: 'un tableau, une peinture', en: 'a painting' } },
          { zh: '一幅地图', pinyin: 'yì fú dìtú', alt: ['张', '本'], tr: { fr: 'une carte (géographique)', en: 'a map' } },
        ],
      },
      {
        char: '段',
        pinyin: 'duàn',
        usage: {
          fr: 'Segments : période de temps, passage de texte, tronçon',
          en: 'Segments: periods of time, passages of text, stretches',
        },
        examples: [
          { zh: '一段时间', pinyin: 'yí duàn shíjiān', tr: { fr: 'un certain temps', en: 'a while' } },
          {
            zh: '一段话',
            pinyin: 'yí duàn huà',
            alt: ['句'],
            tr: { fr: 'un passage, quelques mots', en: 'a passage, a few words' },
          },
          { zh: '一段路', pinyin: 'yí duàn lù', alt: ['条'], tr: { fr: 'un bout de chemin', en: 'a stretch of road' } },
        ],
      },
      {
        char: '节',
        pinyin: 'jié',
        usage: { fr: 'Séances de cours ; sections ; piles', en: 'Class periods; sections; batteries' },
        examples: [
          {
            zh: '一节课',
            pinyin: 'yì jié kè',
            alt: ['门'],
            tr: { fr: 'une heure de cours', en: 'a class (lesson period)' },
          },
          { zh: '两节电池', pinyin: 'liǎng jié diànchí', alt: ['块'], tr: { fr: 'deux piles', en: 'two batteries' } },
        ],
      },
      {
        char: '门',
        pinyin: 'mén',
        usage: { fr: 'Matières, disciplines, langues', en: 'Subjects, disciplines, languages' },
        examples: [
          {
            zh: '一门课',
            pinyin: 'yì mén kè',
            alt: ['节'],
            tr: { fr: 'une matière, un cours', en: 'a subject, a course' },
          },
          {
            zh: '两门外语',
            pinyin: 'liǎng mén wàiyǔ',
            tr: { fr: 'deux langues étrangères', en: 'two foreign languages' },
          },
        ],
      },
      {
        char: '道',
        pinyin: 'dào',
        usage: {
          fr: 'Plats d\'un repas ; questions d\'exercice ; portes, murs',
          en: 'Dishes of a meal; exercise questions; doors, walls',
        },
        examples: [
          { zh: '一道菜', pinyin: 'yí dào cài', alt: ['口'], tr: { fr: 'un plat', en: 'a dish' } },
          {
            zh: '三道题',
            pinyin: 'sān dào tí',
            alt: ['套'],
            tr: { fr: 'trois questions (exercice)', en: 'three questions (exercise)' },
          },
        ],
      },
    ],
  },
  {
    title: { fr: 'Sortes & quantités vagues', en: 'Kinds & vague amounts' },
    items: [
      {
        char: '种',
        pinyin: 'zhǒng',
        generic: true,
        usage: { fr: 'Sortes, types, espèces', en: 'Kinds, types, species' },
        examples: [
          {
            zh: '三种颜色',
            pinyin: 'sān zhǒng yánsè',
            tr: { fr: 'trois (sortes de) couleurs', en: 'three (kinds of) colors' },
          },
          { zh: '一种语言', pinyin: 'yì zhǒng yǔyán', alt: ['门'], tr: { fr: 'une langue', en: 'a language' } },
          {
            zh: '这种情况',
            pinyin: 'zhè zhǒng qíngkuàng',
            tr: { fr: 'ce genre de situation', en: 'this kind of situation' },
          },
        ],
      },
      {
        char: '些',
        pinyin: 'xiē',
        generic: true,
        usage: {
          fr: 'Quelques, un certain nombre (pluriel indéfini, avec 一/这/那/有)',
          en: 'Some, a number of (indefinite plural, with 一/这/那/有)',
        },
        examples: [
          { zh: '一些人', pinyin: 'yì xiē rén', alt: ['群'], tr: { fr: 'quelques personnes', en: 'a few people' } },
          { zh: '这些天', pinyin: 'zhè xiē tiān', tr: { fr: 'ces jours-ci', en: 'these days' } },
          { zh: '有些问题', pinyin: 'yǒu xiē wèntí', alt: ['道'], tr: { fr: 'certains problèmes', en: 'some problems' } },
        ],
      },
    ],
  },
  {
    title: { fr: 'Actions (classificateurs verbaux)', en: 'Actions (verbal classifiers)' },
    note: {
      fr: 'Ils se placent après le verbe et comptent combien de fois l\'action a lieu.',
      en: 'They come after the verb and count how many times the action happens.',
    },
    items: [
      {
        char: '次',
        pinyin: 'cì',
        usage: { fr: 'Nombre de fois (une action, un événement)', en: 'Number of times (an action, an event)' },
        examples: [
          {
            zh: '我去过北京两次',
            pinyin: 'wǒ qù guo Běijīng liǎng cì',
            alt: ['趟'],
            tr: { fr: 'je suis allé deux fois à Pékin', en: 'I\'ve been to Beijing twice' },
          },
          {
            zh: '我看过这部电影三次',
            pinyin: 'wǒ kàn guo zhè bù diànyǐng sān cì',
            alt: ['遍'],
            tr: { fr: 'j\'ai vu ce film trois fois', en: 'I\'ve seen this film three times' },
          },
        ],
      },
      {
        char: '遍',
        pinyin: 'biàn',
        usage: {
          fr: 'Fois, du début à la fin (lire, écouter, répéter en entier)',
          en: 'Times, from start to finish (reading, listening, repeating in full)',
        },
        examples: [
          {
            zh: '请再说一遍',
            pinyin: 'qǐng zài shuō yí biàn',
            alt: ['次'],
            tr: { fr: 'répétez, s\'il vous plaît', en: 'please say it again' },
          },
          {
            zh: '这本书我看了三遍',
            pinyin: 'zhè běn shū wǒ kàn le sān biàn',
            alt: ['次'],
            tr: { fr: 'j\'ai lu ce livre trois fois', en: 'I\'ve read this book three times' },
          },
        ],
      },
      {
        char: '趟',
        pinyin: 'tàng',
        usage: { fr: 'Trajets, allers-retours', en: 'Trips, round trips' },
        examples: [
          {
            zh: '我去了一趟超市',
            pinyin: 'wǒ qù le yí tàng chāoshì',
            alt: ['次'],
            tr: { fr: 'j\'ai fait un saut au supermarché', en: 'I popped over to the supermarket' },
          },
          {
            zh: '他来了两趟',
            pinyin: 'tā lái le liǎng tàng',
            alt: ['次'],
            tr: { fr: 'il est venu deux fois', en: 'he came twice' },
          },
        ],
      },
      {
        char: '场',
        pinyin: 'chǎng',
        usage: {
          fr: 'Événements, séances : match, film, pluie, spectacle',
          en: 'Events, sessions: matches, films, rain, shows',
        },
        examples: [
          { zh: '一场比赛', pinyin: 'yì chǎng bǐsài', alt: ['次'], tr: { fr: 'un match', en: 'a match' } },
          { zh: '一场大雨', pinyin: 'yì chǎng dà yǔ', alt: ['次'], tr: { fr: 'une grosse averse', en: 'a heavy shower' } },
          {
            zh: '看一场电影',
            pinyin: 'kàn yì chǎng diànyǐng',
            alt: ['部'],
            tr: { fr: 'voir une séance de cinéma', en: 'see a film showing' },
          },
        ],
      },
      {
        char: '顿',
        pinyin: 'dùn',
        usage: { fr: 'Repas ; (familier) une engueulade, une raclée', en: 'Meals; (informal) a scolding, a beating' },
        examples: [
          { zh: '一顿饭', pinyin: 'yí dùn fàn', alt: ['次', '口'], tr: { fr: 'un repas', en: 'a meal' } },
          {
            zh: '他被骂了一顿',
            pinyin: 'tā bèi mà le yí dùn',
            alt: ['次', '场'],
            tr: { fr: 'il s\'est fait engueuler', en: 'he got told off' },
          },
        ],
      },
    ],
  },
]

export const CLASSIFIERS = CLASSIFIER_GROUPS.flatMap(g => g.items.map(item => ({ ...item, group: g.title })))

// Clé de progression (même magasin IndexedDB / synchronisation que les mots HSK).
export const classifierKey = cl => `cl_${cl.char}`
