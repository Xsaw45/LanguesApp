# Feuille de route — application de chinois

Objectif à terme : vendre l'application de chinois seule (sans l'italien), en français et en anglais pour commencer.

## Fait

- Modules : Pinyin et tons (7 leçons, audio, tableau des sons), Vocabulaire HSK 1–9 (répétition espacée),
  Caractères (2 998 caractères HSK 3.0, ordre des traits, tracé au doigt, 125 clés), Grammaire (33 points HSK 1–3),
  Lecture (13 textes et dialogues HSK 1–3), Classificateurs (56).
- Bouton écouter sur les mots (enregistrements CC BY-SA, sinon synthèse Google pour les mots de plusieurs
  caractères) et sur toutes les phrases (grammaire, classificateurs, lecture : une voix par personnage des dialogues).
- Design (passe unslop), icônes lucide, mises à jour visibles sans fermer l'app, hors ligne.
- Langue de l'utilisateur (français / anglais) dans les paramètres ; définitions du vocabulaire en français
  (CFDICT) et en anglais (CC-CEDICT) ; lecture des caractères corrigée d'après la liste HSK 3.0.
- Recherche dans la liste des mots, tous niveaux : caractères, pinyin avec ou sans tons, sens.
- Page « Aujourd'hui » : toutes les révisions dues en une séance ; jours d'affilée (un jour compte dès une réponse),
  éléments maîtrisés et temps de pratique (aujourd'hui, 7 jours ; pauses de plus de 90 s non comptées).

## Priorités

1. **Vocabulaire juste** — fait : définitions dans la langue de l'utilisateur, bonne lecture des caractères à
   plusieurs prononciations (听 tīng, 说 shuō, 吗 ma…).
   Reste : mots sans définition française dans CFDICT (environ 4 %, affichés en anglais).
2. **Tests de vocabulaire plus variés** — fait : le type de question suit la progression du mot (QCM de sens, puis
   écoute → caractère et pinyin avec les tons, puis saisie quand le mot est presque connu).
3. **Caractères** — fait : 300 caractères par niveau HSK 1 à 6 et 1 200 pour le 7–9 (liste officielle) ; ordre des
   traits animé, clé en couleur ; un caractère nouveau se trace sur le modèle, puis s'écrit de mémoire (Hanzi Writer) ;
   les 125 clés courantes avec leur sens et un test. Données de traits : licence Arphic, vente autorisée en
   fournissant le texte de la licence (`public/hanzi/LICENSE-ARPHIC.txt`).
4. **Lire et écouter des phrases** — fait du HSK 1 au 3 : 13 textes et dialogues (se présenter, restaurant,
   chemin, achats, médecin, téléphone, famille, journée, week-end, apprendre le chinois, hôtel, voyage, anniversaire) ;
   pinyin et traduction affichables, sens de chaque mot au toucher, phrases enregistrées ; questions de compréhension
   et phrases à remettre dans l'ordre. Reste : textes HSK 4 et plus ; relecture par un locuteur natif.

## Secondaire

- Grammaire HSK 4 et plus (fait jusqu'au HSK 3 : 把, 被, compléments de résultat, de direction et de possibilité,
  越来越, 是…的, 有点儿 / 一点儿).
- Relecture du contenu écrit sans source (grammaire, classificateurs, leçons pinyin) par un locuteur natif,
  dans les deux langues.
- Prononciation : enregistrement de sa voix et comparaison avec le modèle (sans note automatique des tons, peu
  fiable).

## Avant de vendre

- **Séparer l'app de chinois** de LanguesApp : son propre dépôt ou dossier de déploiement, son domaine, sans
  l'italien ni la page d'accueil commune.
- **Comptes et paiement** : aujourd'hui l'identité vient de Tailscale (réseau privé). Il faut des comptes
  (e-mail / Apple / Google), un paiement (abonnement ou achat unique : Stripe sur le web, achats intégrés dans les
  stores) et la synchronisation par compte.
- **Distribution** : PWA sur le web, puis Play Store (TWA) et App Store (Capacitor) ; tests sur vrais iPhone et
  Android (son, encoche, hors ligne).
- **Licences et mentions** (page « À propos / crédits » dans l'app et sur la page de vente) :
  - CC-CEDICT (définitions anglaises) : CC BY-SA 4.0.
  - CFDICT (définitions françaises) : CC BY-SA 3.0, citer https://chine.in/mandarin/dictionnaire/CFDICT/ dans
    l'app et sur les pages de présentation.
  - Liste HSK : drkameleon/complete-hsk-vocabulary (MIT) ; lectures : krmanik/HSK-3.0 (Pleco, MIT / CC BY-SA 4.0).
  - Enregistrements : hugolpz/audio-cmn (Chen Wang, Yue Tan / Shtooka), CC BY-SA.
  - Tracés des caractères : Make Me a Hanzi via hanzi-writer-data, Arphic Public License (joindre la licence) ;
    bibliothèque Hanzi Writer : MIT ; clés : Unihan (licence Unicode).
  - Le partage à l'identique (BY-SA) s'applique aux données, pas au code de l'app : publier les données modifiées
    (définitions nettoyées) sous la même licence.
- **Légal** : mentions légales, CGV / CGU, politique de confidentialité (RGPD), gestion des données de compte.
- **Produit** : premier lancement guidé (niveau, objectif), page de présentation, captures, essai gratuit.
- **Langues** : ajouter d'autres langues d'interface (espagnol, allemand…) avec le même système de traduction.
