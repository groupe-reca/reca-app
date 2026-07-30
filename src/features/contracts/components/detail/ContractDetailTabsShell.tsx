import { useState } from 'react'
import type { ReactNode } from 'react'
import { PageTabs } from '@/components/layout/PageTabs'
import type { PageTab } from '@/components/layout/PageTabs'

export type ContractDetailTabId = 'resume' | 'site' | 'echeancier' | 'clauses' | 'historique'

const TABS: (PageTab & { id: ContractDetailTabId })[] = [
  { id: 'resume', label: 'Résumé' },
  { id: 'site', label: 'Site & zones' },
  { id: 'echeancier', label: 'Échéancier' },
  { id: 'clauses', label: 'Clauses' },
  { id: 'historique', label: 'Historique' },
]

type ContractDetailTabsShellProps = {
  /** `ContractDetailHeader`, rendu dans le bloc collant au-dessus des onglets. */
  header: ReactNode
  /**
   * Classes du bloc collant, propres à la coquille appelante (le tier reste connu de la page,
   * pas d'ici). **Doit porter un décalage `top-*`** en plus des marges négatives : les offsets
   * `sticky` sont calculés depuis la *padding box* du conteneur de scroll, donc un `top-0`
   * fige le bloc sous le padding du `<main>` et le contenu défile dans la bande ainsi laissée
   * au-dessus. Une coquille paddée doit compenser avec un `top` négatif de la même valeur.
   */
  stickyClassName?: string
  children: (activeTab: ContractDetailTabId) => ReactNode
}

/**
 * Fiche contrat en onglets, partagée Desktop/Mobile. La fiche était une page-fleuve de trois
 * écrans de défilement sans repère ; elle est désormais découpée en cinq onglets, sous un
 * en-tête collant qui rappelle en permanence quel contrat est ouvert.
 *
 * Consomme `PageTabs` (composant partagé, contrôlé) mais **pas** `PageLayout` : ce dernier
 * impose `ModuleContainer` + viewport verrouillé avec son propre scroll, incompatible avec
 * ces pages déjà paddées et scrollées par le `<main>` de leur coquille — c'est la raison
 * pour laquelle `RoutesTabs` avait dû réimplémenter sa barre localement.
 *
 * L'onglet actif est un state local, pas un paramètre d'URL : aucun besoin de lien profond
 * n'a été exprimé. `ContractNotesCard`/`ContractHistoryCard` étant auto-suffisantes (requête
 * interne), leurs données ne sont chargées que quand leur onglet est monté.
 */
export function ContractDetailTabsShell({
  header,
  stickyClassName = '',
  children,
}: ContractDetailTabsShellProps) {
  const [activeTab, setActiveTab] = useState<ContractDetailTabId>('resume')

  return (
    <div className="flex flex-col gap-6">
      <div className={`sticky z-10 bg-reca-snow ${stickyClassName}`}>
        {header}
        <PageTabs
          flush
          tabs={TABS}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as ContractDetailTabId)}
        />
      </div>
      {children(activeTab)}
    </div>
  )
}
