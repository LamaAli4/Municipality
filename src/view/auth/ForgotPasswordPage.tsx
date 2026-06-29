import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Logo from '@/assets/logo.png'
import type { AuthPage } from '@/lib/types'
import { useForgotPassword } from '@/services/authService'

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' as const },
  }),
}

interface Props { navigate: (page: AuthPage) => void }

export default function ForgotPasswordPage({ navigate }: Props) {
  const [identifier, setIdentifier] = useState('')
  const routerNav = useNavigate()
  const forgotPassword = useForgotPassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) {
      toast.error('Please enter your National ID, phone number, or Employee ID')
      return
    }
    forgotPassword.mutate({ identifier }, {
      onSuccess: () => {
        toast.success('OTP sent! Check your registered phone or email.')
        routerNav('/otp', { state: { identifier } })
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col items-center">
        <motion.img src={Logo} alt=""
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }} className=""
        />
        <h1 className="mt-3 text-2xl font-bold">
          <span className="text-teal-600">Thecnho </span>
          <span className="text-gray-900">Amar</span>
        </h1>
      </motion.div>

      <div className="mt-10 w-full max-w-sm">
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your National ID, phone number, or Employee ID and we'll send you a one-time code.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
            <label className="text-sm text-gray-600 block mb-1">National ID / Phone / Employee ID</label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="e.g. 123456789"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </motion.div>

          <motion.button
            custom={3} initial="hidden" animate="visible" variants={fadeUp}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={forgotPassword.isPending}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {forgotPassword.isPending ? 'Sending...' : 'Send OTP'}
          </motion.button>

          <motion.p custom={4} initial="hidden" animate="visible" variants={fadeUp} className="text-center text-sm text-gray-500">
            Remember your password?{' '}
            <button type="button" onClick={() => navigate('signin')} className="text-teal-600 font-medium hover:underline">
              Sign in
            </button>
          </motion.p>
        </form>
      </div>
    </div>
  )
}
