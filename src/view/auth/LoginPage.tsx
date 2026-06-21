import type { NavigateFn } from '@/lib/types'
import { Input } from '@/components/ui/Input'

export default function LoginPage({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d3a47' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Sign in to your account</p>

        <div className="space-y-4">
          <Input label="Email" type="email" placeholder="admin@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
        </div>

        <button
          onClick={() => navigate('dashboard')}
          className="btn-confirm w-full text-white font-semibold py-3 rounded-xl mt-6 hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
