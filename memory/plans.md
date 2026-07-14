# Plans — RECA Centre des opérations

## [x] Sprint 013 — Design System, socle visuel Phase 1 (branche `sprint013-design-system`, depuis `sprint012-mobile-contrats`) — terminé et vérifié

Demande (`.input/sprint013.md`) : poser **uniquement le socle visuel commun** (tokens + primitives `src/components/ui/`) dérivé de 3 maquettes de référence (`.input/ui_dashboard.png`, `ui_mobile.png`, `ui_add_contract.png`) — cartes plus arrondies/douces (ombre plutôt que bordure dure), badges pastel-sur-fond-teinté, nouvelles primitives `StatCard`/`ListRow`/`Avatar`, appliqué sur **une seule page pilote** (Dashboard/`OperationsCenterPage.tsx`). Pas de nouvelle fonctionnalité produit, pas de refonte du Wizard (Phase 2 = sprint014, séparé), les 9 autres modules héritent passivement (aucun fichier de module touché individuellement).

Correctifs aux hypothèses du brief, vérifiés avant de coder : le préalable "committer `sprint012-mobile-contrats` avant d'ouvrir la branche" était déjà fait (`6673d16`) — branche créée directement depuis là. Les rayons (`--radius-card: 16px`, `--radius-control: 10px`) et `Badge` (déjà pastel-bg/texte-foncé) satisfaisaient déjà la cible — le vrai chantier tokens était les **ombres**, absentes avant ce sprint.

Plan détaillé complet (props exactes, classes Tailwind, décisions Card-vs-ListRow) : `/root/.claude/plans/r-cup-re-ta-nouvelle-dans-foamy-yeti.md`.

**Fichiers touchés** :
- Tokens : `src/styles/index.css` (`--shadow-card`/`--shadow-floating`, teinte `reca-night-blue`, pas de nouveau token couleur/rayon/espacement — `gap-4/5/6` suffisent).
- Primitives existantes : `Card.tsx` (retrait bordure dure → `shadow-card`, + `variant="clickable"`/`chevron` additifs), `Badge.tsx` (+ `size="sm"|"md"`, logique couleur extraite dans le nouveau `statusColors.ts` partagé), `Button.tsx` (+ `fullWidth` additif, non branché ce sprint), `Table.tsx` (2 classes alignées sur le nouveau style Card, fonctionnellement inchangé). `Input.tsx`/`Select.tsx` non touchés (déjà conformes).
- Nouvelles primitives : `StatCard.tsx`, `ListRow.tsx`, `Avatar.tsx`, `statusColors.ts` (tous `src/components/ui/`).
- `src/features/contracts/constants/contractStatusColors.ts` (nouveau) : `CONTRACT_STATUS_COLORS` déplacé hors de `ContractStatusBadge.tsx` (règle Fast Refresh un-seul-export-composant-par-fichier, déjà rencontrée sprint009) pour être réutilisable par la page pilote.
- `src/lib/format.ts` : + `formatRelativeTime()` (Intl.RelativeTimeFormat, même convention que `formatCurrency`).
- `src/pages/OperationsCenterPage.tsx` : réécriture complète (était un stub quasi vide) — 3 `StatCard` (Contrats actifs, Clients, Factures en attente + solde) via `useContracts`/`useClients`/`useInvoices` (hooks déjà existants, aucun nouveau), section "Activité récente" en `ListRow` limitée aux 5 contrats les plus récents (`createdAt` desc) — pas de flux d'activité inter-module fabriqué.

**Décisions de portée à connaître pour sprint014 (Phase 2 Wizard v2)**, pour ne pas les rediscuter :
- `Card` a une variante `clickable`+`chevron` générique (conteneur agnostique, chevron aligné à droite) — construite mais **non démontrée** ce sprint (le seul call site visuel du brief pour ce pattern, les rangées Client/Propriété/Zones/Clauses/Notes de la fiche contrat mobile, n'est pas la page pilote). `ListRow` est le composant réellement utilisé pour ce pattern précis (icône+titre+sous-titre+chevron) et reste distinct de `Card` pour éviter de dupliquer la logique de layout icône/texte à deux endroits.
- `Avatar.tsx` construit mais **non branché** — le bloc initiales ad hoc de `Sidebar.tsx` n'a pas été retouché (aurait été une modification active d'un fichier non-pilote).
- `Button.fullWidth` construit mais **non branché** — le CTA "Modifier le contrat" (pleine largeur) vit dans `MobileContractDetailPage.tsx`, hors périmètre pilote.
- Explicitement omis, aucun placeholder construit (aucune donnée réelle disponible et non demandé par le brief) : météo, notifications, recherche ⌘K, carte temps réel, donut "Répartition des contrats", stat "Équipes actives", photos de propriété.

