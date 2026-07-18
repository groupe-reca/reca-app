import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Bot, Calendar, Clock, DollarSign, Handshake, Snowflake, Thermometer, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { contractWizardDefaultsSchema } from '../schemas/contractWizardDefaults.schema'
import type { ContractWizardDefaultsFormValues } from '../schemas/contractWizardDefaults.schema'
import type { ContractWizardDefaults } from '../types/contractWizardDefaults.types'
import {
  AI_MODEL_OPTIONS_BY_PROVIDER,
  AI_PROVIDER_OPTIONS,
  DEPOT_NEIGE_OPTIONS,
  MODE_CONCLUSION_OPTIONS,
  PRIX_TAXES_OPTIONS,
  SEUIL_DECLENCHEMENT_OPTIONS,
  SERVICE_OPTIONS,
} from '../constants/wizardOptions'

type ContractWizardDefaultsFormProps = {
  defaults: ContractWizardDefaults
  isSubmitting: boolean
  onSubmit: (values: ContractWizardDefaultsFormValues) => void
}

/**
 * Formulaire des paramètres par défaut du Wizard Contrats (tâche 5) — mêmes
 * paramètres pour tout le monde, générés/écrits sur chaque contrat sans être
 * saisis à nouveau. Réservé aux administrateurs (route `contracts/parametres`).
 */
export function ContractWizardDefaultsForm({ defaults, isSubmitting, onSubmit }: ContractWizardDefaultsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContractWizardDefaultsFormValues>({
    resolver: zodResolver(contractWizardDefaultsSchema),
    mode: 'onTouched',
    defaultValues: defaults,
  })

  const aiProvider = useWatch({ control, name: 'aiProvider' })
  const aiModel = useWatch({ control, name: 'aiModel' })
  const aiModelOptions = AI_MODEL_OPTIONS_BY_PROVIDER[aiProvider]

  useEffect(() => {
    if (!aiModelOptions.some((option) => option.value === aiModel)) {
      setValue('aiModel', aiModelOptions[0].value, { shouldValidate: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiProvider])

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-4 gap-4">
        <Input label="Saison" error={errors.saison?.message} {...register('saison')} icon={Snowflake} />
        <Input
          label="Date de début"
          type="date"
          icon={Calendar}
          error={errors.dateDebut?.message}
          {...register('dateDebut')}
        />
        <Input
          label="Date de fin"
          type="date"
          icon={Calendar}
          error={errors.dateFin?.message}
          {...register('dateFin')}
        />
        <Input
          label="Date du 2e versement (Bi-paiement)"
          type="date"
          icon={Calendar}
          error={errors.dateDeuxiemeVersement?.message}
          {...register('dateDeuxiemeVersement')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Le prix du contrat est"
          icon={DollarSign}
          error={errors.prixTaxes?.message}
          {...register('prixTaxes')}
        >
          {PRIX_TAXES_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-label font-medium text-reca-gray-medium">Services actifs par défaut</span>
        <div className="flex flex-wrap gap-4">
          {SERVICE_OPTIONS.map((option) => (
            <label key={option.code} className="flex items-center gap-2 text-body text-reca-black">
              <input
                type="checkbox"
                value={option.code}
                className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
                {...register('serviceCodes')}
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.serviceCodes && (
          <p role="alert" className="text-label text-red-600">
            {errors.serviceCodes.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Seuil d'intervention"
          icon={Thermometer}
          error={errors.seuilDeclenchementCm?.message}
          {...register('seuilDeclenchementCm', { valueAsNumber: true })}
        >
          {SEUIL_DECLENCHEMENT_OPTIONS.map((cm) => (
            <option key={cm} value={cm}>
              {cm} cm
            </option>
          ))}
        </Select>
        <Input
          label="Heure limite de dégagement"
          type="time"
          icon={Clock}
          error={errors.heurePremierPassage?.message}
          {...register('heurePremierPassage')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Dépôt de la neige"
          icon={Truck}
          error={errors.depotNeige?.message}
          {...register('depotNeige')}
        >
          {DEPOT_NEIGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          label="Mode de conclusion"
          icon={Handshake}
          error={errors.modeConclusion?.message}
          {...register('modeConclusion')}
        >
          {MODE_CONCLUSION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Fournisseur IA (détection automatique du stationnement)"
          icon={Bot}
          error={errors.aiProvider?.message}
          {...register('aiProvider')}
        >
          {AI_PROVIDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select label="Modèle" icon={Bot} error={errors.aiModel?.message} {...register('aiModel')}>
          {aiModelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="aiPromptDetection" className="text-label font-medium text-reca-gray-medium">
          Texte du prompt pour la détection automatique
        </label>
        <textarea
          id="aiPromptDetection"
          rows={16}
          className={`rounded-control border bg-white px-3 py-2 font-mono text-label text-reca-black focus:outline-none focus:ring-2 ${
            errors.aiPromptDetection ? 'border-red-400 focus:ring-red-200' : 'border-reca-gray-light focus:ring-reca-red/30'
          }`}
          {...register('aiPromptDetection')}
        />
        {errors.aiPromptDetection && (
          <p role="alert" className="text-label text-red-600">
            {errors.aiPromptDetection.message}
          </p>
        )}
      </div>

      <div className="mt-2 flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
