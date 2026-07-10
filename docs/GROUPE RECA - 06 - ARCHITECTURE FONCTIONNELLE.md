# GROUPE RECA
# LIVRABLE 06 — ARCHITECTURE FONCTIONNELLE & PARCOURS UTILISATEUR

Projet :
Groupe RECA – Centre des opérations

Version :
1.0

Développé par :
Signa

---

# Vision

Chaque module doit représenter une étape réelle des opérations quotidiennes de Groupe RECA.

Nous ne construisons pas un logiciel.

Nous reproduisons le fonctionnement de l'entreprise.

---

# Cycle de vie complet d'un client

Visiteur

↓

Demande de soumission

↓

Lead

↓

Soumission

↓

Client

↓

Contrat

↓

Assignation d'une route

↓

Déneigement

↓

Facturation

↓

Paiement

↓

Renouvellement

Le logiciel accompagne le client pendant plusieurs années.

---

# MODULE A

# LEADS

Mission

Recevoir automatiquement les demandes provenant de la Landing Page.

Informations

Nom

Téléphone

Courriel

Adresse

Ville

Code postal

Type

Résidentiel

Commercial

Service demandé

Déneigement

Épandage

Déneigement + Épandage

Message

Date

Statut

Nouveau

Contacté

Soumission envoyée

Converti

Perdu

Actions

Créer une soumission

Téléphoner

Envoyer un courriel

Planifier un rappel

---

# MODULE B

# SOUMISSIONS

Mission

Créer rapidement une soumission professionnelle.

Sections

Informations client

Adresse

Type de propriété

Services

Prix

Conditions

PDF

Signature future

Statuts

Brouillon

Envoyée

Acceptée

Refusée

Expirée

Actions

Transformer en client

Modifier

Dupliquer

Télécharger PDF

---

# MODULE C

# CLIENTS

Mission

Regrouper toutes les informations d'un client.

Onglets

Informations

Contrats

Factures

Paiements

Documents

Historique

Carte

Actions rapides

Téléphoner

Envoyer un courriel

Créer un contrat

Créer une facture

Voir sur Google Maps

---

# MODULE D

# CONTRATS

Mission

Gérer les contrats saisonniers.

Types

Résidentiel

Commercial

Informations

Saison

Adresse

Services inclus

Prix

Date de début

Date de fin

Renouvellement

Statuts

Actif

Expiré

Annulé

En attente

---

# MODULE E

# FACTURES

Mission

Facturation simple.

Fonctions

Créer

Modifier

Envoyer

Télécharger PDF

Imprimer

Statuts

Brouillon

Envoyée

Payée

En retard

Annulée

---

# MODULE F

# PAIEMENTS

Mission

Suivre les paiements.

Modes

Interac

Comptant

Chèque

Virement

Carte

Actions

Associer à une facture

Imprimer reçu

Historique

---

# MODULE G

# ROUTES

Le cœur du logiciel.

Une route représente une tournée complète.

Chaque route possède

Nom

Secteur

Employé

Équipement

Clients

Distance

Durée estimée

Statut

Planifiée

En cours

Terminée

Suspendue

Vue

Carte

Liste

Timeline

Actions

Démarrer

Terminer

Modifier

Imprimer

---

# MODULE H

# ÉQUIPEMENTS

Mission

Gérer tous les équipements.

Catégories

Camions

Tracteurs

Chargeuses

Souffleuses

Saleuses

Remorques

Chaque équipement possède

Numéro

Marque

Modèle

Année

Plaque

Heures

Kilométrage

État

Disponible

En opération

Entretien

Brisé

---

# MODULE I

# EMPLOYÉS

Mission

Gérer les employés.

Informations

Nom

Téléphone

Courriel

Photo

Poste

Date d'embauche

Rôle

Administrateur

Employé

Équipements assignés

Historique

Routes effectuées

---

# MODULE J

# PARAMÈTRES

Entreprise

Nom

Adresse

Téléphone

Courriel

Taxes

Logo

Utilisateurs

Sécurité

Sauvegardes

---

# CENTRE DES OPÉRATIONS

Le propriétaire ouvre le logiciel.

Il doit immédiatement voir :

Conditions météo

Température

Accumulation prévue

Routes actives

Routes terminées

Employés sur le terrain

Équipements disponibles

Demandes de soumission reçues

Factures en attente

Paiements reçus aujourd'hui

Activité récente

Le Centre des opérations doit raconter l'état de l'entreprise.

---

# APPLICATION EMPLOYÉ

Connexion

↓

Aujourd'hui

↓

Ma route

↓

Navigation

↓

Début de la tournée

↓

Client suivant

↓

Client suivant

↓

Fin de la tournée

L'application doit pouvoir être utilisée dans un camion avec des gants.

Très peu de texte.

Très gros boutons.

Très peu de décisions.

---

# LANDING PAGE

Objectif

Transformer les visiteurs en demandes de soumission.

Architecture

Hero

↓

Le problème

↓

Nos services

↓

Pourquoi Groupe RECA

↓

Notre processus

↓

Territoire desservi

↓

Questions fréquentes

↓

Appel à l'action

↓

Formulaire

---

# PROCESSUS CLIENT

1

Le client demande une soumission.

↓

2

Le répartiteur crée une soumission.

↓

3

Le client accepte.

↓

4

Le contrat est créé.

↓

5

Le client est ajouté à une route.

↓

6

La saison commence.

↓

7

Le déneigement est effectué.

↓

8

Les paiements sont enregistrés.

↓

9

Le contrat est renouvelé l'année suivante.

---

# Vision Signa

Le logiciel ne doit jamais donner l'impression qu'il s'agit d'un CRM adapté au déneigement.

Le logiciel doit donner l'impression qu'il a été conçu exclusivement pour cette industrie.

Chaque écran, chaque bouton, chaque terme utilisé devra refléter le quotidien d'une entreprise de déneigement résidentiel et commercial opérant à Saint-Jérôme.

Lorsque le propriétaire ouvrira son Centre des opérations lors d'une tempête, il devra avoir immédiatement confiance dans les informations affichées et prendre ses décisions en quelques secondes.

C'est cette simplicité qui fera du Centre des opérations Groupe RECA une réalisation emblématique de Signa.
