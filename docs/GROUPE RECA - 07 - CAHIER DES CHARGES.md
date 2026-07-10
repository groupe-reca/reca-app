# GROUPE RECA
# LIVRABLE 07 — CAHIER DES CHARGES

**Projet :** Groupe RECA – Centre des opérations

**Version :** 1.0

**Date :** 9 juillet 2026

**Consolidé à partir des livrables 01 à 06 (Signa) et de l'état réel du code**

---

# 1. Résumé exécutif

Groupe RECA (entreprise de déneigement résidentiel/commercial) fait développer un "Centre des opérations" : une application web unique qui remplace les feuilles de calcul et outils dispersés pour gérer l'ensemble du cycle d'affaires — des demandes entrantes (leads) jusqu'au paiement des factures, en passant par les soumissions, les contrats, la planification des routes de déneigement, les équipements et les employés.

**État d'avancement réel (au 9 juillet 2026) : environ 5 à 10 % du périmètre spécifié.**

Ce qui existe : authentification complète (connexion/déconnexion/session/garde de route) contre un projet Supabase déjà provisionné, un routage de base (`/`, `/login`, `/dashboard`), deux composants d'interface réutilisables (Button, Input), un layout minimal. Une page de renvoi ("landing") et un tableau de bord ("Centre des opérations") existent mais sont des placeholders.

Ce qui manque : les 10 modules métier (Leads à Paramètres), le schéma de base de données complet (spécifié en détail au livrable 04 mais jamais implémenté avant ce cahier des charges), la gestion des rôles/permissions (tout utilisateur connecté était jusqu'ici traité comme administrateur), la navigation principale (sidebar/fil d'Ariane), les composants d'interface partagés (tableau, badge, modale, etc.), et les tests automatisés.

Ce document consolide la vision, l'architecture et le périmètre fonctionnel déjà spécifiés par l'agence Signa (livrables 01-06), documente l'état réel du code, formalise les décisions prises pour amorcer la phase de construction, et sert de feuille de route pour les phases suivantes.

---

# 2. Périmètre fonctionnel — les 10 modules

Statuts : `✅ Construit` · `🚧 Fondation posée` · `⬜ Backlog (non commencé)`

| # | Module | Statut | Résumé (doc 06) |
|---|--------|--------|------------------|
| — | Authentification | ✅ Construit | Connexion Supabase, session, garde de route. Rôles réels branchés dans cette phase (voir §4). |
| A | Leads | 🚧 En construction (cette phase) | Demandes entrantes du site web : coordonnées, type de service, source, statut (Nouveau → Contacté → Soumission envoyée → Converti/Perdu), assignation à un employé, actions (appeler, courriel, créer une soumission, planifier un rappel). |
| B | Soumissions (quotes) | ⬜ Backlog | Montant, taxes, total, statut (Brouillon → Envoyée → Acceptée/Refusée/Expirée), liée à un lead et/ou un client. |
| C | Clients | ⬜ Backlog | Fiche client (coordonnées, entreprise, type, GPS), numéro CLI-000001, historique des contrats/factures/routes. |
| D | Contrats | ⬜ Backlog | Type, saison, prix, statut (Actif/En attente/Expiré/Annulé), renouvellement, dates de début/fin. |
| E | Factures | ⬜ Backlog | Sous-total, TPS, TVQ, total, solde, statut (Brouillon → Envoyée → Payée/Partiellement payée/En retard/Annulée). |
| F | Paiements | ⬜ Backlog | Montant, méthode, référence, liés à une facture. |
| G | Routes | ⬜ Backlog | Routes de déneigement (secteur, distance, durée estimée), liste ordonnée de clients, statut (Planifiée/En cours/Terminée/Suspendue). |
| H | Équipements | ⬜ Backlog | Véhicules/machines (catégorie, marque, modèle, plaque), statut (Disponible/En opération/Entretien/Brisé). |
| I | Employés | ⬜ Backlog | Fiche employé, poste, rôle, équipement assigné, "Application employé" (vue simplifiée terrain — non spécifiée en détail). |
| J | Paramètres | ⬜ Backlog | Configuration entreprise (nom, logo, taxes, couleurs), gestion des utilisateurs/rôles. |

Le backlog détaillé (champs, statuts, dépendances) pour les modules B→J est au §7.

---

# 3. Architecture technique de référence

