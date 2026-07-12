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
- [x] J. Paramètres — terminé (2026-07-11, pas encore commité). `pages/SettingsPage.tsx` créé (section entreprise/taxes + section comptes). Route `/settings` câblée dans `src/routes/router.tsx` sous un nœud `RequireRole roles={['administrateur']}` (composant déjà présent dans `auth/components/RequireAuth.tsx`, jamais utilisé avant — premier module à s'en servir). Lien sidebar activé (`enabled: true`) et rendu conditionnel à `session.user.role === 'administrateur'` dans `src/layouts/Sidebar.tsx`. Vérifié : `tsc --noEmit` et `eslint` propres, dev server sert les nouveaux fichiers sans erreur de compilation. Vérifié en navigateur (Playwright + Chromium, `chromium-cli` n'existe pas comme paquet installable donc Playwright sert de driver équivalent) : connexion admin, page Paramètres rendue avec les vraies données live (formulaire entreprise/taxes pré-rempli, table des 2 comptes admin), aucune erreur console, lien sidebar visible pour un compte admin. Mutations de rôle/statut de compte non testées par clic pour éviter de modifier des comptes réels sur la base live. Les 10 modules du scope sont maintenant tous construits.

## Tâches hors-module
- [x] 2026-07-11 — Ajout de la section "Système de mémoire" au `CLAUDE.md` racine (créé, n'existait pas avant).
- [x] 2026-07-11 — Renommage `mempry/` → `memory/` et initialisation des 3 fichiers avec le contexte réel du projet.
- [x] 2026-07-12 — Rework module Contrats : fiche de création complète (clauses éditables, recherche/création client inline, échéancier de paiement → génération de factures). Migration `20260712000000_contracts_clauses_and_schedule.sql` appliquée par l'utilisateur à la base live. Test de bout en bout réel confirmé : contrat créé (statut Actif), 2 modalités 50/50 → 2 factures générées automatiquement (574,88 $ chacune, statut Brouillon), client créé et bien lié. Les 3 critères de vérification de `.input/tache2.md` sont validés. Données de test nettoyées (client/contrat/factures du test final supprimés ; 2 clients "Jean Test"/"Jean Test2" d'un test précédent laissés à l'utilisateur). Pas encore commité. Détail complet du plan : `/root/.claude/plans/robust-fluttering-dahl.md`.
