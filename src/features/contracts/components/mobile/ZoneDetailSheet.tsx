import { Camera, Flag, StickyNote, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { ZONE_TYPE_COLORS, ZONE_TYPE_OPTIONS } from '../../constants/wizardOptions'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type ZoneDetailSheetProps = {
  zone: ContractZoneFormValues | null
  onClose: () => void
}

/**
 * Fiche de détail d'une zone sélectionnée (mobile uniquement, sprint012 — aucun
 * équivalent Desktop). Nom + surface sont réels (câblés sur `ContractZoneFormValues`).
 * Services/Notes/Photos/Priorité (demandés par le brief) ne sont PAS dans le modèle de
 * données actuel de `contract_zones` — affichés en placeholder visuel clairement
 * identifié, sans donnée réelle : une extension du modèle de données zone est un sujet
 * à part (structure des services, upload photos, enum priorité), hors scope de ce
 * sprint UX.
 */
export function ZoneDetailSheet({ zone, onClose }: ZoneDetailSheetProps) {
  const typeLabel = zone ? (ZONE_TYPE_OPTIONS.find((option) => option.code === zone.type)?.label ?? zone.type) : ''

  return (
    <BottomSheet open={zone !== null} onClose={onClose} snapPoints={['half', 'full']} title={zone?.label}>
      {zone && (
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: ZONE_TYPE_COLORS[zone.type] }}
              aria-hidden="true"
            />
            <span className="text-body text-reca-black">{typeLabel}</span>
          </div>

          <div className="rounded-control border border-reca-gray-light p-3">
            <p className="text-label text-reca-gray-medium">Surface</p>
            <p className="text-subtitle font-semibold text-reca-black">{zone.surfaceM2.toFixed(2)} m²</p>
          </div>

          <div className="flex flex-col gap-2 border-t border-reca-gray-light pt-4">
            <PlaceholderField icon={Wrench} label="Services" />
            <PlaceholderField icon={StickyNote} label="Notes" />
            <PlaceholderField icon={Camera} label="Photos" />
            <PlaceholderField icon={Flag} label="Priorité" />
          </div>
        </div>
      )}
    </BottomSheet>
  )
}

function PlaceholderField({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-control border border-dashed border-reca-gray-light p-3 text-reca-gray-medium">
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="text-body">{label}</span>
      <span className="ml-auto text-label italic">Bientôt disponible</span>
    </div>
  )
}
