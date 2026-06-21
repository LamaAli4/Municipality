import { useState } from 'react'
import type { AuthPage } from '@/lib/types'
import Logo from '@/assets/logo.png'

interface Props { navigate: (page: AuthPage) => void }

export default function ResetPasswordPage({ navigate }: Props) {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <img src={Logo} alt="" />
      <h2 className="text-2xl font-bold mt-3 mb-1">
        <span className="text-teal-600">Thecnho </span>
        <span className="text-gray-900">Amar</span>
      </h2>

      <div className="mt-10 w-full max-w-sm space-y-4">
        <PasswordField label="Enter your new Password" show={show1} toggle={() => setShow1(v => !v)} />
        <PasswordField label="Rewrite your new Password" show={show2} toggle={() => setShow2(v => !v)} />

        <div className="text-right">
          <button onClick={() => navigate('signin')} className="text-sm font-bold text-gray-700 hover:text-teal-600 underline">
            Back to login
          </button>
        </div>

        <button
          onClick={() => navigate('signin')}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          Reset password
        </button>

        <p className="text-center text-sm text-gray-500">
          Dont have an account?{' '}
          <button onClick={() => navigate('create-account')} className="text-teal-600 font-medium hover:underline">
            create an account
          </button>
        </p>
      </div>
    </div>
  )
}

function PasswordField({ label, show, toggle }: { label: string; show: boolean; toggle: () => void }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
        />
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
