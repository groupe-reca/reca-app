import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * URL signée d'une capture satellite (bucket privé `contract-captures`) —
 * même pattern que `ContractCreatedPage.tsx`. `undefined`/`'manuel'` (repli
 * sans carte) : pas d'image à afficher.
 */
export function useSignedCaptureUrl(storagePath: string | undefined): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!storagePath || storagePath === 'manuel') return
    let cancelled = false
    supabase.storage
      .from('contract-captures')
      .createSignedUrl(storagePath, 3600)
      .then(({ data }) => {
        if (!cancelled) setImageUrl(data?.signedUrl ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [storagePath])

  return imageUrl
}