Résumé opérationnel des livrables 03 (architecture logicielle) et 04 (base de données) — se référer aux documents originaux pour le détail complet.

**Stack** : React 19, Vite, TypeScript, React Router, TanStack Query, React Hook Form + Zod, Tailwind CSS, Framer Motion, Lucide React (frontend) · Supabase : Postgres, Auth, Storage (backend).

**Structure par module** (`src/features/<module>/`) : `components/ pages/ hooks/ services/ schemas/ types/ utils/`. Un module ne dépend jamais directement d'un autre — toute communication passe par services/hooks/types partagés.

**Conventions** : composants en PascalCase, hooks en camelCase (`useX`), services en `*.service.ts`, types en `*.types.ts`, schémas en `*.schema.ts`. Tout formulaire utilise React Hook Form + Zod, jamais de validation manuelle. Tout appel réseau passe par `services/`, jamais directement dans un composant. Aucun `any`. ~300 lignes maximum par composant. Dossiers interdits : `helpers, misc, temp, functions, old, new, test2`.

**Base de données** : 16 tables (voir §5), une seule source de vérité, relations normalisées. Chaque table importante a `created_at/updated_at/created_by/updated_by`. Aucune suppression physique — `deleted_at` uniquement. Identifiants lisibles séquentiels pour Clients/Leads/Soumissions/Contrats/Factures/Routes/Équipements (ex. `CLI-000001`). Toutes les opérations passent par les politiques RLS de Supabase.

---

# 4. Décisions prises pour cette phase

Ces décisions comblent des zones où les livrables 01-06 étaient muets ou informels. Elles sont documentées ici pour traçabilité — à revisiter si un module concerné révèle un besoin différent.

| Sujet | Décision | Justification |
|---|---|---|
| `leads.assigné_à` | FK vers `employees.id` | Un lead est assigné à un employé qui le suit, cohérent avec le reste du schéma (routes, équipements assignés à des employés). |
| Table `documents` | Conception polymorphe : `entity_type` + `entity_id` + `storage_path` (Supabase Storage) | Doc 04 ne donne aucune liste de colonnes pour cette table ; le design polymorphe évite une table de jonction par entité. |
| `employees.user_id` | FK nullable vers `public.users`, ajoutée dès l'étape 0 | Anticipe la connexion des employés terrain (module I, "Application employé") sans nécessiter de migration future. |
| Provisionnement des comptes | Invitation admin via le tableau de bord Supabase pour l'instant ; trigger `auth.users → public.users` (rôle par défaut `employe`) déjà en place | Aucun flux "Ajouter un employé" en app n'existe encore ; ce sera construit avec le module Employés. |
| Tables `activities` / `notifications` | Différées de l'étape 0 | Ajout informel du client à la fin du doc 04, sans liste de colonnes — signal qu'elles n'ont pas été formellement spécifiées. `activities` est recommandée en ajout rapide juste après la livraison du module Leads (son schéma est générique et utile dès la première mutation) ; `notifications` sera ajoutée quand un module aura réellement besoin d'en émettre une. |
| "Planifier un rappel" (action du module Leads) | Colonnes `rappel_le` (timestamptz) et `rappel_note` (text) ajoutées directement sur `leads`, pas de nouvelle table | Aucune table de rappels/tâches n'existe dans doc 04 — solution légère suffisante pour le MVP du module A. |
| Statut de `route_assignments` | Valeurs `planifiee/en_cours/terminee/annulee` (inférées) | Doc 04 nomme le champ "Statut" dans le schéma d'assignation sans énumérer ses valeurs ; reprises de la nomenclature du statut des routes en attendant que le module Routes affine le besoin réel. |
| Transitions de statut (Lead, Soumission, Contrat, Facture, Route, Équipement) | Validées en UI/service uniquement, pas de machine à états au niveau base de données | Plus simple à faire évoluer tant que les règles de transition ne sont pas figées par l'usage réel. |
| Politiques RLS | Lecture pour tout utilisateur authentifié (y compris données financières) ; création/modification réservées à `administrateur` | Décision du propriétaire du projet : simplicité pour démarrer, raffinement (ex. cacher les factures aux employés) prévu lors de la conception réelle du module Employés/App employé. |
| Portée de cette phase de développement | Fondation technique complète (BDD, RBAC, layout, composants UI partagés) + module Leads construit en gabarit complet ; modules B→J en backlog documenté | Décision du propriétaire du projet, vu l'ampleur du périmètre total (16 tables, 10 modules). |

