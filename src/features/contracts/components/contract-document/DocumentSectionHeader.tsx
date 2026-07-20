type DocumentSectionHeaderProps = {
  title: string
  variant?: 'plain' | 'navy'
}

/**
 * Les 2 seuls traitements d'en-tête de section du document (mockup `.input/contract_design.png`) :
 * `plain` = libellé gras majuscule + filet horizontal (colonne gauche : Services, Modalités,
 * Clauses, Signatures), `navy` = bandeau plein `bg-reca-night-blue` en haut de carte (colonne
 * droite : Client, Récapitulatif, Paiement). Centralisé ici pour ne pas dupliquer ces 2 markups.
 */
export function DocumentSectionHeader({ title, variant = 'plain' }: DocumentSectionHeaderProps) {
  if (variant === 'navy') {
    return (
      <div className="-mx-5 -mt-5 mb-4 rounded-t-card bg-reca-night-blue px-5 py-3">
        <h3 className="text-label font-semibold tracking-wide text-white uppercase">{title}</h3>
      </div>
    )
  }

  return (
    <div className="mb-3 flex items-center gap-3">
      <h3 className="shrink-0 text-label font-semibold tracking-wide text-reca-black uppercase">{title}</h3>
      <div className="h-px flex-1 bg-reca-gray-light" />
    </div>
  )
}
