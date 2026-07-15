import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Building2, Image, Mail, MapPin, Palette, Percent, Phone, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { settingsSchema } from '../schemas/settings.schema'
import type { SettingsFormValues } from '../schemas/settings.schema'
import type { Settings } from '../types/settings.types'

type CompanySettingsFormProps = {
  settings: Settings
  isSubmitting: boolean
  onSubmit: (values: SettingsFormValues) => void
}

export function CompanySettingsForm({ settings, isSubmitting, onSubmit }: CompanySettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: 'onTouched',
    defaultValues: {
      nom: settings.nom ?? '',
      adresse: settings.adresse ?? '',
      telephone: settings.telephone ?? '',
      courriel: settings.courriel ?? '',
      logo: settings.logo ?? '',
      tps: String(settings.taxes.tps),
      tvq: String(settings.taxes.tvq),
      couleurPrimaire: settings.couleurs.primaire,
      couleurSecondaire: settings.couleurs.secondaire,
      assurancePoliceNo: settings.assurancePoliceNo ?? '',
    },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nom de l'entreprise" icon={Building2} error={errors.nom?.message} {...register('nom')} />
        <Input label="Logo (URL)" icon={Image} error={errors.logo?.message} {...register('logo')} />
      </div>
      <Input label="Adresse" icon={MapPin} error={errors.adresse?.message} {...register('adresse')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Téléphone" icon={Phone} error={errors.telephone?.message} {...register('telephone')} />
        <Input label="Courriel" icon={Mail} error={errors.courriel?.message} {...register('courriel')} />
      </div>
      <Input
        label="N° de police d'assurance responsabilité civile"
        icon={Shield}
        error={errors.assurancePoliceNo?.message}
        {...register('assurancePoliceNo')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="TPS (%)"
          type="number"
          step="0.001"
          icon={Percent}
          error={errors.tps?.message}
          {...register('tps')}
        />
        <Input
          label="TVQ (%)"
          type="number"
          step="0.001"
          icon={Percent}
          error={errors.tvq?.message}
          {...register('tvq')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="couleurPrimaire" className="text-label font-medium text-reca-gray-medium">
            Couleur primaire
          </label>
          <div className="relative">
            <Palette
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-reca-gray-medium"
              aria-hidden="true"
            />
            <input
              id="couleurPrimaire"
              type="color"
              className="h-11 w-full rounded-control border border-reca-gray-light bg-white pl-9 pr-3"
              {...register('couleurPrimaire')}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="couleurSecondaire" className="text-label font-medium text-reca-gray-medium">
            Couleur secondaire
          </label>
          <div className="relative">
            <Palette
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-reca-gray-medium"
              aria-hidden="true"
            />
            <input
              id="couleurSecondaire"
              type="color"
              className="h-11 w-full rounded-control border border-reca-gray-light bg-white pl-9 pr-3"
              {...register('couleurSecondaire')}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
