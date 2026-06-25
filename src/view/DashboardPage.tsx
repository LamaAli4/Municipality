import type { NavigateFn } from '../lib/types'
import { latestRequests } from '../lib/data'
import { CitizensIcon, StaffIcon, LogsIcon, ServiceIcon, ChevronRightIcon } from '../lib/icons'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import SectionHeader from '../components/ui/SectionHeader'
import { useAdminUsers } from '../services/adminService'

export default function DashboardPage({ navigate }: { navigate: NavigateFn }) {
  const { data: citizens  = [] } = useAdminUsers('CITIZEN')
  const { data: employees = [] } = useAdminUsers('EMPLOYEE')
  const { data: pending   = [] } = useAdminUsers('CITIZEN', 'PENDING_VERIFICATION')

  return (
    <div>
      <SectionHeader title="Control panel" subtitle="System overview and quick statistics" />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total citizens"    value={citizens.length.toLocaleString()}  icon={<CitizensIcon />} />
        <StatCard label="Total employees"   value={employees.length.toLocaleString()} icon={<StaffIcon />}    />
        <StatCard label="Total request"     value="80"                                icon={<LogsIcon />}     />
        <StatCard label="Pending accounts"  value={pending.length.toLocaleString()}   icon={<ServiceIcon />}  />
      </div>

      {/* Latest Requests — demo until requests endpoint is available */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Latest request</h2>
          <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            View all <ChevronRightIcon />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['#', 'Order ID', 'Citizen', 'Service', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {latestRequests.map(r => (
              <tr key={r.num} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-500">{r.num}</td>
                <td className="px-5 py-3 text-gray-600">{r.id}</td>
                <td className="px-5 py-3 text-gray-600">{r.citizen}</td>
                <td className="px-5 py-3 text-gray-500">{r.service}</td>
                <td className="px-5 py-3"><Badge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Awaiting Verification — real data */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Accounts awaiting verification</h2>
          <button
            onClick={() => navigate('citizens')}
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            View all <ChevronRightIcon />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Name', 'ID number', 'Registration date', 'Procedures'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No pending accounts</td></tr>
            ) : pending.slice(0, 5).map(u => (
              <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-600">{u.full_name}</td>
                <td className="px-5 py-3 text-gray-500">{u.national_id ?? '—'}</td>
                <td className="px-5 py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => navigate('citizen-detail', { userId: u.id })}
                    className="border border-primary text-primary text-xs font-medium px-3 py-1 rounded-full hover:bg-teal-50"
                  >
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
