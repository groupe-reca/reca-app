import { Badge } from '@/components/ui/Badge'

/** Wrapper trivial autour de `Badge` — uniformise la fiche/carte Employés avec le catalogue `XxxStatusBadge` des autres modules, même si le champ sous-jacent (`actif`) est un simple booléen. */
export function EmployeeStatusBadge({ actif }: { actif: boolean }) {
  return <Badge color={actif ? 'green' : 'gray'}>{actif ? 'Actif' : 'Inactif'}</Badge>
}
