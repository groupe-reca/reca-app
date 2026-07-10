import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import { EquipmentStatusBadge } from './EquipmentStatusBadge'
import type { Equipment } from '../types/equipment.types'

type EquipmentTableProps = {
  equipments: Equipment[] | undefined
  isLoading: boolean
  isError: boolean
}

export function EquipmentTable({ equipments, isLoading, isError }: EquipmentTableProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={equipments}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun équipement pour le moment."
      errorLabel="Impossible de charger les équipements."
    >
      {(data) => (
        <EquipmentTableContent
          equipments={data}
          onRowClick={(equipment) => navigate(`/equipment/${equipment.id}`)}
        />
      )}
    </QueryState>
  )
}

function EquipmentTableContent({
  equipments,
  onRowClick,
}: {
  equipments: Equipment[]
  onRowClick: (equipment: Equipment) => void
}) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: equipments,
    searchableFields: ['numero', 'nom', 'marque', 'modele', 'plaque'],
  })

  const columns: TableColumn<Equipment>[] = [
    { key: 'numero', header: 'Numéro', sortable: true, render: (equipment) => equipment.numero },
    { key: 'nom', header: 'Nom', sortable: true, render: (equipment) => equipment.nom },
    { key: 'categorie', header: 'Catégorie', render: (equipment) => equipment.categorie ?? '—' },
    {
      key: 'marque',
      header: 'Marque / Modèle',
      render: (equipment) => [equipment.marque, equipment.modele].filter(Boolean).join(' ') || '—',
    },
    { key: 'plaque', header: 'Plaque', render: (equipment) => equipment.plaque ?? '—' },
    { key: 'statut', header: 'Statut', render: (equipment) => <EquipmentStatusBadge status={equipment.statut} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, nom, plaque..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(equipment) => equipment.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
