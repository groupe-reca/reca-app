import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DEPOT_NEIGE_OPTIONS } from '../../constants/wizardOptions'
import type { Contract } from '../../types/contract.types'

/** "Clauses du contrat" — une clause visible par défaut (maquette), le reste en expansion. */
export function ContractClausesCard({ contract }: { contract: Contract }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <h2 className="text-subtitle font-semibold text-reca-black">Clauses du contrat</h2>
        {expanded ? (
          <ChevronUp className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
        )}
      </button>

      <p className="text-body text-reca-gray-medium">
        <span className="font-medium text-reca-black">Zone desservie : </span>
        {contract.zoneDesservie}
      </p>

      {expanded && (
        <div className="flex flex-col gap-2 border-t border-reca-gray-light pt-3 text-body text-reca-gray-medium">
          <p>Superficie : {contract.superficie != null ? `${contract.superficie} m²` : '—'}</p>
          <p>Exclusions : {contract.exclusions}</p>
          <p>Seuil de déclenchement : {contract.seuilDeclenchementCm} cm</p>
          <p>Heure limite de dégagement : {contract.heurePremierPassage}</p>
          <p>
            Accumulation max. par précipitation :{' '}
            {contract.accumulationMaximaleCm != null ? `${contract.accumulationMaximaleCm} cm` : '—'}
          </p>
          <p>
            Dépôt de la neige :{' '}
            {DEPOT_NEIGE_OPTIONS.find((option) => option.value === contract.depotNeige)?.label ?? '—'}
            {contract.depotNeige !== 'sur_terrain' &&
              ` (permis municipal ${contract.permisMunicipalObtenu ? 'obtenu' : 'non obtenu'})`}
          </p>
          <p>Nettoyage final : {contract.nettoyageFinal}</p>
          <p>Distance de sécurité : {contract.distanceSecuriteCm} cm</p>
          <p>Balises requises : {contract.balisesRequises ? 'Oui' : 'Non'}</p>
          <p>Obligations du client : {contract.obligationsClient}</p>
          <p>Responsabilités : {contract.responsabilites}</p>
          {contract.clauseAnnulation && <p>Annulation / résolution : {contract.clauseAnnulation}</p>}
          {contract.clausePrix && <p>Prix : {contract.clausePrix}</p>}
          {contract.clauseExecution && <p>Exécution : {contract.clauseExecution}</p>}
          {contract.clauseAssurance && <p>Assurance et responsabilité : {contract.clauseAssurance}</p>}
        </div>
      )}
    </Card>
  )
}
