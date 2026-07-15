import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { FileEdit, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge'
import { useContractInvoices } from '@/features/invoices/hooks/useContractInvoices'
import { formatCurrency } from '@/lib/format'
import { useContract } from '../../hooks/useContract'
import { useDeleteContract } from '../../hooks/useDeleteContract'
import { useUpdateContractStatus } from '../../hooks/useUpdateContractStatus'
import { ContractFormModal } from '../../components/ContractFormModal'
import { ContractStatusBadge } from '../../components/ContractStatusBadge'
import { CONTRACT_STATUSES, CONTRACT_STATUS_LABELS } from '../../types/contract.types'
import { DEPOT_NEIGE_OPTIONS, MODE_CONCLUSION_LABELS } from '../../constants/wizardOptions'

/** Contenu Desktop/Tablette — inchangé, seulement déplacé/renommé depuis `ContractDetailPage.tsx` (sprint012). */
export function DesktopContractDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: contract, isLoading } = useContract(id)
  const updateStatus = useUpdateContractStatus(id)
  const deleteContract = useDeleteContract()
  const { data: invoices } = useContractInvoices(id)
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading || !contract) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!contract) return
    if (!window.confirm(`Supprimer le contrat ${contract.numero} ?`)) return
    deleteContract.mutate(contract.id, { onSuccess: () => navigate('/contracts') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{contract.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">
            {contract.type ?? 'Contrat'} {contract.saison ? `— ${contract.saison}` : ''}
          </h1>
          <div className="mt-2">
            <ContractStatusBadge status={contract.statut} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {contract.statut === 'en_attente' && (
            <Button variant="secondary" onClick={() => navigate(`/contracts/new?draftId=${contract.id}`)}>
              <FileEdit className="size-4" aria-hidden="true" />
              Reprendre le brouillon
            </Button>
          )}
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Dropdown trigger={<Button variant="ghost">Statut</Button>}>
            {CONTRACT_STATUSES.map((status) => (
              <DropdownItem key={status} onClick={() => updateStatus.mutate(status)}>
                {CONTRACT_STATUS_LABELS[status]}
              </DropdownItem>
            ))}
          </Dropdown>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Prix : {contract.prix != null ? formatCurrency(contract.prix) : '—'}</p>
            <p>Mode de conclusion : {MODE_CONCLUSION_LABELS[contract.modeConclusion]}</p>
            <p>Signature : {contract.dateSignature ?? '—'}</p>
            <p>Début : {contract.dateDebut ?? '—'}</p>
            <p>Fin : {contract.dateFin ?? '—'}</p>
            <p>Renouvellement automatique : {contract.renouvellement ? 'Oui' : 'Non'}</p>
            <p>Notes : {contract.notes ?? '—'}</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Client</h2>
          {contract.client ? (
            <p className="text-body text-reca-gray-medium">
              <Link to={`/clients/${contract.client.id}`} className="text-reca-red hover:underline">
                {contract.client.prenom} {contract.client.nom} ({contract.client.numero})
              </Link>
            </p>
          ) : (
            <p className="text-body text-reca-gray-medium">Aucun client associé.</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Clauses du contrat</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Zone desservie : {contract.zoneDesservie}</p>
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
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Échéancier de paiement</h2>
          {contract.modalitesPaiement.length > 0 ? (
            <div className="flex flex-col gap-2">
              {contract.modalitesPaiement.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-body text-reca-gray-medium">
                  <span>{entry.description || 'Échéance'}</span>
                  <span>
                    {entry.type === 'pourcentage' ? `${entry.valeur}%` : formatCurrency(entry.valeur)}
                    {entry.dateEcheance && ` — ${entry.dateEcheance}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body text-reca-gray-medium">Aucune échéance.</p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Factures liées</h2>
        {invoices && invoices.length > 0 ? (
          <div className="flex flex-col gap-2">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                to={`/invoices/${invoice.id}`}
                className="flex items-center justify-between rounded-control border border-reca-gray-light px-4 py-3 hover:bg-reca-snow"
              >
                <div className="text-body text-reca-black">
                  <span className="font-medium">{invoice.numero}</span>
                  <span className="text-reca-gray-medium"> — {formatCurrency(invoice.total)}</span>
                </div>
                <InvoiceStatusBadge status={invoice.statut} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-body text-reca-gray-medium">Aucune facture liée à ce contrat.</p>
        )}
      </Card>

      <ContractFormModal open={editOpen} onClose={() => setEditOpen(false)} contract={contract} />
    </div>
  )
}
