import centroid from '@turf/centroid'
import type { ContractZoneRow } from '@/features/contracts/types/contract.types'

type ContractFallback = { latitude: number | null; longitude: number | null }

/**
 * Un point GPS unique par contrat, dérivé du tracé réel des zones de déneigement — jamais de
 * l'adresse géocodée du client, sauf en dernier recours (aucune zone tracée). Parmi les N zones
 * possibles d'un contrat (entrée/stationnement/trottoir/escaliers/...), potentiellement
 * disjointes spatialement, on prend le centroïde de la SEULE zone de plus grande surface plutôt
 * qu'un centroïde combiné : combiner risquerait de placer le point dans un espace mort entre
 * deux zones éloignées (ex: entre l'avant et l'arrière d'une propriété).
 */
export function computeContractPoint(
  zones: ContractZoneRow[],
  fallback: ContractFallback,
): [number, number] | null {
  if (zones.length > 0) {
    const largest = zones.reduce((a, b) => (b.surface_m2 > a.surface_m2 ? b : a))
    const point = centroid(largest.geojson)
    return point.geometry.coordinates as [number, number]
  }
  if (fallback.longitude != null && fallback.latitude != null) {
    return [fallback.longitude, fallback.latitude]
  }
  return null
}
