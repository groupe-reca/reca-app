import { useNavigate } from 'react-router'
import { Plus, Settings } from 'lucide-react'
import { useSession } from '@/features/auth/hooks/useSession'
import { MobileContractLayout } from '../../components/mobile/MobileContractLayout'
import { ContractTable } from '../../components/ContractTable'
import { useContracts } from '../../hooks/useContracts'

export function MobileContractsListPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const { data: contracts, isLoading, isError } = useContracts()

  return (
    <MobileContractLayout
      headerActions={
        <div className="flex items-center">
          {session?.user.role === 'administrateur' && (
            <button
              type="button"
              onClick={() => navigate('/contracts/parametres')}
              aria-label="Paramètres du Wizard Contrats"
              className="flex size-12 items-center justify-center rounded-control text-reca-black hover:bg-reca-snow"
            >
              <Settings className="size-5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/contracts/new')}
            aria-label="Nouveau contrat"
            className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
          >
            <Plus className="size-5" aria-hidden="true" />
          </button>
        </div>
      }
    >
      <ContractTable contracts={contracts} isLoading={isLoading} isError={isError} />
    </MobileContractLayout>
  )
}
