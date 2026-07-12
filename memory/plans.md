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

## [x] Généraliser le pattern de création "page dédiée" à tout le site (2026-07-12, terminé et vérifié)

Demande (`.input/tache1.md`) : toute la navigation du site doit suivre le pattern du module Contrats — "Nouveau X" navigue vers une page dédiée (`/x/new`), jamais une modale sur la liste, comme c'était encore le cas pour Clients et 6 autres modules.

Décisions validées avec l'utilisateur :
1. Les boutons de création croisée depuis une fiche détail (Lead→"Créer une soumission", Client→"Créer une facture") sont alignés aussi, pas seulement les listes.
2. "Transformer en client" (fiche Soumission) est converti en page dédiée aussi, malgré sa mutation de liaison supplémentaire.

Exception délibérée conservée : `ClientSearchPicker` (création rapide de client à l'intérieur du formulaire Contrats en cours) reste une modale — précédent posé par Contrats lui-même.

Plan détaillé complet (gabarit page par module, cas particuliers Quotes/Invoices/Clients, fichiers touchés) : voir `/root/.claude/plans/floating-snacking-popcorn.md`.

**Étapes réalisées** : 7 nouvelles `pages/*CreatePage.tsx` (Leads, Quotes, Clients, Invoices, Equipment, Employees, Routes), 7 routes `x/new` ajoutées dans `router.tsx`, 7 `*ListPage.tsx` migrées vers `navigate()`, 6 `*FormModal.tsx` simplifiées en édition seule (`ClientFormModal` gardé dual, exception documentée), 3 boutons de fiche détail migrés (`LeadDetailPage`, `ClientDetailPage`, `QuoteDetailPage`). `tsc -b` et `npm run lint` propres à chaque étape.

**Vérification finale (2026-07-12)** : test de bout en bout réel (Playwright, compte admin, port 3011) — les 7 boutons "Nouveau X" des listes ouvrent bien une page (pas de modale) ; flow croisé Lead→Soumission avec mise à jour automatique du statut du lead (`soumission_envoyee`) ; flow Soumission→Client ("Transformer en client") avec préremplissage prénom/nom et liaison automatique au retour sur la soumission ; flow Client→Facture avec client préselectionné (pas de picker affiché) ; régression confirmée : modale d'édition (Lead) toujours fonctionnelle, modale inline `ClientSearchPicker` (exception) toujours une modale. Aucune erreur console à aucune étape. Un bug de course a été trouvé et corrigé pendant la vérification : `QuoteCreatePage` pouvait laisser soumettre le formulaire avant la fin du chargement du lead lié, sautant silencieusement la mise à jour de son statut — corrigé par un garde de chargement (`if (leadId && isLoading) return <skeleton/>`), voir `memory/memory.md` pour le pattern à réutiliser. Toutes les données de test créées pendant la vérification ont été supprimées (4 leads, 4 soumissions, 2 clients, 2 factures) — base revérifiée vide de ces entités. Pas encore commité.

## [~] Optimisation de la navigation (2026-07-12, implémenté — vérification navigateur bloquée par migration non appliquée)

Demande (`.input/tache1.md` — nom de fichier réutilisé, contenu différent de la tâche "page dédiée" ci-dessus) : verrouiller la sidebar (pagination au lieu du scroll), déplacer la déconnexion en icône dans le bloc utilisateur du bas du menu, fusionner la barre de navigation (breadcrumb) avec le header tout en haut (corriger au passage le fait que tous les crumbs étaient cliquables), ajouter un système de modules activables/désactivables dans Paramètres (Routes/Équipements/Factures/Employés désactivés par défaut), retirer "Centre des opérations" du header du menu, poser les nouveaux logos SVG, renommer l'affichage de `admin@groupereca.ca` en "Gabriel Cayer". Le tout sur une nouvelle branche.

Décision validée avec l'utilisateur : désactiver un module cache le lien du menu ET bloque l'accès direct par URL (pas seulement visuel).

Plan détaillé complet (fichiers exacts, logique de pagination, modèle de données modules, garde de route) : voir `/root/.claude/plans/binary-coalescing-hejlsberg.md`.

**Étapes réalisées** : branche `optimisation-de-la-navigation` créée ; nouveaux logos copiés dans `src/assets/` ; 2 migrations écrites (`20260712180000_settings_modules.sql`, `20260712180100_users_nom.sql`) ; types/service/hooks/composant `ModulesTable` pour le toggle modules ; nouveau `src/routes/RequireModule.tsx` appliqué aux 9 modules dans `router.tsx` ; `Sidebar.tsx` réécrit (pagination via nouveau hook `useElementSize`, filtrage par module, icône déconnexion, header sans texte) ; `Breadcrumb.tsx`/`AppLayout.tsx` fusionnés (hamburger déplacé, dernier crumb non cliquable) ; rename admin propagé (`auth.service.ts`, `auth.types.ts`, `accounts.service.ts`, `AccountsTable.tsx`). `tsc -b` et `npm run lint` propres.

**Vérification (2026-07-12, partielle)** : logo de la page de connexion confirmé visuellement par capture d'écran (navy sur fond blanc, net, bien proportionné). Le reste ne peut pas être vérifié en navigateur : test réel de login a échoué avec `HTTP 400` sur `public.users?select=...,nom` — la colonne `nom` n'existe pas encore en live tant que la migration n'est pas appliquée, ce qui casse actuellement **tout** le login de l'app (pas juste la fonctionnalité rename). L'utilisateur a choisi de reporter l'application des 2 migrations à plus tard plutôt que de les appliquer immédiatement. **Ne pas merger/déployer cette branche avant que les migrations soient appliquées** — sinon plus personne ne peut se connecter. Une fois les migrations appliquées, revérifier en navigateur : pagination sidebar (forcer un dépassement), breadcrumb (tous crumbs cliquables sauf dernier), toggle module Routes (lien caché + `/routes` redirige), affichage "Gabriel Cayer". Pas encore commité.

**Clôture (2026-07-12)** : travail commité (`02086f2`) avant de démarrer le sprint UX Contrats suivant (décision utilisateur, voir plan ci-dessous). Les 2 migrations ont été appliquées par l'utilisateur le même jour — confirmé indirectement pendant la vérification du sprint suivant (login fonctionnel, sondes REST 200 sur `settings.modules` et `users.nom`).

## [x] Refonte UX Contrats — interface "Desktop Application" (2026-07-12, terminé et vérifié)

Demande (`.input/tache1.md`, 3e réutilisation de ce nom de fichier) : transformer `ContractCreatePage` (longue page qui défile) en interface façon SaaS desktop (Linear/Vercel/Stripe/Notion) — viewport fixe (sidebar/header/breadcrumb/footer jamais hors écran), formulaire divisé en 5 onglets (une vue à la fois, défilement local uniquement), breadcrumb 3 niveaux avec dernier élément non cliquable, logo +50% (sidebar + login), et composants génériques réutilisables (`PageLayout`, `Breadcrumb`, `PageTabs`, `StickyPageHeader`, `StickyPageFooter`, `ModuleContainer`) en vue d'un déploiement futur aux 7 autres modules. Scope explicitement limité à Contrats pour ce sprint.

Décisions prises (voir détail complet dans `/root/.claude/plans/temporal-swimming-sifakis.md`) :
1. Branche créée à partir du commit nav-optim (`02086f2`) plutôt que de `main` — décision utilisateur après question explicite sur la gestion des changements non commités.
2. `AppLayout.tsx` `min-h-screen` → `h-screen overflow-hidden` : seul changement de fondation partagé par toute l'app, bas risque, ne change rien visuellement pour les modules non convertis.
3. Amélioration ajoutée à la demande brute : point d'erreur rouge par onglet (`PageTabs`) dérivé de `formState.errors`, pour que "Créer" désactivé reste compréhensible même quand l'onglet fautif n'est pas affiché.
4. Bug de breadcrumb pré-existant corrigé (routes Contrats imbriquées sous un parent avec `handle.breadcrumb`) — probablement présent sur les 7 autres modules aussi, non corrigé ailleurs (hors scope).

**Étapes réalisées** : 5 nouveaux composants génériques (`src/components/layout/`), `ContractClausesFields.tsx` éclaté en 3 fichiers + `TextareaField.tsx` partagé, `ContractCreatePage.tsx` réécrite avec état d'onglet local et même logique métier (`useCreateContractWithInvoices`, `canFinalize`, `submitAs`) inchangée, `router.tsx` (routes Contrats imbriquées), `AppLayout.tsx` (scroll fix), `Sidebar.tsx`/`LoginPage.tsx` (logos). `tsc -b` et `npm run lint` propres.

**Vérification finale (2026-07-12)** : test de bout en bout réel (Playwright, compte admin, port 3011) — aucun scroll de body observé nulle part dans l'app (Dashboard, Leads, Contrats) après le fix `AppLayout`, non-régression confirmée sur les modules non convertis ; les 5 onglets basculent sans reflow du header/sidebar/footer ; point d'erreur testé en laissant un champ requis vide sur un onglet non affiché ; footer vérifié sans chevauchement avec la sidebar (280px) ; breadcrumb confirmé "Centre des opérations › Contrats › Nouveau contrat" (et variantes liste/détail) ; tailles de logo confirmées visuellement (sidebar 48px, login 96px). Contrat de test créé de bout en bout (client inline "UXTest Sprint" + 10 clauses remplies + 2 échéances 50/50 → 2 factures générées automatiquement, statut Actif) puis toutes les données de test supprimées (2 factures, 1 contrat, 1 client) via l'API REST avec la clé `service_role`. Aucune erreur console à aucune étape. Pas encore commité.
