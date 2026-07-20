import type { StatusColor } from '@/components/ui/statusColors'

const PALETTE: StatusColor[] = ['blue', 'purple', 'green', 'orange', 'yellow', 'red']

/** Couleur déterministe (toujours la même pour un même id) — utilisé pour les avatars d'auteur des timelines de notes. */
export function getAvatarColor(id: string): StatusColor {
  let hash = 0
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) | 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
