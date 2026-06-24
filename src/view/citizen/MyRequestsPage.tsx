import { useState, useEffect } from 'react'
import type { CitizenNavigateFn } from '../../lib/types'
import axiosInstance from '../../lib/axios'

interface Props { navigate: CitizenNavigateFn }

interface ApiRequest {
  id: string
  request_number?: string
  service_id?: string
  service?: { name: string }
  status: string
  created_at: string
}

type StatusFilter = 'All' | 'In process' | 'Complete' | 'Rejected' | 'Waiting for documents'

const STATUS_MAP: Record<string, StatusFilter> = {
  IN_PROGRESS: 'In process',
  PENDING: 'In process',
  COMPLETED: 'Complete',
  APPROVED: 'Complete',
  REJECTED: 'Rejected',
  WAITING_DOCUMENTS: 'Waiting for documents',
}

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

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function MyRequestsPage({ navigate }: Props) {
  const [requests, setRequests] = useState<ApiRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('All')

  useEffect(() => {
    axiosInstance.get('/requests')
      .then(res => {
        const json = res.data
        if (json.success) setRequests(json.data)
        else setError(json.message ?? 'Failed to load requests')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const mapped = requests.map(r => ({
    id: r.id,
    num: r.request_number ?? `#REQ-${r.id}`,
    service: r.service?.name ?? `Service ${r.service_id ?? ''}`,
    date: formatDate(r.created_at),
    status: (STATUS_MAP[r.status] ?? r.status) as StatusFilter,
  }))

  const filtered = filter === 'All' ? mapped : mapped.filter(r => r.status === filter)

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

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
          Loading requests...
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-500 text-sm">{error}</div>
      )}

      {/* Request cards */}
      {!loading && !error && (
        <div className="space-y-3">
          {filtered.map(req => (
            <div
              key={req.id}
              onClick={() => navigate('request-detail')}
              className={`bg-white rounded-xl border-l-4 shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow ${borderColors[req.status] ?? 'border-l-gray-300'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{req.service}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{req.num} • Submitted {req.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColors[req.status] ?? 'bg-gray-100 text-gray-600'}`}>
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
      )}
    </div>
  )
}
