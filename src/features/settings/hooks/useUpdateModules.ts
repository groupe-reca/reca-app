import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as settingsService from '../services/settings.service'
import type { SettingsModules } from '../types/settings.types'
import { settingsKeys } from './settingsKeys'

export function useUpdateModules() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (modules: SettingsModules) => settingsService.updateModules(modules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
      toast.success('Modules mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour les modules.'),
  })
}
