import { useSyncExternalStore } from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { dismissToast, getToastsSnapshot, subscribeToasts } from '@/stores/toastStore'

export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot)

  if (toasts.length === 0) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)] sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-6">
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className="flex w-full items-center gap-2 rounded-control border border-reca-gray-light bg-white px-4 py-3 text-body text-reca-black shadow-lg sm:w-auto"
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
            className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-gray-medium hover:text-reca-black"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
