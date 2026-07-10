import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useDeleteEquipment } from '../hooks/useDeleteEquipment'
import { useEquipment } from '../hooks/useEquipment'
import { useUpdateEquipmentStatus } from '../hooks/useUpdateEquipmentStatus'
import { EquipmentFormModal } from '../components/EquipmentFormModal'
import { EquipmentStatusBadge } from '../components/EquipmentStatusBadge'
import { EQUIPMENT_STATUSES, EQUIPMENT_STATUS_LABELS } from '../types/equipment.types'

export function EquipmentDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: equipment, isLoading } = useEquipment(id)
  const updateStatus = useUpdateEquipmentStatus(id)
  const deleteEquipment = useDeleteEquipment()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading || !equipment) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!equipment) return
    if (!window.confirm(`Supprimer l’équipement ${equipment.numero} ?`)) return
    deleteEquipment.mutate(equipment.id, { onSuccess: () => navigate('/equipment') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{equipment.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">{equipment.nom}</h1>
          <div className="mt-2">
            <EquipmentStatusBadge status={equipment.statut} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Dropdown trigger={<Button variant="ghost">Statut</Button>}>
            {EQUIPMENT_STATUSES.map((status) => (
              <DropdownItem key={status} onClick={() => updateStatus.mutate(status)}>
                {EQUIPMENT_STATUS_LABELS[status]}
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
            <p>Catégorie : {equipment.categorie ?? '—'}</p>
            <p>Marque / Modèle : {[equipment.marque, equipment.modele].filter(Boolean).join(' ') || '—'}</p>
            <p>Année : {equipment.annee ?? '—'}</p>
            <p>Plaque : {equipment.plaque ?? '—'}</p>
            <p>Numéro de série : {equipment.numeroSerie ?? '—'}</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Entretien</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>{equipment.entretien ?? 'Aucune information d’entretien.'}</p>
            <p>Notes : {equipment.notes ?? '—'}</p>
          </div>
        </Card>
      </div>

      <EquipmentFormModal open={editOpen} onClose={() => setEditOpen(false)} equipment={equipment} />
    </div>
  )
}
