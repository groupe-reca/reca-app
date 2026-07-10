import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowDown, ArrowUp, Calendar, Pencil, Plus, Trash2, Truck, UserCog, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useClients } from '@/features/clients/hooks/useClients'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
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
import { RouteFormModal } from '../components/RouteFormModal'
import { RouteStatusBadge } from '../components/RouteStatusBadge'
import { ROUTE_STATUSES, ROUTE_STATUS_LABELS } from '../types/route.types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function RouteDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: route, isLoading } = useRoute(id)
  const updateStatus = useUpdateRouteStatus(id)
  const deleteRoute = useDeleteRoute()

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

  if (isLoading || !route) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!route) return
    if (!window.confirm(`Supprimer la route ${route.numero} ?`)) return
    deleteRoute.mutate(route.id, { onSuccess: () => navigate('/routes') })
  }

  const assignedClientIds = new Set((routeClients ?? []).map((item) => item.clientId))
  const availableClients = (clients ?? []).filter((client) => !assignedClientIds.has(client.id))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {route.couleur && (
            <span
              className="mt-1 size-4 shrink-0 rounded-full border border-reca-gray-light"
              style={{ backgroundColor: route.couleur }}
              aria-hidden="true"
            />
          )}
          <div>
            <p className="text-label text-reca-gray-medium">{route.numero}</p>
            <h1 className="text-section font-semibold text-reca-black">{route.nom}</h1>
            <div className="mt-2">
              <RouteStatusBadge status={route.statut} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Dropdown trigger={<Button variant="ghost">Statut</Button>}>
            {ROUTE_STATUSES.map((status) => (
              <DropdownItem key={status} onClick={() => updateStatus.mutate(status)}>
                {ROUTE_STATUS_LABELS[status]}
              </DropdownItem>
            ))}
          </Dropdown>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

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
