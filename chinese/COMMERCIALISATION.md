# Commercialisation — application de chinois

Notes de la discussion des 10 et 11 novembre 2026. Décisions prises par Erwan, propositions en attente de décision.

## Décidé

- **Abonnement**, en **web d'abord** (PWA). Si ça marche : Android, puis Apple.
- **Essai gratuit de 7 jours**, puis payant. Prix pas encore fixé.
- **Parrainage** pour faire venir des utilisateurs.
- **Statut juridique** : entreprise individuelle (EI) sous le régime micro-entreprise pour démarrer seul.
- **Paiement web** : **Paddle**, vendeur officiel (« Merchant of Record ») qui encaisse les clients et gère les
  abonnements, les taxes sur les ventes et le support lié aux paiements.
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

## Statut juridique retenu

**Entreprise individuelle (EI) sous le régime micro-entreprise**, sans société ni capital social au lancement.
Il n'y a donc pas de statuts de société à rédiger. L'activité à déclarer au guichet unique de l'INPI :

> Édition et exploitation d'une application web d'apprentissage linguistique ; fourniture, par abonnement, d'un
> accès à un service numérique en ligne.

- Immatriculation sur le [guichet unique des formalités](https://formalites.entreprises.gouv.fr/) avant la première
  vente. Choix recommandé : déclaration mensuelle du chiffre d'affaires.
- Le plafond 2026 du régime micro pour les prestations de services et activités libérales est de **83 600 € HT**.
  Le classement exact BIC ou BNC et le taux social correspondant doivent être confirmés par l'INPI ou l'Urssaf lors
  de l'immatriculation ; ils ne sont pas devinés dans l'application.
- Le chiffre d'affaires à déclarer est la recette réellement encaissée. Paddle ne remplace ni les déclarations
  Urssaf, ni l'impôt français, ni la CFE, ni la tenue du livre des recettes.
- Revoir le choix avec un expert-comptable en approchant du plafond, avant d'embaucher ou de faire entrer un associé,
  ou si les frais réels deviennent importants ; une EURL ou une SASU pourra alors être plus adaptée.

Texte de base pour les mentions légales, à compléter après l'immatriculation sans inventer les champs manquants :

> Éditeur : Erwan [nom complet], entrepreneur individuel sous le régime micro-entreprise, exerçant sous le nom
> commercial [nom retenu], SIREN [numéro], domicilié [adresse professionnelle], contact : [adresse e-mail].

Sources officielles : [régime micro-social](https://entreprendre.service-public.gouv.fr/vosdroits/F37353) et
[régime micro-fiscal](https://entreprendre.service-public.gouv.fr/vosdroits/F23267), vérifiés en 2026.

## Prestataire retenu : Paddle

Paddle devient le vendeur officiel des abonnements web. Son offre sans abonnement mensuel est actuellement facturée
**5 % + 0,50 $ par transaction**. Elle comprend le paiement, le checkout, la facturation récurrente, le calcul,
l'encaissement et le reversement des taxes sur les ventes et de la TVA, les factures clients, la fraude, les
contestations de paiement et l'assistance liée aux paiements.

Pour l'application, il reste à intégrer le checkout Paddle, vérifier les webhooks côté serveur et ouvrir ou fermer
l'accès premium selon l'état de l'abonnement. Paddle ne prend pas en charge l'immatriculation française, les
déclarations Urssaf et fiscales, la CFE, les CGU/CGV, le RGPD ni la comptabilité propre de l'activité.

Ce choix coûte plus cher qu'un simple encaissement Stripe, particulièrement sur l'abonnement mensuel à petit prix,
mais évite de gérer la TVA consommateur pays par pays. Il est donc cohérent avec la demande d'un prestataire qui
prend en charge le maximum. Source : [tarification et périmètre Paddle](https://www.paddle.com/pricing).

## Obligations légales (France, vente aux particuliers)

- Statut retenu : entreprise individuelle au régime micro-entreprise ; immatriculation et champs légaux encore à
  compléter avant la première vente.
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
3. Essai, version gratuite et abonnement avec Paddle.
4. Parrainage.
5. Page de présentation avec tarifs ; pages légales.
6. Premier lancement guidé : langue puis test de placement (fait), objectif par jour (reste).

Les étapes 1 et 2 ne dépendent d'aucune décision ; le nom s'ajoute quand il est choisi.

## Décisions encore attendues

1. Le nom.
2. Le modèle : 7 jours puis tout payant, ou 7 jours puis version gratuite limitée.
3. Le prix final.
