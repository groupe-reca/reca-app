import { useSyncExternalStore } from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { dismissToast, getToastsSnapshot, subscribeToasts } from '@/stores/toastStore'

export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot)

  if (toasts.length === 0) return null

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-2">
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className="flex items-center gap-2 rounded-control border border-reca-gray-light bg-white px-4 py-3 text-body text-reca-black shadow-lg"
        >
          {item.variant === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0 text-reca-success" aria-hidden="true" />
          ) : (
            <XCircle className="size-4 shrink-0 text-red-600" aria-hidden="true" />
          )}
          <span className="flex-1">{item.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(item.id)}
            aria-label="Fermer"
            className="text-reca-gray-medium hover:text-reca-black"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
