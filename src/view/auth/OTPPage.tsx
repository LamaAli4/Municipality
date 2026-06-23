import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Logo from '@/assets/logo.png'
import type { AuthPage } from '@/lib/types'
import { useVerifyOtp, useForgotPassword } from '@/services/authService'

interface Props { navigate: (page: AuthPage) => void }

export default function OTPPage({ navigate }: Props) {
  const [digits, setDigits] = useState(['', '', '', ''])

  // Four individual refs (hooks must not be in loops)
  const r0 = useRef<HTMLInputElement>(null)
  const r1 = useRef<HTMLInputElement>(null)
  const r2 = useRef<HTMLInputElement>(null)
  const r3 = useRef<HTMLInputElement>(null)
  const refs = [r0, r1, r2, r3]

  const routerNav = useNavigate()
  const location = useLocation()
  const { identifier } = (location.state ?? {}) as { identifier?: string }

  const verifyOtp = useVerifyOtp()
  const forgotPassword = useForgotPassword()

  useEffect(() => {
    if (!identifier) navigate('forgot-password')
  }, [identifier, navigate])

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = digit
    setDigits(next)
    if (digit && i < 3) refs[i + 1].current?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pasted) return
    const next = ['', '', '', '']
    pasted.split('').forEach((d, i) => { if (i < 4) next[i] = d })
    setDigits(next)
    refs[Math.min(pasted.length, 3)].current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 4) {
      toast.error('Please enter the complete 4-digit OTP')
      return
    }
    verifyOtp.mutate({ identifier: identifier!, code }, {
      onSuccess: (data) => {
        toast.success('OTP verified!')
        routerNav('/reset-password', { state: { reset_token: data.reset_token, identifier } })
      },
    })
  }

  const handleResend = () => {
    if (!identifier) return
    forgotPassword.mutate({ identifier }, {
      onSuccess: () => {
        toast.success('New OTP sent!')
        setDigits(['', '', '', ''])
        refs[0].current?.focus()
      },
    })
  }

  const code = digits.join('')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <img src={Logo} alt="" />
      <h1 className="mt-3 text-2xl font-bold">
        <span className="text-teal-600">Thecnho </span>
        <span className="text-gray-900">Amar</span>
      </h1>

      <div className="mt-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">Enter OTP Code</h2>
        <p className="text-sm text-gray-500 mb-8">
          We sent a 4-digit code to your registered phone or email.
          {identifier && (
            <span className="block font-medium text-gray-700 mt-0.5">{identifier}</span>
          )}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors"
                style={{ borderColor: d ? '#0d9488' : '#d1d5db' }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifyOtp.isPending || code.length < 4}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {verifyOtp.isPending ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          Didn't receive a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={forgotPassword.isPending}
            className="text-teal-600 font-medium hover:underline disabled:opacity-50"
          >
            {forgotPassword.isPending ? 'Resending...' : 'Resend'}
          </button>
        </p>

        <button
          type="button"
          onClick={() => navigate('forgot-password')}
          className="mt-3 text-sm text-gray-400 hover:text-gray-600"
        >
          ← Change identifier
        </button>
      </div>
    </div>
  )
}
