import { useState } from 'react'
import { PasswordIcon, LogoutIcon, ChevronDownIcon, EditIcon } from '../lib/icons'
import SectionHeader from '../components/ui/SectionHeader'
import { Input } from '../components/ui/Input'
import { PrimaryBtn } from '../components/ui/Button'

export default function AccountPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <SectionHeader title="Profile" action={<PrimaryBtn label="Save changes" />} />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#dbeafe"/>
              <ellipse cx="50" cy="38" rx="18" ry="18" fill="#93c5fd"/>
              <ellipse cx="50" cy="80" rx="28" ry="20" fill="#3b82f6"/>
              <rect x="44" y="48" width="12" height="8" fill="#dc2626" rx="2"/>
            </svg>
          </div>
          <p className="font-bold text-gray-800 text-lg">System Admin</p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input label="Full Name"     value="Admin Muhammad"              readOnly />
          <Input label="The role"      value="Admin"                       readOnly />
          <Input label="Phone Number"  value="0592468345"                  icon={<EditIcon />} />
          <Input label="Email"         value="Khaledkhalil123@gmail.com"   icon={<EditIcon />} />
          <Input label="Joining date"  value="1\\1\\2024"                  readOnly />
          <Input label="Last login"    value="10-10-2024 |11:20Am"         readOnly />
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Change Password */}
          <button
            onClick={() => setShowPassword(v => !v)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            <div className="flex items-center gap-2">
              <PasswordIcon /> Change Password
            </div>
            <ChevronDownIcon />
          </button>

          {showPassword && (
            <div className="space-y-3 pl-7">
              <Input label="Current password"     type="password" placeholder="••••••••" />
              <Input label="New password"          type="password" placeholder="••••••••" />
              <Input label="Confirm new password"  type="password" placeholder="••••••••" />
            </div>
          )}

          {/* Log out */}
          <button className="w-full flex items-center gap-2 py-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
            <LogoutIcon /> Log out
          </button>
        </div>
      </div>
    </div>
  )
}
