import { motion } from 'motion/react'
import { LoginForm } from '../components/LoginForm'
import logo from '@/assets/logo.jpg'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-reca-snow px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-[420px] rounded-card border border-reca-gray-light bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="Groupe RECA" className="mb-4 h-16 w-auto object-contain" />
          <p className="text-label font-medium uppercase tracking-wide text-reca-gray-medium">
            Centre des opérations
          </p>
          <h1 className="text-section font-semibold text-reca-black">Connexion</h1>
        </div>

        <LoginForm />
      </motion.div>
    </div>
  )
}
