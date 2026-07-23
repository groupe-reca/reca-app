import { ROUTE_COLOR_PRESETS } from '../types/route.types'

type RouteColorPickerProps = {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function RouteColorPicker({ value, onChange, error }: RouteColorPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label font-medium text-reca-gray-medium">Couleur</label>
      <div className="flex flex-wrap items-center gap-2">
        {ROUTE_COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={preset}
            onClick={() => onChange(preset)}
            className={`size-8 rounded-full border-2 transition-transform ${
              value.toLowerCase() === preset.toLowerCase() ? 'scale-110 border-reca-black' : 'border-transparent'
            }`}
            style={{ backgroundColor: preset }}
          />
        ))}
        <input
          type="color"
          value={value || '#000000'}
          onChange={(event) => onChange(event.target.value)}
          className="size-8 cursor-pointer rounded-full border border-reca-gray-light p-0"
          aria-label="Couleur personnalisée"
        />
      </div>
      {error && (
        <p role="alert" className="text-label text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