**Vérification (2026-07-14)** : `tsc -b`, `npm run lint`, `npm run build` propres (avertissement pré-existant sur la taille du bundle, non lié à ce sprint). Vérifié en navigateur (Playwright, compte admin, port 3011, viewports 390/768/1280px) : Dashboard pilote conforme aux maquettes (StatCards avec icône teintée + valeur + libellé, ListRow avec icône/titre/sous-titre/prix/chevron, cliquable vers la fiche contrat), aucune erreur console. Non-régression confirmée : Leads (liste), Contrats (liste desktop+carte mobile, détail desktop+mobile), un Dropdown (changement de statut contrat), un Modal (édition client), un Toast (déclenché via un login invalide, non lié à une mutation de données) — les 3 derniers pixel-identiques, comme attendu puisque non touchés (vérifié : ils ne partagent aucune classe modifiée avec `Card`/`Table`). Aucune donnée de test créée pendant cette vérification (uniquement lecture des données déjà présentes en base). Pas encore commité.

## [x] Sprint 012 — Expérience mobile du module Contrats (branche `sprint012-mobile-contrats`) — terminé et vérifié en entier (Phases A-E)

Demande (`.input/tache4.md`) : refonte mobile "app native" du module Contrats (pas un simple responsive) — Bottom Navigation, Header compact, Wizard plein écran à transitions horizontales, carte plein écran + Bottom Sheets redimensionnables façon Google Maps, barre d'action flottante, outils de dessin flottants.

Décisions validées avant implémentation : Bottom Nav/Header app-wide mais chrome seulement (contenu des 9 autres modules inchangé, seul Contrats reçoit la refonte complète) ; tablette hérite du Desktop ce sprint ; branche committée d'abord (`75adafe`) puis nouvelle branche **depuis `sprint008-analyse-propriete`** (piège rencontré : une première tentative l'a créée depuis `main` par erreur, corrigée avant tout commit — voir `memory/memory.md`).

Plan détaillé complet (5 phases A-E, signatures exactes, architecture) : `/root/.claude/plans/recupere-ta-nouvelle-tache-harmonic-patterson.md`.

**Phase A (infra device-tier + `BottomSheet` + bascule nav app-wide) — terminée et vérifiée** : `useDeviceTier.ts`, `BottomSheet.tsx` (drag/snap via `motion`, poignée dédiée), `viewport-fit=cover` + fix zoom iOS, `AppLayout.tsx` → dispatcher `DesktopAppShell`/`MobileAppShell`, `navItems.ts` (extrait de `Sidebar.tsx`), `MobileBottomNavigation.tsx`, `MobileHeader.tsx` + `useMobileHeaderActions.ts`. `tsc -b`/`npm run lint` propres. Vérifié en navigateur (Playwright, 390/768/1280px) : Bottom Nav+Header app-wide sans régression du contenu des autres modules, tiroir Sidebar intact ≥768px, glisser de la feuille "Menu" testé (peek→full), Bottom Nav masqué sur `/contracts/new`. 1 correctif pendant la vérification : bouton retour affiché à tort sur les racines de module (Leads/Clients/Contrats/Factures) — corrigé (retour seulement si ≥2 crumbs réels, pas sur un onglet racine).

**Phase B (pages Contrats mobiles liste/détail) — terminée et vérifiée** : dispatchers triviaux + `pages/desktop/`+`pages/mobile/` séparés, `MobileContractLayout.tsx`, liste mobile réutilise `ContractTable`/`Table` tel quel, détail mobile condense les actions dans un menu `⋮`. Vérifié en navigateur (390px) avec un contrat réel (créé via le Wizard desktop, toujours utilisé tel quel — Phase C pas encore faite).

