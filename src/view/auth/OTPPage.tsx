import { useState } from 'react'
import type { AuthPage } from '@/lib/types'

interface Props { navigate: (page: AuthPage) => void }

export default function OTPPage({ navigate }: Props) {
  const [codes, setCodes] = useState(['', '', '', '', '', ''])

  function handleChange(i: number, v: string) {
    if (v.length > 1) return
    const next = [...codes]
    next[i] = v
    setCodes(next)
    if (v && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`)
      el?.focus()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP Code</h2>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-xs">
        We sent a 6-digit code to your email. Enter it below.
      </p>

      <div className="flex gap-3 mb-8">
        {codes.map((c, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={c}
            onChange={e => handleChange(i, e.target.value)}
            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
          />
        ))}
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => navigate('reset-password')}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          Verify
        </button>
        <p className="text-center text-sm text-gray-500">
          Didn't receive a code?{' '}
          <button className="text-teal-600 font-medium hover:underline">Resend</button>
        </p>
      </div>
    </div>
  )
}
