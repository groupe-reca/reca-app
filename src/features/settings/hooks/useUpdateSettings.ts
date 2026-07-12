import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as settingsService from '../services/settings.service'
import type { SettingsFormValues } from '../schemas/settings.schema'
import { settingsKeys } from './settingsKeys'

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: SettingsFormValues) => settingsService.updateSettings(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
      toast.success('Paramètres mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour les paramètres.'),
  })
}
