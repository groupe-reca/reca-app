export type RouteMapPoint = {
  contractId: string
  routeId: string
  routeName: string
  routeColor: string
  lng: number
  lat: number
  numero: string
  clientName: string
  adresse: string | null
  statut: string
}

export type RouteMapRoute = {
  id: string
  nom: string
  couleur: string
}

export type RouteMapData = {
  routes: RouteMapRoute[]
  points: RouteMapPoint[]
}
