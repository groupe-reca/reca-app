import { useMemo, useState } from 'react'

const DAY_MS = 24 * 60 * 60 * 1000

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Lundi de la semaine contenant `date` (jour local, pas UTC). */
function startOfWeek(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = result.getDay() // 0 = dimanche
  const diffToMonday = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diffToMonday)
  return result
}

/** Navigation semaine (lun-dim) pour la vue Timeline des routes — aucune dépendance de date externe. */
export function useTimelineWeek() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => toIsoDate(new Date(weekStart.getTime() + index * DAY_MS))),
    [weekStart],
  )

  return {
    weekDays,
    weekStartIso: weekDays[0],
    weekEndIso: weekDays[6],
    goPrevWeek: () => setWeekStart((current) => new Date(current.getTime() - 7 * DAY_MS)),
    goNextWeek: () => setWeekStart((current) => new Date(current.getTime() + 7 * DAY_MS)),
    goToday: () => setWeekStart(startOfWeek(new Date())),
  }
}
