import { useEffect, useRef, useState } from 'react'
import type { FocusEvent } from 'react'
import { MapPin } from 'lucide-react'
import { MAPBOX_GEOCODING_URL, MAPBOX_TOKEN, isMapboxConfigured } from '@/lib/mapboxClient'

export type AddressSuggestion = {
  placeName: string
  adresse: string
  ville: string | null
  codePostal: string | null
  latitude: number
  longitude: number
}

type MapboxFeature = {
  place_name: string
  text: string
  address?: string
  center: [number, number]
  context?: { id: string; text: string }[]
}

function parseFeature(feature: MapboxFeature): AddressSuggestion {
  const context = feature.context ?? []
  const ville = context.find((entry) => entry.id.startsWith('place'))?.text ?? null
  const codePostal = context.find((entry) => entry.id.startsWith('postcode'))?.text ?? null
  const [longitude, latitude] = feature.center
  const adresse = feature.address ? `${feature.address} ${feature.text}` : feature.text
  return { placeName: feature.place_name, adresse, ville, codePostal, latitude, longitude }
}

type AddressAutocompleteProps = {
  label: string
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  error?: string
}

/**
 * Champ adresse avec suggestions Mapbox (façon Google Maps) — le token n'étant
 * pas obligatoire partout dans l'app, se dégrade en simple champ texte libre
 * (sans suggestions) si `VITE_MAPBOX_TOKEN` est absent.
 */
export function AddressAutocomplete({ label, value, onChange, onSelect, error }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const justSelectedRef = useRef(false)

  useEffect(() => {
    if (!isMapboxConfigured) return

    if (justSelectedRef.current) {
      justSelectedRef.current = false
      return
    }

    const query = value.trim()
    if (query.length < 3) {
      queueMicrotask(() => setSuggestions([]))
      return
    }

    const timeout = setTimeout(() => {
      setIsLoading(true)
      const url = `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&types=address&country=CA&limit=5`
      fetch(url)
        .then((response) => response.json())
        .then((data: { features?: MapboxFeature[] }) => {
          setSuggestions(data.features ?? [])
          setOpen(true)
        })
        .catch(() => setSuggestions([]))
        .finally(() => setIsLoading(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [value])

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (containerRef.current?.contains(event.relatedTarget as Node)) return
    setOpen(false)
  }

  function handleSelect(feature: MapboxFeature) {
    const suggestion = parseFeature(feature)
    justSelectedRef.current = true
    onChange(suggestion.adresse)
    onSelect(suggestion)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef} onBlur={handleBlur}>
      <label className="text-label font-medium text-reca-gray-medium">{label}</label>
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-reca-gray-medium"
          aria-hidden="true"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={isMapboxConfigured ? 'Commencez à taper une adresse…' : undefined}
          className={`h-11 w-full rounded-control border bg-white pl-9 pr-3 text-body text-reca-black placeholder:text-reca-gray-medium/70 focus:outline-none focus:ring-2 ${
            error ? 'border-red-400 focus:ring-red-200' : 'border-reca-gray-light focus:ring-reca-red/30'
          }`}
        />
        {open && (suggestions.length > 0 || isLoading) && (
          <div className="absolute z-10 mt-1 flex w-full flex-col gap-0.5 rounded-control border border-reca-gray-light bg-white p-1 shadow-lg">
            {isLoading && <p className="px-3 py-2 text-label text-reca-gray-medium">Recherche…</p>}
            {!isLoading &&
              suggestions.map((feature) => (
                <button
                  key={feature.place_name}
                  type="button"
                  onClick={() => handleSelect(feature)}
                  className="rounded-control px-3 py-2 text-left text-body text-reca-black hover:bg-reca-snow"
                >
                  {feature.place_name}
                </button>
              ))}
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="text-label text-red-600">
          {error}
        </p>
      )}
      {!isMapboxConfigured && (
        <p className="text-label text-reca-gray-medium">
          Suggestions d'adresse indisponibles (token Mapbox non configuré) — saisie manuelle.
        </p>
      )}
    </div>
  )
}
