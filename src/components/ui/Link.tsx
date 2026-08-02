import { Link as RouterLink } from 'react-router'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

/**
 * Lien stylé unique du repo — Bleu interface (`reca-info`, couleur de lien retenue par
 * refonte-ui « liens bleus »), soulignement au survol, `:visited` **neutralisé** (sinon le
 * navigateur vire au violet selon l'historique de navigation, ce qui donnait des couleurs de
 * lien différentes d'une page à l'autre). À utiliser à la place de tout `<a>` brut.
 *
 * `to` → lien interne (React Router). `href` → lien externe/protocole (`tel:`/`mailto:`/`https:`),
 * rendu en `<a>`.
 */
const LINK_CLASS = 'text-reca-info visited:text-reca-info hover:underline'

type LinkProps = {
  children: ReactNode
  className?: string
} & (
  | { to: string; href?: never }
  | ({ href: string; to?: never } & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel' | 'aria-label'>)
)

export function Link({ className = '', children, ...rest }: LinkProps) {
  const classes = `${LINK_CLASS} ${className}`.trim()

  if ('to' in rest && rest.to != null) {
    return (
      <RouterLink to={rest.to} className={classes}>
        {children}
      </RouterLink>
    )
  }

  const { href, ...anchorRest } = rest as Extract<LinkProps, { href: string }>
  return (
    <a href={href} className={classes} {...anchorRest}>
      {children}
    </a>
  )
}
