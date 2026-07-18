import { useNavigate } from 'react-router'
import { Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSession } from '@/features/auth/hooks/useSession'
import { ContractsListContent } from '../../components/ContractsListContent'
import { useContracts } from '../../hooks/useContracts'

/** Contenu Desktop/Tablette — inchangé, seulement déplacé/renommé depuis `ContractsListPage.tsx` (sprint012). */
export function DesktopContractsListPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const { data: contracts, isLoading, isError } = useContracts()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Contrats</h1>
          <p className="text-body text-reca-gray-medium">Contrats saisonniers des clients.</p>
        </div>
        <div className="flex items-center gap-2">
          {session?.user.role === 'administrateur' && (
            <Button
              variant="ghost"
              aria-label="Paramètres du Wizard Contrats"
              onClick={() => navigate('/contracts/parametres')}
            >
              <Settings className="size-4" aria-hidden="true" />
            </Button>
          )}
          <Button onClick={() => navigate('/contracts/new')}>
            <Plus className="size-4" aria-hidden="true" />
            Nouveau contrat
          </Button>
        </div>
      </div>

      <ContractsListContent contracts={contracts} isLoading={isLoading} isError={isError} />
    </div>
  )
}
