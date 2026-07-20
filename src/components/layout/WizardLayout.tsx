import type { ReactNode } from 'react'
import { ModuleContainer } from './ModuleContainer'
import { WizardProgress } from './WizardProgress'
import type { WizardStep } from './WizardProgress'

type WizardLayoutProps = {
  steps: WizardStep[]
  onStepClick?: (id: string) => void
  /**
   * Barre fine optionnelle au-dessus de la barre de progression — réservée aux actions
   * globales du Wizard (Annuler/Enregistrer le brouillon, sprint014) qui doivent rester
   * disponibles à toute étape. Ce n'est PAS une réintroduction du titre/sous-titre de
   * page retiré au sprint008.5 (jugé redondant avec le Breadcrumb) — seulement des
   * actions fonctionnelles, cohérent avec la maquette desktop du Wizard v2.
   */
  headerActions?: ReactNode
  /**
   * Panneau latéral optionnel permanent (desktop, ex. "Récapitulatif du contrat" du
   * Wizard v2, sprint014) — bascule le contenu en grille 2 colonnes à partir de `lg`,
   * une seule colonne en dessous. Absent = comportement inchangé (pleine largeur).
   */
  sidePanel?: ReactNode
  /**
   * Retire le padding/scroll par défaut du conteneur de contenu (ex. étape "Analyse &
   * Zones" du Wizard Contrats, dont la carte doit toucher les bords) — le contenu devient
   * alors responsable de son propre padding/scroll interne. `false` par défaut : aucun
   * changement pour les Wizards/étapes existants.
   */
  fullBleedContent?: boolean
  /**
   * Masque la barre de progression (tâche 7 — même mode plein écran que
   * `fullBleedContent`, mais plus agressif : ne fait pas que retirer le padding,
   * retire aussi la barre elle-même). `false` par défaut.
   */
  hideProgress?: boolean
  footer: ReactNode
  children: ReactNode
}

/**
 * Layout Wizard : la barre de progression est le premier élément visible (pas de titre de
 * page — redondant avec le Breadcrumb, l'utilisateur est déjà dans le Wizard), suivie du
 * contenu (scrollable localement si une étape en a besoin) puis le footer, fixes.
 */
export function WizardLayout({
  steps,
  onStepClick,
  headerActions,
  sidePanel,
  fullBleedContent = false,
  hideProgress = false,
  footer,
  children,
}: WizardLayoutProps) {
  return (
    <ModuleContainer>
      {headerActions && (
        <div className="flex items-center justify-end gap-2 px-4 pt-3 sm:px-6 lg:px-8">{headerActions}</div>
      )}
      {!hideProgress && <WizardProgress steps={steps} onStepClick={onStepClick} />}
      <div className={fullBleedContent ? 'min-h-0 flex-1 overflow-hidden' : 'min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8'}>
        {sidePanel ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            <div className="min-w-0">{children}</div>
            <div className="min-w-0">{sidePanel}</div>
          </div>
        ) : (
          children
        )}
      </div>
      {footer}
    </ModuleContainer>
  )
}
