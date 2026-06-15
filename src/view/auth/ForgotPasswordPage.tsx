import type { AuthPage } from '../../lib/types'

interface Props { navigate: (page: AuthPage) => void }

export default function ForgotPasswordPage({ navigate }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-xs">
        Enter your email address and we'll send you a code to reset your password.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={() => navigate('otp')}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          Send code
        </button>
        <p className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <button onClick={() => navigate('signin')} className="text-teal-600 font-medium hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  )
}
