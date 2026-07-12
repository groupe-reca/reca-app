import { Card } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import { AccountsTable } from '../components/AccountsTable'
import { CompanySettingsForm } from '../components/CompanySettingsForm'
import { useSettings } from '../hooks/useSettings'
import { useUpdateSettings } from '../hooks/useUpdateSettings'

export function SettingsPage() {
  const { data: settings, isLoading, isError } = useSettings()
  const updateSettings = useUpdateSettings()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Paramètres</h1>
        <p className="text-body text-reca-gray-medium">Configuration de l'entreprise et gestion des comptes.</p>
      </div>

      <Card>
        <h2 className="mb-4 text-label font-semibold text-reca-black">Entreprise et taxes</h2>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          data={settings}
          errorLabel="Impossible de charger les paramètres."
        >
          {(data) => (
            <CompanySettingsForm
              settings={data}
              isSubmitting={updateSettings.isPending}
              onSubmit={(values) => updateSettings.mutate(values)}
            />
          )}
        </QueryState>
      </Card>

      <Card>
        <h2 className="mb-4 text-label font-semibold text-reca-black">Comptes</h2>
        <AccountsTable />
      </Card>
    </div>
  )
}
