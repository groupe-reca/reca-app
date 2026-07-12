import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useAccounts } from '../hooks/useAccounts'
import { useUpdateAccountActive } from '../hooks/useUpdateAccountActive'
import { useUpdateAccountRole } from '../hooks/useUpdateAccountRole'
import type { Account } from '../services/accounts.service'

export function AccountsTable() {
  const { data: accounts, isLoading, isError } = useAccounts()
  const updateRole = useUpdateAccountRole()
  const updateActive = useUpdateAccountActive()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={accounts}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun compte pour le moment."
      errorLabel="Impossible de charger les comptes."
    >
      {(data) => {
        const columns: TableColumn<Account>[] = [
          { key: 'nom', header: 'Nom', render: (account) => account.nom ?? '—' },
          { key: 'email', header: 'Courriel', render: (account) => account.email },
          {
            key: 'role',
            header: 'Rôle',
            render: (account) => (
              <Badge color={account.role === 'administrateur' ? 'red' : 'blue'}>
                {account.role === 'administrateur' ? 'Administrateur' : 'Employé'}
              </Badge>
            ),
          },
          {
            key: 'actif',
            header: 'Statut',
            render: (account) => (
              <Badge color={account.actif ? 'green' : 'gray'}>{account.actif ? 'Actif' : 'Désactivé'}</Badge>
            ),
          },
          {
            key: 'derniereConnexion',
            header: 'Dernière connexion',
            render: (account) => account.derniereConnexion ?? '—',
          },
          {
            key: 'actions',
            header: '',
            render: (account) => (
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateRole.mutate({
                      id: account.id,
                      role: account.role === 'administrateur' ? 'employe' : 'administrateur',
                    })
                  }
                >
                  {account.role === 'administrateur' ? 'Rétrograder' : 'Promouvoir'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => updateActive.mutate({ id: account.id, actif: !account.actif })}
                >
                  {account.actif ? 'Désactiver' : 'Activer'}
                </Button>
              </div>
            ),
          },
        ]

        return <Table columns={columns} rows={data} rowKey={(account) => account.id} />
      }}
    </QueryState>
  )
}
