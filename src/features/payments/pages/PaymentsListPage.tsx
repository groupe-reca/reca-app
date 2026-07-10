import { PaymentTable } from '../components/PaymentTable'
import { usePayments } from '../hooks/usePayments'

export function PaymentsListPage() {
  const { data: payments, isLoading, isError } = usePayments()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Paiements</h1>
        <p className="text-body text-reca-gray-medium">Historique des paiements reçus.</p>
      </div>

      <PaymentTable payments={payments} isLoading={isLoading} isError={isError} />
    </div>
  )
}
