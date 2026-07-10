import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Building2, Compass, Mail, MapPin, Phone, Tag, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { clientSchema } from '../schemas/client.schema'
import type { ClientFormValues } from '../schemas/client.schema'
import type { Client } from '../types/client.types'

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
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: 'onTouched',
    defaultValues: client
      ? {
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
          typeClient: client.typeClient ?? '',
          notes: client.notes ?? '',
        }
      : initialValues,
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Prénom" icon={User} error={errors.prenom?.message} {...register('prenom')} />
        <Input label="Nom" icon={User} error={errors.nom?.message} {...register('nom')} />
      </div>
      <Input
        label="Entreprise"
        icon={Building2}
        error={errors.entreprise?.message}
        {...register('entreprise')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Téléphone" icon={Phone} error={errors.telephone?.message} {...register('telephone')} />
        <Input label="Courriel" icon={Mail} error={errors.courriel?.message} {...register('courriel')} />
      </div>
      <Input label="Adresse" icon={MapPin} error={errors.adresse?.message} {...register('adresse')} />
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
        <Input
          label="Latitude"
          icon={Compass}
          error={errors.latitude?.message}
          {...register('latitude')}
        />
        <Input
          label="Longitude"
          icon={Compass}
          error={errors.longitude?.message}
          {...register('longitude')}
        />
      </div>
      <Input
        label="Type de client"
        icon={Tag}
        placeholder="Résidentiel, commercial..."
        error={errors.typeClient?.message}
        {...register('typeClient')}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-label font-medium text-reca-gray-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="rounded-control border border-reca-gray-light bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('notes')}
        />
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
