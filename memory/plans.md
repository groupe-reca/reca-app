# Plans — RECA Centre des opérations

## [x] J. Paramètres — archivé, terminé le 2026-07-11 (voir `tasks.md` pour le détail exact de ce qui a été livré et de ce qui reste non vérifié en navigateur)

**Objectif** : finir le dernier des 10 modules du scope — config entreprise/taxes + gestion des rôles de comptes, réservé aux administrateurs.

**État actuel** (fichiers déjà présents, non commités) :
- `src/features/settings/types/settings.types.ts`
- `src/features/settings/schemas/settings.schema.ts`
- `src/features/settings/services/settings.service.ts` + `accounts.service.ts`
- `src/features/settings/hooks/settingsKeys.ts`, `useSettings.ts`, `useUpdateSettings.ts`, `useAccounts.ts`, `useUpdateAccountRole.ts`, `useUpdateAccountActive.ts`
- `src/features/settings/components/CompanySettingsForm.tsx`, `AccountsTable.tsx`

**Étapes restantes** :
1. Vérifier que `CompanySettingsForm` et `AccountsTable` suivent bien le gabarit (RHF+Zod `mode: 'onTouched'`, `Table`/`useTableState`, `QueryState`) — sinon ajuster.
2. Créer `pages/SettingsPage.tsx` (page unique probable : section config entreprise + section comptes/rôles, pas de liste/détail comme les autres modules puisqu'il n'y a qu'une seule ligne de config).
3. Câbler la route `/settings` dans `src/routes/router.tsx` sous la branche `RequireAuth` + `AppLayout`, avec restriction admin-only (vérifier comment les autres routes gèrent une restriction de rôle, sinon garder au niveau composant/hook).
4. Passer `enabled: false → true` sur `SETTINGS_ITEM` dans `src/layouts/Sidebar.tsx:39`.
5. Tester la page en local (formulaire config + changement de rôle/statut actif d'un compte) avant de commit.

**Fichiers touchés** : `src/features/settings/pages/*` (nouveau), `src/routes/router.tsx`, `src/layouts/Sidebar.tsx`.

**Risques** :
- Restriction admin-only : vérifier s'il existe déjà un pattern de garde de rôle ailleurs dans le repo (sinon c'est une nouveauté à introduire proprement, pas un hack local à cette page).
- `useUpdateAccountRole`/`useUpdateAccountActive` touchent `public.users` avec RLS — mêmes précautions que le module Employés (déjà résolu là-bas, réutiliser le même pattern).

**Prochaine étape après ce module** : les 10 modules du scope sont complets — repasser en revue globale (doc 07) pour tout écart avant de considérer le projet "livré".
