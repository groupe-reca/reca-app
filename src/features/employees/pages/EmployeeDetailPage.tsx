import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Mail, Pencil, Phone, Plus, Trash2, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { EquipmentStatusBadge } from '@/features/equipments/components/EquipmentStatusBadge'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { useAssignEquipment } from '../hooks/useAssignEquipment'
import { useDeleteEmployee } from '../hooks/useDeleteEmployee'
import { useEmployee } from '../hooks/useEmployee'
import { useEmployeeAccount } from '../hooks/useEmployeeAccount'
import { useEmployeeEquipment } from '../hooks/useEmployeeEquipment'
import { usePromoteEmployeeAccount } from '../hooks/usePromoteEmployeeAccount'
import { useUnassignEquipment } from '../hooks/useUnassignEquipment'
import { EmployeeFormModal } from '../components/EmployeeFormModal'

export function EmployeeDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: employee, isLoading } = useEmployee(id)
  const deleteEmployee = useDeleteEmployee()
  const { data: assignedEquipment } = useEmployeeEquipment(id)
  const { data: allEquipment } = useEquipments()
  const assignEquipment = useAssignEquipment(id)
  const unassignEquipment = useUnassignEquipment(id)
  const { data: account } = useEmployeeAccount(employee?.userId ?? null)
  const promoteAccount = usePromoteEmployeeAccount(employee?.userId ?? '')
  const [editOpen, setEditOpen] = useState(false)
  const [equipmentToAssign, setEquipmentToAssign] = useState('')

  if (isLoading || !employee) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!employee) return
    if (!window.confirm(`Supprimer l’employé ${employee.prenom} ${employee.nom} ?`)) return
    deleteEmployee.mutate(employee.id, { onSuccess: () => navigate('/employees') })
  }

  const assignedIds = new Set((assignedEquipment ?? []).map((item) => item.equipmentId))
  const availableToAssign = (allEquipment ?? []).filter((item) => !assignedIds.has(item.id))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{employee.poste ?? 'Employé'}</p>
          <h1 className="text-section font-semibold text-reca-black">
            {employee.prenom} {employee.nom}
          </h1>
          <div className="mt-2">
            <Badge color={employee.actif ? 'green' : 'gray'}>{employee.actif ? 'Actif' : 'Inactif'}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Coordonnées</h2>
          <div className="flex flex-col gap-2 text-body">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-reca-gray-medium" aria-hidden="true" />
              {employee.telephone ? (
                <a href={`tel:${employee.telephone}`} className="text-reca-red hover:underline">
                  {employee.telephone}
                </a>
              ) : (
                <span className="text-reca-gray-medium">—</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-reca-gray-medium" aria-hidden="true" />
              {employee.courriel ? (
                <a href={`mailto:${employee.courriel}`} className="text-reca-red hover:underline">
                  {employee.courriel}
                </a>
              ) : (
                <span className="text-reca-gray-medium">—</span>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Poste : {employee.poste ?? '—'}</p>
            <p>Rôle : {employee.role ?? '—'}</p>
            <p>Date d'embauche : {employee.dateEmbauche ?? '—'}</p>
            <p>Notes : {employee.notes ?? '—'}</p>
          </div>
        </Card>
      </div>

      {employee.userId && (
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Compte utilisateur</h2>
          {account ? (
            <div className="flex items-center justify-between">
              <div className="text-body text-reca-gray-medium">
                <p>{account.email}</p>
                <p className="mt-1">
                  Rôle du compte :{' '}
                  <Badge color={account.role === 'administrateur' ? 'red' : 'blue'}>
                    {account.role === 'administrateur' ? 'Administrateur' : 'Employé'}
                  </Badge>
                </p>
              </div>
              <Button
                variant="secondary"
                isLoading={promoteAccount.isPending}
                onClick={() =>
                  promoteAccount.mutate(account.role === 'administrateur' ? 'employe' : 'administrateur')
                }
              >
                {account.role === 'administrateur' ? 'Rétrograder employé' : 'Promouvoir administrateur'}
              </Button>
            </div>
          ) : (
            <p className="text-body text-reca-gray-medium">Chargement du compte...</p>
          )}
        </Card>
      )}

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-subtitle font-semibold text-reca-black">Équipements assignés</h2>
        </div>
        <div className="mb-4 flex items-end gap-3">
          <div className="flex-1">
            <Select
              label="Assigner un équipement"
              icon={Truck}
              value={equipmentToAssign}
              onChange={(event) => setEquipmentToAssign(event.target.value)}
            >
              <option value="">Sélectionner un équipement</option>
              {availableToAssign.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.numero} — {item.nom}
                </option>
              ))}
            </Select>
          </div>
          <Button
            variant="secondary"
            isLoading={assignEquipment.isPending}
            disabled={!equipmentToAssign}
            onClick={() => {
              assignEquipment.mutate(equipmentToAssign, { onSuccess: () => setEquipmentToAssign('') })
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            Assigner
          </Button>
        </div>
        {assignedEquipment && assignedEquipment.length > 0 ? (
          <div className="flex flex-col gap-2">
            {assignedEquipment.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-control border border-reca-gray-light px-4 py-3"
              >
                <div className="text-body text-reca-black">
                  <span className="font-medium">{item.numero}</span>
                  <span className="text-reca-gray-medium"> — {item.nom}</span>
                </div>
                <div className="flex items-center gap-3">
                  <EquipmentStatusBadge status={item.statut} />
                  <Button variant="ghost" onClick={() => unassignEquipment.mutate(item.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body text-reca-gray-medium">Aucun équipement assigné.</p>
        )}
      </Card>

      <EmployeeFormModal open={editOpen} onClose={() => setEditOpen(false)} employee={employee} />
    </div>
  )
}
