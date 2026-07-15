import { useEffect, useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import type { ContractCreationFormValues, ContractPhotoFormValues, ContractZoneFormValues } from '../schemas/contractCreation.schema'
import type { GeocodeResult } from '../services/geocoding.service'
import { buildDemoBoundary } from '../utils/propertyBoundary'
import type { PropertyNav } from '../components/wizard/WizardStepProperty'

export type PropertySubStep = 'locate' | 'delineate' | 'validate'
export const SUB_STEP_ORDER: PropertySubStep[] = ['locate', 'delineate', 'validate']
export const SUB_STEP_LABELS: Record<PropertySubStep, string> = {
  locate: 'Localiser',
  delineate: 'Délimiter',
  validate: 'Valider',
}
const QUEBEC_CENTER: [number, number] = [-71.2082, 46.8139]

type UsePropertyStepStateArgs = {
  control: Control<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
  onCompletionChange: (complete: boolean) => void
  onNavChange: (nav: PropertyNav) => void
  onAdvanceStep: () => void
}

/**
 * Orchestration de l'étape "Analyse de la propriété" (mini-stepper à 3 sous-phases) —
 * extraite de `WizardStepProperty.tsx` (sprint012) pour être réutilisée à l'identique
 * par le Desktop et `MobileWizardStepProperty.tsx`.
 */
export function usePropertyStepState({
  control,
  setValue,
  onCompletionChange,
  onNavChange,
  onAdvanceStep,
}: UsePropertyStepStateArgs) {
  const [subStep, setSubStep] = useState<PropertySubStep>('locate')
  const [geocode, setGeocode] = useState<GeocodeResult | null>(null)
  const [capturePath, setCapturePath] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const zones = useWatch({ control, name: 'zones' }) ?? []
  const photos = useWatch({ control, name: 'photos' }) ?? []
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

  function addPhoto(photo: ContractPhotoFormValues) {
    setValue('photos', [...photos, photo], { shouldValidate: true })
  }

  function removePhoto(id: string) {
    setValue(
      'photos',
      photos.filter((photo) => photo.id !== id),
      { shouldValidate: true },
    )
  }

  const center: [number, number] = useMemo(() => (geocode ? [geocode.lng, geocode.lat] : QUEBEC_CENTER), [geocode])
  const currentIndex = SUB_STEP_ORDER.indexOf(subStep)

  // Placeholder de démonstration (pas de données cadastrales) — calculé une seule fois ici
  // et transmis aux sous-étapes, pour qu'elles affichent exactement le même contour.
  const boundary = useMemo(() => buildDemoBoundary(center), [center])

  return {
    subStep,
    setSubStep,
    geocode,
    capturePath,
    setCapturePath,
    mapError,
    setMapError,
    zones,
    photos,
    mapUnavailable,
    center,
    boundary,
    currentIndex,
    handleGeocoded,
    addZone,
    updateZone,
    removeZone,
    addPhoto,
    removePhoto,
  }
}
