import { Link } from 'react-router'

type EmptyValueProps = {
  /** Invitation à agir (ex. « Ajouter une date »). Sans `label`, rend un tiret neutre. */
  label?: string
  /** Texte précédant l'invitation (ex. « Aucun obstacle noté »), non cliquable. */
  prefix?: string
  onAction?: () => void
  to?: string
}

/**
 * Valeur absente. Un tiret n'est ni une information ni une invitation : dès qu'un chemin
 * d'édition existe, cette valeur vide devient une affordance discrète (« Ajouter … ») qui
 * mène droit au bon formulaire.
 *
 * Sans `label` (ni `onAction`/`to`), le rendu reste le tiret neutre d'origine — le composant
 * est donc adoptable partout sans changer le comportement existant.
 */
export function EmptyValue({ label, prefix, onAction, to }: EmptyValueProps) {
  if (!label || (!onAction && !to)) {
    return <span className="text-body text-reca-gray-medium">—</span>
  }

  const linkClasses = 'text-label font-medium text-reca-info hover:underline'

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {prefix && <span className="text-body text-reca-gray-medium">{prefix} ·</span>}
      {to ? (
        <Link to={to} className={linkClasses}>
          {label}
        </Link>
      ) : (
        <button type="button" onClick={onAction} className={linkClasses}>
          {label}
        </button>
      )}
    </span>
  )
}
