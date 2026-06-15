export default function ManagerAccountPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Account</h1>
        <p className="text-sm text-gray-500">Manage your profile and settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-700 flex items-center justify-center text-white text-xl font-bold">KA</div>
          <div>
            <p className="font-semibold text-gray-800">Khalid Al-Rashid</p>
            <p className="text-sm text-gray-500">Department Manager — Water Department</p>
          </div>
        </div>

        <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" value="Khalid" />
          <Field label="Last name" value="Al-Rashid" />
          <Field label="Employee ID" value="EMP-2019-0042" />
          <Field label="Phone number" value="+966 55 987 6543" />
          <div className="col-span-2">
            <Field label="Email" value="k.alrashid@dept.gov" type="email" />
          </div>
          <Field label="Department" value="Water Department" />
          <Field label="Position" value="Department Manager" />
        </div>

        <button
          className="mt-6 px-6 py-2.5 rounded-lg text-white text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          Save Changes
        </button>
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
