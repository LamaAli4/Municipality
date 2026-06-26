import { useState, useRef, useEffect } from 'react'
import type { Role } from '@/lib/types'
import type { AuthPage } from '@/lib/types'
import Logo from '@/assets/logo.png'
import { useSignIn } from '@/services/authService'
import { signInSchema } from '@/schemas/authSchema'
import { toast } from 'react-toastify'
import { ZodError } from 'zod'

interface Props {
  navigate: (page: AuthPage) => void
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'citizen',            label: 'Citizen'            },
  { value: 'admin',              label: 'System Admin'       },
  { value: 'department_manager', label: 'Department Manager' },
  { value: 'employee',           label: 'Employee'           },
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
        toast.error(err.issues[0].message)
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
      <img src={Logo} alt="" />
      <h1 className="mt-4 text-2xl font-bold">
        <span className="text-teal-600">Thecnho </span>
        <span className="text-gray-900">Amar</span>
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">User Type</label>
          <RoleSelect value={selectedRole} onChange={setSelectedRole} />
        </div>
        <div>
          <label className="text-sm text-gray-600">{getIdentifierLabel()}</label>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <EyeSvg />
            </button>
          </div>
        </div>
        <div className="text-right">
          <button type="button" onClick={() => navigate('forgot-password')} className="text-sm text-gray-500 hover:text-teal-600 underline font-medium">
            Forget password?
          </button>
        </div>
        <button
          type="submit"
          disabled={signIn.isPending}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          {signIn.isPending ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('create-account')} className="text-teal-600 font-medium hover:underline">
            Create an account
          </button>
        </p>
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