**Phase C (`MobileWizard` + 5 étapes simples) — terminée et vérifiée** : `useContractWizardState.ts` (extraction neutre depuis `ContractWizard.tsx`), `components/layout/mobile/{MobileStepLayout,MobileWizard,FloatingActionBar}.tsx`, `MobileContractWizard.tsx` (5 étapes réutilisées telles quelles, Property en placeholder desktop temporaire). Piège eslint `react-hooks/refs` (plus strict que `set-state-in-effect`) — corrigé via 2 `useState` au lieu d'une ref pour détecter le sens du glissement. Vérifié en navigateur (390px + régression 1280px) jusqu'à la création réelle d'un contrat.

**Phase D (étape Property mobile — carte plein écran + bottom sheets + outils flottants) — terminée et vérifiée** : extraction `useDelineateState.ts`/`usePropertyStepState.ts` (même principe que `useContractWizardState`), éclatement `PropertyInfoPanel`/`PropertyZonesPanel` en contenu pur + wrapper, nouveaux `PropertyInfoSheet`/`PropertyZonesSheet`/`ZoneToolbarFloating`/`ZoneDetailSheet`/`MobilePropertySubStepLocate`/`MobilePropertySubStepDelineate`/`MobileWizardStepProperty`. **3 bugs réels de `BottomSheet` trouvés et corrigés** (portail par-dessus la FloatingActionBar, clip incomplet interceptant les clics, pattern `useDragControls` non fiable au 2e glissement — détail technique complet dans `memory/memory.md`). Vérifié en navigateur de bout en bout jusqu'à la création réelle de plusieurs contrats mobiles avec zones typées, glissement peek/half/full répété avec succès.

**Phase E (régression finale) — terminée et vérifiée** : smoke test mobile sur les 6 modules restants + re-vérification tablette/desktop, aucune régression.

Pas encore commité (reste sur `sprint012-mobile-contrats`).

## [x] Sprint 009 — Dessin des zones de déneigement & calcul des superficies (branche `sprint008-analyse-propriete`, suite) — implémenté et vérifié en entier, y compris la persistance DB

Demande (`.input/sprint009`) : transformer le tracé basique de zones (sprint007/tâche3) en vrai outil de préparation des opérations — dessin déclenché explicitement, zones typées avec couleur sobre par type (Entrée/Stationnement/Trottoir/Escaliers/Aire de manœuvre/Terrasse/Autre), barre d'outils dédiée, édition des sommets, zoom sur zone, suppression réelle, résumé par catégorie.

Décisions validées avec l'utilisateur avant implémentation : (1) étendre `contract_zones` (colonne `type`) plutôt que créer `contract_areas` comme suggéré par le brief ; (2) la barre d'outils locale n'ajoute que + Nouvelle zone/Modifier/Supprimer, Recentrer/Capturer restent dans le Footer global (sprint008.5) ; (3) suite sur la même branche, pas de nouvelle branche.

Plan détaillé complet (signatures exactes, wiring, thème Mapbox GL Draw) : `/root/.claude/plans/recupere-ta-nouvelle-tache-harmonic-patterson.md`.

**Fichiers touchés** :
- Nouveaux : `supabase/migrations/20260713010000_contract_zones_type.sql`, `src/features/contracts/constants/zoneDrawStyles.ts`, `src/features/contracts/hooks/useZoneTypeSelection.ts`, `src/features/contracts/components/wizard/{ZoneToolbar,ZoneTypeSelector,ZoneNamingModal,PolygonCard,PolygonList,ZoneAreaSummary}.tsx`
- Modifiés : `types/contract.types.ts`, `constants/wizardOptions.ts`, `schemas/contractCreation.schema.ts`, `services/contracts.service.ts`, `components/wizard/SurfaceSummary.tsx`
- Réécrits : `components/wizard/PolygonEditor.tsx` (piloté par ref), `PropertySubStepDelineate.tsx`, `PropertyZonesPanel.tsx`, `WizardStepProperty.tsx` (ajout `updateZone`)

