# OUTIL_MESURE_ASSESSMENT.md — Refonte de l'outil de mesure des contrats

**Phase A — Analyse sans modification** (aucun fichier de code modifié)
**Branche :** `refonte-outil-mesure-contrats`
**Date :** 2026-08-02
**Auteur :** Claude (agent)
**Source de la demande :** `RECAAPPREFONTEOUTILMESURE.md` (direction officielle à étudier)

> ⚠️ **Avertissement liminaire, exigé par le §2/§10 du brief (« Ne pas supposer. Confirmer
> dans le code »)** : le brief part de la prémisse que « RECA Opérateur connaît la surface
> réelle à déneiger » et que « son comportement GPS est plus stable » grâce à elle. **Cette
> prémisse n'est PAS vérifiée par le code actuel.** reca-operateur ne consomme aujourd'hui
> **ni** `contract_zones`, **ni** `superficie`, **ni** aucun polygone : son moteur GPS
> fonctionne exclusivement sur un **point (lat/lng) + un rayon circulaire**. Voir §6 pour la
> démonstration ligne par ligne. C'est le constat le plus important de cette analyse et il
> réoriente la portée de la refonte (voir §7/§9).

---

## 1. Fonctionnement actuel

L'« outil de mesure » est la sous-étape **« Analyse & Zones »** du Wizard de création/reprise
de contrat (`/contracts/new`, `/contracts/new?draftId=`). Depuis la tâche 5 (2026-07-15),
cette étape est **optionnelle** : elle n'est atteinte que si l'utilisateur clique
« Outil de mesure » sur la carte « Adresse Validée » de l'étape 1 ; sinon la navigation
séquentielle la saute (`nextSkippingProperty`).

L'étape est elle-même un mini-stepper à 3 sous-étapes, orchestré par
`usePropertyStepState.ts` (logique) et `WizardStepProperty.tsx` (rendu) :

1. **Localiser** (`PropertySubStepLocate.tsx`)
   - Géocodage de l'adresse du client (Mapbox Geocoding) → centre `[lng, lat]`.
   - Carte satellite Mapbox GL JS. `MapViewportController.tsx` fait un `fitBounds()`
     automatique sur un **contour de démonstration fixe** (voir §3).
   - Contour rouge RECA (`PropertyBoundaryLayer.tsx`) + assombrissement de l'extérieur
     (`PropertyMaskLayer.tsx`, 4 rectangles).
   - Sur Desktop, quand la carte est prête, bascule en **plein écran** avec panneaux
     flottants (tâche 4).

2. **Délimiter** (`PropertySubStepDelineate.tsx` + `useDelineateState.ts`)
   - Dessin explicite de polygones (bouton « Nouvelle zone » → mode `draw_polygon`).
   - 7 types de zone colorés (`entree`, `stationnement`, `trottoir`, `escaliers`,
     `aire_manoeuvre`, `terrasse`, `autre`) via `ZoneNamingModal` + `ZoneTypeSelector`.
   - Édition des sommets d'une zone (recalcul de surface en direct), zoom-sur-zone,
     suppression réelle (carte + liste).
   - **Capture satellite** : `usePropertyCapture.ts` fait `map.getCanvas().toDataURL('image/jpeg')`
     → upload dans le bucket privé `contract-captures` → chaque zone stocke le chemin de
     cette image dans `image_storage_path`.
   - Détection automatique du stationnement (Gemini, Edge Function `analyze-satellite-image`)
     — hors périmètre de cette refonte mais présente.

3. **Valider** (`PropertySubStepValidate.tsx` + `SurfaceSummary.tsx`)
   - Récapitulatif des zones + surface totale.

Au **submit** du contrat (`contracts.service.ts → upsertContractWithZones` /
`createContractWithZones`), les zones sont insérées dans `contract_zones` en une fois, et
`contracts.superficie` reçoit la **somme** des `surface_m2` (arrondie 2 déc.).

