import { useState } from 'react'
import type { CitizenNavigateFn } from '../../lib/types'
import { EyeIcon } from '../../lib/icons'
import { useMyRequests } from '../../services/requestsService'
import PageWrapper from '../../components/ui/PageWrapper'

interface Props { navigate: CitizenNavigateFn }

type StatusFilter = 'All' | 'Submitted' | 'In progress' | 'Approved' | 'Rejected'

const STATUS_LABEL: Record<string, StatusFilter> = {
  SUBMITTED:   'Submitted',
  IN_PROGRESS: 'In progress',
  APPROVED:    'Approved',
  REJECTED:    'Rejected',
}

const borderColors: Record<string, string> = {
  'Submitted':   'border-l-orange-400',
  'In progress': 'border-l-blue-400',
  'Approved':    'border-l-teal-500',
  'Rejected':    'border-l-red-400',
}

const badgeColors: Record<string, string> = {
  'Submitted':   'bg-orange-100 text-orange-600',
  'In progress': 'bg-blue-100 text-blue-600',
  'Approved':    'bg-teal-100 text-teal-700',
  'Rejected':    'bg-red-100 text-red-600',
}

const iconBg = ['bg-teal-700', 'bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-purple-500']

function formatDate(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

function reqNumber(id: string) {
  const year = new Date().getFullYear()
  return `${String(Number(id)).padStart(3, '0')}_${year}`
}

function ServiceIcon({ name, idx }: { name: string; idx: number }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg[idx % iconBg.length]}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
  )
}

export default function MyRequestsPage({ navigate }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('All')
  const { data: requests = [], isLoading, isError } = useMyRequests()

  const mapped = [...requests]
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((r, idx) => ({
    id: r.id,
    num: reqNumber(r.id),
    service: r.service_name ?? r.service?.name ?? `Service ${r.service_id ?? ''}`,
    date: formatDate(r.submitted_at ?? r.created_at),
    status: (STATUS_LABEL[r.status] ?? 'In progress') as StatusFilter,
    idx,
  }))

  const filtered = filter === 'All' ? mapped : mapped.filter(r => r.status === filter)

  return (
    <PageWrapper>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">My Requests</h1>
        <p className="text-sm text-gray-500">
          Showing {mapped.length} request{mapped.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Submitted', 'In progress', 'Approved', 'Rejected'] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-teal-600 text-white'
                : 'border border-gray-300 text-gray-600 hover:border-teal-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading requests...</div>
      )}
      {isError && (
        <div className="text-center py-16 text-red-500 text-sm">Failed to load requests</div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {filtered.map(req => (
            <div
              key={req.id}
              className={`bg-white rounded-xl border border-gray-100 border-l-4 shadow-sm px-5 py-4 ${borderColors[req.status] ?? 'border-l-gray-300'}`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <ServiceIcon name={req.service} idx={req.idx} />

                {/* Request number */}
                <div className="min-w-[120px]">
                  <p className="text-xs text-gray-400 mb-0.5">Request number</p>
                  <p className="text-sm font-semibold text-gray-800">{req.num}</p>
                </div>

                {/* Service type */}
                <div className="flex-1 min-w-[130px]">
                  <p className="text-xs text-gray-400 mb-0.5">Service type</p>
                  <p className="text-sm font-semibold text-gray-800">{req.service}</p>
                </div>

                {/* Date */}
                <div className="min-w-[110px]">
                  <p className="text-xs text-gray-400 mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-gray-800">{req.date}</p>
                </div>

                {/* Status badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badgeColors[req.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {req.status}
                </span>

                {/* Eye icon */}
                <button
                  onClick={() => navigate('request-detail', { requestId: req.id })}
                  className="ml-auto p-2 rounded-lg hover:bg-teal-50 transition-colors"
                  title="View details"
                >
                  <EyeIcon />
                </button>
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
    </PageWrapper>
  )
}
