import { Card } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import { ContractWizardDefaultsForm } from '../components/ContractWizardDefaultsForm'
import { useContractWizardDefaults } from '../hooks/useContractWizardDefaults'
import { useUpdateContractWizardDefaults } from '../hooks/useUpdateContractWizardDefaults'
import type { ServiceCode } from '../types/contract.types'

export function ContractWizardSettingsPage() {
  const { data: defaults, isLoading, isError } = useContractWizardDefaults()
  const updateDefaults = useUpdateContractWizardDefaults()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Paramètres du Wizard Contrats</h1>
        <p className="text-body text-reca-gray-medium">
          Ces valeurs sont les mêmes pour tous les contrats — elles sont générées automatiquement à la création,
          sans être saisies à nouveau à chaque fois.
        </p>
      </div>

      <Card>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          data={defaults}
          errorLabel="Impossible de charger les paramètres du Wizard."
        >
          {(data) => (
            <ContractWizardDefaultsForm
              defaults={data}
              isSubmitting={updateDefaults.isPending}
              onSubmit={(values) =>
                updateDefaults.mutate({ ...values, serviceCodes: values.serviceCodes as ServiceCode[] })
              }
            />
          )}
        </QueryState>
      </Card>
    </div>
  )
}
