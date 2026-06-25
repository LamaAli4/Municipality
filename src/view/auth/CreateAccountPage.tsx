import { useState, useRef } from 'react'
import { ZodError } from 'zod'
import { toast } from 'react-toastify'
import Logo from '@/assets/logo.png'
import { AuthPage } from '@/lib/types'
import { signUpSchema } from '@/schemas/authSchema'
import { useSignUp, SignUpPayload } from '@/services/authService'
import axiosInstance from '@/lib/axios'

interface Props { navigate: (page: AuthPage) => void }

interface FileDoc {
  file_name: string
  file_type: string
  file_url: string
  file_id: string
}

interface ImageKitAuth {
  publicKey: string
  token: string
  expire: number
  signature: string
}

const CITIES = [
  { value: 'GAZA',   label: 'Gaza' },
  { value: 'MIDDLE', label: 'Middle' },
  { value: 'KHAN',   label: 'Khan Younis' },
  { value: 'RAFAH',  label: 'Rafah' },
  { value: 'NORTH',  label: 'North' },
]

async function fetchImageKitAuth(): Promise<ImageKitAuth> {
  const res = await axiosInstance.get('/auth/imagekit/upload-auth')
  return res.data.data
}

async function uploadToImageKit(file: File, auth: ImageKitAuth): Promise<FileDoc> {
  const form = new FormData()
  form.append('file', file)
  form.append('fileName', file.name)
  form.append('publicKey', auth.publicKey)
  form.append('signature', auth.signature)
  form.append('expire', String(auth.expire))
  form.append('token', auth.token)
  form.append('folder', '/citizens')

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).message || 'File upload failed')
  }
  const data = await res.json() as { url: string; fileId: string }
  return { file_name: file.name, file_type: file.type, file_url: data.url, file_id: data.fileId }
}

export default function CreateAccountPage({ navigate }: Props) {
  const [fields, setFields] = useState({
    full_name: '',
    email: '',
    national_id: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  })
  const [idDoc, setIdDoc] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitStep, setSubmitStep] = useState<'idle' | 'uploading' | 'submitting'>('idle')
  const [done, setDone] = useState(false)

  const signUp = useSignUp()

  const set = (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      signUpSchema.parse(fields)
    } catch (err) {
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
        return
      }
    }

    if (!idDoc) { toast.error('Please upload your national ID document (PDF)'); return }
    if (!selfie) { toast.error('Please upload a selfie holding your ID'); return }

    setSubmitStep('uploading')
    let idDocument: FileDoc
    let idSelfie: FileDoc
    try {
      // Fetch separate auth tokens — ImageKit tokens are single-use
      const [auth1, auth2] = await Promise.all([fetchImageKitAuth(), fetchImageKitAuth()])
      ;[idDocument, idSelfie] = await Promise.all([
        uploadToImageKit(idDoc, auth1),
        uploadToImageKit(selfie, auth2),
      ])
    } catch (err: any) {
      toast.error(err?.message || 'File upload failed. Please try again.')
      setSubmitStep('idle')
      return
    }

    setSubmitStep('submitting')
    const { confirmPassword: _c, ...rest } = fields
    const payload: SignUpPayload = {
      ...rest,
      verification_documents: { id_document: idDocument!, id_selfie: idSelfie! },
    }
    signUp.mutate(payload, {
      onSuccess: () => setDone(true),
      onSettled: () => setSubmitStep('idle'),
    })
  }

  const isLoading = submitStep !== 'idle'
  const btnLabel =
    submitStep === 'uploading' ? 'Uploading files...' :
    submitStep === 'submitting' ? 'Creating account...' :
    'Create Account'

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your account is pending admin verification. You will be notified once approved.
          </p>
          <button
            onClick={() => navigate('signin')}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center bg-white px-8 py-10">
      <img src={Logo} alt="" />
      <h1 className="mt-3 text-2xl font-bold">
        <span className="text-teal-600">Thecnho </span>
        <span className="text-gray-900">Amar</span>
      </h1>
      <p className="mt-1 text-sm text-gray-500 font-medium">Create a Citizen Account</p>

      <div className="mt-8 w-full max-w-3xl">
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">

          <Field label="Full Name" value={fields.full_name} onChange={set('full_name')} placeholder="Ahmed Al-Masri" />
          <Field label="National ID" value={fields.national_id} onChange={set('national_id')} placeholder="9-digit national ID" maxLength={9} />

          <Field label="Email" type="email" value={fields.email} onChange={set('email')} placeholder="you@example.com" />
          <Field label="Phone Number" type="tel" value={fields.phone} onChange={set('phone')} placeholder="+970591234567" />

          <PasswordField
            label="Password"
            value={fields.password}
            onChange={set('password')}
            show={showPass}
            onToggle={() => setShowPass(v => !v)}
            placeholder="Min. 8 chars — include A-Z, 0-9, @#$"
          />
          <PasswordField
            label="Confirm Password"
            value={fields.confirmPassword}
            onChange={set('confirmPassword')}
            show={showConfirm}
            onToggle={() => setShowConfirm(v => !v)}
            placeholder="Repeat your password"
          />

          <Field label="Address" value={fields.address} onChange={set('address')} placeholder="Al-Rimal, Gaza City" />
          <div>
            <label className="text-sm text-gray-500 block mb-1">City</label>
            <select
              value={fields.city}
              onChange={set('city')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="">Select a city</option>
              {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <UploadBox
            label="National ID Document"
            hint="PDF file only"
            accept=".pdf,application/pdf"
            file={idDoc}
            onFile={setIdDoc}
          />
          <UploadBox
            label="Selfie Holding Your ID"
            hint="JPEG or PNG image"
            accept="image/*"
            file={selfie}
            onFile={setSelfie}
          />
        </div>

        <div className="flex justify-between items-center mt-8">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('signin')}
              className="text-teal-600 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="px-16 py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </form>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label, type = 'text', value, onChange, placeholder, maxLength,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  maxLength?: number
}) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  )
}

function PasswordField({
  label, value, onChange, show, onToggle, placeholder,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  show: boolean
  onToggle: () => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOffSvg /> : <EyeSvg />}
        </button>
      </div>
    </div>
  )
}

function UploadBox({
  label, hint, accept, file, onFile,
}: {
  label: string
  hint: string
  accept: string
  file: File | null
  onFile: (f: File) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-0.5">{label}</label>
      <p className="text-xs text-gray-400 mb-1.5">{hint}</p>
      <div
        role="button"
        tabIndex={0}
        onClick={() => ref.current?.click()}
        onKeyDown={e => e.key === 'Enter' && ref.current?.click()}
        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer h-28 transition-colors ${
          file ? 'border-teal-400 bg-teal-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'
        }`}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }}
        />
        {file ? (
          <div className="text-center px-3">
            <svg className="mx-auto mb-1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-xs text-teal-700 font-medium max-w-[160px] truncate">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">Click to change</p>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto mb-1.5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
            </svg>
            <p className="text-xs text-gray-400">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  )
}

function EyeSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}
