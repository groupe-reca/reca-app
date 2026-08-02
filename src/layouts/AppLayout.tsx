import { useDeviceTier } from '@/hooks/useDeviceTier'
import { BreadcrumbLabelProvider } from './BreadcrumbLabelContext'
import { DesktopAppShell } from './DesktopAppShell'
import { MobileAppShell } from './MobileAppShell'

/**
 * Point de bascule Desktop/Mobile de l'app entière (sprint012) — les deux shells
 * sont des arbres 100% séparés (aucun JSX partagé), donc ce dispatcher est le seul
 * endroit en dehors des pages Contrats où un `if (tier === 'mobile')` apparaît.
 *
 * `BreadcrumbLabelProvider` est monté ici, au-dessus de la bascule, parce que le libellé
 * dynamique du dernier crumb est consommé par `Breadcrumb` (desktop) ET `MobileHeader`
 * (mobile) — un seul montage couvre les deux.
 */
export function AppLayout() {
  const tier = useDeviceTier()
  return (
    <BreadcrumbLabelProvider>
      {tier === 'mobile' ? <MobileAppShell /> : <DesktopAppShell />}
    </BreadcrumbLabelProvider>
  )
}
