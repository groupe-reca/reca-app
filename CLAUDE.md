## 4. Le système de mémoire (`/memory`)

Pour éviter la perte de cohérence entre les sessions et les tâches, chaque repo contient un dossier `memory/` à la racine avec trois fichiers :

```
memory/
├── memory.md   → Contexte permanent du projet
├── tasks.md    → Liste des tâches (à faire / en cours / terminées)
└── plans.md    → Plans détaillés des fonctionnalités en cours ou à venir
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

### Protocole de mise à jour — OBLIGATOIRE

**Au début de chaque tâche :**
1. Lire `memory/memory.md` en entier
2. Lire `memory/tasks.md` pour voir l'état actuel
3. Si la tâche est non-triviale, écrire ou mettre à jour le plan correspondant dans `memory/plans.md` avant de coder

**À la fin de chaque tâche :**
1. Mettre à jour `memory/tasks.md` (statut + note de complétion)
2. Ajouter à `memory/memory.md` toute décision ou contrainte nouvelle qui devra être connue plus tard
3. Cocher/archiver le plan correspondant dans `memory/plans.md`

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
