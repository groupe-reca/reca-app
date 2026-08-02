import { Card } from '@/components/ui/Card'
import type { LucideIcon } from 'lucide-react'

/** Onglet du livrable 06 dont la donnée n'existe pas encore (Documents/Historique) — état « à venir » explicite, pas un vide muet. */
export function ClientPlaceholderTab({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <Card className="flex flex-col items-center gap-2 py-12 text-center">
      <Icon className="size-8 text-reca-gray-medium" aria-hidden="true" />
      <p className="text-body font-medium text-reca-black">{title}</p>
      <p className="text-label text-reca-gray-medium">Bientôt disponible.</p>
    </Card>
  )
}
