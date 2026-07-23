import type { Settings } from '@/features/settings/types/settings.types'
import type { RouteAssignment } from '../services/routeAssignments.service'
import type { RouteClient } from '../services/routeClients.service'
import type { Route } from '../types/route.types'

export type RoutePdfData = {
  route: Route
  routeClients: RouteClient[]
  assignments: RouteAssignment[]
  settings: Settings
}
