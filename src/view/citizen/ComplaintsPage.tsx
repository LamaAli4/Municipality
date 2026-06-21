import type { CitizenNavigateFn } from '@/lib/types'

interface Props { navigate: CitizenNavigateFn }

const complaints = [
  { id: 1, title: 'Water supply interruption', service: 'Water Subscription', date: '10/2/2024', status: 'In process' as const },
  { id: 2, title: 'Delayed permit processing', service: 'Building Permit', date: '2/2/2024', status: 'Complete' as const },
  { id: 3, title: 'Incorrect billing amount', service: 'Utility Bills', date: '25/1/2024', status: 'Rejected' as const },
]

const borderColors: Record<string, string> = {
  'In process': 'border-l-orange-400',
  'Complete': 'border-l-teal-500',
  'Rejected': 'border-l-red-400',
}

const badgeColors: Record<string, string> = {
  'In process': 'bg-orange-100 text-orange-700',
  'Complete': 'bg-teal-100 text-teal-700',
  'Rejected': 'bg-red-100 text-red-700',
}

export default function ComplaintsPage({ navigate }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Complaints</h1>
          <p className="text-sm text-gray-500">Manage your submitted complaints</p>
        </div>
        <button
          onClick={() => navigate('new-complaint')}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Complaint
        </button>
      </div>

      <div className="space-y-3">
        {complaints.map(c => (
          <div key={c.id} className={`bg-white rounded-xl border-l-4 shadow-sm border border-gray-100 p-4 ${borderColors[c.status]}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.service} • {c.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColors[c.status]}`}>
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
