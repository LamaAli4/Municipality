import type { CitizenNavigateFn } from '../../lib/types'
import PageWrapper from '../../components/ui/PageWrapper'
import { useMyRequests } from '../../services/requestsService'

interface Props { navigate: CitizenNavigateFn }

const STATUS_LABEL: Record<string, string> = {
  SUBMITTED:   'In process',
  IN_PROGRESS: 'In process',
  APPROVED:    'Complete',
  REJECTED:    'Rejected',
}

const statusColors: Record<string, string> = {
  'In process': 'bg-orange-100 text-orange-700',
  'Complete':   'bg-teal-100 text-teal-700',
  'Rejected':   'bg-red-100 text-red-700',
}

const quickActions = [
  { label: 'New Service Request', page: 'services'           as const, icon: '📋' },
  { label: 'Submit Complaint',    page: 'complaints'         as const, icon: '💬' },
  { label: 'Damage Assessment',   page: 'damage-assessment'  as const, icon: '🏠' },
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function reqNumber(id: string) {
  const year = new Date().getFullYear()
  return `${String(Number(id)).padStart(3, '0')}_${year}`
}

export default function HomePage({ navigate }: Props) {
  const { data: requests = [], isLoading } = useMyRequests()

  const recent = [...requests]
    .sort((a, b) => new Date(b.submitted_at ?? b.created_at).getTime() - new Date(a.submitted_at ?? a.created_at).getTime())
    .slice(0, 3)

  const activeCount = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'IN_PROGRESS').length

  return (
    <PageWrapper>
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-teal-100 mt-1 text-sm">Track your service requests and manage your account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
            {isLoading ? '…' : activeCount}
          </div>
          <p className="text-sm text-gray-600 font-medium">Active Requests</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
            {isLoading ? '…' : requests.length}
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Requests</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
            {isLoading ? '…' : requests.filter(r => r.status === 'APPROVED').length}
          </div>
          <p className="text-sm text-gray-600 font-medium">Completed</p>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              {isLoading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : recent.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No requests yet</td></tr>
              ) : recent.map(r => {
                const label = STATUS_LABEL[r.status] ?? 'In process'
                return (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('request-detail', { requestId: r.id })}
                  >
                    <td className="px-4 py-3 text-gray-700 font-medium">{reqNumber(r.id)}</td>
                    <td className="px-4 py-3 text-gray-600">{r.service_name ?? r.service?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(r.submitted_at ?? r.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[label] ?? 'bg-gray-100 text-gray-600'}`}>
                        {label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </PageWrapper>
  )
}
