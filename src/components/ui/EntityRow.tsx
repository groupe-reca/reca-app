import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import type { ReactNode } from 'react'

type EntityRowProps = {
  /** Cible du clic — toute la ligne est cliquable (plus de listes voisines aux modèles d'interaction différents). */
  to: string
  /** Identifiant court, ex. `CTR-000056` / `FAC-000081`. */
  identifier: string
  /** Libellé utile facultatif, ex. `Résidentiel 2026-2027`. */
  label?: ReactNode
  /** Date pivot facultative, déjà libellée, ex. `Fin : 30 avr. 2027` / `Échéance : 31 oct. 2026`. */
  pivot?: ReactNode
  /** Montant facultatif, déjà formaté. */
  amount?: string
  /** Badge de statut facultatif. */
  badge?: ReactNode
}

/**
 * Ligne générique pour toute liste d'entités imbriquée dans une fiche (contrats/factures/…).
 * Un seul modèle d'interaction : ligne entière cliquable + chevron, colonnes alignées. Remplace
 * les rangées ad hoc qui divergeaient d'une carte à l'autre (chevron ici, pas là ; date ici, pas là).
 */
export function EntityRow({ to, identifier, label, pivot, amount, badge }: EntityRowProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 rounded-control border border-reca-gray-light px-4 py-3 hover:bg-reca-snow"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-body text-reca-black">
          <span className="font-medium">{identifier}</span>
          {label != null && label !== '' && <span className="text-reca-gray-medium"> — {label}</span>}
        </p>
        {pivot != null && pivot !== '' && <p className="truncate text-label text-reca-gray-medium">{pivot}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {amount != null && <span className="text-body font-medium text-reca-black">{amount}</span>}
        {badge}
        <ChevronRight className="size-4 text-reca-gray-medium" aria-hidden="true" />
      </div>
    </Link>
  )
}
