import { PdfBrandHeader } from '@/components/pdf/PdfBrandHeader'
import { ROUTE_STATUS_LABELS } from '../../types/route.types'
import type { RoutePdfData } from '../types'

type PdfRouteHeaderProps = Pick<RoutePdfData, 'route'> & { logoDataUri: string | null }

/** Mire `PdfInvoiceHeader.tsx`/`PdfContractHeader.tsx` (même bandeau partagé) — titre "Feuille de route". */
export function PdfRouteHeader({ route, logoDataUri }: PdfRouteHeaderProps) {
  return (
    <PdfBrandHeader
      title="Feuille de route"
      subtitle={ROUTE_STATUS_LABELS[route.statut]}
      logoDataUri={logoDataUri}
      metaRows={[
        { label: 'N° de route', value: route.numero },
        { label: 'Secteur', value: route.secteur ?? '—' },
      ]}
    />
  )
}