**Le « cadre » du brief est en réalité la superposition de trois mécanismes distincts** —
il est essentiel de ne pas les confondre :

| Mécanisme | Fichier | Rôle réel | Contraint-il le dessin ? |
|---|---|---|---|
| Contour rouge « terrain » | `PropertyBoundaryLayer.tsx` + `buildDemoBoundary()` | Boîte **fixe 25 m × 18 m** autour du centre géocodé (placeholder, aucune donnée cadastrale) | Non (purement visuel) |
| Masque extérieur assombri | `PropertyMaskLayer.tsx` + `buildMaskRects()` | Assombrit tout hors du contour | Non (purement visuel), mais **suggère** une limite |
| Cadrage auto + capture | `MapViewportController.fitBounds()` (padding 20) + `usePropertyCapture` | Zoome serré sur la boîte 25×18, la capture = **screenshot du viewport** | **Indirectement oui** — voir §4 |

**Point capital confirmé sur le code** : Mapbox GL Draw dessine sur **toute** la carte ; le
dessin n'est *jamais* techniquement borné par le contour rouge. La « limite » ressentie
vient de (a) l'auto-zoom serré sur une boîte fixe trop petite et (b) la capture qui n'est
qu'un screenshot du viewport visible — une zone tracée hors du viewport capturé n'apparaît
pas sur l'image stockée.

---

## 2. Fichiers concernés

**Cœur de l'outil (module `contracts`) :**

