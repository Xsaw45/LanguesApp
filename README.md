# LanguesApp

Italien et chinois dans une seule app web (PWA), privée sur le tailnet Tailscale, avec la progression
synchronisée par utilisateur entre ses appareils.

Fusion de [ItalianApp](https://github.com/Xsaw45/ItalianApp) et [chineseApp](https://github.com/Xsaw45/chineseApp)
(historiques conservés : `git log --follow italian/...`).

| Chemin | Contenu | Servi sur |
|---|---|---|
| `home/` | page d'accueil, manifeste PWA unique, icônes | `/` |
| `italian/` | app italienne (JS sans build) | `/it/` |
| `chinese/` | app chinoise (React + Vite, `base: '/zh/'`) | `/zh/` |
| `shared/sync.js` | client de synchronisation commun aux deux apps | `/shared/` |
| `server/` | Node 24 + Fastify : fichiers statiques + API + SQLite (`node:sqlite`) | |

## Synchronisation

- **Identité** : en-tête `Tailscale-User-Login` posé par Tailscale Serve (aucun compte ni mot de passe). Le serveur
  ne doit être joignable que via Serve, qui supprime ces en-têtes s'ils viennent du client.
- **Données** : chaque app garde son stockage local (`localStorage` pour l'italien, IndexedDB pour le chinois) et
  fonctionne hors ligne. Les modifications sont découpées en enregistrements (`vocab/casa`, `schede/12`,
  `hsk1_0100`, …) et envoyées à `POST /api/sync/<it|zh>`.
- **Fusion** : par enregistrement, le plus récent gagne (horloge de l'appareil). Le serveur renvoie ce qui a changé
  depuis le curseur de l'appareil, plus sa version des enregistrements refusés.
- **Quand** : au démarrage (attente de 4 s max), 1,5 s après chaque modification, au retour en ligne ou sur l'onglet,
  et toutes les minutes.
- **Appareil passé à un autre compte Tailscale** : le serveur répond 409, l'appareil efface ses données locales et
  recharge celles du nouvel utilisateur.
- Progression d'avant la fusion (site Netlify) : italien → *Paramètres > Exporter* sur l'ancien site, puis
  *Importer* ici (l'import est synchronisé).

## Développement

```bash
docker build -t langues-app .
docker run --rm -p 8080:8080 -e DEV_USER=moi@local -v "$PWD/data:/data" langues-app   # http://localhost:8080
cd server && npm install && npm test
```

`DEV_USER` remplace l'identité Tailscale : **jamais en production**.

Italien : son service worker sert tout depuis le cache. Après une modification de `italian/` ou `shared/`,
incrémenter `CACHE_NAME` dans `italian/sw.js` (et ajouter les nouveaux fichiers à `ASSETS_TO_CACHE`).

Chinois, données (dans `chinese/`) :
- `node scripts/build-data.js` : vocabulaire HSK (drkameleon/complete-hsk-vocabulary), lecture enseignée par le HSK
  (krmanik/HSK-3.0), définitions anglaises (CC-CEDICT) et françaises ([CFDICT](https://chine.in/mandarin/dictionnaire/CFDICT/),
  CC BY-SA 3.0 : citer la source dans l'app et sur les pages de présentation).
- puis `node scripts/fetch-audio.js` : copie dans `public/audio/` les enregistrements de
  [hugolpz/audio-cmn](https://github.com/hugolpz/audio-cmn) (syllabes : Chen Wang ; mots HSK : Yue Tan / Shtooka ;
  licence CC BY-SA) et écrit `src/data/audio.json`.
- puis `node scripts/fetch-tts-audio.js` : enregistre avec Google Cloud Text-to-Speech (voix Chirp 3 HD) les phrases
  (grammaire, classificateurs, lecture, une voix par personnage des dialogues) et les mots HSK de plusieurs caractères
  sans enregistrement humain, dans `public/audio/tts/`, et écrit `src/data/ttsAudio.json`. Clé `GOOGLE_TTS_KEY` dans
  `chinese/.env.local` (non commitée) ; seuls les textes nouveaux sont demandés (environ 12 500 caractères en tout,
  gratuit). Restent lus par la voix chinoise du téléphone : les caractères seuls au ton neutre sans enregistrement.
- puis `node scripts/build-hanzi.js` : caractères par niveau (krmanik/HSK-3.0, « HSK Hanzi »), clé (Unihan), sens
  (CC-CEDICT, CFDICT) dans `src/data/hanzi.json` ; copie les tracés de `hanzi-writer-data` (Make Me a Hanzi, Arphic
  Public License, texte joint dans `public/hanzi/`) dans `public/hanzi/`.

Chinois, langues : l'utilisateur choisit français ou anglais dans les paramètres (réglage synchronisé). Textes
d'interface dans `src/i18n/strings.js` ; contenus (leçons, grammaire, classificateurs) en `{ fr, en }` dans
`src/data`. Feuille de route et prérequis pour la vente : `chinese/ROADMAP.md`.

## Production

VPS, `/srv/services/langues` (configuration dans le dépôt `vps-config`) : conteneur `app` + conteneur Tailscale
(nœud `langues`, `https://langues.<tailnet>.ts.net`), base dans `data/langues.db`. Mise à jour : `./deploy.sh`.
