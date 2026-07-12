import { useNavigate, useSearchParams } from 'react-router'
import { Card } from '@/components/ui/Card'
import { useConvertQuoteToClient } from '@/features/quotes/hooks/useConvertQuoteToClient'
import { useQuote } from '@/features/quotes/hooks/useQuote'
import { ClientForm } from '../components/ClientForm'
import { useCreateClient } from '../hooks/useCreateClient'

export function ClientCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const convertQuoteId = searchParams.get('convertQuoteId') ?? ''
  const { data: quote } = useQuote(convertQuoteId)

  const createClient = useCreateClient()
  const convertToClient = useConvertQuoteToClient(convertQuoteId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouveau client</h1>
        <p className="text-body text-reca-gray-medium">
          {convertQuoteId ? 'Créez le client à lier à cette soumission.' : 'Ajoutez une fiche client.'}
        </p>
      </div>

      <Card>
        <ClientForm
          initialValues={quote?.lead ? { prenom: quote.lead.prenom, nom: quote.lead.nom } : undefined}
          isSubmitting={createClient.isPending}
          onSubmit={(values) =>
            createClient.mutate(values, {
              onSuccess: (created) => {
                if (convertQuoteId) {
                  convertToClient.mutate(created.id)
                  navigate(`/quotes/${convertQuoteId}`)
                } else {
                  navigate(`/clients/${created.id}`)
                }
              },
            })
          }
          onCancel={() => navigate(convertQuoteId ? `/quotes/${convertQuoteId}` : '/clients')}
        />
      </Card>
    </div>
  )
}
