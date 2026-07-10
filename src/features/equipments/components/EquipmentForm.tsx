import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Calendar, Hash, Tag, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { equipmentSchema } from '../schemas/equipment.schema'
import type { EquipmentFormValues } from '../schemas/equipment.schema'
import { EQUIPMENT_CATEGORIES } from '../types/equipment.types'
import type { Equipment } from '../types/equipment.types'

type EquipmentFormProps = {
  equipment?: Equipment
  isSubmitting: boolean
  onSubmit: (values: EquipmentFormValues) => void
  onCancel: () => void
}

export function EquipmentForm({ equipment, isSubmitting, onSubmit, onCancel }: EquipmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    mode: 'onTouched',
    defaultValues: equipment
      ? {
          nom: equipment.nom,
          categorie: equipment.categorie ?? '',
          marque: equipment.marque ?? '',
          modele: equipment.modele ?? '',
          annee: equipment.annee?.toString() ?? '',
          plaque: equipment.plaque ?? '',
          numeroSerie: equipment.numeroSerie ?? '',
          entretien: equipment.entretien ?? '',
          notes: equipment.notes ?? '',
        }
      : undefined,
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nom" icon={Tag} error={errors.nom?.message} {...register('nom')} />
        <Select label="Catégorie" icon={Tag} error={errors.categorie?.message} {...register('categorie')}>
          <option value="">Sélectionner...</option>
          {EQUIPMENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Input label="Marque" icon={Tag} error={errors.marque?.message} {...register('marque')} />
        <Input label="Modèle" icon={Tag} error={errors.modele?.message} {...register('modele')} />
        <Input label="Année" icon={Calendar} error={errors.annee?.message} {...register('annee')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Plaque" icon={Hash} error={errors.plaque?.message} {...register('plaque')} />
        <Input
          label="Numéro de série"
          icon={Hash}
          error={errors.numeroSerie?.message}
          {...register('numeroSerie')}
        />
      </div>
      <Input
        label="Entretien"
        icon={Wrench}
        placeholder="Dernier entretien, notes techniques..."
        error={errors.entretien?.message}
        {...register('entretien')}
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
          {equipment ? 'Enregistrer' : 'Créer l’équipement'}
        </Button>
      </div>
    </form>
  )
}
