import { useState } from 'react'
import { ZONE_TYPE_AUTRE, ZONE_TYPE_OPTIONS } from '../constants/wizardOptions'
import type { ZoneType } from '../types/contract.types'

/**
 * Regroupe l'état d'un menu "type de zone" (option + précision libre si "Autre").
 * Reprend tel quel le pattern déjà approuvé "menu déroulant + Autres révèle un champ
 * libre" (ex-`useZoneNameSelection`, tâche3), adapté au vocabulaire de types du
 * sprint009 (7 types colorés) plutôt qu'à une liste de noms libres. Dans un fichier
 * dédié (et non `ZoneTypeSelector.tsx`) car un fichier de composant ne peut exporter
 * qu'un composant sans casser le Fast Refresh (règle `react-refresh/only-export-components`).
 */
export function useZoneTypeSelection() {
  const [type, setType] = useState<ZoneType>(ZONE_TYPE_OPTIONS[0].code)
  const [customLabel, setCustomLabel] = useState('')
  const resolvedLabel =
    type === ZONE_TYPE_AUTRE ? customLabel.trim() : (ZONE_TYPE_OPTIONS.find((option) => option.code === type)?.label ?? '')

  function reset() {
    setType(ZONE_TYPE_OPTIONS[0].code)
    setCustomLabel('')
  }

  return { type, setType, customLabel, setCustomLabel, resolvedLabel, reset }
}

export type ZoneTypeSelection = ReturnType<typeof useZoneTypeSelection>
