import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopAppShell } from './DesktopAppShell'
import { MobileAppShell } from './MobileAppShell'

/**
 * Point de bascule Desktop/Mobile de l'app entière (sprint012) — les deux shells
 * sont des arbres 100% séparés (aucun JSX partagé), donc ce dispatcher est le seul
 * endroit en dehors des pages Contrats où un `if (tier === 'mobile')` apparaît.
 */
export function AppLayout() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileAppShell /> : <DesktopAppShell />
}
