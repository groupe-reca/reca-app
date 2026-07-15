import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Building2, Mail, MapPin, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete'
import { CLIENT_TYPES, clientSchema } from '../schemas/client.schema'
import type { ClientFormValues, ClientType } from '../schemas/client.schema'
import type { Client } from '../types/client.types'

const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  residentiel: 'Résidentiel',
  commercial: 'Commercial',
}

type ClientFormProps = {
  client?: Client
  initialValues?: Partial<ClientFormValues>
  isSubmitting: boolean
  onSubmit: (values: ClientFormValues) => void
  onCancel: () => void
}

export function ClientForm({ client, initialValues, isSubmitting, onSubmit, onCancel }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: 'onTouched',
    defaultValues: client
      ? {
          typeClient: client.typeClient === 'commercial' ? 'commercial' : 'residentiel',
          prenom: client.prenom,
          nom: client.nom,
          entreprise: client.entreprise ?? '',
          telephone: client.telephone ?? '',
          courriel: client.courriel ?? '',
          adresse: client.adresse ?? '',
          ville: client.ville ?? '',
          codePostal: client.codePostal ?? '',
          latitude: client.latitude?.toString() ?? '',
          longitude: client.longitude?.toString() ?? '',
          notes: client.notes ?? '',
        }
      : { typeClient: 'residentiel', ...initialValues },
  })

  const typeClient = useWatch({ control, name: 'typeClient' })
  const adresse = useWatch({ control, name: 'adresse' }) ?? ''

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5">
        <span className="text-label font-medium text-reca-gray-medium">Type de client</span>
        <div className="inline-flex w-fit rounded-control border border-reca-gray-light bg-white p-1">
          {CLIENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue('typeClient', type, { shouldValidate: true, shouldDirty: true })}
              className={`rounded-md px-4 py-1.5 text-label font-medium transition-colors ${
                typeClient === type ? 'bg-reca-red text-white' : 'text-reca-gray-medium hover:text-reca-black'
              }`}
            >
              {CLIENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {typeClient === 'commercial' && (
        <Input
          label="Entreprise"
          icon={Building2}
          error={errors.entreprise?.message}
          {...register('entreprise')}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Nom" icon={User} error={errors.nom?.message} {...register('nom')} />
        <Input label="Prénom" icon={User} error={errors.prenom?.message} {...register('prenom')} />
      </div>

      <AddressAutocomplete
        label="Adresse"
        value={adresse}
        onChange={(value) => setValue('adresse', value, { shouldValidate: true, shouldDirty: true })}
        onSelect={(suggestion) => {
          setValue('adresse', suggestion.adresse, { shouldDirty: true })
          setValue('ville', suggestion.ville ?? '', { shouldDirty: true })
          setValue('codePostal', suggestion.codePostal ?? '', { shouldDirty: true })
          setValue('latitude', suggestion.latitude.toString(), { shouldDirty: true })
          setValue('longitude', suggestion.longitude.toString(), { shouldDirty: true })
        }}
        error={errors.adresse?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Ville" icon={MapPin} error={errors.ville?.message} {...register('ville')} />
        <Input
          label="Code postal"
          icon={MapPin}
          error={errors.codePostal?.message}
          {...register('codePostal')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Téléphone" icon={Phone} error={errors.telephone?.message} {...register('telephone')} />
        <Input label="Courriel" icon={Mail} error={errors.courriel?.message} {...register('courriel')} />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {client ? 'Enregistrer' : 'Créer le client'}
        </Button>
      </div>
    </form>
  )
}
