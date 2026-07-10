import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import type { Client } from '../types/client.types'

type ClientTableProps = {
  clients: Client[] | undefined
  isLoading: boolean
  isError: boolean
}

export function ClientTable({ clients, isLoading, isError }: ClientTableProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={clients}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun client pour le moment."
      errorLabel="Impossible de charger les clients."
    >
      {(data) => (
        <ClientTableContent clients={data} onRowClick={(client) => navigate(`/clients/${client.id}`)} />
      )}
    </QueryState>
  )
}

function ClientTableContent({
  clients,
  onRowClick,
}: {
  clients: Client[]
  onRowClick: (client: Client) => void
}) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: clients,
    searchableFields: ['prenom', 'nom', 'entreprise', 'courriel', 'telephone', 'numero'],
  })

  const columns: TableColumn<Client>[] = [
    { key: 'numero', header: 'Numéro', sortable: true, render: (client) => client.numero },
    { key: 'nom', header: 'Nom', sortable: true, render: (client) => `${client.prenom} ${client.nom}` },
    { key: 'entreprise', header: 'Entreprise', render: (client) => client.entreprise ?? '—' },
    { key: 'telephone', header: 'Téléphone', render: (client) => client.telephone ?? '—' },
    { key: 'ville', header: 'Ville', render: (client) => client.ville ?? '—' },
    { key: 'typeClient', header: 'Type', render: (client) => client.typeClient ?? '—' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Nom, entreprise, courriel, téléphone..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(client) => client.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
