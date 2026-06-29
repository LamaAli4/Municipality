import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Role } from '@/lib/types'
import type { AuthPage } from '@/lib/types'
import Logo from '@/assets/logo.png'
import { useSignIn } from '@/services/authService'
import { signInSchema } from '@/schemas/authSchema'
import { toast } from 'react-toastify'
import { ZodError } from 'zod'

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' as const },
  }),
}

interface Props {
  navigate: (page: AuthPage) => void
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'citizen',  label: 'Citizen'      },
  { value: 'admin',    label: 'System Admin' },
  // { value: 'department_manager', label: 'Department Manager' },
  { value: 'employee', label: 'Employee'     },
]

function RoleSelect({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const label = ROLE_OPTIONS.find(o => o.value === value)?.label ?? ''

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <span>{label}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {ROLE_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  opt.value === value
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-teal-50'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function SignInPage({ navigate }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role>('citizen')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const signIn = useSignIn()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validatedData = signInSchema.parse({ identifier, password, role: selectedRole })

      // Additional validation for citizen: must be exactly 9 digits
      if (selectedRole === 'citizen' && !/^\d{9}$/.test(identifier)) {
        toast.error('National ID must be exactly 9 digits')
        return
      }

      await signIn.mutateAsync(validatedData)
      // Auth is handled by authStore automatically
    } catch (err) {
      if (err instanceof ZodError) {
        const identifierIssue = err.issues.find(i => i.path[0] === 'identifier')
        toast.error((identifierIssue ?? err.issues[0]).message)
      } else if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  const getIdentifierLabel = () => {
    switch (selectedRole) {
      case 'citizen':
        return 'National ID'
      case 'admin':
      case 'department_manager':
      case 'employee':
        return 'Employee ID'
      default:
        return 'National ID / Employee ID'
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">

      <motion.div
        custom={0} initial="hidden" animate="visible" variants={fadeUp}
        className="flex flex-col items-center"
      >
        <motion.img
          src={Logo} alt=""
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className=""
        />
        <h1 className="mt-3 text-2xl font-bold">
          <span className="text-teal-600">Thecnho </span>
          <span className="text-gray-900">Amar</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm space-y-4">
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          <label className="text-sm text-gray-600 mb-1 block">User Type</label>
          <RoleSelect value={selectedRole} onChange={setSelectedRole} />
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <label className="text-sm text-gray-600">{getIdentifierLabel()}</label>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10 transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <EyeSvg />
            </button>
          </div>
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="text-right">
          <button type="button" onClick={() => navigate('forgot-password')} className="text-sm text-gray-500 hover:text-teal-600 underline font-medium transition">
            Forget password?
          </button>
        </motion.div>

        <motion.button
          custom={5} initial="hidden" animate="visible" variants={fadeUp}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={signIn.isPending}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-50 transition"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          {signIn.isPending ? 'Signing in...' : 'Sign in'}
        </motion.button>

        <motion.p custom={6} initial="hidden" animate="visible" variants={fadeUp} className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('create-account')} className="text-teal-600 font-medium hover:underline">
            Create an account
          </button>
        </motion.p>
      </form>
    </div>
  )
}


function EyeSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