- `hooks/useDelineateState.ts` — état du dessin/édition/suppression/zoom, calcul de surface `@turf/area`
- `hooks/usePropertyStepState.ts` — orchestration des 3 sous-étapes + photos + viewport
- `hooks/usePropertyCapture.ts` — capture screenshot + upload Storage
- `hooks/usePropertyPhotos.ts` — photos de propriété (`contract_photos`)
- `components/wizard/WizardStepProperty.tsx` — rendu de l'étape (Desktop)
- `components/wizard/PropertySubStepLocate.tsx` / `PropertySubStepDelineate.tsx` / `PropertySubStepValidate.tsx`
- `components/wizard/PropertyMapStage.tsx` — composant carte partagé (contour+masque+cadrage)
- `components/wizard/PropertyMap.tsx`, `PropertyBoundaryLayer.tsx`, `PropertyMaskLayer.tsx`, `MapViewportController.tsx`
- `components/wizard/PolygonEditor.tsx` — intégration Mapbox GL Draw, calcul de surface au `draw.create`/`draw.update`
- `components/wizard/PropertyZonesPanel.tsx` / `PropertyZonesContent.tsx`, `PropertyInfoPanel.tsx` / `PropertyInfoContent.tsx`
- `components/wizard/ZoneToolbarFloatingDesktop.tsx`, `ZoneTypeSelector.tsx`, `ZoneNamingModal.tsx`, `PolygonList.tsx`, `PolygonCard.tsx`, `ZoneAreaSummary.tsx`, `SurfaceSummary.tsx`
- `components/mobile/MobileWizardStepProperty.tsx`, `MobilePropertySubStepLocate.tsx`, `MobilePropertySubStepDelineate.tsx`, `PropertyInfoSheet.tsx`, `PropertyZonesSheet.tsx`, `ZoneToolbarFloating.tsx`, `ZoneDetailSheet.tsx`
- `utils/propertyBoundary.ts` — `buildDemoBoundary` / `buildMaskRects` / `boundsFromPolygon`
- `utils/drawPolygonAllVertices.ts` — mode `draw_polygon` custom (sommets visibles)
- `utils/satelliteZoneProjection.ts` — projection des détections Gemini
- `constants/zoneDrawStyles.ts`, `constants/wizardOptions.ts` (`ZONE_TYPE_OPTIONS`/`ZONE_TYPE_COLORS`)
- `schemas/contractCreation.schema.ts` — `contractZoneSchema` (forme d'une zone)
- `types/contract.types.ts` — `ZONE_TYPES`, `ContractZoneRow`, `ContractZone`
- `services/contracts.service.ts` — écriture `contract_zones` + calcul `superficie`

**Consommation aval (fiche détail / PDF) :**
- `components/detail/ContractMapCard.tsx`, `ContractZonesStatRow.tsx`, `hooks/useContractZones.ts`, `hooks/useSignedCaptureUrl.ts`
- `pdf/PdfSatelliteZones.tsx`, `contract-document/DocumentSatelliteZones.tsx`

**Base de données :**
- `supabase/migrations/20260713000000_contract_wizard.sql` — table `contract_zones` + bucket `contract-captures` + colonnes `contracts`
- `supabase/migrations/20260713010000_contract_zones_type.sql` — colonne `type`
- `supabase/migrations/20260714010000_contract_photos.sql` — table `contract_photos`

**Côté `reca-operateur` (repo voisin) :**
- `src/integrations/supabase/fetchAssignedMission.ts` — join `contracts(adresse_geocodee, latitude, longitude)`
- `src/domain/entities.ts` — `MissionItem`
- `src/engines/gps/gpsEngine.ts` + `src/engines/gps/types.ts` — moteur GPS (point + rayon)
- Tables serveur `missions` / `mission_items` (migrations `reca-app/supabase/migrations/20260723000000_missions.sql` et suivantes)

---

## 3. Structure de données actuelle

### Table `contract_zones` (schéma réel)

```sql
create table public.contract_zones (
  id                 uuid primary key default gen_random_uuid(),
  contract_id        uuid not null references public.contracts (id) on delete cascade,
  label              text not null,          -- nom affiché (dérivé du type, ou libre si 'autre')
  geojson            jsonb not null,         -- GeoJSON Polygon (jamais MultiPolygon)
  surface_m2         numeric(10,2) not null, -- surface géodésique de CETTE zone
  image_storage_path text not null,          -- capture satellite (viewport screenshot)
  type               text not null default 'autre',  -- 7 valeurs (check constraint)
  ordre              int not null default 0,
  captured_at        timestamptz not null default now(),
  created_at/updated_at/created_by/updated_by/deleted_at   -- audit + soft-delete
);
-- contrainte : jsonb_typeof(geojson) = 'object' ; type in (7 valeurs)
```

### Forme TypeScript (`contractZoneSchema`)

```ts
{ id, type: ZONE_TYPES, label, geojson: GeoJSON.Polygon, surfaceM2: number, imageStoragePath, ordre, capturedAt }
```

### Colonnes pertinentes sur `contracts`
- `superficie numeric` — **somme** des `surface_m2` des zones (sémantique m² depuis sprint007 ; historiquement pi²)
- `latitude` / `longitude` numeric(9,6), `adresse_geocodee text` — le **point** géocodé (c'est la seule géométrie que reca-operateur lit)

### Calcul de surface
- `@turf/area` sur chaque `Feature<Polygon>` → **aire géodésique sphérique en m²**, arrondie 2 déc.
  (`PolygonEditor.tsx:133/152`, `useDelineateState.ts:226`).
- Unité stockée : **m²** (unité unique). Affichage : m² (pi² supprimé de l'UI).

### Observations structurelles
- **1 zone = 1 Polygon simple.** Une propriété à plusieurs surfaces = **plusieurs lignes**
  `contract_zones`, jamais un `MultiPolygon`. Il n'existe **aucune** géométrie MultiPolygon
  ni PostGIS dans le projet — `geojson` est du `jsonb` brut, la surface est pré-calculée
  côté client et stockée en colonne.
- **Aucune zone GPS opérationnelle dérivée** n'existe (ni colonne, ni table). Le concept
  §5.3 du brief est entièrement à créer.
- **Aucun versionnement** de la géométrie (pas de `version`, pas d'historique de tracé).
  Seul l'audit `updated_at`/`updated_by` + soft-delete existe.
- **Aucune `source`** de tracé (`MANUAL`/`MIGRATED`/`IMPORTED`) n'est enregistrée.
- Pas de PostGIS : impossible aujourd'hui de faire une validation/containment géographique
  côté base.

---

## 4. Limites UX (confirmées sur le code)

1. **Cadrage auto trop serré et fixe.** `buildDemoBoundary` fabrique une boîte **25 m × 18 m**
   autour du centre, et `fitBounds(padding: 20)` zoome dessus. Une propriété plus grande
   qu'une boîte de 25×18 m (allée longue, grand stationnement, maison en coin) déborde
   d'emblée du viewport auto-cadré.
2. **Le masque sombre suggère une frontière.** Assombrir l'extérieur du contour communique
   visuellement « ne dessine pas ici », alors que rien n'empêche techniquement de tracer
   au-delà. Effet : l'utilisateur ne pense pas à sortir du cadre.
3. **La capture = screenshot du viewport.** Une zone tracée hors de la portion visible au
   moment du clic « Capturer » n'apparaît pas sur l'image stockée → image partielle,
   incohérente avec la géométrie réellement enregistrée.
4. **Cadrage difficile à corriger sans « recommencer ».** Le contour et le cadrage sont
   recalculés au montage de chaque sous-étape (mitigé par le `initialViewport` de la tâche 12,
   mais l'utilisateur ne peut pas *redimensionner* la zone de travail — seulement zoomer/panner).
5. **Pas de « surface partiellement cachée par les arbres ».** Aucun indicateur, aucune note
   par zone, aucune bascule satellite/plan intégrée au flux de dessin.
6. **Pas d'exclusions** (îlot, plate-bande, bâtiment) — impossible de représenter un trou.
7. **Pas d'aperçu « zone GPS » avant sauvegarde** (le concept n'existe pas).

---

## 5. Limites techniques (confirmées sur le code)

1. **Contour = placeholder, pas une parcelle.** `buildDemoBoundary` est explicitement un
   faux contour (commentaire dans le fichier) : aucune donnée cadastrale.
2. **Modèle « 1 Polygon par ligne », pas de MultiPolygon** ni de type géométrique unifié →
   aucune représentation atomique d'« une propriété = un ensemble de surfaces ».
3. **Surface calculée côté client puis figée** en colonne `surface_m2`. Si la géométrie était
   un jour modifiée hors de ce chemin, la surface ne se recalculerait pas.
4. **Pas de PostGIS / pas de validation géographique serveur** : fermeture du polygone,
   auto-intersection, proximité de l'adresse, surface plausible — rien n'est validé
   aujourd'hui (le seul garde-fou est `surfaceM2 > 0` côté Zod).
5. **Capture couplée à Mapbox GL JS (`getCanvas().toDataURL`)** : dépendance forte au rendu
   WebGL du navigateur, non reproductible côté serveur/PDF autrement qu'en re-signant l'image.
6. **Pas de versionnement / pas de copie figée pour les missions.** Rien ne garantit qu'une
   mission déjà créée conserve la géométrie qu'elle utilisait (le brief §14/§15 l'exige).
7. **Draw custom fragile.** `drawPolygonAllVertices.ts` + rappels `changeMode` reportés en
   `setTimeout` (pièges Mapbox GL Draw connus, cf. `memory.md`) — dette technique à surveiller
   dans toute refonte de l'éditeur.

---

## 6. Utilisation par RECA Opérateur (CODE, pas supposition)

**Ce que reca-operateur lit d'un contrat** — `fetchAssignedMission.ts` :

```ts
.from('mission_items')
.select(`id, contract_id, statut_operateur, heure_arrivee, heure_fin,
         duree_trajet_secondes, duree_intervention_secondes,
         contract:contracts(adresse_geocodee, latitude, longitude)`)
```

→ **Seuls `adresse_geocodee`, `latitude`, `longitude` sont lus.** Ni `superficie`, ni
`contract_zones`, ni `geojson`, ni image.

**Le `MissionItem` local** (`domain/entities.ts`) ne porte qu'un point + un rayon optionnel :

```ts
latitude, longitude, detectionRadiusMeters: null   // ← toujours null (jamais rempli depuis le serveur)
```

**Le moteur GPS** (`gpsEngine.ts` + `types.ts`) décide des transitions **par distance à un
point** (`haversineDistanceMeters(position, coordinate)`) comparée à des **rayons
circulaires** :

```ts
approachRadiusMeters: 250, workRadiusMeters: 30, completionRadiusMeters: 50
// ActiveResidence = { coordinate, detectionRadiusMeters }  ← detectionRadiusMeters override, aujourd'hui null
```

**Conclusion §10, basée sur le code :**

- reca-operateur **ne connaît PAS la surface** aujourd'hui. Il utilise un **cercle autour d'un
  point**. La détection d'arrivée / début / fin / résidences rapprochées repose entièrement
  sur ces rayons.
- La prémisse du brief (« plus stable depuis qu'il connaît la surface ») est donc **future,
  pas actuelle**. Elle décrit un bénéfice *attendu*, pas un comportement observé.
- **Pourquoi la surface *améliorerait* la stabilité (raisonnement, à valider produit)** : un
  test « point-dans-polygone » (ou dans une zone GPS dérivée, légèrement bufferisée) est plus
  discriminant qu'un cercle fixe de 30 m, surtout pour des **résidences rapprochées** en rangée
  où deux cercles de 30 m se chevauchent et génèrent des faux positifs. Une géométrie réelle
  (ou un rayon dérivé de la surface plutôt qu'une constante) réduirait ces faux positifs.
  **Mais aucun de ces mécanismes n'existe encore côté opérateur** — c'est un travail
  d'intégration à faire (voir §7, et §D.9 du plan à venir).

**Ce qu'il faudrait pour que reca-operateur exploite la surface :**
- soit propager une **zone GPS dérivée** (polygone simplifié / rayon calculé) sur `mission_items`
  au moment de la création de mission (copie figée, §14) ;
- soit charger `contract_zones` dans le moteur GPS et remplacer le test de rayon par un test
  de containment. La 1ʳᵉ option est la plus sûre (découple l'opérateur du schéma de dessin,
  et fige la géométrie utilisée par une mission — exigence §14/§15).

---

## 7. Options de refonte

### Option A — Améliorer l'existant (cadrage ajustable, sans changer le modèle de données)
- Remplacer `buildDemoBoundary` fixe par une **zone de travail ajustable** (déplaçable/
  redimensionnable) avec **marge 20–40 %** (§6.2 du brief), retirer l'auto-zoom serré.
- Découpler capture et dessin : capturer **la bounding box des zones tracées** (+ marge) au
  lieu du viewport brut, ou recadrer après coup (déjà amorcé par la tâche 8 « recapture avec
  zones en quittant Délimiter »).
- Garde le modèle « N lignes `contract_zones` », garde reca-operateur inchangé.
- **Effort : faible/moyen. Risque : faible. Ne répond pas à MultiPolygon / zone GPS / versionnement.**

### Option B — Éditeur de surface V2 (nouveau modèle géométrique unifié + zone GPS + versionnement)
- Introduire une **géométrie de déneigement unifiée par contrat** (`Polygon`/`MultiPolygon`),
  additive à côté de `contract_zones` (ne rien casser), avec `source`, `version`,
  `area_square_meters`, et une **`gps_geometry` dérivée**.
- Séparer explicitement les 3 concepts du brief §5 (vue de capture / zone de déneigement /
  zone GPS).
- Copie figée de la géométrie dans `mission_items` à la création de mission (§14).
- **Effort : élevé. Risque : moyen/élevé. Répond à tout le brief, mais touche reca-operateur.**

### Option C — PostGIS
- Activer PostGIS, stocker `geometry(MultiPolygon, 4326)`, valider/calculer côté base.
- **Effort : élevé + risque infra (extension, RLS, tooling). Non recommandé en V1** : le projet
  n'utilise nulle part PostGIS, `jsonb` + Turf suffit pour les besoins actuels, et l'ajout
  d'une extension à la base live est un changement à fort rayon de risque.

### Recommandation combinée (voir §9)
**Option A d'abord (livrable rapide, débloque la vraie douleur : le cadre qui coupe), puis
Option B par incréments** — le modèle géométrique unifié + zone GPS dérivée + versionnement +
copie figée mission, en gardant `contract_zones` comme couche de dessin. **PostGIS reporté.**

---

## 8. Risques

| Risque | Gravité | Mitigation |
|---|---|---|
| **Casser la création de contrat existante** (chemin `upsertContractWithZones` en prod) | Élevée | Toute migration **additive** (aucun renommage/suppression), comme toutes les migrations du projet ; feature-flag l'éditeur V2 |
| **Écraser une surface existante à la migration** | Élevée | Migration en **lecture seule** sur l'existant : dériver la nouvelle géométrie *à partir* des zones, ne jamais toucher `surface_m2`/`geojson` d'origine ; états `VALID/NEEDS_REVIEW/MISSING/MIGRATED/INVALID` (§11) |
| **Divergence reca-operateur** si le schéma change | Élevée | Ne rien retirer de ce que lit `fetchAssignedMission` ; toute nouvelle donnée opérateur passe par une **copie figée** sur `mission_items`, jamais par une lecture directe du dessin |
| **Mission active modifiée silencieusement** si le contrat change après coup | Élevée | Copie figée de la géométrie à la création de mission (§14) — à concevoir avec reca-operateur |
| **Migration base live impossible depuis ce sandbox** | Moyenne | Convention connue : migrations écrites ici, **appliquées par l'utilisateur** ; ne jamais merger tant que non appliquées |
| **Régression carte** (pièges Mapbox GL Draw connus) | Moyenne | Réutiliser les hooks neutres déjà débogués (`useDelineateState`), tester en navigateur réel |
| **Prémisse produit erronée** (surface ≠ utilisée par l'opérateur) | Moyenne | Ce rapport la corrige ; décider avec l'utilisateur si l'intégration opérateur fait partie de CE chantier ou d'un chantier reca-operateur séparé |

---

## 9. Recommandation

1. **Corriger la prémisse avec l'utilisateur** (§6) avant tout code : la surface n'améliore
   pas *encore* le GPS opérateur. Décider si l'intégration opérateur (zone GPS dérivée +
   copie figée mission) fait partie de ce chantier ou d'un sprint reca-operateur distinct.

2. **V1 — Option A (débloque la douleur réelle, faible risque, aucun changement de schéma) :**
   - Remplacer le cadre fixe par une **zone de travail ajustable + marge 20–40 %**, retirer
     l'auto-zoom serré, permettre le dessin/zoom/pan libre au-delà du cadrage initial.
   - Capturer la **bounding box des zones (+ marge)** plutôt que le viewport brut.
   - Adoucir/retirer le masque sombre en tant que « frontière ».
   - Ajouter bascule satellite/plan + note « surface partiellement cachée » par zone.

3. **V2 — Option B par incréments (répond au reste du brief), tout **additif** :**
   - Modèle géométrique unifié par contrat (`Polygon`/`MultiPolygon`) + `source` + `version` +
     `area_square_meters` + `gps_geometry` dérivée, **à côté** de `contract_zones`.
   - Distinguer les 3 concepts §5 (vue de capture / zone déneigement / zone GPS).
   - Exclusions (§5.5) : préparer la structure (trous/MultiPolygon), **ne pas implémenter l'UI**
     tant que la valeur n'est pas confirmée.
   - Intégration reca-operateur : **copie figée** de la géométrie sur `mission_items` à la
     création de mission + adaptation du moteur GPS (rayon dérivé ou containment).

4. **Reporter PostGIS** (Option C) — non nécessaire en V1/V2, `jsonb` + Turf suffisent.

5. **Ne pas supprimer l'outil**, ne jamais laisser le cadre visuel borner la géométrie finale,
   ne jamais écraser une surface existante (règles §24).

**Séquencement proposé :** Phase A (ce rapport) → validation utilisateur → Phase B (plan
détaillé dans `memory/plans.md`) → Phase C (prototype visuel données simulées) → Phase D
(implémentation V1 puis V2 par étapes contrôlées).

---

## 10. Stratégie de migration

**Principes (issus de §11/§24) :** additive uniquement, jamais d'écrasement silencieux,
états de qualité explicites, données existantes protégées.

1. **Inventaire (lecture seule)** des contrats via sonde REST :
   - contrats **avec** zones (`contract_zones` non vides) → surface existante.
   - contrats **sans** zone (créés en sautant « Analyse & Zones », cas fréquent depuis tâche 5)
     → `MISSING`.
2. **Dérivation, jamais écrasement.** Si un modèle unifié V2 est introduit, il est **calculé à
   partir** des `contract_zones` existantes (union / MultiPolygon), écrit dans la **nouvelle**
   structure, en marquant `source = 'MIGRATED'`. Les colonnes `geojson`/`surface_m2` d'origine
   restent intactes.
3. **États de qualité** attribués à la dérivation :
   - `VALID` — zones fermées, surface > 0, proche de l'adresse.
   - `NEEDS_REVIEW` — surface douteuse (aberrante), géométrie éloignée de l'adresse, capture
     partielle probable.
   - `MISSING` — aucune zone.
   - `MIGRATED` — dérivée automatiquement, à confirmer.
   - `INVALID` — géométrie non fermée / auto-intersectante / coordonnées hors bornes.
4. **Backfill de la zone GPS dérivée** (si V2) : générée depuis la zone de déneigement, jamais
   saisie ; recalculable.
5. **Missions historiques** : ne **jamais** rétro-remplir une mission passée — elle doit garder
   la géométrie qu'elle utilisait (ou aucune, si créée avant l'intégration). La copie figée ne
   s'applique qu'aux missions créées *après* la mise en place.
6. **Application** : migrations écrites dans `supabase/migrations/`, **appliquées par
   l'utilisateur** (contrainte sandbox connue), vérifiées par sonde REST avant tout merge.

---

## Annexe — Faits vérifiés sur le code (traçabilité)

- Zone = `GeoJSON.Polygon` simple, jamais MultiPolygon — `contractCreation.schema.ts` (`contractZoneSchema`).
- Surface = `@turf/area` géodésique, arrondie 2 déc. — `PolygonEditor.tsx:133/152`, `useDelineateState.ts:226`.
- `contracts.superficie` = Σ `surface_m2` — `contracts.service.ts:175-186`.
- Capture = screenshot viewport `getCanvas().toDataURL` — `usePropertyCapture.ts`.
- Contour = boîte fixe 25×18 m placeholder — `propertyBoundary.ts` (`buildDemoBoundary`).
- Masque = 4 rectangles, pas de trou — `propertyBoundary.ts` (`buildMaskRects`).
- reca-operateur lit `adresse_geocodee/latitude/longitude` seulement — `fetchAssignedMission.ts`.
- GPS = distance-à-point + rayons (250/30/50 m), `detectionRadiusMeters` toujours null — `gpsEngine.ts`, `gps/types.ts`, `entities.ts`.
- Aucune donnée cadastrale, aucun PostGIS, aucun versionnement/`source` géométrique dans le projet.
