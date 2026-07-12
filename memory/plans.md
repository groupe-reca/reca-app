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

## [x] Modernisation UI — Socle responsive + pilote Leads (2026-07-12, terminé et vérifié)

**Objectif** : rendre le Centre des opérations (app admin existante) responsive desktop/tablette/mobile, en commençant par le socle partagé (tokens, shell `layouts/`, primitives `components/ui/`) validé sur le module Leads comme pilote. Les 8 autres modules sont reportés à des tâches ultérieures séparées. La future "Application employé" terrain (module I, non spécifiée) est explicitement hors scope.

Décisions validées avec l'utilisateur :
1. Seuil tiroir sidebar : `<1024px` (`lg`) = tiroir avec backdrop, `≥1024px` = sidebar fixe comme aujourd'hui.
2. Fond sidebar corrigé vers Bleu Nuit `#0F172A` (doc 05) — écart préexistant avec la doc, corrigé au passage puisque le fichier est touché de toute façon.
3. Rouge RECA reste le placeholder `#ed1c24` (pas de changement de couleur de marque).
4. Table → vue carte sous `md` (768px), avec nouvelles props optionnelles `TableColumn.primary`/`hiddenOnCard` rétrocompatibles.
5. Modal → bottom-sheet sous `sm` (640px) avec `motion` pour l'animation (déjà une dépendance, utilisée seulement dans LoginPage avant ça).
6. Nouveaux hooks partagés `src/hooks/{useBreakpoint,useBodyScrollLock,useFocusTrap}.ts`, réutilisés par Modal (qui n'avait ni scroll-lock ni focus-trap avant) et le tiroir Sidebar.

Plan détaillé complet (tous les fichiers touchés, comportement exact par composant, plan de vérification par largeur de viewport) : voir `/root/.claude/plans/oui-c-est-lui-on-imperative-hartmanis.md`.

**Fichiers touchés** : `src/styles/index.css` (commentaire convention durées), `src/hooks/useBreakpoint.ts` (nouveau), `src/hooks/useBodyScrollLock.ts` (nouveau), `src/hooks/useFocusTrap.ts` (nouveau), `src/layouts/Sidebar.tsx`, `src/layouts/AppLayout.tsx`, `src/layouts/Breadcrumb.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/Dropdown.tsx`, `src/components/ui/Tooltip.tsx`, `src/components/ui/Toaster.tsx`, `src/components/ui/Table.tsx`, `src/features/leads/pages/LeadsListPage.tsx`, `src/features/leads/components/LeadTable.tsx`, `src/features/leads/pages/LeadDetailPage.tsx`.

**Vérification finale (2026-07-12)** : `tsc -b` et `npm run lint` propres. Test de bout en bout réel (Playwright, compte admin, dev server sur le port 3011 — 3010 occupé par le process pm2 de build statique) aux largeurs 375/768/1024/1280px sur Leads (liste+détail) et le Dashboard : tiroir sidebar + backdrop + fermeture (hamburger/Esc) fonctionnels sous 1024px, sidebar fixe sans hamburger dès 1024px, fond Bleu Nuit correct, bascule table↔cartes à 768px avec tri mobile fonctionnel, Modal en bottom-sheet sous 640px avec animation `motion`, Dropdown Statut sans débordement, breadcrumb condensé en lien retour sous 640px, Dashboard hérite du nouveau shell sans aucune modification de code. Non-régression confirmée : création/modification/suppression d'un lead de test fonctionne de bout en bout (lead créé puis supprimé proprement, aucune donnée de test résiduelle). Aucune erreur console à aucune étape. Pas encore commité.

## [x] Rework module Contrats — fiche de création complète (2026-07-12, terminé et vérifié)

Demande (`.input/tache2.md` + `.input/contrat.md`) : la fiche "Nouveau contrat" doit contenir toutes les clauses d'un contrat de déneigement type (zone desservie, exclusions, seuil de déclenchement, obligations, responsabilités, prix + échéancier de paiement), permettre de chercher un client existant (nom/adresse/téléphone) ou d'en créer un nouveau à la volée, et générer une facture par modalité de paiement lors de la création. Le module existe déjà (commit `4c29ef9`) mais seulement avec les champs génériques — c'est une extension, pas une reconstruction.

Décisions validées avec l'utilisateur :
1. Les clauses légales sont des **champs éditables en base** (pas un texte fixe) — migration nécessaire.
2. Le bouton **"Brouillon" crée un Contrat** (statut `en_attente`), pas une Soumission — sans générer de factures.
3. Le bouton "Créer un contrat" de la fiche client redirige aussi vers `/contracts/new?clientId=...` — un seul chemin de création dans toute l'app.

Plan détaillé complet (migration SQL, types, schéma, service, hooks, `ClientSearchPicker`, `ContractCreatePage` + sous-composants, câblage router/pages existantes, vérification) : voir `/root/.claude/plans/robust-fluttering-dahl.md`.

**Contrainte bloquante connue** : la migration ne peut pas être appliquée à la base live depuis ce sandbox (pas de connexion Postgres directe, seulement URL+clés PostgREST dans `.input/supabase`) — l'utilisateur doit l'appliquer lui-même avant que "Créer"/"Brouillon" fonctionnent contre la vraie base.

**Étapes** : toutes les étapes du plan détaillé sont implémentées (migration écrite, types/schéma/service/hooks, `ClientSearchPicker`, `ContractCreatePage` + sous-composants, câblage router/pages existantes). `tsc -b` et `npm run lint` propres. Vérifié en navigateur (Playwright, compte admin) : recherche/création client inline fonctionne, clauses pré-remplies correctement, validation Zod bloque les échéances sans date, échec géré proprement par toast quand la base ne connaît pas encore les nouvelles colonnes.

**Vérification finale (2026-07-12)** : migration appliquée par l'utilisateur, test de bout en bout réel effectué — contrat créé avec 2 modalités 50/50 → 2 factures générées automatiquement au bon montant, statut Actif, client bien lié. Données de ce test nettoyées après vérification. Reste dans la base (laissés par l'utilisateur, hors scope de cette tâche) : 2 clients de test d'une vérification antérieure (CLI-000001 "Jean Test", CLI-000002 "Jean Test2"). Commit en attente de confirmation de l'utilisateur.
