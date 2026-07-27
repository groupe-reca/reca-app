import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useEmployeeAccount } from '../../hooks/useEmployeeAccount'
import { usePromoteEmployeeAccount } from '../../hooks/usePromoteEmployeeAccount'

export function EmployeeAccountCard({ userId }: { userId: string }) {
  const { data: account } = useEmployeeAccount(userId)
  const promoteAccount = usePromoteEmployeeAccount(userId)

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-subtitle font-semibold text-reca-black">Compte utilisateur</h2>
      {account ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-body text-reca-gray-medium">
            <p>{account.email}</p>
            <p className="mt-1">
              Rôle du compte :{' '}
              <Badge color={account.role === 'administrateur' ? 'red' : 'blue'}>
                {account.role === 'administrateur' ? 'Administrateur' : 'Employé'}
              </Badge>
            </p>
          </div>
          <Button
            variant="secondary"
            fullWidth
            className="sm:w-auto"
            isLoading={promoteAccount.isPending}
            onClick={() => promoteAccount.mutate(account.role === 'administrateur' ? 'employe' : 'administrateur')}
          >
            {account.role === 'administrateur' ? 'Rétrograder employé' : 'Promouvoir administrateur'}
          </Button>
        </div>
      ) : (
        <p className="text-body text-reca-gray-medium">Chargement du compte...</p>
      )}
    </Card>
  )
}
