import { Badge } from '@/components/ui/Badge'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import type { ContractDocumentData } from './types'

type DocumentSignaturesProps = Pick<ContractDocumentData, 'client'>

/** Zones de signature — purement décoratif, aucune capture de signature réelle ce sprint. */
export function DocumentSignatures({ client }: DocumentSignaturesProps) {
  return (
    <div>
      <DocumentSectionHeader title="Signatures" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <p className="text-label font-semibold uppercase text-reca-gray-medium">Client</p>
            <Badge color="orange" size="sm">
              Sign
            </Badge>
          </div>
          <p className="text-body font-medium text-reca-black">
            {client.prenom} {client.nom}
          </p>
          <div className="mt-8 border-b border-reca-gray-light" />
          <p className="mt-2 text-label text-reca-gray-medium">Date : ____________________</p>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2">
            <p className="text-label font-semibold uppercase text-reca-gray-medium">Groupe RÉCA</p>
            <Badge color="orange" size="sm">
              Sign
            </Badge>
          </div>
          <p className="text-body font-medium text-reca-black">Entrepreneur</p>
          <div className="mt-8 border-b border-reca-gray-light" />
          <p className="mt-2 text-label text-reca-gray-medium">Date : ____________________</p>
        </div>
      </div>
    </div>
  )
}
