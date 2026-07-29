import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Quote } from '../../types/quote.types'

export function QuoteClientCard({ quote }: { quote: Quote }) {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Client</h2>
      {quote.client ? (
        <>
          <p className="text-body text-reca-black">
            {quote.client.prenom} {quote.client.nom}
          </p>
          <p className="text-label text-reca-gray-medium">{quote.client.numero}</p>
          <Button variant="secondary" fullWidth onClick={() => navigate(`/clients/${quote.client?.id}`)}>
            Ouvrir la fiche client
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-reca-gray-medium">Aucun client associé.</p>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate(`/clients/new?convertQuoteId=${quote.id}`)}
            className="sm:w-auto"
          >
            Transformer en client
          </Button>
        </div>
      )}
    </Card>
  )
}
