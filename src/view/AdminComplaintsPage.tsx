import { useState, useRef, useEffect } from 'react'
import PageWrapper from '../components/ui/PageWrapper'
import CountUp from '../components/ui/CountUp'
import type { NavigateFn } from '../lib/types'
import { EyeIcon } from '../lib/icons'
import { useAdminComplaints } from '../services/adminComplaintsService'

interface Props { navigate: NavigateFn }

const STATUS_OPTIONS = [
  { value: '',             label: 'All Statuses' },
  { value: 'SUBMITTED',   label: 'Submitted' },
  { value: 'UNDER_REVIEW',label: 'Under Review' },
  { value: 'RESOLVED',    label: 'Resolved' },
  { value: 'CLOSED',      label: 'Closed' },
]

const CATEGORY_OPTIONS = [
  { value: '',                 label: 'All Categories' },
  { value: 'SERVICE_QUALITY',  label: 'Service Quality' },
  { value: 'EMPLOYEE_CONDUCT', label: 'Employee Conduct' },
  { value: 'BILLING',          label: 'Billing' },
  { value: 'FACILITY',         label: 'Facility' },
  { value: 'OTHER',            label: 'Other' },
]

const PRIORITY_OPTIONS = [
  { value: '',       label: 'All Priorities' },
  { value: 'LOW',    label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH',   label: 'High' },
]

const STATUS_BADGE: Record<string, string> = {
  SUBMITTED:    'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-orange-100 text-orange-700',
  RESOLVED:     'bg-teal-100 text-teal-700',
  CLOSED:       'bg-gray-100 text-gray-600',
}

const PRIORITY_BADGE: Record<string, string> = {
  HIGH:   'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW:    'bg-green-100 text-green-700',
}

const iconBg = ['bg-teal-600', 'bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-purple-500']

function fmt(iso: string) {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

function cmpNumber(id: string) {
  return `CMP-${String(Number(id)).padStart(3, '0')}`
}

function CustomSelect({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const label = options.find(o => o.value === value)?.label ?? options[0].label

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[140px]"
      >
        <span>{label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  opt.value === value
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-teal-50'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function AdminComplaintsPage({ navigate }: Props) {
  const [status,   setStatus]   = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')

  const { data: complaints = [], isLoading, isError } = useAdminComplaints({
    status:   status   || undefined,
    category: category || undefined,
    priority: priority || undefined,
  })

  return (
    <PageWrapper>
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Complaints Management</h1>
        <p className="text-sm text-gray-500">View and manage citizen complaints</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <CustomSelect value={status}   onChange={setStatus}   options={STATUS_OPTIONS}   />
        <CustomSelect value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
        <CustomSelect value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
        {(status || category || priority) && (
          <button
            onClick={() => { setStatus(''); setCategory(''); setPriority('') }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',       val: complaints.length,                                                         color: 'text-gray-700'   },
          { label: 'Submitted',   val: complaints.filter(c => c.status === 'SUBMITTED').length,                   color: 'text-blue-600'   },
          { label: 'Under Review',val: complaints.filter(c => c.status === 'UNDER_REVIEW').length,                color: 'text-orange-600' },
          { label: 'Resolved',    val: complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length, color: 'text-teal-600'   },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}><CountUp to={s.val} /></p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading complaints...</div>
      )}
      {isError && (
        <div className="text-center py-16 text-red-500 text-sm">Failed to load complaints</div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {complaints.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">No complaints found</div>
          ) : (
            complaints.map((c, idx) => (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg[idx % iconBg.length]}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-xs text-gray-400 font-medium">{cmpNumber(c.id)}</span>
                      <span className="font-semibold text-gray-800 truncate">{c.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                      <span className="font-medium text-gray-500">{c.category.replace(/_/g, ' ')}</span>
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
                        {fmt(c.submitted_at)}
                      </span>
                    </div>
                  </div>

                  {/* Badges + action */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_BADGE[c.priority] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.priority}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.status.replace(/_/g, ' ')}
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
    </PageWrapper>
  )
}
