import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowDown, ArrowUp, Calendar, Plus, Trash2, Truck, UserCog, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useClients } from '@/features/clients/hooks/useClients'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { toast } from '@/stores/toastStore'
import { ASSIGNMENT_STATUS_LABELS } from '../services/routeAssignments.service'
import type { AssignmentStatus } from '../services/routeAssignments.service'
import { useAddRouteClient } from '../hooks/useAddRouteClient'
import { useCreateRouteAssignment } from '../hooks/useCreateRouteAssignment'
import { useDeleteRoute } from '../hooks/useDeleteRoute'
import { useDeleteRouteAssignment } from '../hooks/useDeleteRouteAssignment'
import { useRemoveRouteClient } from '../hooks/useRemoveRouteClient'
import { useReorderRouteClient } from '../hooks/useReorderRouteClient'
import { useRoute } from '../hooks/useRoute'
import { useRouteAssignments } from '../hooks/useRouteAssignments'
import { useRouteClients } from '../hooks/useRouteClients'
import { useUpdateAssignmentStatus } from '../hooks/useUpdateAssignmentStatus'
import { useUpdateRouteStatus } from '../hooks/useUpdateRouteStatus'
import { RouteDetailHeader } from '../components/detail/RouteDetailHeader'
import { RouteFormModal } from '../components/RouteFormModal'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function RouteDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: route, isLoading } = useRoute(id)
  const updateStatus = useUpdateRouteStatus(id)
  const deleteRoute = useDeleteRoute()
  const { data: settings } = useSettings()

  const { data: routeClients } = useRouteClients(id)
  const { data: clients } = useClients()
  const addRouteClient = useAddRouteClient(id)
  const removeRouteClient = useRemoveRouteClient(id)
  const reorderRouteClient = useReorderRouteClient(id)

  const { data: assignments } = useRouteAssignments(id)
  const { data: employees } = useEmployees()
  const { data: equipments } = useEquipments()
  const createAssignment = useCreateRouteAssignment(id)
  const updateAssignmentStatus = useUpdateAssignmentStatus(id)
  const deleteAssignment = useDeleteRouteAssignment(id)

  const [editOpen, setEditOpen] = useState(false)
  const [clientToAdd, setClientToAdd] = useState('')
  const [assignEmployee, setAssignEmployee] = useState('')
  const [assignEquipment, setAssignEquipment] = useState('')
  const [assignDate, setAssignDate] = useState(today())
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  if (isLoading || !route) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!route) return
    if (!window.confirm(`Supprimer la route ${route.numero} ?`)) return
    deleteRoute.mutate(route.id, { onSuccess: () => navigate('/routes') })
  }

  async function handleDownloadPdf() {
    if (!route || !settings) return
    setIsDownloadingPdf(true)
    try {
      const { generateRoutePdf } = await import('../pdf/generateRoutePdf')
      await generateRoutePdf({
        route,
        routeClients: routeClients ?? [],
        assignments: assignments ?? [],
        settings,
      })
    } catch {
      toast.error('Impossible de générer le PDF de la route.')
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const assignedClientIds = new Set((routeClients ?? []).map((item) => item.clientId))
  const availableClients = (clients ?? []).filter((client) => !assignedClientIds.has(client.id))

  return (
    <div className="flex flex-col gap-6">
      <RouteDetailHeader
        route={route}
        onEdit={() => setEditOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        onChangeStatus={(status) => updateStatus.mutate(status)}
        onDelete={handleDelete}
        isChangingStatus={updateStatus.isPending}
        isDownloadingPdf={isDownloadingPdf}
      />

      <Card>
        <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
        <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
          <p>Secteur : {route.secteur ?? '—'}</p>
          <p>Durée estimée : {route.dureeEstimee ?? '—'}</p>
          <p>Distance : {route.distance != null ? `${route.distance} km` : '—'}</p>
          <p>Description : {route.description ?? '—'}</p>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-subtitle font-semibold text-reca-black">Clients ({routeClients?.length ?? 0})</h2>
        </div>
        <div className="mb-4 flex items-end gap-3">
          <div className="flex-1">
            <Select
              label="Ajouter un client"
              icon={Users}
              value={clientToAdd}
              onChange={(event) => setClientToAdd(event.target.value)}
            >
              <option value="">Sélectionner un client</option>
              {availableClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.prenom} {client.nom} ({client.numero})
                </option>
              ))}
            </Select>
          </div>
          <Button
            variant="secondary"
            isLoading={addRouteClient.isPending}
            disabled={!clientToAdd}
            onClick={() => addRouteClient.mutate(clientToAdd, { onSuccess: () => setClientToAdd('') })}
          >
            <Plus className="size-4" aria-hidden="true" />
            Ajouter
          </Button>
        </div>
        {routeClients && routeClients.length > 0 ? (
          <div className="flex flex-col gap-2">
            {routeClients.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-control border border-reca-gray-light px-4 py-3"
              >
                <div className="text-body text-reca-black">
                  <span className="font-medium text-reca-gray-medium">{index + 1}.</span>{' '}
                  <span className="font-medium">
                    {item.prenom} {item.nom}
                  </span>
                  <span className="text-reca-gray-medium"> — {item.adresse ?? item.numero}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => {
                      const previous = routeClients[index - 1]
                      reorderRouteClient.mutate({
                        firstId: item.id,
                        firstOrdre: item.ordre,
                        secondId: previous.id,
                        secondOrdre: previous.ordre,
                      })
                    }}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={index === routeClients.length - 1}
                    onClick={() => {
                      const next = routeClients[index + 1]
                      reorderRouteClient.mutate({
                        firstId: item.id,
                        firstOrdre: item.ordre,
                        secondId: next.id,
                        secondOrdre: next.ordre,
                      })
                    }}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" onClick={() => removeRouteClient.mutate(item.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body text-reca-gray-medium">Aucun client sur cette route.</p>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Assignations</h2>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
          <Select
            label="Employé"
            icon={UserCog}
            value={assignEmployee}
            onChange={(event) => setAssignEmployee(event.target.value)}
          >
            <option value="">Sélectionner...</option>
            {employees?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.prenom} {employee.nom}
              </option>
            ))}
          </Select>
          <Select
            label="Équipement (optionnel)"
            icon={Truck}
            value={assignEquipment}
            onChange={(event) => setAssignEquipment(event.target.value)}
          >
            <option value="">Aucun</option>
            {equipments?.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.numero} — {equipment.nom}
              </option>
            ))}
          </Select>
          <Input
            label="Date"
            type="date"
            icon={Calendar}
            value={assignDate}
            onChange={(event) => setAssignDate(event.target.value)}
          />
          <Button
            variant="secondary"
            isLoading={createAssignment.isPending}
            disabled={!assignEmployee || !assignDate}
            onClick={() =>
              createAssignment.mutate(
                { employeeId: assignEmployee, date: assignDate, equipmentId: assignEquipment || undefined },
                {
                  onSuccess: () => {
                    setAssignEmployee('')
                    setAssignEquipment('')
                  },
                },
              )
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Assigner
          </Button>
        </div>
        {assignments && assignments.length > 0 ? (
          <div className="flex flex-col gap-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded-control border border-reca-gray-light px-4 py-3"
              >
                <div className="text-body text-reca-black">
                  <span className="font-medium">
                    {assignment.employee ? `${assignment.employee.prenom} ${assignment.employee.nom}` : '—'}
                  </span>
                  {assignment.equipment && (
                    <span className="text-reca-gray-medium"> · {assignment.equipment.numero}</span>
                  )}
                  <span className="text-reca-gray-medium"> · {assignment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dropdown trigger={<Badge color="blue">{ASSIGNMENT_STATUS_LABELS[assignment.statut]}</Badge>}>
                    {(Object.keys(ASSIGNMENT_STATUS_LABELS) as AssignmentStatus[]).map((status) => (
                      <DropdownItem
                        key={status}
                        onClick={() => updateAssignmentStatus.mutate({ id: assignment.id, statut: status })}
                      >
                        {ASSIGNMENT_STATUS_LABELS[status]}
                      </DropdownItem>
                    ))}
                  </Dropdown>
                  <Button variant="ghost" onClick={() => deleteAssignment.mutate(assignment.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body text-reca-gray-medium">Aucune assignation pour cette route.</p>
        )}
      </Card>

      <RouteFormModal open={editOpen} onClose={() => setEditOpen(false)} route={route} />
    </div>
  )
}
