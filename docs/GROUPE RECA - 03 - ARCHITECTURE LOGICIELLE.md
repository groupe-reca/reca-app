# GROUPE RECA
# LIVRABLE 03 — ARCHITECTURE LOGICIELLE

**Projet :** Groupe RECA – Centre des opérations

**Version :** 1.0

**Développé par :** Signa

---

# Objectif

Construire une architecture moderne, modulaire et évolutive qui permettra à Groupe RECA d'opérer l'ensemble de ses activités à partir d'une seule application.

Cette architecture devra privilégier :

- Performance
- Simplicité
- Lisibilité
- Réutilisation du code
- Facilité de maintenance
- Sécurité

---

# Philosophie

Une application complexe doit être simple à comprendre.

L'objectif est que n'importe quel développeur rejoignant le projet dans plusieurs années puisse comprendre rapidement son fonctionnement.

Nous privilégions :

- petits composants
- logique séparée
- conventions strictes
- typage complet
- architecture modulaire

---

# Stack officielle

## Frontend

React 19

Vite

TypeScript

React Router

TanStack Query

React Hook Form

Zod

Tailwind CSS

Framer Motion

Lucide React

---

## Backend

Supabase

PostgreSQL

Storage

Edge Functions (si nécessaire)

Realtime (future version)

---

# Structure générale

```
src/

app/

assets/

components/

features/

hooks/

layouts/

lib/

pages/

routes/

services/

stores/

styles/

types/

utils/

```

---

# Architecture par module

Chaque module possède sa propre structure.

Exemple :

```
features/

clients/

components/

pages/

hooks/

services/

schemas/

types/

utils/

```

Le même principe sera appliqué à :

Leads

Soumissions

Clients

Contrats

Factures

Paiements

Routes

Équipements

Employés

Paramètres

---

# Convention

Un module doit être autonome.

Il ne doit jamais dépendre directement d'un autre module.

Toute communication passe par :

Services

Hooks

Types

---

# Composants

Nous distinguons trois catégories.

## UI

Boutons

Inputs

Modal

Cards

Badge

Table

Tooltip

Dialog

Dropdown

Toast

Réutilisables partout.

---

## Shared

Composants métier réutilisables.

Exemple :

ClientCard

AddressCard

EmployeeAvatar

StatusBadge

---

## Module

Composants spécifiques.

Exemple

RouteTimeline

InvoicePreview

LeadPipeline

---

# Layouts

Deux layouts seulement.

## PublicLayout

Landing Page

Politique

Conditions

---

## AppLayout

Centre des opérations

Sidebar

Header

Breadcrumb

Navigation

---

# Navigation

Sidebar fixe.

Header fixe.

Navigation extrêmement rapide.

Aucune page ne doit dépasser trois clics.

---

# Routage

Convention :

```
/

landing

login

dashboard

leads

quotes

clients

contracts

invoices

payments

routes

equipment

employees

settings

```

Toutes les routes seront protégées.

---

# Gestion des états

Nous limitons les états globaux.

Utilisation de :

TanStack Query

pour :

API

Cache

Synchronisation

React State

pour :

États locaux

---

# Validation

Tous les formulaires utilisent :

React Hook Form

+

Zod

Aucune validation manuelle.

---

# Appels API

Toutes les requêtes passent par :

services/

Exemple :

```
services/

clients.service.ts

contracts.service.ts

routes.service.ts

```

Jamais directement dans les composants React.

---

# Types

Tous les objets sont typés.

Exemple

```
Client

Lead

Invoice

Employee

Contract

Route

Equipment

```

Aucun any autorisé.

---

# Dossiers interdits

Nous évitons :

helpers

misc

temp

functions

old

new

test2

Tous les dossiers doivent avoir une responsabilité claire.

---

# Conventions de nommage

Composants

PascalCase

```
ClientCard.tsx
```

Hooks

camelCase

```
useClients.ts
```

Services

```
clients.service.ts
```

Types

```
client.types.ts
```

Schemas

```
client.schema.ts
```

---

# Responsive

Desktop prioritaire.

Version mobile adaptée ensuite.

Toutes les pages devront néanmoins fonctionner correctement sur tablette.

---

# Performance

Objectif :

Chargement extrêmement rapide.

Nous privilégions :

Lazy Loading

Code Splitting

Memoization

Virtualisation des tableaux

Images WebP

Compression

---

# Gestion des erreurs

Chaque requête devra prévoir :

Loading

Success

Empty State

Error

Aucune page blanche.

---

# Notifications

Toutes les actions importantes génèrent un retour visuel.

Création

Modification

Suppression

Erreur

Succès

---

# Accessibilité

Contraste élevé.

Navigation clavier.

Focus visible.

ARIA lorsque nécessaire.

---

# Sécurité

Authentification Supabase.

Permissions par rôle.

Validation serveur.

Validation client.

Protection des routes.

---

# Journalisation

Toutes les erreurs importantes devront être enregistrées.

Prévoir une future intégration avec :

Sentry

---

# Tests

Chaque module devra être testé individuellement avant son intégration.

Aucun développement direct en production.

---

# Architecture du Centre des opérations

```
Application

│

├── Landing Page

│

├── Auth

│

└── Centre des opérations

│

├── Dashboard

├── Leads

├── Soumissions

├── Clients

├── Contrats

├── Factures

├── Paiements

├── Routes

├── Équipements

├── Employés

└── Paramètres

```

---

# Standards Signa

Chaque écran doit respecter les règles suivantes.

✔ Une responsabilité unique

✔ Aucun composant dépassant environ 300 lignes lorsque cela peut être évité

✔ Une logique clairement séparée de l'interface

✔ Réutilisation maximale

✔ Typage complet

✔ Code documenté lorsque nécessaire

✔ Aucune duplication

✔ Lisibilité prioritaire

---

# Vision

L'architecture doit permettre à Groupe RECA de faire évoluer son Centre des opérations pendant plusieurs années sans nécessiter une reconstruction complète.

La qualité de cette architecture déterminera la vitesse de développement des prochaines phases, la stabilité du logiciel et la facilité avec laquelle de nouveaux modules pourront être ajoutés à l'avenir.
