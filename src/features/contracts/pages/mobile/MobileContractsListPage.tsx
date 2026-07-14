import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileContractLayout } from '../../components/mobile/MobileContractLayout'
import { ContractTable } from '../../components/ContractTable'
import { useContracts } from '../../hooks/useContracts'

export function MobileContractsListPage() {
  const navigate = useNavigate()
  const { data: contracts, isLoading, isError } = useContracts()

  return (
    <MobileContractLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/contracts/new')}
          aria-label="Nouveau contrat"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <ContractTable contracts={contracts} isLoading={isLoading} isError={isError} />
    </MobileContractLayout>
  )
}
