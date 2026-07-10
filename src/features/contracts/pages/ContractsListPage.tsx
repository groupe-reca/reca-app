import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ContractFormModal } from '../components/ContractFormModal'
import { ContractTable } from '../components/ContractTable'
import { useContracts } from '../hooks/useContracts'

export function ContractsListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: contracts, isLoading, isError } = useContracts()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Contrats</h1>
          <p className="text-body text-reca-gray-medium">Contrats saisonniers des clients.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Nouveau contrat
        </Button>
      </div>

      <ContractTable contracts={contracts} isLoading={isLoading} isError={isError} />

      <ContractFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
