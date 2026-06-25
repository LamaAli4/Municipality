import { useState, useEffect } from 'react'
import { PasswordIcon, LogoutIcon, ChevronDownIcon, EditIcon, SaveIcon } from '../lib/icons'
import SectionHeader from '../components/ui/SectionHeader'
import { Input } from '../components/ui/Input'
import { PrimaryBtn } from '../components/ui/Button'
import { useMyProfile, useUpdateProfile, useUpdatePassword } from '../services/profileService'
import { useNavigate } from 'react-router-dom'

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function formatRole(role: string) {
  if (role === 'ADMIN')              return 'Admin'
  if (role === 'DEPARTMENT_MANAGER') return 'Dept. Manager'
  if (role === 'EMPLOYEE')           return 'Employee'
  if (role === 'CITIZEN')            return 'Citizen'
  return role
}

export default function AccountPage() {
  const { data: profile, isLoading } = useMyProfile()
  const updateProfile  = useUpdateProfile()
  const updatePassword = useUpdatePassword()
  const navigate       = useNavigate()

  const [fullName,    setFullName]    = useState('')
  const [phone,       setPhone]       = useState('')
  const [showPwd,     setShowPwd]     = useState(false)
  const [currentPwd,  setCurrentPwd]  = useState('')
  const [newPwd,      setNewPwd]      = useState('')
  const [confirmPwd,  setConfirmPwd]  = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
    }
  }, [profile])

  function handleSave() {
    updateProfile.mutate({
      full_name: fullName || undefined,
      phone:     phone    || undefined,
    })
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  async function handleChangePassword() {
    if (!newPwd || newPwd !== confirmPwd) return
    await updatePassword.mutateAsync(newPwd)
    setCurrentPwd('')
    setNewPwd('')
    setConfirmPwd('')
    setShowPwd(false)
  }

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading…</div>

  return (
    <div>
      <SectionHeader
        title="Profile"
        action={
          <PrimaryBtn
            label={updateProfile.isPending ? 'Saving…' : 'Save changes'}
            icon={<SaveIcon />}
            onClick={handleSave}
          />
        }
      />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#dbeafe" />
              <ellipse cx="50" cy="38" rx="18" ry="18" fill="#93c5fd" />
              <ellipse cx="50" cy="80" rx="28" ry="20" fill="#3b82f6" />
              <rect x="44" y="48" width="12" height="8" fill="#dc2626" rx="2" />
            </svg>
          </div>
          <p className="font-bold text-gray-800 text-lg">{profile?.full_name ?? '—'}</p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input label="Full Name"    value={fullName} onChange={e => setFullName(e.target.value)} icon={<EditIcon />} />
          <Input label="The role"     value={formatRole(profile?.role ?? '')}     readOnly />
          <Input label="Phone Number" value={phone}    onChange={e => setPhone(e.target.value)}    icon={<EditIcon />} />
          <Input label="Email"        value={profile?.email ?? '—'}               readOnly />
          <Input label="Joining date" value={formatDate(profile?.created_at)}     readOnly />
          <Input label="Last login"   value={formatDate(profile?.last_login_at)}  readOnly />
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Change Password */}
          <button
            onClick={() => setShowPwd(v => !v)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            <div className="flex items-center gap-2">
              <PasswordIcon /> Change Password
            </div>
            <ChevronDownIcon />
          </button>

          {showPwd && (
            <div className="space-y-3 pl-7">
              <Input label="Current password"      type="password" placeholder="••••••••" value={currentPwd}  onChange={e => setCurrentPwd(e.target.value)} />
              <Input label="New password"          type="password" placeholder="••••••••" value={newPwd}       onChange={e => setNewPwd(e.target.value)} />
              <Input label="Confirm new password"  type="password" placeholder="••••••••" value={confirmPwd}  onChange={e => setConfirmPwd(e.target.value)} />
              <button
                onClick={handleChangePassword}
                disabled={!newPwd || newPwd !== confirmPwd || updatePassword.isPending}
                className="px-5 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {updatePassword.isPending ? 'Saving…' : 'Update password'}
              </button>
            </div>
          )}

          {/* Log out */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 py-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            <LogoutIcon /> Log out
          </button>
        </div>
      </div>
    </div>
  )
}
