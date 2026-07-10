import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LeadFormModal } from '../components/LeadFormModal'
import { LeadTable } from '../components/LeadTable'
import { useLeads } from '../hooks/useLeads'

export function LeadsListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: leads, isLoading, isError } = useLeads()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Leads</h1>
          <p className="text-body text-reca-gray-medium">Demandes provenant du site web.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Nouveau lead
        </Button>
      </div>

      <LeadTable leads={leads} isLoading={isLoading} isError={isError} />

      <LeadFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
