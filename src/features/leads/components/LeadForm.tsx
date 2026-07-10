import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { leadSchema } from '../schemas/lead.schema'
import type { LeadFormValues } from '../schemas/lead.schema'
import type { Lead } from '../types/lead.types'

type LeadFormProps = {
  lead?: Lead
  isSubmitting: boolean
  onSubmit: (values: LeadFormValues) => void
  onCancel: () => void
}

export function LeadForm({ lead, isSubmitting, onSubmit, onCancel }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: 'onTouched',
    defaultValues: lead
      ? {
          prenom: lead.prenom,
          nom: lead.nom,
          telephone: lead.telephone ?? '',
          courriel: lead.courriel ?? '',
          adresse: lead.adresse ?? '',
          ville: lead.ville ?? '',
          codePostal: lead.codePostal ?? '',
          typeService: lead.typeService ?? '',
          message: lead.message ?? '',
          source: lead.source ?? '',
        }
      : undefined,
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Prénom" icon={User} error={errors.prenom?.message} {...register('prenom')} />
        <Input label="Nom" icon={User} error={errors.nom?.message} {...register('nom')} />
      </div>
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
      <Input
        label="Type de service"
        icon={MessageSquare}
        error={errors.typeService?.message}
        {...register('typeService')}
      />
      <Input label="Source" icon={MessageSquare} error={errors.source?.message} {...register('source')} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-label font-medium text-reca-gray-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={3}
          className="rounded-control border border-reca-gray-light bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('message')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {lead ? 'Enregistrer' : 'Créer le lead'}
        </Button>
      </div>
    </form>
  )
}