**Étapes réalisées** : toutes implémentées. `tsc -b`/`npm run lint`/`npm run build` propres. Vérifié en navigateur (Playwright, compte admin, port 3011, token Mapbox réel) : tous les critères d'acceptation UI confirmés, y compris les 2 tests de non-régression (Annuler retire le polygone, Supprimer retire carte+liste). **1 bug réel trouvé et corrigé en test réel** : `MapboxDraw` nécessite `userProperties: true` au constructeur pour exposer les propriétés custom (`zoneType`) aux expressions de style (`user_zoneType`) — sans ce flag, la couleur retombait silencieusement sur le bleu par défaut dès qu'une zone était désélectionnée (2e/3e zone bleues au lieu de leur couleur de type). Détail technique complet dans `memory/memory.md`.

**Persistance confirmée (2026-07-13)** : migration appliquée par l'utilisateur, 2 contrats de test créés de bout en bout (1 zone puis 5 zones couvrant les 6 types) — sonde REST confirme `type` correctement écrit pour chaque zone. Données de test supprimées. Pas encore commité.

## [x] Tâche 3 — Cadrage carte + parité Localiser/Délimiter + noms de zone en liste déroulante (branche `sprint008-analyse-propriete`, suite) — terminé et vérifié

Demande (`.input/tache3.md`, retour utilisateur après sprint008/008.5) : (1) cadrage caméra de Localiser trop large — zoomer davantage (`fitBounds` padding réduit) ; (2) Délimiter doit reprendre exactement la même vue que Localiser (2 colonnes, contour rouge + masque, même zoom) — seul le panneau gauche change de contenu (zones tracées au lieu de l'adresse) ; (3) nom de zone : champ texte libre → menu déroulant (Stationnement défaut, Entrée, Trottoir, Autres), avec champ "Précisez" additionnel (pas de remplacement) quand Autres est choisi.

Décisions validées avec l'utilisateur : dropdown + champ additionnel pour Autres (pas de remplacement du menu) ; Délimiter reprend le contour+masque complet, pas seulement le layout.

Plan détaillé complet : `/root/.claude/plans/ouvre-une-nouvelle-branche-gleaming-goblet.md` (contenu remplacé — sprints 008/008.5 archivés dans les entrées ci-dessous et dans `tasks.md`/`memory.md`).

**Fichiers prévus** :
- Nouveaux : `src/features/contracts/components/wizard/PropertyMapStage.tsx`, `PropertyZonesPanel.tsx`
- Modifiés : `MapViewportController.tsx` (padding), `WizardStepProperty.tsx` (calcul `boundary` centralisé), `PropertySubStepLocate.tsx`, `PropertySubStepDelineate.tsx`
- Inchangés : `PropertyMap.tsx`, `PropertyBoundaryLayer.tsx`, `PropertyMaskLayer.tsx`, `PropertyInfoPanel.tsx`, `PolygonEditor.tsx`, `SurfaceSummary.tsx`, `PropertySubStepValidate.tsx`, schémas/DB

**Étapes réalisées** : toutes implémentées. `tsc -b`/`npm run lint`/`npm run build` propres. Vérifié en navigateur de bout en bout (Playwright, compte admin, port 3011) : zoom resserré confirmé, même cadre/contour/masque sur Localiser et Délimiter, panneau zones + dropdown fonctionnels (dont le cas "Autres"), création réelle d'un contrat jusqu'au bout. 2 clients de test (+1 contrat/2 factures/1 zone) créés puis supprimés après vérification (confirmation utilisateur). Pas encore commité.

## [x] Sprint 008.5 — Optimisation UX du Wizard (carte plein écran, Footer unifié), branche `sprint008-analyse-propriete` (suite, pas de nouvelle branche) — terminé et vérifié

Demande (`.input/sprint85`) : suite du sprint008, purement UX/layout (aucune nouvelle fonctionnalité métier). Supprimer l'en-tête de page du Wizard (titre+sous-titre, redondant avec le Breadcrumb) sur les 6 étapes, faire remonter `WizardProgress` juste sous le Breadcrumb, faire de la carte le composant dominant (hauteur max, zéro scroll) sur les 3 sous-étapes de "Analyse de la propriété", sortir tous les boutons de navigation/action de la zone de carte vers un Footer unique et réutilisable (slot `action` générique, pensé pour tous les futurs Wizards), redimensionnement Mapbox automatique (`map.resize()` via `ResizeObserver`), et préparer l'automatisation future de la capture (composant `CaptureButton` → hook `usePropertyCapture`).

Décision validée avec l'utilisateur : le regroupement dans le Footer s'étend aux 3 sous-étapes (Localiser/Délimiter/Valider), pas seulement Localiser (seul exemple concret du brief) — cohérence sur toute l'étape. Le mini-formulaire "Ajouter la zone" (Délimiter) reste sur la carte (ce n'est pas une navigation).

