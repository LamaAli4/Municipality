import { useState, useEffect } from 'react'
import { useMyProfile, useUpdateProfile, useUpdatePassword } from '../../services/profileService'
import { useSection } from '../../services/sectionsService'
import PageWrapper from '../../components/ui/PageWrapper'
import { LogoutIcon, EditIcon, ChevronDownIcon } from '../../lib/icons'

interface Props { onLogout: () => void }

export default function EmployeeAccountPage({ onLogout }: Props) {
  const { data: profile, isLoading } = useMyProfile()
  const { data: section } = useSection(profile?.section_id ?? null)
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile()
  const { mutate: updatePassword, isPending: savingPw } = useUpdatePassword()

  const [form, setForm] = useState({ full_name: '', phone: '', email: '' })
  const [pwOpen, setPwOpen] = useState(false)
  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name ?? '',
      phone:     profile.phone    ?? '',
      email:     profile.email    ?? '',
    })
  }, [profile])

  function handleSave() {
    updateProfile({ full_name: form.full_name, phone: form.phone })
  }

  function handlePassword() {
    if (pw.next !== pw.confirm) { setPwError('Passwords do not match'); return }
    if (pw.next.length < 6)     { setPwError('Minimum 6 characters');   return }
    setPwError('')
    updatePassword(pw.next, { onSuccess: () => { setPw({ next: '', confirm: '' }); setPwOpen(false) } })
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
  )

  return (
    <PageWrapper>
      <div className="p-4 md:p-6 max-w-2xl">
        {/* Title + Save button */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-800">Profile</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Avatar + name */}
          <div className="flex flex-col items-center pt-7 pb-5 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#93c5fd"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#bfdbfe"/>
                <rect x="9" y="11" width="6" height="3" rx="1" fill="#ef4444"/>
              </svg>
            </div>
            <p className="font-semibold text-gray-800 text-base">{profile?.full_name}</p>
          </div>

          {/* Fields */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <Field label="Full Name">
              <input
                value={form.full_name}
                onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </Field>

            {/* Phone */}
            <Field label="Phone Number">
              <div className="relative">
                <input
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><EditIcon /></span>
              </div>
            </Field>

            {/* Email */}
            <Field label="Email">
              <div className="relative">
                <input
                  value={form.email}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-9 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><EditIcon /></span>
              </div>
            </Field>

            {/* Job Number - read only */}
            <Field label="Job Number">
              <input
                readOnly
                value={profile?.employee_id ?? '—'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
              />
            </Field>

            {/* Section - read only */}
            <Field label="Section">
              <input
                readOnly
                value={section?.name ?? '—'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
              />
            </Field>
          </div>

          {/* Change password accordion */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setPwOpen(p => !p)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-teal-700 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93a10 10 0 0 1 14.14 14.14"/>
                </svg>
                Change Password
              </span>
              <span className={`transition-transform ${pwOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
            </button>

            {pwOpen && (
              <div className="px-5 pb-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">New password</label>
                  <input
                    type="password"
                    value={pw.next}
                    onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Confirm password</label>
                  <input
                    type="password"
                    value={pw.confirm}
                    onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {pwError && <p className="text-xs text-red-500">{pwError}</p>}
                <button
                  onClick={handlePassword}
                  disabled={savingPw || !pw.next || !pw.confirm}
                  className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
                >
                  {savingPw ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon />
              Log out
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
      {children}
    </div>
  )
}
