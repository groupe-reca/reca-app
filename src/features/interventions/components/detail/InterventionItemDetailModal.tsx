import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AlertTriangle, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useUpdateInterventionItemStatus } from '../../hooks/useUpdateInterventionItemStatus'
import { interventionItemUpdateSchema } from '../../schemas/interventionItemUpdate.schema'
import type { InterventionItemUpdateFormValues } from '../../schemas/interventionItemUpdate.schema'
import { INTERVENTION_ITEM_STATUSES, INTERVENTION_ITEM_STATUS_LABELS } from '../../types/interventionItem.types'
import type { InterventionItem } from '../../types/interventionItem.types'

type InterventionItemDetailModalProps = {
  open: boolean
  onClose: () => void
  interventionId: string
  item: InterventionItem
}

/** Formulaire complet (statut + notes + code problème) — seul endroit où ces 2 derniers champs sont éditables. */
export function InterventionItemDetailModal({ open, onClose, interventionId, item }: InterventionItemDetailModalProps) {
  const updateStatus = useUpdateInterventionItemStatus(interventionId)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterventionItemUpdateFormValues>({
    resolver: zodResolver(interventionItemUpdateSchema),
    defaultValues: {
      statut: item.statut,
      notes: item.notes ?? '',
      codeProbleme: item.codeProbleme ?? '',
    },
  })

  function handleFormSubmit(values: InterventionItemUpdateFormValues) {
    updateStatus.mutate({ id: item.id, values }, { onSuccess: onClose })
  }

  const clientName = item.client ? `${item.client.prenom} ${item.client.nom}` : 'Résidence'

  return (
    <Modal open={open} onClose={onClose} title={clientName}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        {item.client?.adresse && <p className="text-body text-reca-gray-medium">{item.client.adresse}</p>}

        <Select label="Statut" icon={ClipboardList} error={errors.statut?.message} {...register('statut')}>
          {INTERVENTION_ITEM_STATUSES.map((status) => (
            <option key={status} value={status}>
              {INTERVENTION_ITEM_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-label font-medium text-reca-gray-medium">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
            {...register('notes')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="codeProbleme" className="text-label font-medium text-reca-gray-medium">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              Code problème
            </span>
          </label>
          <input
            id="codeProbleme"
            type="text"
            className="h-11 rounded-control border border-reca-gray-light bg-reca-white px-3 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
            {...register('codeProbleme')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={updateStatus.isPending}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
