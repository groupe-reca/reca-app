import { Card } from '@/components/ui/Card'
import { formatDateLong } from '@/lib/format'
import type { MissionSummary } from '../../types/mission.types'

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(heureDebut: string | null, heureFin: string | null): string {
  if (!heureDebut || !heureFin) return '—'
  const minutes = Math.max(0, Math.round((new Date(heureFin).getTime() - new Date(heureDebut).getTime()) / 60000))
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  if (hours === 0) return `${remainder} min`
  return `${hours} h ${remainder.toString().padStart(2, '0')}`
}

export function MissionInfoCard({ mission }: { mission: MissionSummary }) {
  const rows: [string, string][] = [
    ['Date', formatDateLong(mission.date)],
    ['Heure début', formatTime(mission.heureDebut)],
    ['Heure fin', formatTime(mission.heureFin)],
    ['Durée', formatDuration(mission.heureDebut, mission.heureFin)],
    ['Opérateur', mission.operatorName ?? '—'],
    ['Équipement', mission.equipmentName ?? '—'],
  ]

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-subtitle font-semibold text-reca-black">Informations</h2>
      <div className="flex flex-col gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-body">
            <span className="text-reca-gray-medium">{label}</span>
            <span className="font-medium text-reca-black">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
