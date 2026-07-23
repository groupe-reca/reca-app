import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useUpdateModules } from '../hooks/useUpdateModules'
import type { ModuleKey, Settings, SettingsModules } from '../types/settings.types'

const MODULE_LABELS: Record<ModuleKey, string> = {
  leads: 'Leads',
  quotes: 'Soumissions',
  clients: 'Clients',
  contracts: 'Contrats',
  invoices: 'Factures',
  payments: 'Paiements',
  routes: 'Routes',
  equipment: 'Équipements',
  employees: 'Employés',
  missions: 'Missions',
}

const MODULE_ORDER: ModuleKey[] = [
  'leads',
  'quotes',
  'clients',
  'contracts',
  'invoices',
  'payments',
  'routes',
  'equipment',
  'employees',
  'missions',
]

type ModuleRow = {
  key: ModuleKey
  label: string
  enabled: boolean
}

type ModulesTableProps = {
  settings: Settings
}

export function ModulesTable({ settings }: ModulesTableProps) {
  const updateModules = useUpdateModules()

  const rows: ModuleRow[] = MODULE_ORDER.map((key) => ({
    key,
    label: MODULE_LABELS[key],
    enabled: settings.modules[key],
  }))

  function toggleModule(key: ModuleKey) {
    const next: SettingsModules = { ...settings.modules, [key]: !settings.modules[key] }
    updateModules.mutate(next)
  }

  const columns: TableColumn<ModuleRow>[] = [
    { key: 'label', header: 'Module', render: (row) => row.label, primary: true },
    {
      key: 'enabled',
      header: 'Statut',
      render: (row) => <Badge color={row.enabled ? 'green' : 'gray'}>{row.enabled ? 'Actif' : 'Désactivé'}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => toggleModule(row.key)}>
            {row.enabled ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      ),
    },
  ]

  return <Table columns={columns} rows={rows} rowKey={(row) => row.key} />
}
