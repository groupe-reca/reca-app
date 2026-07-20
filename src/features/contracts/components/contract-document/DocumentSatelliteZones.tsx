import { MapPin } from 'lucide-react'
import { PolygonCard } from '../wizard/PolygonCard'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import type { ContractDocumentData } from './types'

type DocumentSatelliteZonesProps = Pick<ContractDocumentData, 'zones' | 'imageUrl'>

/**
 * Remplace la section "Clauses générales" (tâche 8, `DocumentClausesList.tsx` supprimé) :
 * photo satellite capturée avec les zones déjà tracées visibles dessus — la recapture est
 * automatique en quittant Délimiter (voir `useDelineateState.handleContinueWithCapture`),
 * jamais la capture de Localiser (prise avant le tracé, ne montre jamais les zones). `imageUrl`
 * (URL signée, calculée par `ContractCreatedPage.tsx`) reste un simple prop — composant pur,
 * aucun hook/route à l'intérieur, réutilisable tel quel par un futur moteur PDF.
 */
export function DocumentSatelliteZones({ zones, imageUrl }: DocumentSatelliteZonesProps) {
  return (
    <div className="rounded-card bg-white p-5 shadow-card">
      <DocumentSectionHeader title="Vue satellite et zones tracées" />
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Vue satellite de la propriété avec les zones tracées"
          className="mb-4 w-full rounded-control"
        />
      ) : (
        <div className="mb-4 flex flex-col items-center gap-1 rounded-control border border-dashed border-reca-gray-light px-4 py-8 text-center">
          <MapPin className="size-5 text-reca-gray-medium" aria-hidden="true" />
          <p className="text-label text-reca-gray-medium">Aucune image satellite disponible.</p>
        </div>
      )}
      {zones.length > 0 && (
        <div className="flex flex-col gap-2">
          {zones.map((zone) => (
            <PolygonCard key={zone.id} zone={zone} />
          ))}
        </div>
      )}
    </div>
  )
}
