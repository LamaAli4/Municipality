import { useState } from 'react'

export default function CitizenAccountPage() {
  const [showPwSection, setShowPwSection] = useState(false)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Account</h1>
        <p className="text-sm text-gray-500">Manage your profile and settings</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold">AM</div>
          <div>
            <p className="font-semibold text-gray-800">Ahmed Mohamed</p>
            <p className="text-sm text-gray-500">ahmed.m@example.com</p>
          </div>
        </div>

        <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" value="Ahmed" />
          <Field label="Last name" value="Mohamed" />
          <Field label="National ID" value="1234567890" />
          <Field label="Phone number" value="+966 50 123 4567" />
          <div className="col-span-2">
            <Field label="Email" value="ahmed.m@example.com" type="email" />
          </div>
          <div className="col-span-2">
            <Field label="Address" value="123 Al-Riyadh Street, Riyadh" />
          </div>
        </div>

        <button
          className="mt-6 px-6 py-2.5 rounded-lg text-white text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          Save Changes
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => setShowPwSection(v => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Change Password
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showPwSection ? 'rotate(180deg)' : '' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {showPwSection && (
          <div className="px-6 pb-6 space-y-3 border-t border-gray-100">
            <Field label="Current password" type="password" value="" />
            <Field label="New password" type="password" value="" />
            <Field label="Confirm new password" type="password" value="" />
            <button
              className="mt-2 px-6 py-2.5 rounded-lg text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
            >
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, type = 'text' }: { label: string; value: string; type?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        defaultValue={value}
        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  )
}
