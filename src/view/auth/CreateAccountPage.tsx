import { useState } from 'react'
import { AuthPage } from '@/lib/types'
import Logo from '@/assets/logo.png'
import { useSignUp } from '@/services/authService'
import { signUpSchema } from '@/schemas/authSchema'

interface Props { navigate: (page: AuthPage) => void }

export default function CreateAccountPage({ navigate }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    idNumber: '',
    phone: '',
    governorate: '',
  })
  const [error, setError] = useState('')

  const signUp = useSignUp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const validatedData = signUpSchema.parse(formData)
      await signUp.mutateAsync(validatedData)
      setShowConfirm(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  if (showConfirm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-sm text-gray-500 mb-6">Your account has been created successfully. Please sign in to continue.</p>
          <button
            onClick={() => navigate('signin')}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center justify-start bg-white px-8 py-10">
      {/* Logo + brand */}
      <img src={Logo} alt="" />
      <h1 className="mt-3 text-2xl font-bold">
        <span className="text-teal-600">Thecnho </span>
        <span className="text-gray-900">Amar</span>
      </h1>

      {/* Form */}
      <div className="mt-10 w-full max-w-3xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {/* Left column */}
          <Field label="Username" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Field label="Governorate" value={formData.governorate} onChange={(e) => setFormData({...formData, governorate: e.target.value})} />

          <Field label="ID Number" value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} />
          <Field label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <Field label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <Field label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />

          {/* Upload — spans remaining rows on the right */}
          <div className="row-span-2">
            <label className="text-sm text-gray-500 leading-tight block mb-1">
              Upload a selfie holding ID and another<br />photo of your ID card
            </label>
            <div className="border border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors" style={{ height: '138px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
              </svg>
            </div>
          </div>

          <Field label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>

        {/* Next button — right-aligned to match design */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={signUp.isPending}
            className="px-24 py-3 rounded-lg text-white text-base font-semibold disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {signUp.isPending ? 'Creating...' : 'Next'}
          </button>
        </div>
      </div>
    </form>
  )
}

function Field({ label, type = 'text', value, onChange }: { label: string; type?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  )
}
