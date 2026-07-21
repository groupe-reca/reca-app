-- routes.trace_geojson: tracé (GeoJSON LineString) calculé par l'API Mapbox
-- Directions à partir des clients ordonnés de la route (module Routes, vue Carte).
-- Persisté plutôt que recalculé à chaque rendu pour que la vue Carte affiche toutes
-- les routes actives sans rappeler Directions une fois par route à chaque affichage.
-- Repeuplé par routeMetrics.service.ts::recalculateRouteMetrics(), jamais écrit
-- directement depuis un formulaire.
alter table public.routes
  add column trace_geojson jsonb;
