import { useQuery } from '@tanstack/react-query'
import * as settingsService from '../services/settings.service'
import { settingsKeys } from './settingsKeys'

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: settingsService.getSettings,
  })
}
