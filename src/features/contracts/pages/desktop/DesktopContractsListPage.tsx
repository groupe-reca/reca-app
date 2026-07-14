import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ContractTable } from '../../components/ContractTable'
import { useContracts } from '../../hooks/useContracts'

/** Contenu Desktop/Tablette — inchangé, seulement déplacé/renommé depuis `ContractsListPage.tsx` (sprint012). */
export function DesktopContractsListPage() {
  const navigate = useNavigate()
  const { data: contracts, isLoading, isError } = useContracts()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Contrats</h1>
          <p className="text-body text-reca-gray-medium">Contrats saisonniers des clients.</p>
        </div>
        <Button onClick={() => navigate('/contracts/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouveau contrat
        </Button>
      </div>

      <ContractTable contracts={contracts} isLoading={isLoading} isError={isError} />
    </div>
  )
}
