import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { ClientFormModal } from '@/features/clients/components/ClientFormModal'
import { formatCurrency } from '@/lib/format'
import { useConvertQuoteToClient } from '../hooks/useConvertQuoteToClient'
import { useDeleteQuote } from '../hooks/useDeleteQuote'
import { useQuote } from '../hooks/useQuote'
import { useUpdateQuoteStatus } from '../hooks/useUpdateQuoteStatus'
import { QuoteFormModal } from '../components/QuoteFormModal'
import { QuoteStatusBadge } from '../components/QuoteStatusBadge'
import { QUOTE_STATUSES, QUOTE_STATUS_LABELS } from '../types/quote.types'

export function QuoteDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: quote, isLoading } = useQuote(id)
  const updateStatus = useUpdateQuoteStatus(id)
  const deleteQuote = useDeleteQuote()
  const convertToClient = useConvertQuoteToClient(id)
  const [editOpen, setEditOpen] = useState(false)
  const [clientModalOpen, setClientModalOpen] = useState(false)

  if (isLoading || !quote) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!quote) return
    if (!window.confirm(`Supprimer la soumission ${quote.numero} ?`)) return
    deleteQuote.mutate(quote.id, { onSuccess: () => navigate('/quotes') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{quote.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">{formatCurrency(quote.total)}</h1>
          <div className="mt-2">
            <QuoteStatusBadge status={quote.statut} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Dropdown trigger={<Button variant="ghost">Statut</Button>}>
            {QUOTE_STATUSES.map((status) => (
              <DropdownItem key={status} onClick={() => updateStatus.mutate(status)}>
                {QUOTE_STATUS_LABELS[status]}
              </DropdownItem>
            ))}
          </Dropdown>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Montant : {formatCurrency(quote.montant)}</p>
            <p>Taxes : {formatCurrency(quote.taxes)}</p>
            <p>Total : {formatCurrency(quote.total)}</p>
            <p>Expiration : {quote.expiration ?? '—'}</p>
            <p>Notes : {quote.notes ?? '—'}</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Origine</h2>
          {quote.lead ? (
            <p className="text-body text-reca-gray-medium">
              Lead :{' '}
              <Link to={`/leads/${quote.lead.id}`} className="text-reca-red hover:underline">
                {quote.lead.prenom} {quote.lead.nom} ({quote.lead.numero})
              </Link>
            </p>
          ) : (
            <p className="text-body text-reca-gray-medium">Aucun lead associé.</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Client</h2>
          {quote.client ? (
            <p className="text-body text-reca-gray-medium">
              <Link to={`/clients/${quote.client.id}`} className="text-reca-red hover:underline">
                {quote.client.prenom} {quote.client.nom} ({quote.client.numero})
              </Link>
            </p>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-body text-reca-gray-medium">Aucun client associé.</p>
              <Button variant="secondary" onClick={() => setClientModalOpen(true)}>
                Transformer en client
              </Button>
            </div>
          )}
        </Card>
      </div>

      <QuoteFormModal open={editOpen} onClose={() => setEditOpen(false)} quote={quote} />

      <ClientFormModal
        open={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        initialValues={quote.lead ? { prenom: quote.lead.prenom, nom: quote.lead.nom } : undefined}
        onCreated={(client) => convertToClient.mutate(client.id)}
      />
    </div>
  )
}
