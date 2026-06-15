import { useState } from 'react'
import type { CitizenNavigateFn } from '../../lib/types'

interface Props { navigate: CitizenNavigateFn }

const requests = [
  { num: '#REQ-2024-001', service: 'Building permit', date: '12/1/2024', status: 'In process' as const },
  { num: '#REQ-2024-002', service: 'Water subscription', date: '5/2/2024', status: 'Complete' as const },
  { num: '#REQ-2024-003', service: 'Road damage report', date: '18/2/2024', status: 'Rejected' as const },
  { num: '#REQ-2024-004', service: 'Electricity connection', date: '1/3/2024', status: 'Waiting for documents' as const },
  { num: '#REQ-2024-005', service: 'Infrastructure inspection', date: '10/3/2024', status: 'In process' as const },
]

type StatusFilter = 'All' | 'In process' | 'Complete' | 'Rejected' | 'Waiting for documents'

const borderColors: Record<string, string> = {
  'In process': 'border-l-orange-400',
  'Complete': 'border-l-teal-500',
  'Rejected': 'border-l-red-400',
  'Waiting for documents': 'border-l-yellow-400',
}

const badgeColors: Record<string, string> = {
  'In process': 'bg-orange-100 text-orange-700',
  'Complete': 'bg-teal-100 text-teal-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Waiting for documents': 'bg-yellow-100 text-yellow-700',
}

export default function MyRequestsPage({ navigate }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('All')

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">My Requests</h1>
        <p className="text-sm text-gray-500">Track all your service requests</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'In process', 'Complete', 'Rejected', 'Waiting for documents'] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? 'bg-teal-600 text-white' : 'border border-gray-300 text-gray-600 hover:border-teal-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Request cards */}
      <div className="space-y-3">
        {filtered.map(req => (
          <div
            key={req.num}
            onClick={() => navigate('request-detail')}
            className={`bg-white rounded-xl border-l-4 shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow ${borderColors[req.status]}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{req.service}</p>
                <p className="text-xs text-gray-400 mt-0.5">{req.num} • Submitted {req.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColors[req.status]}`}>
                {req.status}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No requests found</p>
          </div>
        )}
      </div>
    </div>
  )
}
