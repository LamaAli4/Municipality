import { motion } from 'framer-motion'
import type { NavigateFn } from '../lib/types'
import { CitizensIcon, StaffIcon, ServiceIcon, ChevronRightIcon } from '../lib/icons'
import StatCard from '../components/ui/StatCard'
import CountUp from '../components/ui/CountUp'
import Badge from '../components/ui/Badge'
import SectionHeader from '../components/ui/SectionHeader'
import PageWrapper, { stagger, fadeUp, fadeIn } from '../components/ui/PageWrapper'
import { useAdminUsers } from '../services/adminService'
import { useAdminComplaints } from '../services/adminComplaintsService'
import { useAdminServices } from '../services/servicesService'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

export default function DashboardPage({ navigate }: { navigate: NavigateFn }) {
  const { data: citizens  = [] } = useAdminUsers('CITIZEN')
  const { data: employees = [] } = useAdminUsers('EMPLOYEE')
  const { data: pending   = [] } = useAdminUsers('CITIZEN', 'PENDING_VERIFICATION')
  const { data: complaints = [] } = useAdminComplaints()
  const { data: services   = [] } = useAdminServices()

  /* ── Complaints pie data ── */
  const complaintCounts = [
    { name: 'Submitted',   value: complaints.filter(c => c.status === 'SUBMITTED').length,   color: '#3b82f6' },
    { name: 'Under Review',value: complaints.filter(c => c.status === 'UNDER_REVIEW').length, color: '#f97316' },
    { name: 'Resolved',    value: complaints.filter(c => c.status === 'RESOLVED').length,    color: '#0d9488' },
    { name: 'Closed',      value: complaints.filter(c => c.status === 'CLOSED').length,      color: '#6b7280' },
  ].filter(d => d.value > 0)

  /* ── Services bar data ── */
  const serviceStats = [
    { name: 'Draft',     value: services.filter(s => s.status === 'DRAFT').length,     fill: '#fbbf24' },
    { name: 'Published', value: services.filter(s => s.status === 'PUBLISHED').length, fill: '#0d9488' },
    { name: 'Archived',  value: services.filter(s => s.status === 'ARCHIVED').length,  fill: '#9ca3af' },
  ]

  return (
    <PageWrapper>
    <div className="space-y-6">
      <SectionHeader title="Control panel" subtitle="System overview and quick statistics" />

      {/* ── Stat cards ── */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp}><StatCard label="Total citizens"   value={<CountUp to={citizens.length} />}   icon={<CitizensIcon />} /></motion.div>
        <motion.div variants={fadeUp}><StatCard label="Total employees"  value={<CountUp to={employees.length} />}  icon={<StaffIcon />}    /></motion.div>
        <motion.div variants={fadeUp}><StatCard label="Total complaints" value={<CountUp to={complaints.length} />} icon={<ServiceIcon />}  /></motion.div>
        <motion.div variants={fadeUp}><StatCard label="Pending accounts" value={<CountUp to={pending.length} />}    icon={<CitizensIcon />} /></motion.div>
      </motion.div>

      {/* ── Charts row ── */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Complaints donut */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Complaints by status</h2>
          {complaintCounts.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No complaints yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={complaintCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {complaintCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'Complaints']} />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Services bar */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Services overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceStats} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="value" name="Services" radius={[6, 6, 0, 0]}>
                {serviceStats.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* ── Accounts awaiting verification ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Accounts awaiting verification</h2>
          <button
            onClick={() => navigate('citizens')}
            className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:underline"
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
                    className="border border-teal-600 text-teal-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-teal-50"
                  >
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ── Recent complaints ── */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Recent complaints</h2>
          <button
            onClick={() => navigate('complaints')}
            className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            View all <ChevronRightIcon />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['#', 'Title', 'Category', 'Priority', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No complaints yet</td></tr>
            ) : [...complaints].slice(0, 5).map((c, i) => (
              <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                <td className="px-5 py-3 text-gray-700 font-medium">{c.title}</td>
                <td className="px-5 py-3 text-gray-500">{c.category.replace(/_/g, ' ')}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    c.priority === 'HIGH'   ? 'bg-red-100 text-red-700' :
                    c.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                              'bg-green-100 text-green-700'
                  }`}>{c.priority}</span>
                </td>
                <td className="px-5 py-3"><Badge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
    </PageWrapper>
  )
}
