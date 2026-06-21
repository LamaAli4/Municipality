import type { CitizenNavigateFn } from '@/lib/types'

interface Props { navigate: CitizenNavigateFn }

const stats = [
  { label: 'Active Requests', value: 1, color: 'bg-teal-500' },
  { label: 'Pending Payments', value: 1, color: 'bg-orange-400' },
  { label: 'Notifications', value: 3, color: 'bg-green-500' },
  { label: 'Utility Bills', value: "500$", color: 'bg-red-400' },
]

const recentRequests = [
  { num: '#REQ-2024-001', service: 'Building permit', date: '12/1/2024', status: 'In process' },
  { num: '#REQ-2024-002', service: 'Water subscription', date: '5/2/2024', status: 'Complete' },
  { num: '#REQ-2024-003', service: 'Road damage report', date: '18/2/2024', status: 'Rejected' },
]

const statusColors: Record<string, string> = {
  'In process': 'bg-orange-100 text-orange-700',
  'Complete': 'bg-teal-100 text-teal-700',
  'Rejected': 'bg-red-100 text-red-700',
}

const quickActions = [
  { label: 'New Service Request', page: 'services' as const, icon: '📋' },
  { label: 'Submit Complaint', page: 'complaints' as const, icon: '💬' },
  { label: 'Pay Utility Bill', page: 'utility-bills' as const, icon: '🧾' },
  { label: 'Damage Assessment', page: 'damage-assessment' as const, icon: '🏠' },
]

export default function HomePage({ navigate }: Props) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, Ahmed!</h1>
        <p className="text-teal-100 mt-1 text-sm">Track your service requests and manage your account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-3`}>
              {s.value}
            </div>
            <p className="text-sm text-gray-600 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(a => (
            <button
              key={a.label}
              onClick={() => navigate(a.page)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all text-center"
            >
              <div className="text-2xl mb-2">{a.icon}</div>
              <p className="text-xs font-medium text-gray-700">{a.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">Recent Requests</h2>
          <button onClick={() => navigate('my-requests')} className="text-teal-600 text-sm hover:underline">View all</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Request #</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Service</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer" onClick={() => navigate('request-detail')}>
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.num}</td>
                  <td className="px-4 py-3 text-gray-600">{r.service}</td>
                  <td className="px-4 py-3 text-gray-500">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
