import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import logo from '@/assets/logo.jpg'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-reca-snow px-4 text-center">
      <img src={logo} alt="Groupe RECA" className="h-24 w-auto object-contain" />
      <h1 className="text-h1 font-semibold text-reca-black">Groupe RECA</h1>
      <p className="max-w-md text-body text-reca-gray-medium">
        Le centre des opérations qui accompagne Groupe RECA du premier flocon à la facturation.
      </p>
      <Link to="/login">
        <Button variant="primary">Accéder au centre des opérations</Button>
      </Link>
    </div>
  )
}
