# Tâches — RECA Centre des opérations

Portée totale : 10 modules (doc 07 §8). Ordre de construction imposé par les dépendances du pipeline.

- [x] Auth — terminé
- [x] A. Leads — terminé
- [x] B. Soumissions/Quotes — terminé (commit 3ded2b1) — inclut fix RLS soft-delete
- [x] C. Clients — terminé (commit c6edf7b, 2026-07-10) — conversion soumission → client câblée
- [x] D. Contrats — terminé (commit 4c29ef9, 2026-07-10) — lié depuis la fiche client
- [x] E. Factures — terminé (commit 0876f18, 2026-07-10) — TPS 5%/TVQ 9.975% autofill, lien contrat optionnel
- [x] F. Paiements — terminé (commit 8480040, 2026-07-10) — enregistrement/annulation recalcule solde+statut facture ; pas d'action "Modifier"
- [x] H. Équipements — terminé (commit ec3c575, 2026-07-10)
- [x] I. Employés — terminé (commit 97a1c7c, 2026-07-10) — équipements assignés (table jonction employee_equipment) + promotion de rôle (employe ↔ administrateur) via public.users, RLS. Vue "Application employé" pas encore spécifiée (doc 06 la reporte).
- [x] G. Routes — terminé (commit af9f848) — le module le plus complexe (route_clients + route_assignments, liste de clients ordonnée, assignation employé+équipement+date)
- [~] J. Paramètres — **en cours**. Fichiers déjà créés (non commités) dans `src/features/settings/` : types, schema, services (settings + accounts), hooks (settings + accounts, y compris update role/active). **Manquant** : `components/` (formulaires/tables déjà présents en fait — voir note), `pages/`, câblage du router (`src/routes/router.tsx`), activation du lien sidebar (`src/layouts/Sidebar.tsx` → `enabled: true`). Réservé aux comptes admin. Dernier module du scope — après lui, les 10 modules sont complets.

## Tâches hors-module
- [x] 2026-07-11 — Ajout de la section "Système de mémoire" au `CLAUDE.md` racine (créé, n'existait pas avant).
- [x] 2026-07-11 — Renommage `mempry/` → `memory/` et initialisation des 3 fichiers avec le contexte réel du projet.
