/**
 * Miroir TypeScript de la réponse de l'Edge Function `analyze-satellite-image` —
 * déjà validée côté serveur (Zod), pas de revalidation côté client (même logique que
 * `geocoding.service.ts` qui type sans revalider une réponse externe déjà structurée).
 */
export type SatelliteZoneDetection = {
  /** Points ordonnés [y, x] du contour, un par coin, normalisés 0-1000 par rapport à l'image capturée. */
  contour: [number, number][]
}

export type SatelliteAnalysisResult = {
  nombre_zones_detectees: number
  zones: SatelliteZoneDetection[]
  qualite_image: 'bonne' | 'moyenne' | 'insuffisante'
  raison_qualite?: string | null
}
