import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Lead } from '../../types/lead.types'

export function LeadNextStepCard({ lead }: { lead: Lead }) {
  const navigate = useNavigate()

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-subtitle font-semibold text-reca-black">Prochaine étape</h2>
          <p className="text-body text-reca-gray-medium">Créer une soumission pour ce lead.</p>
        </div>
        <Button variant="secondary" fullWidth onClick={() => navigate(`/quotes/new?leadId=${lead.id}`)} className="sm:w-auto">
          Créer une soumission
        </Button>
      </div>
    </Card>
  )
}
