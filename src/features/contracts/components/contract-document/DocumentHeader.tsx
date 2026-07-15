import { CalendarDays, FileText } from 'lucide-react'
import logo from '@/assets/logo-sombre.svg'
import { formatDateLong } from '@/lib/format'
import type { ContractDocumentData } from './types'

type DocumentHeaderProps = Pick<ContractDocumentData, 'contract'>

/** Bandeau héro du document — pas de photo (aucun asset disponible), dégradé navy en remplacement. */
export function DocumentHeader({ contract }: DocumentHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6 rounded-t-card bg-gradient-to-br from-reca-night-blue to-[#1e293b] px-8 py-8 text-white">
      <div className="min-w-0">
        <img src={logo} alt="Groupe RÉCA" className="mb-6 h-10 w-auto object-contain" />
        <h1 className="text-section font-bold uppercase leading-tight">Contrat de déneigement</h1>
        <div className="mt-2 flex items-center gap-3 text-label font-semibold uppercase tracking-wide">
          {contract.type && <span className="text-reca-warning">{contract.type}</span>}
          {contract.saison && <span className="text-white/70">Saison {contract.saison}</span>}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 rounded-card bg-white px-5 py-4 text-reca-black shadow-floating">
        <div className="flex items-center gap-3">
          <FileText className="size-4 text-reca-red" aria-hidden="true" />
          <div>
            <p className="text-label text-reca-gray-medium">N° de contrat</p>
            <p className="text-body font-semibold">{contract.numero}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="size-4 text-reca-red" aria-hidden="true" />
          <div>
            <p className="text-label text-reca-gray-medium">Date du contrat</p>
            <p className="text-body font-semibold">{formatDateLong(contract.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
