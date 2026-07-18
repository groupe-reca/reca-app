import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme, isUpdating } = useTheme()

  return (
    <div className="inline-flex w-fit rounded-control border border-reca-gray-light bg-reca-white p-1">
      <button
        type="button"
        onClick={() => setTheme('sombre')}
        disabled={isUpdating}
        aria-pressed={theme === 'sombre'}
        className={`flex items-center gap-2 rounded-control px-4 py-2 text-body font-medium transition-colors duration-150 disabled:opacity-50 ${
          theme === 'sombre' ? 'bg-reca-red text-white' : 'text-reca-gray-medium hover:bg-reca-gray-light'
        }`}
      >
        <Moon className="size-4" aria-hidden="true" />
        Sombre
      </button>
      <button
        type="button"
        onClick={() => setTheme('clair')}
        disabled={isUpdating}
        aria-pressed={theme === 'clair'}
        className={`flex items-center gap-2 rounded-control px-4 py-2 text-body font-medium transition-colors duration-150 disabled:opacity-50 ${
          theme === 'clair' ? 'bg-reca-red text-white' : 'text-reca-gray-medium hover:bg-reca-gray-light'
        }`}
      >
        <Sun className="size-4" aria-hidden="true" />
        Clair
      </button>
    </div>
  )
}