---

# 5. Schéma de base de données — état d'implémentation

Les 16 tables du doc 04 sont désormais définies comme migrations SQL versionnées dans `supabase/migrations/` (elles n'existaient auparavant qu'en documentation prose). Chaque table porte : audit (`created_at/updated_at/created_by/updated_by` via un trigger générique), suppression logique uniquement (`deleted_at`, aucune politique RLS `DELETE`), et RLS activée.

Identifiants lisibles générés par séquence Postgres + trigger `BEFORE INSERT` (atomique, pas de risque de collision concurrente) : `CLI-000001` (clients), `LEAD-000001` (leads), `SOUM-000001` (quotes), `CTR-000001` (contracts), `FAC-000001` (invoices), `RTE-001` (routes), `EQ-001` (equipments).

**⚠️ Ces migrations existent en local mais n'ont pas encore été appliquées au projet Supabase live** (`ynsuxctqsvusbgcudcno`) — l'application (`supabase link` + `supabase db push`) nécessite une authentification interactive (`supabase login`) ou un jeton d'accès que l'environnement de développement ne possède pas. Voir la note de handoff en fin de document.

---

# 6. Sécurité et hygiène

- Le fichier `.input/supabase` contient la clé `service_role` du projet Supabase **en clair**. Cette clé contourne entièrement les politiques RLS. Elle est exclue du dépôt via `.gitignore`, mais ne doit **jamais** être committée, partagée, ni exposée côté client (seule `VITE_SUPABASE_ANON_KEY` doit vivre dans le bundle de l'application).
- `.env` contient les identifiants Supabase réels (URL + clé anonyme) du projet live — également exclu du dépôt.
- Recommandation : régénérer la clé `service_role` si ce fichier a pu être partagé hors de ce poste de travail.

---

# 7. Backlog structuré — modules B à J

À planifier en détail (spécification technique + design) au moment d'attaquer chaque module, dans l'ordre convenu avec le propriétaire du projet.

**B — Soumissions** (dépend de : Leads, Clients) — création à partir d'un lead ou directement pour un client existant ; montant/taxes/total ; cycle Brouillon→Envoyée→Acceptée/Refusée/Expirée ; conversion acceptée → Client + Contrat.

**C — Clients** (dépend de : rien, alimenté par Leads/Soumissions) — fiche complète, historique croisé (contrats, factures, routes), géolocalisation pour l'assignation aux routes.

**D — Contrats** (dépend de : Clients) — type/saison/prix, renouvellement automatique en fin de saison, déclenche la génération de factures.

**E — Factures** (dépend de : Clients, Contrats) — calcul TPS/TVQ, solde, relance des factures en retard.

**F — Paiements** (dépend de : Factures) — enregistrement de paiement, mise à jour du solde/statut de facture.

**G — Routes** (dépend de : Clients, Employés, Équipements) — composition de la route (liste ordonnée de clients), assignation employé + équipement + date.

**H — Équipements** (dépend de : rien, consommé par Routes/Employés) — inventaire, statut, historique d'entretien.

**I — Employés** (dépend de : rien, consommé par Routes/Équipements) — fiche employé, "Application employé" (vue terrain simplifiée — à spécifier plus précisément avant construction), promotion de rôle (employe → administrateur).

**J — Paramètres** (dépend de : rien, admin uniquement) — configuration entreprise, gestion des utilisateurs/rôles, personnalisation des couleurs/taxes.

---

# 8. Prochaines étapes (handoff)

1. **Appliquer les migrations au projet Supabase live** : depuis un poste avec accès interactif, exécuter `npx supabase login`, puis `npx supabase link --project-ref ynsuxctqsvusbgcudcno`, puis `npx supabase db push` depuis la racine du projet. Vérifier ensuite dans le tableau de bord Supabase que les 16 tables, triggers et politiques existent.
2. **Promouvoir les comptes administrateurs existants** : une fois la table `public.users` peuplée (via le trigger de synchronisation, au prochain login de chaque compte), exécuter manuellement `UPDATE public.users SET role = 'administrateur' WHERE email IN (...)` pour les comptes qui doivent garder l'accès admin.
3. **Poursuivre avec le module Soumissions (B)** en suivant le gabarit établi par le module Leads (A).
