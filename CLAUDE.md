## 4. Le système de mémoire (`/memory`)

Pour éviter la perte de cohérence entre les sessions et les tâches, chaque repo contient un dossier `memory/` à la racine avec quatre fichiers :

```
memory/
├── memory.md      → Contexte permanent du projet
├── tasks.md       → Liste des tâches (à faire / en cours / terminées)
├── plans.md       → Plans détaillés des fonctionnalités en cours ou à venir
└── file-index.md  → Table de référence : quels fichiers appartiennent à quel module
```

### `memory/memory.md`
Contient le contexte qui ne doit jamais être perdu :
- Nom du client, secteur, ton de marque, couleurs, typographies
- Décisions techniques prises et pourquoi (ex: "on utilise X plutôt que Y parce que...")
- Contraintes spécifiques au client
- Ce qui a été essayé et rejeté (pour ne pas relancer la même idée deux fois)

### `memory/tasks.md`
Liste de tâches à trois statuts : `[ ] à faire`, `[~] en cours`, `[x] terminée`. Chaque tâche terminée garde une courte note de ce qui a été fait.

### `memory/plans.md`
Avant toute tâche non-triviale (nouvelle section, nouvelle fonctionnalité, refonte), on y écrit d'abord le plan : objectif, étapes, fichiers touchés, risques. On implémente seulement après.

### `memory/file-index.md`
Table de référence "module → fichiers" : pour chaque module (Leads, Quotes, Clients, Contrats, Factures, Paiements, Équipements, Employés, Routes, Paramètres, Auth), la liste exacte des fichiers réels groupés par couche (`types`/`schemas`/`services`/`hooks`/`components`/`pages`), plus une section "Partagé/transverse" (`src/components/layout`, `src/components/ui`, `src/hooks`, `src/layouts`, `src/routes`, `src/lib`). C'est la référence à consulter avant toute exploration du repo (voir section 6).

### Protocole de mise à jour — OBLIGATOIRE

**Au début de chaque tâche :**
1. Lire `memory/memory.md` en entier
2. Lire `memory/tasks.md` pour voir l'état actuel
3. Si la tâche touche un module existant, consulter `memory/file-index.md` pour la liste exacte des fichiers concernés (voir section 6)
4. Si la tâche est non-triviale, écrire ou mettre à jour le plan correspondant dans `memory/plans.md` avant de coder

**À la fin de chaque tâche :**
1. Mettre à jour `memory/tasks.md` (statut + note de complétion)
2. Ajouter à `memory/memory.md` toute décision ou contrainte nouvelle qui devra être connue plus tard
3. Cocher/archiver le plan correspondant dans `memory/plans.md`
4. Si des fichiers ont été ajoutés/supprimés/déplacés dans un module, mettre à jour `memory/file-index.md` en conséquence

Ne jamais considérer une tâche "terminée" tant que ces fichiers ne sont pas à jour. Une tâche non reflétée dans `memory/` est une tâche qui n'existe pas pour la prochaine session.

---

## 5. Le module Contrats — Assistant (Wizard) de création

La création d'un contrat (`/contracts/new`) n'est **plus** un formulaire à onglets : c'est un Assistant linéaire et verrouillé à 6 étapes (impossible d'avancer sans compléter l'étape courante ; revenir à une étape déjà complétée reste possible). Orchestrateur : `src/features/contracts/components/wizard/ContractWizard.tsx`.

Étapes : **Client** → **Analyse de la propriété** (sous-étapes internes Localiser/Délimiter/Valider) → **Services** → **Obligations** → **Paiement** → **Validation**.

Points clés à connaître avant de toucher ce module :
- **Carte** : Mapbox GL JS + Mapbox GL Draw + Turf.js géocodent l'adresse du client, affichent une vue satellite, permettent de tracer plusieurs zones au clic avec calcul de superficie GPS (précision maximale, aucune approximation pixel). Nécessite `VITE_MAPBOX_TOKEN` dans `.env` — **doit être un token public (`pk.*`), jamais un token secret (`sk.*`)**, Mapbox GL JS refuse ces derniers côté navigateur. Sans token configuré, un mode de secours manuel (saisie du nom + surface en m² à la main) prend le relais automatiquement.
- **Clauses générées automatiquement** : l'étape Obligations est une série de questions/réponses structurées ; le texte des clauses (`obligations_client`, `exclusions`, `nettoyage_final`, `responsabilites`) est assemblé par `src/features/contracts/utils/generateClauses.ts` (fonction pure), plus jamais rédigé en texte libre par l'utilisateur.
- **`contracts.superficie`** est maintenant la somme calculée des zones tracées (m²), plus une estimation manuelle en pi².
- **`contract_zones`** est une table dédiée (une ligne par polygone tracé, `contract_id` FK). Les captures satellite sont stockées dans le bucket Storage **privé** `contract-captures` (accès via URLs signées, chemin `contracts/{contractId}/zones/{zoneId}.jpg`).
- **L'id du contrat est généré côté client** (`crypto.randomUUID()`) dès l'ouverture du Wizard, avant même que la ligne `contracts` n'existe — nécessaire car les captures satellite sont uploadées avant l'insertion finale. Contrat + zones sont insérés en une seule fois au submit (`contractsService.createContractWithZones`).
- **Composants layout génériques** `WizardLayout`/`WizardProgress`/`WizardFooter` (`src/components/layout/`) sont **verrouillés/linéaires**, à la différence de `PageLayout`/`PageTabs` (librement cliquables, utilisés par les autres modules) — ne pas les confondre ni essayer de les fusionner.
- **`ContractDetailPage.tsx` n'affiche pas encore** les zones/carte/clauses générées/services créés par le Wizard — fast-follow connu, pas un oubli si on le remarque.
- Migration de référence pour le schéma exact : `supabase/migrations/20260713000000_contract_wizard.sql`.

---

## 6. Règles pour limiter l'exploration du repo — OBLIGATOIRE

Objectif : ne jamais redécouvrir la structure du projet à chaque tâche (coût en tokens). Règles à appliquer systématiquement :

1. **Ne pas parcourir/grep tout le repo** pour une tâche qui touche un module déjà cartographié dans `memory/file-index.md`. Pas d'exploration récursive du dépôt "au cas où".
2. **Si la tâche concerne un module connu** (ex: "corrige le module Clients"), consulter d'abord `memory/file-index.md` pour obtenir la liste exacte des fichiers de ce module, puis lire uniquement ces fichiers-là.
3. Le réflexe systématique en début de tâche est : `memory/memory.md` + `memory/tasks.md` + **`memory/file-index.md`** — pas une exploration du repo. Ces trois lectures remplacent le besoin de "chercher pour comprendre".
4. Si un fichier nécessaire n'apparaît pas dans l'index (fichier nouveau, cas réellement transverse non listé), une recherche ponctuelle reste acceptable — mais l'index doit être mis à jour ensuite (protocole de fin de tâche, section 4), jamais contourné silencieusement à chaque fois.
5. Ne pas modifier d'autres modules que celui demandé, ne pas renommer de composants existants, ne pas déplacer de fichiers, ne pas proposer une nouvelle architecture — sauf si explicitement demandé. Utiliser les composants/patterns déjà en place (voir `memory/memory.md` pour les décisions déjà prises).

---
