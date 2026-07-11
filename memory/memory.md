# Contexte permanent — RECA "Centre des opérations"

## Client
- **Groupe RECA** — entreprise de déneigement (Québec). Identité de marque existante à préserver (flocon, lettrage véhicules) : voir `docs/GROUPE RECA - 01/02 - ...md`.
- Ton de marque visé : confiance, rapidité, robustesse, organisation, précision, hiver québécois. Interface volontairement sobre (peu de couleurs, beaucoup d'espace).
- Couleurs : Rouge RECA (couleur principale, marque), une couleur secondaire réservée aux interfaces uniquement, + couleurs fonctionnelles (succès/erreur/etc.) uniformisées dans toute l'app.
- Typographie interface : **Manrope** (police principale). Le logo garde sa police historique, non touchée.
- Spec consolidée et faisant autorité : `docs/GROUPE RECA - 07 - CAHIER DES CHARGES.md` (les docs 01-06 sont les livrables d'agence d'origine dont il découle).

## Stack technique
- React 19 + Vite + TypeScript + React Router + TanStack Query + React Hook Form/Zod + Tailwind.
- Backend : Supabase (Postgres, Auth, Storage). Projet live `ynsuxctqsvusbgcudcno` — les migrations SONT appliquées en live (vérifié par sonde REST sur `/rest/v1/clients`, 2026-07-10), même si `docs/07` et le CLI local (`LegacyProjectNotLinkedError`) suggèrent le contraire — ne pas se fier à ces deux signaux pour juger l'état du schéma.
- `.input/supabase` contient la clé `service_role` du projet live en clair (gitignored) — ne jamais la committer ni l'afficher. Aucune credential de login admin app n'est stockée dans le repo ; les flows nécessitant une authentification ne peuvent pas être testés end-to-end sans que l'utilisateur fournisse des identifiants.

## Conventions de code (doc 07 §3)
- PascalCase composants, camelCase hooks, `*.service.ts` / `*.schema.ts`, pas de `any`, ~300 lignes max par fichier, tous les appels réseau passent par `services/`, tous les formulaires passent par RHF + Zod.
- "Un module ne dépend jamais directement d'un autre" = un module en aval peut importer un composant (ex: `FormModal`) d'un module en amont pour créer l'étape suivante du pipeline (ex: QuoteDetailPage → ClientFormModal), mais jamais l'inverse. Dépendances toujours vers l'avant dans le pipeline Leads→Quotes→Clients→Contrats→Factures→Paiements.
- Structure exacte de chaque module (`types/`, `schemas/`, `services/`, `hooks/`, `components/`, `pages/`) : voir les modules Leads/Clients déjà livrés comme gabarit vivant plutôt que de re-dériver depuis les docs.

## Décisions prises et pourquoi
- Paiements : pas d'action "Modifier" (doc 06 n'en liste aucune) — seulement enregistrer/annuler, avec recalcul automatique du solde/statut de la facture parente à chaque opération.
- Ordre de construction des modules imposé par doc 07 §8 "Prochaines étapes" et par les dépendances naturelles du pipeline (voir `tasks.md`).
- CLAUDE.md racine (créé 2026-07-11) documente le protocole memory/ obligatoire — lire ce fichier + `tasks.md` en début de tâche, mettre à jour les trois fichiers en fin de tâche.

## Essayé et rejeté
- (rien à ce jour — section à remplir au fil des décisions techniques écartées)

## Contraintes spécifiques client
- Ne pas modifier l'identité visuelle historique (logo, police du logo).
- Interface Paramètres réservée aux comptes administrateur (rôles, config entreprise, taxes).
