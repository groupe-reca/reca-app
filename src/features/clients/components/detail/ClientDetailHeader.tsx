import { Archive, Mail, MapPin, MoreVertical, Pencil, Phone, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { formatAddress } from '@/lib/format'
import type { Client } from '../../types/client.types'

const STATUS_CONFIG = {
  actif: { label: 'Actif', color: 'green' },
  inactif: { label: 'Inactif', color: 'gray' },
} as const

type ClientDetailHeaderProps = {
  client: Client
  onEdit: () => void
  onArchive: () => void
  onCreateContract: () => void
  onCreateInvoice: () => void
  isArchiving?: boolean
}

function mapsUrl(client: Client): string | null {
  const query =
    client.latitude != null && client.longitude != null
      ? `${client.latitude},${client.longitude}`
      : formatAddress(client.adresse, client.ville, client.codePostal)
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function QuickAction({ href, label, icon: Icon, external }: { href: string; label: string; icon: LucideIcon; external?: boolean }) {
  return (
    <Tooltip label={label}>
      <a
        href={href}
        aria-label={label}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className="flex size-10 items-center justify-center rounded-control border border-reca-gray-light text-reca-black hover:bg-reca-snow"
      >
        <Icon className="size-4" aria-hidden="true" />
      </a>
    </Tooltip>
  )
}

/**
 * En-tête de la fiche client : identité `CLI · nom · [Statut]` (le statut remonte ici depuis la
 * carte Détails), actions rapides du livrable 06 (Téléphoner / Courriel / Google Maps), et une
 * hiérarchie d'actions corrigée — l'action **primaire (rouge)** est « Créer un contrat », plus
 * « Supprimer » en vedette. Archiver (soft-delete `deleted_at`, pas une suppression physique) est
 * rangé dans le menu `⋮`.
 */
export function ClientDetailHeader({
  client,
  onEdit,
  onArchive,
  onCreateContract,
  onCreateInvoice,
  isArchiving = false,
}: ClientDetailHeaderProps) {
  const status = client.statut ? STATUS_CONFIG[client.statut] : null
  const maps = mapsUrl(client)

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-label text-reca-gray-medium">{client.numero}</span>
        <h1 className="text-section font-semibold text-reca-black">
          {client.prenom} {client.nom}
        </h1>
        {status && <Badge color={status.color}>{status.label}</Badge>}
        {client.entreprise && <span className="text-body text-reca-gray-medium">· {client.entreprise}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          {client.telephone && <QuickAction href={`tel:${client.telephone}`} label="Téléphoner" icon={Phone} />}
          {client.courriel && <QuickAction href={`mailto:${client.courriel}`} label="Envoyer un courriel" icon={Mail} />}
          {maps && <QuickAction href={maps} label="Voir sur Google Maps" icon={MapPin} external />}
        </div>

        <Button variant="secondary" onClick={onEdit}>
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        <Button onClick={onCreateContract}>
          <Plus className="size-4" aria-hidden="true" />
          Créer un contrat
        </Button>
        <Dropdown
          trigger={
            <Button variant="ghost" aria-label="Plus d'actions" disabled={isArchiving}>
              <MoreVertical className="size-4" aria-hidden="true" />
            </Button>
          }
        >
          <DropdownItem onClick={onCreateInvoice}>Créer une facture</DropdownItem>
          <DropdownItem variant="danger" onClick={onArchive}>
            <span className="flex items-center gap-2">
              <Archive className="size-4" aria-hidden="true" />
              Archiver le client
            </span>
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  )
}
