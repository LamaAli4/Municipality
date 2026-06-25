import { useState } from 'react'
import type { CitizenNavigateFn } from '../../lib/types'
import { useComplaints } from '../../services/complaintsService'
import { EyeIcon } from '../../lib/icons'

interface Props { navigate: CitizenNavigateFn }

type Filter = 'All' | 'In process' | 'Complete' | 'Rejected'

const STATUS_LABEL: Record<string, Filter> = {
  SUBMITTED:    'In process',
  UNDER_REVIEW: 'In process',
  PENDING:      'In process',
  RESOLVED:     'Complete',
  REJECTED:     'Rejected',
  CLOSED:       'Complete',
}

const badgeColors: Record<Filter, string> = {
  'All':        '',
  'In process': 'bg-orange-100 text-orange-600',
  'Complete':   'bg-teal-100 text-teal-700',
  'Rejected':   'bg-red-100 text-red-600',
}

const borderColors: Record<Filter, string> = {
  'All':        'border-l-gray-300',
  'In process': 'border-l-orange-400',
  'Complete':   'border-l-teal-500',
  'Rejected':   'border-l-red-400',
}

const iconBg = ['bg-teal-600', 'bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-purple-500']

function ComplaintIcon({ idx }: { idx: number }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg[idx % iconBg.length]}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

function cmpNumber(id: string) {
  return `CMP-${String(Number(id)).padStart(3, '0')}`
}

export default function ComplaintsPage({ navigate }: Props) {
  const [filter, setFilter] = useState<Filter>('All')
  const { data: complaints = [], isLoading, isError } = useComplaints()

  const mapped = [...complaints]
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((c, idx) => ({
      ...c,
      label: (STATUS_LABEL[c.status] ?? 'In process') as Filter,
      idx,
    }))

  const filtered = filter === 'All' ? mapped : mapped.filter(c => c.label === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Complaints</h1>
          <p className="text-sm text-gray-500">Track and manage your submitted complaint</p>
        </div>
        <button
          onClick={() => navigate('new-complaint')}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New complaint
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'In process', 'Complete', 'Rejected'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-teal-600 text-white'
                : 'border border-gray-300 text-gray-600 hover:border-teal-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading complaints...</div>
      )}
      {isError && (
        <div className="text-center py-16 text-red-500 text-sm">Failed to load complaints</div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No complaints found</div>
          ) : (
            filtered.map(c => (
              <div
                key={c.id}
                className={`bg-white rounded-xl border border-gray-100 border-l-4 shadow-sm px-5 py-4 ${borderColors[c.label]}`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <ComplaintIcon idx={c.idx} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400 font-medium">{cmpNumber(c.id)}</span>
                      <span className="font-semibold text-gray-800">{c.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {c.location && (
                        <span className="flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {c.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {formatDate(c.submitted_at)}
                      </span>
                    </div>
                  </div>

                  {/* Status + button */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[c.label]}`}>
                      {c.label}
                    </span>
                    <button
                      onClick={() => navigate('complaint-detail', { complaintId: c.id })}
                      className="p-2 rounded-lg hover:bg-teal-50 transition-colors"
                      title="View details"
                    >
                      <EyeIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
