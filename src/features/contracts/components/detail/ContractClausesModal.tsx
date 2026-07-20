import { Modal } from '@/components/ui/Modal'
import { DEPOT_NEIGE_OPTIONS } from '../../constants/wizardOptions'
import type { Contract } from '../../types/contract.types'

export function ContractClausesModal({
  open,
  onClose,
  contract,
}: {
  open: boolean
  onClose: () => void
  contract: Contract
}) {
  return (
    <Modal open={open} onClose={onClose} title="Clauses du contrat">
      <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
        <p>
          <span className="font-medium text-reca-black">Zone desservie : </span>
          {contract.zoneDesservie}
        </p>
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
    </Modal>
  )
}
