import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  isLoading?: boolean
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-reca-red text-white hover:bg-reca-red-dark focus-visible:ring-reca-red/40 disabled:bg-reca-red/60',
  secondary:
    'bg-reca-white text-reca-black border border-reca-gray-light hover:bg-reca-gray-light focus-visible:ring-reca-black/20',
  ghost:
    'bg-transparent text-reca-gray-medium hover:bg-reca-gray-light focus-visible:ring-reca-black/10',
  /**
   * Action destructive : contour + texte rouges, jamais un rouge plein (réservé à l'action
   * primaire) et jamais confondable avec un lien (désormais bleu, `text-reca-info`).
   * `dark:text-red-400` est l'un des rares `dark:` explicites du repo, pour la même raison que
   * `statusColors.ts` : `reca-red` est constant dans les deux thèmes et manque de contraste sur
   * fond sombre.
   */
  danger:
    'bg-transparent border border-reca-red/40 text-reca-red hover:bg-reca-red/10 focus-visible:ring-reca-red/40 dark:text-red-400',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', isLoading = false, fullWidth = false, disabled, className = '', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-control px-4 text-body font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
})
