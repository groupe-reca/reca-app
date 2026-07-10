import { createBrowserRouter } from 'react-router'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { OperationsCenterPage } from '@/pages/OperationsCenterPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LeadDetailPage } from '@/features/leads/pages/LeadDetailPage'
import { LeadsListPage } from '@/features/leads/pages/LeadsListPage'
import { QuoteDetailPage } from '@/features/quotes/pages/QuoteDetailPage'
import { QuotesListPage } from '@/features/quotes/pages/QuotesListPage'

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
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
