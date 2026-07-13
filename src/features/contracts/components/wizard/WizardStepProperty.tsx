import { useEffect, useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import type { Client } from '@/features/clients/types/client.types'
import type { WizardFooterAction } from '@/components/layout/WizardFooter'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import type { ContractCreationFormValues, ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { GeocodeResult } from '../../services/geocoding.service'
import { buildDemoBoundary } from '../../utils/propertyBoundary'
import { PropertySubStepLocate } from './PropertySubStepLocate'
import { PropertySubStepDelineate } from './PropertySubStepDelineate'
import { PropertySubStepValidate } from './PropertySubStepValidate'

type PropertySubStep = 'locate' | 'delineate' | 'validate'

/**
 * Nav rapportée par l'étape "Analyse de la propriété" au Footer unique du Wizard
 * (sprint008.5) — remplace les boutons autrefois rendus dans la zone de carte.
 */
export type PropertyNav = {
  onNext: () => void
  nextDisabled: boolean
  action?: WizardFooterAction | null
}

const SUB_STEP_ORDER: PropertySubStep[] = ['locate', 'delineate', 'validate']
const SUB_STEP_LABELS: Record<PropertySubStep, string> = {
  locate: 'Localiser',
  delineate: 'Délimiter',
  validate: 'Valider',
}
const QUEBEC_CENTER: [number, number] = [-71.2082, 46.8139]

type WizardStepPropertyProps = {
  client: Client
  contractId: string
  control: Control<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
  onCompletionChange: (complete: boolean) => void
  /** Rapporte la nav (Suivant/action) de la sous-étape courante au Footer du Wizard. */
  onNavChange: (nav: PropertyNav) => void
  /** goNext du Wizard — utilisé par la sous-étape Valider pour sortir vers Services. */
  onAdvanceStep: () => void
}

/** Étape 2 — "Analyse de la propriété" : mini-stepper interne à 3 sous-phases fluides. */
export function WizardStepProperty({
  client,
  contractId,
  control,
  setValue,
  onCompletionChange,
  onNavChange,
  onAdvanceStep,
}: WizardStepPropertyProps) {
  const [subStep, setSubStep] = useState<PropertySubStep>('locate')
  const [geocode, setGeocode] = useState<GeocodeResult | null>(null)
  const [capturePath, setCapturePath] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const zones = useWatch({ control, name: 'zones' }) ?? []
  const mapUnavailable = !isMapboxConfigured || Boolean(mapError)

  useEffect(() => {
    onCompletionChange(subStep === 'validate')
  }, [subStep, onCompletionChange])

  useEffect(() => {
    // Validate n'a pas de nav propre (juste "passer à Services") — rapportée directement
    // ici plutôt que par PropertySubStepValidate, qui reste un composant de résumé simple.
    if (subStep !== 'validate') return
    onNavChange({ onNext: onAdvanceStep, nextDisabled: false, action: null })
  }, [subStep, onAdvanceStep, onNavChange])

  function handleGeocoded(result: GeocodeResult | null) {
    setGeocode(result)
    setValue('adresseGeocodee', result?.placeName ?? '')
    setValue('latitude', result?.lat ?? null)
    setValue('longitude', result?.lng ?? null)
  }

  function addZone(zone: ContractZoneFormValues) {
    setValue('zones', [...zones, zone], { shouldValidate: true })
  }

  function updateZone(id: string, patch: Partial<ContractZoneFormValues>) {
    setValue(
      'zones',
      zones.map((zone) => (zone.id === id ? { ...zone, ...patch } : zone)),
      { shouldValidate: true },
    )
  }

  function removeZone(id: string) {
    setValue(
      'zones',
      zones.filter((zone) => zone.id !== id),
      { shouldValidate: true },
    )
  }

  const center: [number, number] = useMemo(
    () => (geocode ? [geocode.lng, geocode.lat] : QUEBEC_CENTER),
    [geocode],
  )
  const currentIndex = SUB_STEP_ORDER.indexOf(subStep)

  // Placeholder de démonstration (pas de données cadastrales) — calculé une seule fois ici
  // et transmis aux deux sous-étapes, pour qu'elles affichent exactement le même contour
  // (tâche 3 : Localiser et Délimiter doivent montrer la même vue).
  const boundary = useMemo(() => buildDemoBoundary(center), [center])

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex shrink-0 items-center gap-2 text-label text-reca-gray-medium">
        {SUB_STEP_ORDER.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span className={index <= currentIndex ? 'font-medium text-reca-red' : ''}>{SUB_STEP_LABELS[step]}</span>
            {index < SUB_STEP_ORDER.length - 1 && <span aria-hidden="true">→</span>}
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1">
        {subStep === 'locate' && (
          <PropertySubStepLocate
            client={client}
            contractId={contractId}
            boundary={boundary}
            capturePath={capturePath}
            mapUnavailable={mapUnavailable}
            onMapError={setMapError}
            onCaptured={setCapturePath}
            onGeocoded={handleGeocoded}
            onContinue={() => setSubStep('delineate')}
            onNavChange={onNavChange}
          />
        )}
        {subStep === 'delineate' && (
          <PropertySubStepDelineate
            center={center}
            boundary={boundary}
            capturePath={capturePath}
            mapUnavailable={mapUnavailable}
            onMapError={setMapError}
            zones={zones}
            onAddZone={addZone}
            onUpdateZone={updateZone}
            onRemoveZone={removeZone}
            onContinue={() => setSubStep('validate')}
            onNavChange={onNavChange}
          />
        )}
        {subStep === 'validate' && <PropertySubStepValidate zones={zones} capturePath={capturePath} />}
      </div>
    </div>
  )
}
