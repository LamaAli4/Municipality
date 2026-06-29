import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ZodError, z } from 'zod'
import { toast } from 'react-toastify'

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}
import Logo from '@/assets/logo.png'
import type { AuthPage } from '@/lib/types'
import { useResetPassword } from '@/services/authService'

interface Props { navigate: (page: AuthPage) => void }

const resetSchema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).superRefine((data, ctx) => {
  if (!/[A-Z]/.test(data.new_password)) {
    ctx.addIssue({ code: 'custom', message: 'Password must contain at least one uppercase letter', path: ['new_password'] })
  }
  if (!/[0-9]/.test(data.new_password)) {
    ctx.addIssue({ code: 'custom', message: 'Password must contain at least one number', path: ['new_password'] })
  }
  if (!/[^A-Za-z0-9]/.test(data.new_password)) {
    ctx.addIssue({ code: 'custom', message: 'Password must contain at least one special character (e.g. @#$)', path: ['new_password'] })
  }
  if (data.new_password !== data.confirmPassword) {
    ctx.addIssue({ code: 'custom', message: "Passwords don't match", path: ['confirmPassword'] })
  }
})

export default function ResetPasswordPage({ navigate }: Props) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [done, setDone] = useState(false)

  const location = useLocation()
  const { reset_token } = (location.state ?? {}) as { reset_token?: string }

  const resetPassword = useResetPassword()

  useEffect(() => {
    if (!reset_token) navigate('forgot-password')
  }, [reset_token, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      resetSchema.parse({ new_password: newPassword, confirmPassword })
    } catch (err) {
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
        return
      }
    }
    resetPassword.mutate({ reset_token: reset_token!, new_password: newPassword }, {
      onSuccess: () => setDone(true),
    })
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Password Reset!</h2>
          <p className="text-sm text-gray-500 mb-6">Your password has been changed successfully. You can now sign in.</p>
          <button
            onClick={() => navigate('signin')}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            Sign In
          </button>
        </div>
      </div>
    )
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
          <h2 className="text-xl font-bold text-gray-800 mb-1">Reset Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter and confirm your new password.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
            <PasswordField label="New Password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)} show={show1}
              toggle={() => setShow1(v => !v)} placeholder="Min. 8 chars — include A-Z, 0-9, @#$"
            />
          </motion.div>
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
            <PasswordField label="Confirm New Password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} show={show2}
              toggle={() => setShow2(v => !v)} placeholder="Repeat your password"
            />
          </motion.div>

          <motion.button
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={resetPassword.isPending}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
          </motion.button>

          <motion.p custom={5} initial="hidden" animate="visible" variants={fadeUp} className="text-center text-sm text-gray-500">
            <button type="button" onClick={() => navigate('signin')} className="text-teal-600 font-medium hover:underline">
              ← Back to Sign In
            </button>
          </motion.p>
        </form>
      </div>
    </div>
  )
}

function PasswordField({ label, value, onChange, show, toggle, placeholder }: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  show: boolean
  toggle: () => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOffSvg /> : <EyeSvg />}
        </button>
      </div>
    </div>
  )
}

function EyeSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}
