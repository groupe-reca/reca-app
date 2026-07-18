import { CalendarClock, CreditCard, DollarSign, Home, Ruler } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { MODE_PAIEMENT_OPTIONS } from '../../constants/wizardOptions'
import { computeInstallmentAmount, getNextPaymentEntry } from '../../utils/paymentPresets'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import type { ContractDocumentData } from './types'

type DocumentSummaryPaymentProps = Pick<ContractDocumentData, 'contract' | 'settings'>

/** Carte Récapitulatif + carte Paiement + citation de clôture — colonne droite du document. */
export function DocumentSummaryPayment({ contract, settings }: DocumentSummaryPaymentProps) {
  const nextPayment = getNextPaymentEntry(contract.modalitesPaiement)
  const modeLabel = MODE_PAIEMENT_OPTIONS.find((mode) => mode.value === contract.modePaiement)?.label ?? '—'

  // Tâche 6 : `contract.prix` est soit le sous-total (avant taxes, comportement
  // d'origine) soit le total taxes incluses — `prixTaxes` (gravé sur le contrat à
  // sa création, jamais relu en live depuis les paramètres) indique lequel.
  const tpsRate = settings.taxes.tps / 100
  const tvqRate = settings.taxes.tvq / 100
  const prix = contract.prix ?? 0
  const sousTotal = contract.prixTaxes === 'apres_taxes' ? prix / (1 + tpsRate + tvqRate) : prix
  const tps = sousTotal * tpsRate
  const tvq = sousTotal * tvqRate
  const total = contract.prixTaxes === 'apres_taxes' ? prix : sousTotal + tps + tvq

  const recap = [
    { icon: Home, label: 'Type', value: contract.type ?? '—' },
    { icon: Ruler, label: 'Surface totale', value: contract.superficie != null ? `${contract.superficie} m²` : '—' },
    { icon: DollarSign, label: 'Prix', value: contract.prix != null ? formatCurrency(contract.prix) : '—' },
    { icon: CalendarClock, label: 'Prochain paiement', value: nextPayment?.dateEcheance ?? '—' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card bg-white p-5 shadow-card">
        <DocumentSectionHeader title="Récapitulatif du contrat" variant="navy" />
        <div className="flex flex-col gap-3">
          {recap.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
              <div>
                <p className="text-label text-reca-gray-medium">{label}</p>
                <p className="text-body font-semibold text-reca-black">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card bg-white p-5 shadow-card">
        <DocumentSectionHeader title="Paiement" variant="navy" />
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-reca-gray-medium" aria-hidden="true" />
            <div>
              <p className="text-label text-reca-gray-medium">Mode de paiement</p>
              <p className="text-body font-semibold text-reca-black">{modeLabel}</p>
            </div>
          </div>
        </div>
        {contract.prix != null ? (
          <div className="mb-3 flex flex-col gap-1">
            <div className="flex items-center justify-between text-body text-reca-gray-medium">
              <span>Sous-total</span>
              <span>{formatCurrency(sousTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-body text-reca-gray-medium">
              <span>TPS ({settings.taxes.tps}%)</span>
              <span>{formatCurrency(tps)}</span>
            </div>
            <div className="flex items-center justify-between text-body text-reca-gray-medium">
              <span>TVQ ({settings.taxes.tvq}%)</span>
              <span>{formatCurrency(tvq)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-reca-gray-light pt-2">
              <span className="text-label font-semibold text-reca-black">Total</span>
              <span className="text-h1 font-bold text-reca-red">{formatCurrency(total)}</span>
            </div>
          </div>
        ) : (
          <p className="mb-3 text-h1 font-bold text-reca-red">—</p>
        )}
        <div className="flex flex-col gap-2">
          {contract.modalitesPaiement.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 rounded-control bg-reca-snow p-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-reca-night-blue text-label font-semibold text-white">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-label font-semibold uppercase text-reca-black">{entry.description}</p>
                <p className="text-body font-semibold text-reca-red">
                  {formatCurrency(computeInstallmentAmount(entry, contract.prix))}
                </p>
              </div>
              <span className="text-label text-reca-gray-medium">{entry.dateEcheance || 'date à définir'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card bg-reca-snow p-5 text-center">
        <p className="text-body text-reca-gray-medium">
          Merci pour votre confiance. Nous sommes fiers de vous accompagner tout au long de la saison.
        </p>
        <p className="mt-2 text-label font-semibold uppercase tracking-wide text-reca-black">Groupe RÉCA.</p>
      </div>
    </div>
  )
}
