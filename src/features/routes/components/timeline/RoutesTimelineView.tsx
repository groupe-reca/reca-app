import { useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight, TriangleAlert, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QueryState } from '@/components/ui/QueryState'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useRouteAssignmentsRange } from '../../hooks/useRouteAssignmentsRange'
import { useTimelineWeek } from '../../hooks/useTimelineWeek'
import type { RouteAssignmentWithRoute } from '../../services/routeAssignments.service'

const DEFAULT_COULEUR = '#DA291C'

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function formatDayHeader(iso: string, index: number): string {
  const [, month, day] = iso.split('-')
  return `${DAY_LABELS[index]} ${day}/${month}`
}

/**
 * Vue Timeline de `RoutesListPage` — planning multi-routes : lignes = employés
 * actifs, colonnes = les 7 jours de la semaine courante, cellules = assignations
 * (`route_assignments`) colorées par `route.couleur`. Grille CSS locale — aucune
 * librairie de calendrier ni équivalent existant dans le repo.
 */
export function RoutesTimelineView() {
  const { weekDays, weekStartIso, weekEndIso, goPrevWeek, goNextWeek, goToday } = useTimelineWeek()
  const { data: employees, isLoading: employeesLoading, isError: employeesError } = useEmployees()
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useRouteAssignmentsRange(weekStartIso, weekEndIso)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={goPrevWeek} aria-label="Semaine précédente">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="secondary" onClick={goToday}>
            Aujourd'hui
          </Button>
          <Button variant="ghost" onClick={goNextWeek} aria-label="Semaine suivante">
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <p className="text-label text-reca-gray-medium">
          {formatDayHeader(weekStartIso, 0)} — {formatDayHeader(weekEndIso, 6)}
        </p>
      </div>

      <QueryState
        isLoading={employeesLoading || assignmentsLoading}
        isError={employeesError || assignmentsError}
        data={employees && assignments ? { employees, assignments } : undefined}
        isEmpty={({ employees }) => employees.filter((employee) => employee.actif).length === 0}
        emptyLabel="Aucun employé actif à afficher."
        errorLabel="Impossible de charger le planning."
      >
        {({ employees, assignments }) => (
          <TimelineGrid employees={employees.filter((employee) => employee.actif)} weekDays={weekDays} assignments={assignments} />
        )}
      </QueryState>
    </div>
  )
}

type TimelineEmployee = { id: string; prenom: string; nom: string }

function TimelineGrid({
  employees,
  weekDays,
  assignments,
}: {
  employees: TimelineEmployee[]
  weekDays: string[]
  assignments: RouteAssignmentWithRoute[]
}) {
  const navigate = useNavigate()

  const byEmployeeAndDate = new Map<string, RouteAssignmentWithRoute[]>()
  for (const assignment of assignments) {
    if (!assignment.employee) continue
    const key = `${assignment.employee.id}__${assignment.date}`
    const bucket = byEmployeeAndDate.get(key) ?? []
    bucket.push(assignment)
    byEmployeeAndDate.set(key, bucket)
  }

  return (
    <div className="overflow-x-auto rounded-card border border-reca-gray-light bg-reca-white">
      <div className="grid min-w-[900px] grid-cols-[180px_repeat(7,1fr)]">
        <div className="border-b border-r border-reca-gray-light bg-reca-snow p-3 text-label font-medium text-reca-gray-medium">
          Employé
        </div>
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="border-b border-r border-reca-gray-light bg-reca-snow p-3 text-label font-medium text-reca-gray-medium last:border-r-0"
          >
            {formatDayHeader(day, index)}
          </div>
        ))}

        {employees.map((employee) => (
          <div key={employee.id} className="contents">
            <div className="flex items-center border-b border-r border-reca-gray-light p-3 text-body text-reca-black">
              {employee.prenom} {employee.nom}
            </div>
            {weekDays.map((day) => {
              const cellAssignments = byEmployeeAndDate.get(`${employee.id}__${day}`) ?? []
              const hasConflict = cellAssignments.length > 1
              return (
                <div
                  key={day}
                  className={`flex flex-col gap-1 border-b border-r border-reca-gray-light p-2 last:border-r-0 ${
                    hasConflict ? 'bg-amber-50' : ''
                  }`}
                >
                  {hasConflict && (
                    <span className="inline-flex items-center gap-1 text-label font-medium text-amber-700">
                      <TriangleAlert className="size-3.5" aria-hidden="true" />
                      Conflit
                    </span>
                  )}
                  {cellAssignments.map((assignment) => (
                    <button
                      key={assignment.id}
                      type="button"
                      onClick={() => assignment.route && navigate(`/routes/${assignment.route.id}`)}
                      className="flex items-center gap-1.5 rounded-control px-2 py-1 text-left text-label font-medium text-white"
                      style={{ backgroundColor: assignment.route?.couleur ?? DEFAULT_COULEUR }}
                    >
                      <span className="truncate">{assignment.route?.nom ?? '—'}</span>
                      {assignment.equipment && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 opacity-90">
                          <Truck className="size-3" aria-hidden="true" />
                          {assignment.equipment.numero}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
