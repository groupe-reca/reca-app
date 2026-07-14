import { createBrowserRouter, Outlet } from 'react-router'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { OperationsCenterPage } from '@/pages/OperationsCenterPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RequireAuth, RequireRole } from '@/features/auth/components/RequireAuth'
import { RequireModule } from './RequireModule'
import { LeadCreatePage } from '@/features/leads/pages/LeadCreatePage'
import { LeadDetailPage } from '@/features/leads/pages/LeadDetailPage'
import { LeadsListPage } from '@/features/leads/pages/LeadsListPage'
import { QuoteCreatePage } from '@/features/quotes/pages/QuoteCreatePage'
import { QuoteDetailPage } from '@/features/quotes/pages/QuoteDetailPage'
import { QuotesListPage } from '@/features/quotes/pages/QuotesListPage'
import { ClientCreatePage } from '@/features/clients/pages/ClientCreatePage'
import { ClientDetailPage } from '@/features/clients/pages/ClientDetailPage'
import { ClientsListPage } from '@/features/clients/pages/ClientsListPage'
import { ContractWizardPage } from '@/features/contracts/pages/ContractWizardPage'
import { ContractDetailPage } from '@/features/contracts/pages/ContractDetailPage'
import { ContractsListPage } from '@/features/contracts/pages/ContractsListPage'
import { InvoiceCreatePage } from '@/features/invoices/pages/InvoiceCreatePage'
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage'
import { InvoicesListPage } from '@/features/invoices/pages/InvoicesListPage'
import { PaymentsListPage } from '@/features/payments/pages/PaymentsListPage'
import { EquipmentCreatePage } from '@/features/equipments/pages/EquipmentCreatePage'
import { EquipmentDetailPage } from '@/features/equipments/pages/EquipmentDetailPage'
import { EquipmentsListPage } from '@/features/equipments/pages/EquipmentsListPage'
import { EmployeeCreatePage } from '@/features/employees/pages/EmployeeCreatePage'
import { EmployeeDetailPage } from '@/features/employees/pages/EmployeeDetailPage'
import { EmployeesListPage } from '@/features/employees/pages/EmployeesListPage'
import { RouteCreatePage } from '@/features/routes/pages/RouteCreatePage'
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
          {
            element: <RequireModule moduleKey="leads" />,
            children: [
              { path: 'leads', element: <LeadsListPage />, handle: { breadcrumb: 'Leads' } },
              { path: 'leads/new', element: <LeadCreatePage />, handle: { breadcrumb: 'Nouveau lead' } },
              { path: 'leads/:id', element: <LeadDetailPage />, handle: { breadcrumb: 'Détail' } },
            ],
          },
          {
            element: <RequireModule moduleKey="quotes" />,
            children: [
              { path: 'quotes', element: <QuotesListPage />, handle: { breadcrumb: 'Soumissions' } },
              { path: 'quotes/new', element: <QuoteCreatePage />, handle: { breadcrumb: 'Nouvelle soumission' } },
              { path: 'quotes/:id', element: <QuoteDetailPage />, handle: { breadcrumb: 'Détail' } },
            ],
          },
          {
            element: <RequireModule moduleKey="clients" />,
            children: [
              { path: 'clients', element: <ClientsListPage />, handle: { breadcrumb: 'Clients' } },
              { path: 'clients/new', element: <ClientCreatePage />, handle: { breadcrumb: 'Nouveau client' } },
              { path: 'clients/:id', element: <ClientDetailPage />, handle: { breadcrumb: 'Détail' } },
            ],
          },
          {
            element: <RequireModule moduleKey="contracts" />,
            children: [
              {
                path: 'contracts',
                element: <Outlet />,
                handle: { breadcrumb: 'Contrats' },
                children: [
                  { index: true, element: <ContractsListPage /> },
                  {
                    path: 'new',
                    element: <ContractWizardPage />,
                    handle: { breadcrumb: 'Nouveau contrat', hideMobileNav: true },
                  },
                  { path: ':id', element: <ContractDetailPage />, handle: { breadcrumb: 'Détail' } },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleKey="invoices" />,
            children: [
              { path: 'invoices', element: <InvoicesListPage />, handle: { breadcrumb: 'Factures' } },
              { path: 'invoices/new', element: <InvoiceCreatePage />, handle: { breadcrumb: 'Nouvelle facture' } },
              { path: 'invoices/:id', element: <InvoiceDetailPage />, handle: { breadcrumb: 'Détail' } },
            ],
          },
          {
            element: <RequireModule moduleKey="payments" />,
            children: [{ path: 'payments', element: <PaymentsListPage />, handle: { breadcrumb: 'Paiements' } }],
          },
          {
            element: <RequireModule moduleKey="equipment" />,
            children: [
              { path: 'equipment', element: <EquipmentsListPage />, handle: { breadcrumb: 'Équipements' } },
              {
                path: 'equipment/new',
                element: <EquipmentCreatePage />,
                handle: { breadcrumb: 'Nouvel équipement' },
              },
              { path: 'equipment/:id', element: <EquipmentDetailPage />, handle: { breadcrumb: 'Détail' } },
            ],
          },
          {
            element: <RequireModule moduleKey="employees" />,
            children: [
              { path: 'employees', element: <EmployeesListPage />, handle: { breadcrumb: 'Employés' } },
              { path: 'employees/new', element: <EmployeeCreatePage />, handle: { breadcrumb: 'Nouvel employé' } },
              { path: 'employees/:id', element: <EmployeeDetailPage />, handle: { breadcrumb: 'Détail' } },
            ],
          },
          {
            element: <RequireModule moduleKey="routes" />,
            children: [
              { path: 'routes', element: <RoutesListPage />, handle: { breadcrumb: 'Routes' } },
              { path: 'routes/new', element: <RouteCreatePage />, handle: { breadcrumb: 'Nouvelle route' } },
              { path: 'routes/:id', element: <RouteDetailPage />, handle: { breadcrumb: 'Détail' } },
            ],
          },
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
