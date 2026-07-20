import type { Contract, ContractPhotoRow, ContractZoneRow } from '../types/contract.types'
import type {
  ContractCreationFormValues,
  ContractPhotoFormValues,
  ContractZoneFormValues,
} from '../schemas/contractCreation.schema'

function zoneRowToFormValues(row: ContractZoneRow): ContractZoneFormValues {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    geojson: row.geojson,
    surfaceM2: row.surface_m2,
    imageStoragePath: row.image_storage_path,
    ordre: row.ordre,
    capturedAt: row.captured_at,
  }
}

function photoRowToFormValues(row: ContractPhotoRow): ContractPhotoFormValues {
  return {
    id: row.id,
    storagePath: row.storage_path,
    ordre: row.ordre,
  }
}

/** Reconstitue les valeurs de formulaire du Wizard depuis un contrat déjà persisté (reprise de brouillon, `?draftId=`). */
export function contractToFormValues(
  contract: Contract,
  zones: ContractZoneRow[],
  photos: ContractPhotoRow[],
): ContractCreationFormValues {
  return {
    adresseGeocodee: contract.adresseGeocodee ?? '',
    latitude: contract.latitude,
    longitude: contract.longitude,
    zones: zones.map(zoneRowToFormValues),
    photos: photos.map(photoRowToFormValues),
    prix: contract.prix != null ? String(contract.prix) : '',
    modePaiement: contract.modePaiement ?? '',
    modalitesPaiement: contract.modalitesPaiement.map((entry) => ({
      description: entry.description,
      type: entry.type,
      valeur: String(entry.valeur),
      dateEcheance: entry.dateEcheance,
    })),
    notes: contract.notes ?? '',
  }
}
