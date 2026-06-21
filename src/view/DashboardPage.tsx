import { useState } from 'react'
import type { NavigateFn } from '@/lib/types'
import { latestRequests, awaitingVerification } from '@/lib/data'
import { CitizensIcon, StaffIcon, LogsIcon, ServiceIcon, ChevronRightIcon } from '@/lib/icons'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import SectionHeader from '@/components/ui/SectionHeader'
import CitizenVerificationModal from './modals/CitizenVerificationModal'

export default function DashboardPage({ navigate }: { navigate: NavigateFn }) {
  const [showVerify, setShowVerify] = useState(false)

  return (
    <div>
      {showVerify && <CitizenVerificationModal onClose={() => setShowVerify(false)} />}

      <SectionHeader title="Control panel" subtitle="System overview and quick statistics" />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total citizens"   value="1,250" icon={<CitizensIcon />} />
        <StatCard label="Total employees"  value="45"    icon={<StaffIcon />}    />
        <StatCard label="Total request"    value="80"    icon={<LogsIcon />}     />
        <StatCard label="Total bills"      value="700$"  icon={<ServiceIcon />}  />
      </div>

      {/* Latest Requests */}
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

      {/* Awaiting Verification */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Accounts awaiting verification</h2>
          <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            View all <ChevronRightIcon />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Name', 'ID number', 'Registration date', 'procedures'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {awaitingVerification.map(v => (
              <tr key={v.name} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-600">{v.name}</td>
                <td className="px-5 py-3 text-gray-500">{v.idNum}</td>
                <td className="px-5 py-3 text-gray-500">{v.date}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setShowVerify(true)}
                    className="border border-primary text-primary text-xs font-medium px-3 py-1 rounded-full hover:bg-teal-50"
                  >
                    verification
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
