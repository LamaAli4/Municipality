export default function EmployeeAccountPage() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Account</h1>
        <p className="text-sm text-gray-500">Your employee profile</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold">EA</div>
          <div>
            <p className="font-semibold text-gray-800">Engineer Ahmed</p>
            <p className="text-sm text-gray-500">Water Supply Section</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ['First name', 'Ahmed'],
            ['Last name', 'Saleh'],
            ['Employee ID', 'EMP-2021-0187'],
            ['Phone number', '+966 54 111 2233'],
            ['Email', 'a.saleh@dept.gov'],
            ['Section', 'Water Supply Section'],
            ['Position', 'Field Engineer'],
            ['Department', 'Water Department'],
          ].map(([label, value]) => (
            <div key={label}>
              <label className="text-xs text-gray-500">{label}</label>
              <input
                defaultValue={value}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          ))}
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
