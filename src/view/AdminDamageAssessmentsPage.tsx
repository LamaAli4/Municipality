import { useState, useRef, useEffect } from 'react'
import type { NavigateFn } from '../lib/types'
import { useAdminDamageAssessments } from '../services/damageAssessmentService'
import { EyeIcon } from '../lib/icons'

interface Props { navigate: NavigateFn }

const SEVERITY_OPTIONS = [
  { value: '',         label: 'All Severities' },
  { value: 'MINOR',    label: 'Minor'          },
  { value: 'MODERATE', label: 'Moderate'       },
  { value: 'SEVERE',   label: 'Severe'         },
]

const SEVERITY_BADGE: Record<string, string> = {
  MINOR:    'bg-yellow-100 text-yellow-700',
  MODERATE: 'bg-orange-100 text-orange-700',
  SEVERE:   'bg-red-100 text-red-700',
}

function fmt(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
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

export default function AdminDamageAssessmentsPage({ navigate }: Props) {
  const [severity, setSeverity] = useState('')

  const { data: assessments = [], isLoading, isError } = useAdminDamageAssessments({
    ...(severity ? { damage_severity: severity } : {}),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Damage Assessments</h1>
        <p className="text-sm text-gray-500">Review citizen-submitted property damage reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <CustomSelect value={severity} onChange={setSeverity} options={SEVERITY_OPTIONS} />
        {severity && (
          <button
            onClick={() => setSeverity('')}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading assessments...</div>
      )}
      {isError && (
        <div className="text-center py-16 text-red-500 text-sm">Failed to load damage assessments</div>
      )}

      {!isLoading && !isError && (
        assessments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
            No damage assessments found
          </div>
        ) : (
          <>
            {/* ── Mobile cards ───────────────────────────────── */}
            <div className="md:hidden space-y-3">
              {assessments.map((a, i) => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-mono mb-0.5">#{String(i + 1).padStart(3, '0')}</p>
                      <p className="font-semibold text-gray-800 truncate">
                        {a.citizen?.full_name ?? '—'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{a.location}</p>
                    </div>
                    <button
                      onClick={() => navigate('damage-assessment-detail', { assessmentId: a.id })}
                      className="p-2 rounded-lg hover:bg-teal-50 transition-colors shrink-0"
                    >
                      <EyeIcon />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${SEVERITY_BADGE[a.damage_severity] ?? 'bg-gray-100 text-gray-600'}`}>
                      {a.damage_severity}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{fmt(a.submitted_at ?? a.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table ──────────────────────────────── */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    <th className="px-5 py-3 text-left">#</th>
                    <th className="px-5 py-3 text-left">Citizen</th>
                    <th className="px-5 py-3 text-left">Location</th>
                    <th className="px-5 py-3 text-left">Severity</th>
                    <th className="px-5 py-3 text-left">Submitted</th>
                    <th className="px-5 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {assessments.map((a, i) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-400 font-mono">{String(i + 1).padStart(3, '0')}</td>
                      <td className="px-5 py-4 text-gray-700 font-medium">
                        {a.citizen?.full_name ?? <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-600 max-w-[160px] truncate">{a.location}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${SEVERITY_BADGE[a.damage_severity] ?? 'bg-gray-100 text-gray-600'}`}>
                          {a.damage_severity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{fmt(a.submitted_at ?? a.created_at)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => navigate('damage-assessment-detail', { assessmentId: a.id })}
                          className="p-2 rounded-lg hover:bg-teal-50 transition-colors"
                          title="View details"
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  )
}
