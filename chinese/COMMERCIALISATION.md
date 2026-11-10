# Commercialisation — application de chinois

Notes de la discussion du 10 novembre 2026. Décisions prises par Erwan, propositions en attente de décision.

## Décidé

- **Abonnement**, en **web d'abord** (PWA). Si ça marche : Android, puis Apple.
- **Essai gratuit de 7 jours**, puis payant. Prix pas encore fixé.
- **Parrainage** pour faire venir des utilisateurs.
- Il faut un **nom d'app** et un **domaine** assorti.

## Nom et domaine (disponibilités vérifiées le 10/11/2026 auprès des registres, RDAP)

| Nom | .com | .app | .fr | Remarque |
|---|---|---|---|---|
| **Hanzimo** (préféré) | libre | libre | libre | court, même prononciation en français et en anglais, évoque 汉字 |
| Hanzi Dojo | pris | libre | libre | « salle d'entraînement aux caractères » |
| Mandaroo | pris | libre | libre | joueur, mascotte possible |
| Mandarinito | libre | libre | libre | long |

Pris (.com et .app) : pandarin, mandarine, xuexi, laoshi, zhongwen, tingshuo, kaishi, pinyo, hanzify…
À faire : acheter les trois extensions du nom choisi (≈ 30-40 €/an), le .com principal et les autres en
redirection ; vérifier qu'aucune marque n'existe déjà (INPI, EUIPO).

## Proposé (à décider)

- **Essai** : 7 jours complets **sans carte bancaire**, puis une **version gratuite limitée qui reste** (pinyin, début
  du HSK 1, page Aujourd'hui sur ce contenu), le reste payant. Un utilisateur non converti continue, garde sa série,
  s'abonne plus tard ou parraine. Alternative : carte demandée dès l'essai (moins d'inscrits, meilleure conversion).
- **Prix** de départ : 7,99 €/mois et 49,99 €/an (annuel mis en avant). Les concurrents (HelloChinese, Duolingo
  Super) seraient autour de 10-13 €/mois : à vérifier. Modifiable sans toucher au code.
- **Parrainage**, récompense des deux côtés : le filleul a 14 jours d'essai au lieu de 7 ; le parrain gagne 1 mois
  offert quand le filleul paie son premier mois (après le délai de remboursement, contre les faux comptes) ;
  plafond 12 mois par an ; lien personnel et compteur d'amis parrainés dans l'app.
- **Paiement** : un « vendeur officiel » (Merchant of Record) **Paddle** ou **Lemon Squeezy** plutôt que Stripe seul :
  ≈ 5 % + 0,50 € par paiement, mais ils gèrent la TVA européenne, les factures, les remboursements et les litiges.
  Stripe seul : ≈ 2 %, mais TVA à déclarer soi-même pays par pays (guichet OSS).

## Obligations légales (France, vente aux particuliers)

- Statut : micro-entreprise suffisante au départ.
- CGV avec case à cocher de renonciation au délai de rétractation de 14 jours (contenu numérique fourni tout de suite).
- Mentions légales, politique de confidentialité (RGPD), gestion et suppression des données de compte.
- Médiateur de la consommation : obligatoire pour vendre aux particuliers.
- Licences des données : voir « Avant de vendre » dans ROADMAP.md (CFDICT à citer sur les pages de vente).

## Stores (plus tard)

- Android : app web emballée (TWA ou Capacitor).
- Apple : un abonnement acheté dans l'app passe par l'achat intégré (15 % pour un petit développeur).
- Avec des comptes, un abonnement pris sur le web débloque aussi les apps.

## Travaux techniques, dans l'ordre

1. App séparée sur son domaine : sans l'italien ni la page d'accueil commune, sans l'identification Tailscale.
2. Comptes : connexion par lien envoyé par e-mail et avec Google ; progression rattachée au compte.
3. Essai, version gratuite, abonnement (Paddle ou Lemon Squeezy).
4. Parrainage.
5. Page de présentation avec tarifs ; pages légales.
6. Premier lancement guidé : niveau (test de placement), objectif par jour.

Les étapes 1 et 2 ne dépendent d'aucune décision ; le nom s'ajoute quand il est choisi.

## Décisions attendues

1. Le nom.
2. Le statut juridique (micro-entreprise existante ?).
3. Le modèle : 7 jours puis tout payant, ou 7 jours puis version gratuite limitée.
4. Paddle ou Lemon Squeezy (ou Stripe seul).
