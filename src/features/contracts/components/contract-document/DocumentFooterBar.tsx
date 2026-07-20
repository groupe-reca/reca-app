import { CreditCard, Globe, Mail, Phone } from 'lucide-react'
import { formatPhone } from '@/lib/format'
import type { ContractDocumentData } from './types'

type DocumentFooterBarProps = Pick<ContractDocumentData, 'settings'>

/**
 * Bandeau de pied de page — téléphone/courriel réels (`Settings`). Le site web est
 * une valeur statique (`groupereca.ca`, aucun champ `Settings` pour ça) ; le n° de
 * licence RBQ du mockup a été volontairement retiré (aucune vraie valeur disponible,
 * décision utilisateur de ne pas en afficher une fictive). Le lien de paiement en
 * ligne (tâche 10) reste du texte, pas un vrai lien cliquable — aucune fonctionnalité
 * de paiement réelle derrière cette prévisualisation ce sprint.
 */
export function DocumentFooterBar({ settings }: DocumentFooterBarProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-b-card bg-reca-night-blue px-8 py-4 text-label text-white/80">
      <span className="flex items-center gap-2 font-semibold text-white">
        <CreditCard className="size-4" aria-hidden="true" />
        Payer le contrat en ligne groupereca.ca/paiement
      </span>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {settings.telephone && (
          <span className="flex items-center gap-2">
            <Phone className="size-4" aria-hidden="true" />
            {formatPhone(settings.telephone)}
          </span>
        )}
        {settings.courriel && (
          <span className="flex items-center gap-2">
            <Mail className="size-4" aria-hidden="true" />
            {settings.courriel}
          </span>
        )}
        <span className="flex items-center gap-2">
          <Globe className="size-4" aria-hidden="true" />
          groupereca.ca
        </span>
      </div>
    </div>
  )
}
