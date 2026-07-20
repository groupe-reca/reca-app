import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionQueryKey } from '@/features/auth/hooks/useSession'
import type { Theme } from '@/features/auth/types/auth.types'
import { toast } from '@/stores/toastStore'
import * as preferencesService from '../services/preferences.service'

export function useUpdateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (theme: Theme) => preferencesService.updateOwnTheme(theme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    },
    onError: () => toast.error('Impossible de mettre à jour le thème.'),
  })
}
