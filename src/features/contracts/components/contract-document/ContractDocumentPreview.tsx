import { DocumentClausesList } from './DocumentClausesList'
import { DocumentClientZones } from './DocumentClientZones'
import { DocumentFooterBar } from './DocumentFooterBar'
import { DocumentHeader } from './DocumentHeader'
import { DocumentServicesModalites } from './DocumentServicesModalites'
import { DocumentSignatures } from './DocumentSignatures'
import { DocumentSummaryPayment } from './DocumentSummaryPayment'
import type { ContractDocumentData } from './types'

/**
 * Prévisualisation HTML du futur contrat PDF — mimique le mockup `.input/contract_design.png`.
 * Les 2 colonnes internes basculent en 1 colonne sous `sm:` (640px) — volontairement un
 * seuil plus bas que celui de la page extérieure (`lg:`, 1024px) : ce document est affiché
 * soit dans la colonne de gauche du layout desktop (~700px de large, donc toujours ≥640px),
 * soit pleine largeur une fois la page extérieure empilée (tablette : 640-1023px, toujours
 * ≥640px ; mobile : <640px, c'est le seul cas où il doit vraiment repasser à 1 colonne).
 * `min-w-0` sur le conteneur évite qu'une grille CSS parente ne le laisse déborder de sa
 * colonne (comportement par défaut de `grid`/`flex`).
 */
export function ContractDocumentPreview({ contract, client, zones, settings }: ContractDocumentData) {
  return (
    <div className="min-w-0 overflow-hidden rounded-card bg-white shadow-card">
      <DocumentHeader contract={contract} />

      <div className="flex flex-col gap-6 bg-reca-snow px-6 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[2fr_1fr]">
          <DocumentServicesModalites contract={contract} />
          <DocumentClientZones contract={contract} client={client} zones={zones} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <DocumentClausesList contract={contract} />
            <div className="rounded-card bg-white p-5 shadow-card">
              <DocumentSignatures client={client} />
            </div>
          </div>
          <DocumentSummaryPayment contract={contract} />
        </div>
      </div>

      <DocumentFooterBar settings={settings} />
    </div>
  )
}
