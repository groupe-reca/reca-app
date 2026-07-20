import { formatDateLong } from '@/lib/format'
import { PdfBrandHeader } from '@/components/pdf/PdfBrandHeader'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfContractHeaderProps = Pick<ContractDocumentData, 'contract'> & { logoDataUri: string | null }

/** Mire `DocumentHeader.tsx` (aperçu HTML) — bandeau héro navy avec numéro/date du contrat. */
export function PdfContractHeader({ contract, logoDataUri }: PdfContractHeaderProps) {
  const subtitle = [contract.type, contract.saison ? `Saison ${contract.saison}` : null].filter(Boolean).join(' — ')

  return (
    <PdfBrandHeader
      title="Contrat de déneigement"
      subtitle={subtitle || undefined}
      logoDataUri={logoDataUri}
      metaRows={[
        { label: 'N° de contrat', value: contract.numero },
        { label: 'Date du contrat', value: formatDateLong(contract.createdAt) },
      ]}
    />
  )
}
