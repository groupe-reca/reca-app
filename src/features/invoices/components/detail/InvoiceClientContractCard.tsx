import { FileText, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ListRow } from '@/components/ui/ListRow'
import type { InvoiceClientRef, InvoiceContractRef } from '../../types/invoice.types'

type InvoiceClientContractCardProps = {
  client: InvoiceClientRef | null
  contract: InvoiceContractRef | null
}

export function InvoiceClientContractCard({ client, contract }: InvoiceClientContractCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-subtitle font-semibold text-reca-black">Client &amp; contrat</h2>
      {client ? (
        <ListRow
          icon={User}
          title={`${client.prenom} ${client.nom}`}
          subtitle={client.numero}
          href={`/clients/${client.id}`}
          chevron
        />
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun client associé.</p>
      )}
      {contract ? (
        <ListRow icon={FileText} title={contract.numero} subtitle="Voir le contrat" href={`/contracts/${contract.id}`} chevron />
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun contrat associé.</p>
      )}
    </Card>
  )
}
