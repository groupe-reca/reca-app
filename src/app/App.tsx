import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui/Toaster'
import { useTheme } from '@/hooks/useTheme'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/routes/router'

/** Applique la préférence de thème (`useTheme`) à `<html>` dès qu'une session est connue. */
function ThemeSync() {
  useTheme()
  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
