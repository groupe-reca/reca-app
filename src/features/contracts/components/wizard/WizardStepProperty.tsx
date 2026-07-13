import { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import type { Client } from '@/features/clients/types/client.types'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import type { ContractCreationFormValues, ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { GeocodeResult } from '../../services/geocoding.service'
import { PropertySubStepLocate } from './PropertySubStepLocate'
import { PropertySubStepDelineate } from './PropertySubStepDelineate'
import { PropertySubStepValidate } from './PropertySubStepValidate'

type PropertySubStep = 'locate' | 'delineate' | 'validate'

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
}

/** Étape 2 — "Analyse de la propriété" : mini-stepper interne à 3 sous-phases fluides. */
export function WizardStepProperty({
  client,
  contractId,
  control,
  setValue,
  onCompletionChange,
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

  function handleGeocoded(result: GeocodeResult | null) {
    setGeocode(result)
    setValue('adresseGeocodee', result?.placeName ?? '')
    setValue('latitude', result?.lat ?? null)
    setValue('longitude', result?.lng ?? null)
  }

  function addZone(zone: ContractZoneFormValues) {
    setValue('zones', [...zones, zone], { shouldValidate: true })
  }

  function removeZone(id: string) {
    setValue(
      'zones',
      zones.filter((zone) => zone.id !== id),
      { shouldValidate: true },
    )
  }

  const center: [number, number] = geocode ? [geocode.lng, geocode.lat] : QUEBEC_CENTER
  const currentIndex = SUB_STEP_ORDER.indexOf(subStep)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-label text-reca-gray-medium">
        {SUB_STEP_ORDER.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span className={index <= currentIndex ? 'font-medium text-reca-red' : ''}>{SUB_STEP_LABELS[step]}</span>
            {index < SUB_STEP_ORDER.length - 1 && <span aria-hidden="true">→</span>}
          </div>
        ))}
      </div>

      {subStep === 'locate' && (
        <PropertySubStepLocate
          client={client}
          contractId={contractId}
          capturePath={capturePath}
          mapUnavailable={mapUnavailable}
          onMapError={setMapError}
          onCaptured={setCapturePath}
          onGeocoded={handleGeocoded}
          onContinue={() => setSubStep('delineate')}
        />
      )}
      {subStep === 'delineate' && (
        <PropertySubStepDelineate
          center={center}
          capturePath={capturePath}
          mapUnavailable={mapUnavailable}
          onMapError={setMapError}
          zones={zones}
          onAddZone={addZone}
          onRemoveZone={removeZone}
          onContinue={() => setSubStep('validate')}
        />
      )}
      {subStep === 'validate' && <PropertySubStepValidate zones={zones} capturePath={capturePath} />}
    </div>
  )
}
