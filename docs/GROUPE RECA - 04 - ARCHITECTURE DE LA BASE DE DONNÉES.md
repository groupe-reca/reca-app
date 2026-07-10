# GROUPE RECA
# LIVRABLE 04 — ARCHITECTURE DE LA BASE DE DONNÉES

**Projet :** Groupe RECA – Centre des opérations

**Version :** 1.0

**Développé par :** Signa

---

# Objectif

Concevoir une base de données moderne, performante et évolutive permettant de gérer l'ensemble des opérations de Groupe RECA.

La base de données doit respecter trois principes :

- Une seule source de vérité
- Relations simples
- Performance maximale

---

# Philosophie

Chaque donnée ne doit exister qu'une seule fois.

Les modules ne doivent jamais dupliquer les informations.

Toutes les relations doivent être normalisées.

---

# Architecture générale

```
Utilisateurs
      │
      │
      ▼
Employés
      │
      │
      ▼
Interventions
```

```
Leads
    │
    ▼
Soumissions
    │
    ▼
Clients
    │
    ▼
Contrats
    │
    ▼
Factures
    │
    ▼
Paiements
```

```
Routes
     │
     ├──────────────┐
     ▼              ▼
Employés      Équipements
```

---

# Liste des tables

## users

Authentification Supabase.

Cette table sera synchronisée avec auth.users.

Contient :

- id
- email
- rôle
- actif
- dernière_connexion

---

## employees

Employés de Groupe RECA.

Colonnes

- id
- prénom
- nom
- téléphone
- courriel
- poste
- rôle
- date_embauche
- actif
- photo
- notes
- created_at
- updated_at

---

## leads

Demandes provenant du site web.

Colonnes

- id
- prénom
- nom
- téléphone
- courriel
- adresse
- ville
- code_postal
- type_service
- message
- source
- statut
- assigné_à
- created_at

---

## quotes

Soumissions.

Colonnes

- id
- numéro
- lead_id
- client_id
- montant
- taxes
- total
- statut
- expiration
- notes

---

## clients

Clients actifs.

Colonnes

- id
- numéro_client
- prénom
- nom
- entreprise
- téléphone
- courriel
- adresse
- ville
- code_postal
- coordonnées GPS
- type_client
- notes

---

## contracts

Contrats.

Colonnes

- id
- numéro
- client_id
- type
- saison
- prix
- statut
- date_signature
- date_début
- date_fin
- renouvellement
- notes

---

## invoices

Factures.

Colonnes

- id
- numéro
- client_id
- contrat_id
- date
- sous_total
- TPS
- TVQ
- total
- solde
- statut

---

## payments

Paiements.

Colonnes

- id
- facture_id
- montant
- méthode
- référence
- date
- notes

---

## routes

Routes de déneigement.

Colonnes

- id
- nom
- secteur
- description
- statut
- durée_estimée
- distance
- couleur

---

## route_clients

Association.

Une route possède plusieurs clients.

Un client appartient à une route.

Colonnes

- id
- route_id
- client_id
- ordre

---

## equipments

Équipements.

Colonnes

- id
- numéro
- nom
- catégorie
- marque
- modèle
- année
- plaque
- numéro_série
- statut
- entretien
- notes

---

## employee_equipment

Association.

Quel employé utilise quel équipement.

---

## route_assignments

Assignation.

Route

↓

Employé

↓

Équipement

↓

Date

↓

Statut

---

## intervention_logs

Historique des opérations.

Colonnes

- id
- route_assignment_id
- employé
- début
- fin
- durée
- commentaire
- photos

---

## documents

Documents.

Permet de centraliser :

- contrats
- photos
- PDF
- pièces jointes

---

## settings

Configuration de l'entreprise.

Contiendra notamment :

- nom

- logo

- téléphone

- courriel

- taxes

- adresse

- couleurs

---

# Relations principales

```
Lead

↓

Soumission

↓

Client

↓

Contrat

↓

Facture

↓

Paiement
```

---

```
Employé

↓

Assignation

↓

Route

↓

Clients
```

---

```
Équipement

↓

Assignation

↓

Route
```

---

# États

## Lead

Nouveau

Contacté

Soumission envoyée

Converti

Perdu

---

## Soumission

Brouillon

Envoyée

Acceptée

Refusée

Expirée

---

## Contrat

Actif

En attente

Expiré

Annulé

---

## Facture

Brouillon

Envoyée

Payée

Partiellement payée

En retard

Annulée

---

## Route

Planifiée

En cours

Terminée

Suspendue

---

## Équipement

Disponible

En opération

Entretien

Brisé

---

# Convention des identifiants

Clients

```
CLI-000001
```

Leads

```
LEAD-000001
```

Soumissions

```
SOUM-000001
```

Contrats

```
CTR-000001
```

Factures

```
FAC-000001
```

Routes

```
RTE-001
```

Équipements

```
EQ-001
```

---

# Audit

Toutes les tables importantes contiendront :

created_at

updated_at

created_by

updated_by

---

# Suppression

Aucune suppression physique.

Nous utiliserons :

deleted_at

pour conserver un historique complet.

---

# Sécurité

Toutes les opérations passeront par les politiques RLS de Supabase.

Chaque utilisateur ne pourra effectuer que les actions autorisées selon son rôle.

---

# Sauvegardes

Sauvegardes automatiques quotidiennes.

Possibilité de restauration.

---

# Évolutions futures

La structure prévoit déjà l'ajout de :

- GPS temps réel

- Optimisation des routes

- Notifications SMS

- Signature électronique

- Application client

- Historique météo

- Journal d'entretien des véhicules

- Gestion des sous-traitants

- Tableau de bord analytique

sans nécessiter de refonte de la base de données.

---

# Vision

La base de données constitue la fondation du Centre des opérations.

Toutes les décisions futures devront respecter cette architecture afin d'assurer la stabilité, la performance et la simplicité du système pendant les prochaines années.

 je voudrais ajouter deux tables qui, selon moi, seront extrêmement utiles :
activities : un journal global des événements (connexion, création d’un client, envoi d’une facture, modification d’un contrat, etc.). Il permettra d’alimenter un fil d’activité dans le Centre des opérations et de faciliter les audits.
notifications : une table centralisée pour toutes les notifications de l’application (soumission reçue, facture échue, route assignée, etc.). Elle servira autant au tableau de bord qu’à une future application mobile.

