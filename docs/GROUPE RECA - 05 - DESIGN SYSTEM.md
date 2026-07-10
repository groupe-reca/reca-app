# GROUPE RECA
# LIVRABLE 05 — DESIGN SYSTEM & EXPÉRIENCE UTILISATEUR (UX/UI)

**Projet :** Groupe RECA – Centre des opérations

**Version :** 1.0

**Développé par :** Signa

---

# Vision

Le Centre des opérations ne doit jamais donner l'impression d'utiliser un CRM traditionnel.

Notre objectif est de concevoir une expérience qui rappelle les meilleurs logiciels SaaS actuels.

Inspirations :

- Linear
- Vercel
- Stripe Dashboard
- Raycast
- Notion
- Apple

L'utilisateur doit ressentir immédiatement :

• Rapidité

• Contrôle

• Simplicité

• Qualité

---

# Philosophie

Le design n'est pas décoratif.

Le design est un outil.

Chaque élément visuel doit aider l'utilisateur à prendre une décision rapidement.

---

# Les règles Signa

Nous suivrons les principes suivants :

## 1.

Moins d'éléments.

Plus de clarté.

---

## 2.

Une seule action principale par écran.

---

## 3.

Les informations importantes apparaissent toujours avant les informations secondaires.

---

## 4.

Aucune surcharge.

Le vide fait partie du design.

---

## 5.

Les couleurs servent uniquement à transmettre une information.

Jamais pour décorer.

---

# Structure de l'application

```
+------------------------------------------------------+

 Sidebar          Header

--------------------------------------------------------

 Breadcrumb

--------------------------------------------------------

 Contenu

--------------------------------------------------------

```

Navigation permanente.

Jamais de menu compliqué.

---

# Sidebar

Toujours visible.

Largeur :

280 px

Contient :

- Logo RECA

- Centre des opérations

- Navigation

- Profil utilisateur

- Paramètres

Le menu actif sera identifié par :

- fond légèrement coloré

- barre verticale Rouge RECA

- animation discrète

---

# Header

Toujours fixe.

Comprend :

Recherche globale

Notifications

Profil

Boutons rapides

Le header ne doit jamais dépasser 72 px.

---

# Breadcrumb

Toujours visible.

Exemple :

```
Centre des opérations

>

Clients

>

Jean Tremblay
```

---

# Espacement

Nous utiliserons une grille de 8 px.

Tous les composants respecteront cette règle.

---

# Coins

Boutons

10 px

Inputs

10 px

Cards

16 px

Modal

20 px

Uniformité sur toute l'application.

---

# Ombres

Très discrètes.

Jamais d'effet "Bootstrap".

Le contraste proviendra principalement :

des espaces

des bordures

des couleurs

---

# Bordures

Très fines.

Utilisées pour séparer les informations.

Jamais épaisses.

---

# Typographie

Police :

Manrope

Hiérarchie

Titre principal

36 px

Titre section

24 px

Sous-titre

18 px

Texte

15 px

Labels

13 px

---

# Icônes

Lucide React.

Même taille partout.

Même épaisseur.

Jamais de mélange de bibliothèques.

---

# Boutons

Trois niveaux seulement.

Primaire

Rouge RECA

Secondaire

Blanc

Bordure légère

Fantôme

Sans fond

Pour les actions secondaires.

---

# Inputs

Même hauteur partout.

Icône à gauche.

Placeholder discret.

Validation immédiate.

---

# Tableaux

Le cœur du logiciel.

Les tableaux devront permettre :

Recherche

Tri

Filtres

Colonnes configurables

Sélection multiple

Pagination

Export futur

---

# Cartes

Les cartes servent uniquement à résumer une information.

Jamais de texte inutile.

Exemple

```
134

Clients actifs

+8

ce mois-ci
```

---

# Badges

Peuvent représenter :

Statut

Priorité

Paiement

Contrat

Couleurs normalisées.

---

# Modales

Une seule action importante.

Boutons toujours identiques.

Annuler

Confirmer

---

# États visuels

Chaque écran devra gérer :

Loading

Skeleton

Empty

Erreur

Succès

Jamais un écran vide.

---

# Skeleton Loader

Tous les chargements utiliseront des Skeletons.

Jamais de spinner pleine page.

---

# Notifications

Coin supérieur droit.

Disparaissent automatiquement.

Possibilité d'ouvrir un centre de notifications dans une future version.

---

# Couleurs fonctionnelles

Rouge

Action principale

Vert

Succès

Orange

Attention

Bleu

Information

Gris

Information secondaire

---

# Animations

Durée

150 à 250 ms

Transitions douces.

Aucune animation spectaculaire.

---

# Dashboard

Nous abandonnons complètement le mot Dashboard.

Le logiciel ouvrira sur :

# Centre des opérations

L'utilisateur doit immédiatement comprendre la situation de l'entreprise.

---

# Première vue

Le propriétaire verra immédiatement :

Conditions météo

Routes en cours

Demandes de soumission

Factures à recevoir

Paiements récents

Employés actifs

Équipements disponibles

Activité récente

---

# Recherche globale

Accessible partout.

Elle devra retrouver :

Client

Facture

Employé

Contrat

Lead

Route

Équipement

Sans changer de page.

---

# Expérience employé

L'application employé sera différente.

Très peu de boutons.

Très grosses zones tactiles.

Navigation simple.

Utilisable avec des gants.

---

# Responsive

Desktop

Version principale.

---

Tablette

100 % compatible.

---

Mobile

Version adaptée.

Navigation simplifiée.

Menus réorganisés.

---

# Accessibilité

Navigation clavier.

Contrastes élevés.

Focus visible.

Police lisible.

Zones tactiles suffisantes.

---

# Performance

Objectif :

Moins de deux secondes jusqu'à l'affichage complet.

Navigation instantanée.

Transitions fluides.

---

# Standards Signa

Avant qu'un écran soit considéré terminé, il doit répondre aux critères suivants :

✓ Compréhensible en moins de cinq secondes.

✓ Une seule action principale.

✓ Aucune distraction.

✓ Navigation évidente.

✓ Compatible mobile.

✓ Performant.

✓ Accessible.

✓ Cohérent avec tous les autres modules.

---

# Signature du Centre des opérations

Le propriétaire ne doit jamais avoir l'impression d'utiliser un logiciel développé sur mesure.

Il doit avoir l'impression d'utiliser une plateforme SaaS de classe mondiale.

Notre référence n'est pas un logiciel de déneigement.

Notre référence est la qualité d'exécution de Linear, Vercel et Stripe.

Le Centre des opérations de Groupe RECA deviendra la nouvelle référence de Signa en matière de logiciels d'entreprise.
