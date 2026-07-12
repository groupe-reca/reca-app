import { createBrowserRouter } from 'react-router'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { OperationsCenterPage } from '@/pages/OperationsCenterPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RequireAuth, RequireRole } from '@/features/auth/components/RequireAuth'
import { LeadDetailPage } from '@/features/leads/pages/LeadDetailPage'
import { LeadsListPage } from '@/features/leads/pages/LeadsListPage'
import { QuoteDetailPage } from '@/features/quotes/pages/QuoteDetailPage'
import { QuotesListPage } from '@/features/quotes/pages/QuotesListPage'
import { ClientDetailPage } from '@/features/clients/pages/ClientDetailPage'
import { ClientsListPage } from '@/features/clients/pages/ClientsListPage'
import { ContractCreatePage } from '@/features/contracts/pages/ContractCreatePage'
import { ContractDetailPage } from '@/features/contracts/pages/ContractDetailPage'
import { ContractsListPage } from '@/features/contracts/pages/ContractsListPage'
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage'
import { InvoicesListPage } from '@/features/invoices/pages/InvoicesListPage'
import { PaymentsListPage } from '@/features/payments/pages/PaymentsListPage'
import { EquipmentDetailPage } from '@/features/equipments/pages/EquipmentDetailPage'
import { EquipmentsListPage } from '@/features/equipments/pages/EquipmentsListPage'
import { EmployeeDetailPage } from '@/features/employees/pages/EmployeeDetailPage'
import { EmployeesListPage } from '@/features/employees/pages/EmployeesListPage'
import { RouteDetailPage } from '@/features/routes/pages/RouteDetailPage'
import { RoutesListPage } from '@/features/routes/pages/RoutesListPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: 'dashboard', element: <OperationsCenterPage /> },
          { path: 'leads', element: <LeadsListPage />, handle: { breadcrumb: 'Leads' } },
          { path: 'leads/:id', element: <LeadDetailPage />, handle: { breadcrumb: 'Détail' } },
          { path: 'quotes', element: <QuotesListPage />, handle: { breadcrumb: 'Soumissions' } },
          { path: 'quotes/:id', element: <QuoteDetailPage />, handle: { breadcrumb: 'Détail' } },
          { path: 'clients', element: <ClientsListPage />, handle: { breadcrumb: 'Clients' } },
          { path: 'clients/:id', element: <ClientDetailPage />, handle: { breadcrumb: 'Détail' } },
          { path: 'contracts', element: <ContractsListPage />, handle: { breadcrumb: 'Contrats' } },
          { path: 'contracts/new', element: <ContractCreatePage />, handle: { breadcrumb: 'Nouveau contrat' } },
          { path: 'contracts/:id', element: <ContractDetailPage />, handle: { breadcrumb: 'Détail' } },
          { path: 'invoices', element: <InvoicesListPage />, handle: { breadcrumb: 'Factures' } },
          { path: 'invoices/:id', element: <InvoiceDetailPage />, handle: { breadcrumb: 'Détail' } },
          { path: 'payments', element: <PaymentsListPage />, handle: { breadcrumb: 'Paiements' } },
          { path: 'equipment', element: <EquipmentsListPage />, handle: { breadcrumb: 'Équipements' } },
          { path: 'equipment/:id', element: <EquipmentDetailPage />, handle: { breadcrumb: 'Détail' } },
          { path: 'employees', element: <EmployeesListPage />, handle: { breadcrumb: 'Employés' } },
          { path: 'employees/:id', element: <EmployeeDetailPage />, handle: { breadcrumb: 'Détail' } },
          { path: 'routes', element: <RoutesListPage />, handle: { breadcrumb: 'Routes' } },
          { path: 'routes/:id', element: <RouteDetailPage />, handle: { breadcrumb: 'Détail' } },
          {
            element: <RequireRole roles={['administrateur']} />,
            children: [{ path: 'settings', element: <SettingsPage />, handle: { breadcrumb: 'Paramètres' } }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
