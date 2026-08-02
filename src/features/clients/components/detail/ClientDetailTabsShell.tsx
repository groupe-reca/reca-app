import { useState } from 'react'
import type { ReactNode } from 'react'
import { PageTabs } from '@/components/layout/PageTabs'
import type { PageTab } from '@/components/layout/PageTabs'

export type ClientDetailTabId = 'informations' | 'contrats' | 'factures' | 'documents' | 'historique'

const TABS: (PageTab & { id: ClientDetailTabId })[] = [
  { id: 'informations', label: 'Informations' },
  { id: 'contrats', label: 'Contrats' },
  { id: 'factures', label: 'Factures & paiements' },
  { id: 'documents', label: 'Documents' },
  { id: 'historique', label: 'Historique' },
]

type ClientDetailTabsShellProps = {
  /** `ClientDetailHeader`, rendu dans le bloc collant au-dessus des onglets. */
  header: ReactNode
  /**
   * Classes du bloc collant, propres à la coquille appelante. **Doit porter un décalage `top-*`**
   * en plus des marges négatives : les offsets `sticky` sont calculés depuis la *padding box* du
   * conteneur de scroll (voir même piège documenté sur `ContractDetailTabsShell`).
   */
  stickyClassName?: string
  children: (activeTab: ClientDetailTabId) => ReactNode
}

/**
 * Fiche client en onglets (livrable 06), partagée Desktop/Mobile. Remplace l'empilement
 * vertical Coordonnées → Détails → Contrats → Notes → Factures, où les Notes coupaient en
 * deux les sections financières et où plus rien n'indiquait quel client était affiché au
 * défilement. Même `PageTabs` que la fiche contrat — pas `PageLayout` (viewport verrouillé,
 * incompatible avec ces pages scrollées par le `<main>` de leur coquille).
 */
export function ClientDetailTabsShell({ header, stickyClassName = '', children }: ClientDetailTabsShellProps) {
  const [activeTab, setActiveTab] = useState<ClientDetailTabId>('informations')

  return (
    <div className="flex flex-col gap-6">
      <div className={`sticky z-10 bg-reca-snow ${stickyClassName}`}>
        {header}
        <PageTabs
          flush
          tabs={TABS}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as ClientDetailTabId)}
        />
      </div>
      {children(activeTab)}
    </div>
  )
}
