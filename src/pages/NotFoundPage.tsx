import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-reca-snow px-4 text-center">
      <h1 className="text-h1 font-semibold text-reca-black">404</h1>
      <p className="text-body text-reca-gray-medium">Cette page n'existe pas.</p>
      <Link to="/">
        <Button variant="secondary">Retour à l'accueil</Button>
      </Link>
    </div>
  )
}