Plan détaillé complet (mécanisme de remontée de navigation "nav lifting", chaîne flex `h-full`/`min-h-0`, fichiers) : `/root/.claude/plans/ouvre-une-nouvelle-branche-gleaming-goblet.md` (même fichier que le sprint008 précédent, contenu remplacé — le plan du sprint008 reste archivé dans l'entrée ci-dessous et dans `tasks.md`/`memory.md`).

**Fichiers prévus** :
- `WizardLayout.tsx` (retrait header), `WizardFooter.tsx` (slot `action` générique)
- `ContractWizard.tsx`, `WizardStepProperty.tsx`, `PropertySubStepLocate.tsx`, `PropertySubStepDelineate.tsx` (nav lifting + hauteur flex)
- `PropertyMap.tsx` (hauteur flexible), `useMapboxMap.ts` (ResizeObserver)
- Nouveau : `src/features/contracts/hooks/usePropertyCapture.ts` — Supprimé : `CaptureButton.tsx`

**Étapes réalisées** : toutes implémentées + 1 bug réel (boucle infinie React, voir `memory/memory.md`/`tasks.md`) trouvé et corrigé pendant la vérification navigateur. `tsc -b`/`npm run lint`/`npm run build` propres. Vérifié en navigateur de bout en bout (Playwright, compte admin, port 3011) jusqu'à la création réelle d'un contrat, resize de fenêtre testé (1440/1024/1920px) sans espace vide ni débordement sur la carte. 4 clients de test (+1 contrat/2 factures/1 zone) créés puis supprimés après vérification (confirmation utilisateur). Pas encore commité.

## [x] Sprint 008 — Analyse de la propriété V1 (carte immersive), branche `sprint008-analyse-propriete` — terminé et vérifié

Demande (`.input/sprint008`) : améliorer la sous-étape **Localiser** de l'étape "Analyse de la propriété" du Wizard Contrats (sprint007). V1 sans données cadastrales : contour GeoJSON de démonstration (généré, pas une vraie parcelle), `fitBounds` automatique, masque assombrissant l'extérieur du terrain, panneau d'information à gauche (30%) + carte (70%), animation discrète (200-300ms), bouton Capturer qui prépare (sans encore persister) zoom/centre/polygone. Délimiter/Valider non touchés (pas de calcul de superficie, pas de dessin de zones dans ce sprint).

Plan détaillé complet (composants, techniques masque/contour, fichiers) : `/root/.claude/plans/ouvre-une-nouvelle-branche-gleaming-goblet.md`.

**Fichiers touchés** :
- Nouveaux : `src/features/contracts/utils/propertyBoundary.ts`, `src/features/contracts/components/wizard/{PropertyBoundaryLayer,PropertyMaskLayer,MapViewportController,PropertyInfoPanel}.tsx`
- Renommé + étendu : `MapCapture.tsx` → `CaptureButton.tsx`
- Réécrit (rendu) : `PropertySubStepLocate.tsx`
- Inchangés : `PropertyMap.tsx`, `PropertySubStepDelineate.tsx`, `PropertySubStepValidate.tsx`, `WizardStepProperty.tsx`, `PolygonEditor.tsx`, schémas/DB

**Étapes réalisées** : implémentation complète + 3 bugs réels trouvés et corrigés en vérification navigateur (détail technique complet dans `memory/memory.md` et `memory/tasks.md` — piège `isStyleLoaded()`, masque en "donut" invisible au rendu malgré géométrie logique correcte remplacé par 4 rectangles, piège React `setState(fn)`). `tsc -b`/`npm run lint`/`npm run build` propres. Vérifié en navigateur de bout en bout (Playwright, compte admin, port 3011, token Mapbox public réel) jusqu'à la création réelle d'un contrat. 17 clients de test (+ 1 contrat/2 factures/1 zone) créés pendant le débogage, tous supprimés après vérification (confirmé vide en base, avec confirmation explicite de l'utilisateur pour la suppression). Pas encore commité.

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

## [x] Wizard de création de contrat — carte satellite + zones (2026-07-13, terminé et vérifié en entier avec la vraie carte)

Demande (`.input/sprint007`) : abandonner le formulaire/onglets pour un vrai Assistant (Wizard) linéaire façon Linear/Vercel/Stripe/Notion, avec comme pièce centrale une analyse cartographique de la propriété (géocodage automatique, capture satellite, tracé de zones au polygone avec calcul de superficie GPS via Mapbox GL JS + Mapbox GL Draw + Turf.js). Plan détaillé complet : `/root/.claude/plans/recupere-ton-prompt-dans-jazzy-gizmo.md`.

Décisions validées avec l'utilisateur avant implémentation :
1. Remplacement complet de `ContractCreatePage` (onglets, `ea2d6c1`) — pas de coexistence.
2. Pas de token Mapbox disponible ce sprint — coder contre `VITE_MAPBOX_TOKEN` en placeholder, parties carte non testables en navigateur.
3. Champs généraux existants (type/saison/prix/dates/renouvellement/notes) regroupés dans l'étape 1 "Client".
4. Paramètres de service (étape 3) en version minimale : interrupteur + champ "précisions" libre par service.

Décisions techniques prises pendant l'implémentation (à connaître pour toute tâche future touchant Contrats) :
- **Bucket Storage `contract-captures` privé** (pas public) — imagerie satellite jugée sensible ; accès via URLs signées (`createSignedUrl`), pas d'URL publique directe.
- **`contract_zones`** est une table dédiée (pas une réutilisation de `documents`) : une ligne par polygone tracé, `created_by`/`captured_at` couvrent "Créateur"/"Date" du brief sans colonnes ad hoc.
- **Id de contrat généré côté client** (`crypto.randomUUID()`, `ContractWizard.tsx`) dès l'ouverture du Wizard — nécessaire car les captures satellite sont uploadées dans Storage (chemin `contracts/{contractId}/zones/{zoneId}.jpg`) bien avant que la ligne `contracts` n'existe (elle n'est insérée qu'au submit final). Le contrat + toutes ses zones sont insérés en une seule fois à ce moment-là.
- **`superficie` (colonne existante) réutilisée** — change de sémantique : avant, estimation manuelle en pi² ; maintenant, somme calculée des zones tracées en m². Toute UI/rapport qui affichait cette colonne comme "estimation manuelle" doit être relu si retouché.
- **Clauses générées automatiquement** (`utils/generateClauses.ts`, fonction pure) à partir des réponses Q&R de l'étape Obligations — remplace le modèle précédent de texte libre pré-rempli mais éditable. `responsabilites` reste un texte fixe (aucune question ne le pilote). Affiché en lecture seule à l'étape Validation, pas d'édition manuelle exposée dans le Wizard.
- **`heure_premier_passage`/`distance_securite_cm`** (colonnes existantes, absentes des 7 questions du brief) ne sont plus collectées via l'UI — les défauts SQL (`07:00`/`60`) s'appliquent silencieusement (colonnes omises de l'insert). Si un besoin de les rendre éditables réapparaît, ajouter un champ dédié plutôt que de supposer qu'elles sont mortes.
- **Mode de secours manuel** ajouté à l'étape "Délimiter" (`PropertySubStepDelineate.tsx`) : quand `isMapboxConfigured` est `false`, un formulaire minimal (nom de zone + superficie en m² tapés à la main) remplace la carte, avec `imageStoragePath: 'manuel'` comme sentinelle. Ceci est une addition délibérée au-delà du brief brut, décidée unilatéralement pour rendre le Wizard testable de bout en bout malgré l'absence de token Mapbox — disparaît automatiquement dès qu'un token est configuré. À signaler explicitement si l'utilisateur s'attend à ce que la carte soit strictement obligatoire.
- **`ContractDetailPage.tsx` n'affiche pas encore** les zones/carte/clauses générées/services créés par le Wizard — fast-follow explicitement hors scope de ce sprint, pas oublié.

**Fichiers touchés** : nouvelle migration `supabase/migrations/20260713000000_contract_wizard.sql` (table `contract_zones`, colonnes `contracts.{adresse_geocodee,latitude,longitude,mode_paiement,services,obligations_reponses,accumulation_maximale_cm}`, bucket Storage + policies) ; nouvelles dépendances `mapbox-gl`, `@mapbox/mapbox-gl-draw`, `@turf/area`, `@turf/helpers` (+ `@types/mapbox__mapbox-gl-draw` en dev — `@types/mapbox-gl` retiré, mapbox-gl fournit ses propres types) ; `.env(.example)` + `VITE_MAPBOX_TOKEN` ; `src/lib/mapboxClient.ts`, `src/hooks/useMapboxMap.ts`, `src/components/map/MapCanvas.tsx` (génériques, hors `features/contracts/`) ; `src/components/layout/{WizardLayout,WizardProgress,WizardFooter}.tsx` (génériques, parallèles à `PageLayout`/`PageTabs` — sémantique verrouillée vs librement cliquable) ; `src/features/contracts/components/wizard/*` (14 nouveaux fichiers : orchestrateur `ContractWizard.tsx`, 6 étapes, 3 sous-étapes Propriété, `PropertyMap`/`MapCapture`/`PolygonEditor`/`SurfaceSummary`) ; `src/features/contracts/{types,schemas,services,hooks,constants,utils}/*` étendus ou créés (`generateClauses.ts`, `paymentPresets.ts`, `geocoding.service.ts`, `wizardOptions.ts`) ; `contracts.service.ts` (`createContractWithZones` remplace `createContractWithInvoices`/`createContract`) ; suppression de `ContractCreatePage.tsx`, `ContractServiceDescriptionFields.tsx`, `ContractThresholdFields.tsx`, `ContractObligationsFields.tsx`, `contractClauseDefaults.ts` (contenu absorbé dans `generateClauses.ts`/`paymentPresets.ts`) ; `router.tsx` (`ContractWizardPage` remplace `ContractCreatePage` sur `contracts/new`).

**Vérification initiale (2026-07-13, sans carte réelle)** : `tsc -b`, `npm run lint`, `npm run build` propres (un seul avertissement non bloquant sur la taille du bundle ~2.8 Mo à cause de mapbox-gl — pas de code-splitting ajouté, hors scope). Parcours complet des 6 étapes avec le mode de secours manuel, verrouillage/déverrouillage du "Suivant" vérifié à chaque étape, retour en arrière fonctionnel.

**Vérification finale (2026-07-13, avec token public réel `pk.*` et migration appliquée par l'utilisateur)** : test de bout en bout réel avec la vraie carte — géocodage automatique affiché sur une vue satellite réelle, tracé d'un polygone à la souris, calcul de surface GPS via Turf.js (75.01 m² / 72.82 m² sur différents tests), capture satellite uploadée dans Storage, contrat créé (statut Actif) avec factures générées automatiquement, tout confirmé sur la fiche détail. **3 bugs réels trouvés et corrigés pendant cette vérification** (aucun lié au type de token, auraient existé de toute façon) :
1. `PolygonEditor.tsx` — rappel synchrone de `draw.changeMode()` depuis le gestionnaire de son propre événement `draw.create` → Mapbox GL Draw se re-rentre dans son propre cycle interne → `RangeError: Maximum call stack size exceeded`. Corrigé en reportant l'appel via `setTimeout(..., 0)`.
2. Même fichier — nettoyage au démontage (`map.removeControl(draw)`) plantait si la carte parente avait déjà été détruite (ordre de démontage entre composants frères non garanti) → `try/catch` best-effort.
3. `contractCreation.schema.ts` — `accumulationMaximaleCm` passait silencieusement de `null` à `0` après un aller-retour entre étapes (remontage d'un input non-contrôlé RHF), et `0` échouait `.positive()`, faisant échouer `handleSubmit` **sans aucun signal visible** (pas de toast, pas d'erreur console). Corrigé : contrainte assouplie à `.min(0)`, et `generateClauses.ts` traite `0` comme "non renseigné" plutôt que comme une vraie valeur.

Correctif additionnel : `ContractDetailPage.tsx` affichait encore "pi²" à côté de `superficie`, unité obsolète depuis que ce champ est calculé en m² — label corrigé (l'affichage complet des zones/carte/services sur cette page reste un fast-follow hors scope).

Toutes les données de test de cette session (11+ clients dupliqués créés au fil des multiples itérations de debug, 2 contrats, 4 factures) supprimées via l'interface après vérification — listes Contrats/Factures/Clients revérifiées vides. **Le Wizard est maintenant pleinement fonctionnel de bout en bout en conditions réelles.** Pas encore commité.

## [x] Refonte UX Contrats — interface "Desktop Application" (2026-07-12, terminé et vérifié)

Demande (`.input/tache1.md`, 3e réutilisation de ce nom de fichier) : transformer `ContractCreatePage` (longue page qui défile) en interface façon SaaS desktop (Linear/Vercel/Stripe/Notion) — viewport fixe (sidebar/header/breadcrumb/footer jamais hors écran), formulaire divisé en 5 onglets (une vue à la fois, défilement local uniquement), breadcrumb 3 niveaux avec dernier élément non cliquable, logo +50% (sidebar + login), et composants génériques réutilisables (`PageLayout`, `Breadcrumb`, `PageTabs`, `StickyPageHeader`, `StickyPageFooter`, `ModuleContainer`) en vue d'un déploiement futur aux 7 autres modules. Scope explicitement limité à Contrats pour ce sprint.

Décisions prises (voir détail complet dans `/root/.claude/plans/temporal-swimming-sifakis.md`) :
1. Branche créée à partir du commit nav-optim (`02086f2`) plutôt que de `main` — décision utilisateur après question explicite sur la gestion des changements non commités.
2. `AppLayout.tsx` `min-h-screen` → `h-screen overflow-hidden` : seul changement de fondation partagé par toute l'app, bas risque, ne change rien visuellement pour les modules non convertis.
3. Amélioration ajoutée à la demande brute : point d'erreur rouge par onglet (`PageTabs`) dérivé de `formState.errors`, pour que "Créer" désactivé reste compréhensible même quand l'onglet fautif n'est pas affiché.
4. Bug de breadcrumb pré-existant corrigé (routes Contrats imbriquées sous un parent avec `handle.breadcrumb`) — probablement présent sur les 7 autres modules aussi, non corrigé ailleurs (hors scope).

**Étapes réalisées** : 5 nouveaux composants génériques (`src/components/layout/`), `ContractClausesFields.tsx` éclaté en 3 fichiers + `TextareaField.tsx` partagé, `ContractCreatePage.tsx` réécrite avec état d'onglet local et même logique métier (`useCreateContractWithInvoices`, `canFinalize`, `submitAs`) inchangée, `router.tsx` (routes Contrats imbriquées), `AppLayout.tsx` (scroll fix), `Sidebar.tsx`/`LoginPage.tsx` (logos). `tsc -b` et `npm run lint` propres.

**Vérification finale (2026-07-12)** : test de bout en bout réel (Playwright, compte admin, port 3011) — aucun scroll de body observé nulle part dans l'app (Dashboard, Leads, Contrats) après le fix `AppLayout`, non-régression confirmée sur les modules non convertis ; les 5 onglets basculent sans reflow du header/sidebar/footer ; point d'erreur testé en laissant un champ requis vide sur un onglet non affiché ; footer vérifié sans chevauchement avec la sidebar (280px) ; breadcrumb confirmé "Centre des opérations › Contrats › Nouveau contrat" (et variantes liste/détail) ; tailles de logo confirmées visuellement (sidebar 48px, login 96px). Contrat de test créé de bout en bout (client inline "UXTest Sprint" + 10 clauses remplies + 2 échéances 50/50 → 2 factures générées automatiquement, statut Actif) puis toutes les données de test supprimées (2 factures, 1 contrat, 1 client) via l'API REST avec la clé `service_role`. Aucune erreur console à aucune étape. Pas encore commité.
