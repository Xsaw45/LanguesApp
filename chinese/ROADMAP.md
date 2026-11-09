# Feuille de route — application de chinois

Objectif à terme : vendre l'application de chinois seule (sans l'italien), en français et en anglais pour commencer.

## Fait

- Modules : Pinyin et tons (7 leçons, audio, tableau des sons), Vocabulaire HSK 1–9 (répétition espacée),
  Grammaire (25 points HSK 1–2), Classificateurs (56).
- Bouton écouter sur les mots (enregistrements CC BY-SA, voix du téléphone sinon).
- Design (passe unslop), icônes lucide, mises à jour visibles sans fermer l'app, hors ligne.
- Langue de l'utilisateur (français / anglais) dans les paramètres ; définitions du vocabulaire en français
  (CFDICT) et en anglais (CC-CEDICT) ; lecture des caractères corrigée d'après la liste HSK 3.0.

## Priorités

1. **Vocabulaire juste** — fait : définitions dans la langue de l'utilisateur, bonne lecture des caractères à
   plusieurs prononciations (听 tīng, 说 shuō, 吗 ma…).
   Reste : mots sans définition française dans CFDICT (environ 4 %, affichés en anglais).
2. **Tests de vocabulaire plus variés** : écouter un mot → choisir le caractère ; voir un caractère → choisir le
   pinyin avec les tons ; QCM pour les mots nouveaux, saisie seulement quand le mot est presque connu.
3. **Caractères** : ordre des traits (animation puis tracé au doigt corrigé, bibliothèque Hanzi Writer, MIT ;
   données de traits Make Me a Hanzi, licence Arphic à vérifier pour la vente) ; clés (radicaux) avec leur sens.
4. **Lire et écouter des phrases** : petits textes gradués par niveau HSK (pinyin et traduction affichables,
   questions de compréhension) ; dialogues du quotidien (se présenter, commander, demander son chemin), écoutés
   puis reconstitués.

## Secondaire

- Page « Aujourd'hui » : tout ce qui est à réviser dans tous les modules, en une session.
- Suivi : jours d'affilée, mots appris par semaine, temps passé.
- Grammaire HSK 3 (把, 被, compléments de résultat et de direction, 越来越, 是…的…), puis HSK 4+.
- Recherche dans la liste des mots (caractère, pinyin, sens).
- Relecture du contenu écrit sans source (grammaire, classificateurs, leçons pinyin) par un locuteur natif,
  dans les deux langues.
- Audio des phrases d'exemple (grammaire, classificateurs) : service de synthèse vocale ou enregistrements, au lieu
  de la voix du téléphone.
- Prononciation : enregistrement de sa voix et comparaison avec le modèle (sans note automatique des tons, peu
  fiable).
- Erreur de lint connue : `src/components/AnswerInput.jsx` (setState dans un effet).

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
  - Le partage à l'identique (BY-SA) s'applique aux données, pas au code de l'app : publier les données modifiées
    (définitions nettoyées) sous la même licence.
- **Légal** : mentions légales, CGV / CGU, politique de confidentialité (RGPD), gestion des données de compte.
- **Produit** : premier lancement guidé (niveau, objectif), page de présentation, captures, essai gratuit.
- **Langues** : ajouter d'autres langues d'interface (espagnol, allemand…) avec le même système de traduction.
