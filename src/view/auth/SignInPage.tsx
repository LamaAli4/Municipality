import { useState } from 'react'
import type { Role } from '../../lib/types'
import type { AuthPage } from '../../lib/types'
import Logo from '../../assets/logo.png'

interface Props {
  onLogin: (role: Role) => void
  navigate: (page: AuthPage) => void
}

export default function SignInPage({ onLogin, navigate }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <img src={Logo} alt="" />
      <h1 className="mt-4 text-2xl font-bold">
        <span className="text-teal-600">Thecnho </span>
        <span className="text-gray-900">Amar</span>
      </h1>

      <div className="mt-10 w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          <button onClick={() => navigate('forgot-password')} className="text-sm text-gray-500 hover:text-teal-600 underline font-medium">
            Forget password?
          </button>
        </div>
        <button
          onClick={() => onLogin('citizen')}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          Sign in
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button onClick={() => navigate('create-account')} className="text-teal-600 font-medium hover:underline">
            Create an account
          </button>
        </p>
      </div>

      {/* Demo role buttons */}
      <div className="mt-12 w-full max-w-sm">
        <p className="text-xs text-center text-gray-400 mb-3">— Demo: choose portal —</p>
        <div className="grid grid-cols-2 gap-2">
          {(['admin', 'citizen', 'manager', 'employee'] as Role[]).map(role => (
            <button
              key={role}
              onClick={() => onLogin(role)}
              className="py-2 px-3 rounded-lg border border-teal-200 text-teal-700 text-xs font-medium hover:bg-teal-50 capitalize"
            >
              {role === 'manager' ? 'Dept. Manager' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>
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
