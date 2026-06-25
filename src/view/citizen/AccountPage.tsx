import { useState, useEffect } from 'react'
import { useMyProfile, useUpdateProfile, useUpdatePassword } from '../../services/profileService'

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function CitizenAccountPage() {
  const { data: profile, isLoading } = useMyProfile()
  const updateProfile = useUpdateProfile()
  const updatePassword = useUpdatePassword()

  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '' })
  const [showPwSection, setShowPwSection] = useState(false)
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name,
        phone: profile.phone ?? '',
        address: profile.address ?? '',
        city: profile.city ?? '',
      })
    }
  }, [profile])

  function handleSave() {
    updateProfile.mutate(form)
  }

  function handleUpdatePassword() {
    if (!pwForm.newPassword) return
    if (pwForm.newPassword !== pwForm.confirmPassword) return
    updatePassword.mutate(pwForm.newPassword, {
      onSuccess: () => {
        setPwForm({ newPassword: '', confirmPassword: '' })
        setShowPwSection(false)
      },
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading profile...</div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Account</h1>
        <p className="text-sm text-gray-500">Manage your profile and settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold">
            {profile ? initials(profile.full_name) : '…'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{profile?.full_name ?? '—'}</p>
            <p className="text-sm text-gray-500">{profile?.email ?? '—'}</p>
          </div>
        </div>

        <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Full name" value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} />
          </div>
          <div className="col-span-2">
            <Field label="Email" value={profile?.email ?? ''} readOnly />
          </div>
          <div className="col-span-2">
            <Field label="National ID" value={profile?.national_id ?? ''} readOnly />
          </div>
          <Field label="Phone number" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
          <Field label="City" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
          <div className="col-span-2">
            <Field label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="mt-6 px-6 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => setShowPwSection(v => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Change Password
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: showPwSection ? 'rotate(180deg)' : '' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {showPwSection && (
          <div className="px-6 pb-6 space-y-3 border-t border-gray-100">
            <Field label="New password" type="password" value={pwForm.newPassword}
              onChange={v => setPwForm(f => ({ ...f, newPassword: v }))} />
            <Field label="Confirm new password" type="password" value={pwForm.confirmPassword}
              onChange={v => setPwForm(f => ({ ...f, confirmPassword: v }))} />
            <button
              onClick={handleUpdatePassword}
              disabled={updatePassword.isPending}
              className="mt-2 px-6 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
            >
              {updatePassword.isPending ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, type = 'text', readOnly = false, onChange }: {
  label: string; value: string; type?: string; readOnly?: boolean; onChange?: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
      />
    </div>
  )
}
