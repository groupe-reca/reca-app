import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Quote } from '../../types/quote.types'

export function QuoteLeadCard({ quote }: { quote: Quote }) {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Origine</h2>
      {quote.lead ? (
        <>
          <p className="text-body text-reca-black">
            {quote.lead.prenom} {quote.lead.nom}
          </p>
          <p className="text-label text-reca-gray-medium">{quote.lead.numero}</p>
          <Button variant="secondary" fullWidth onClick={() => navigate(`/leads/${quote.lead?.id}`)}>
            Ouvrir la fiche lead
          </Button>
        </>
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun lead associé.</p>
      )}
    </Card>
  )
}
