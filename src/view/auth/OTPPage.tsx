import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
        routerNav('/reset-password', { state: { reset_token: data.reset_token, identifier }, replace: true })
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

      <div className="mt-10 w-full max-w-sm text-center">
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}
          className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Enter OTP Code</h2>
          <p className="text-sm text-gray-500 mb-8">
            We sent a 4-digit code to your registered phone or email.
            {identifier && (
              <span className="block font-medium text-gray-700 mt-0.5">{identifier}</span>
            )}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex justify-center gap-3 mb-8" onPaste={handlePaste}
          >
            {digits.map((d, i) => (
              <motion.input
                key={i}
                ref={refs[i]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
                type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors"
                style={{ borderColor: d ? '#0d9488' : '#d1d5db' }}
              />
            ))}
          </motion.div>

          <motion.button
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={verifyOtp.isPending || code.length < 4}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {verifyOtp.isPending ? 'Verifying...' : 'Verify OTP'}
          </motion.button>
        </form>

        <motion.p custom={5} initial="hidden" animate="visible" variants={fadeUp} className="mt-4 text-sm text-gray-500">
          Didn't receive a code?{' '}
          <button type="button" onClick={handleResend} disabled={forgotPassword.isPending}
            className="text-teal-600 font-medium hover:underline disabled:opacity-50"
          >
            {forgotPassword.isPending ? 'Resending...' : 'Resend'}
          </button>
        </motion.p>

        <motion.button custom={6} initial="hidden" animate="visible" variants={fadeUp}
          type="button" onClick={() => navigate('forgot-password')}
          className="mt-3 text-sm text-gray-400 hover:text-gray-600"
        >
          ← Change identifier
        </motion.button>
      </div>
    </div>
  )
}
