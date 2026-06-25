import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon } from '../../lib/icons'
import { useRequestDetail } from '../../services/requestsService'

interface Props {
  navigate: CitizenNavigateFn
  requestId: string | null
}

const STATUS_LABEL: Record<string, string> = {
  SUBMITTED:   'Submitted',
  IN_PROGRESS: 'In progress',
  APPROVED:    'Approved',
  REJECTED:    'Rejected',
}

const STATUS_BADGE: Record<string, string> = {
  'Submitted':   'bg-orange-100 text-orange-600',
  'In progress': 'bg-blue-100 text-blue-600',
  'Approved':    'bg-teal-100 text-teal-700',
  'Rejected':    'bg-red-100 text-red-600',
}

function fmt(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function fmtTime(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m} ${ampm} ${fmt(iso)}`
}

export default function RequestDetailPage({ navigate, requestId }: Props) {
  const { data: req, isLoading } = useRequestDetail(requestId)

  const statusLabel = STATUS_LABEL[req?.status ?? ''] ?? req?.status ?? '—'
  const serviceName = req?.service_name ?? req?.service?.name ?? '—'

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
  )

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('my-requests')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600"
      >
        <ChevronLeftIcon /> Back To My Requests
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">Request details</h1>
        <p className="text-sm text-gray-500">
          Track the status of your {serviceName} request
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* ── Left column ───────────────────────────── */}
        <div className="col-span-2 space-y-4">

          {/* Service card */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {serviceName[0]}
              </div>
              <span className="font-semibold text-gray-800">{serviceName}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_BADGE[statusLabel] ?? 'bg-gray-100 text-gray-600'}`}>
              {statusLabel}
            </span>
          </div>

          {/* Meta row */}
          <div className="bg-teal-600 text-white rounded-xl p-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-teal-200 text-xs mb-0.5">Submission date</p>
              <p className="font-medium">{fmt(req?.submitted_at ?? req?.created_at)}</p>
            </div>
            <div>
              <p className="text-teal-200 text-xs mb-0.5">Assigned To</p>
              <p className="font-medium">{req?.assigned_to?.full_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-teal-200 text-xs mb-0.5">Estimated Completion</p>
              <p className="font-medium">{fmt(req?.estimated_completion_date)}</p>
            </div>
          </div>

          {/* Notes */}
          {req?.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{req.notes}</p>
            </div>
          )}

          {/* Uploaded documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Uploaded documents</h2>
            {!req?.documents || req.documents.length === 0 ? (
              <p className="text-sm text-gray-400">No documents uploaded</p>
            ) : (
              <div className="space-y-2">
                {req.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                    {doc.file_url ? (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-teal-100 text-teal-700">
                        Uploaded
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Timeline ─────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit">
          <h2 className="font-semibold text-gray-800 mb-5">Request Timeline</h2>
          {!req?.tasks || req.tasks.length === 0 ? (
            <p className="text-sm text-gray-400">No timeline available</p>
          ) : (
            <div>
              {[...req.tasks]
                .sort((a, b) => a.task_order - b.task_order)
                .map((task, i, arr) => {
                  const done       = task.status === 'COMPLETED' || task.status === 'APPROVED'
                  const inProgress = task.status === 'IN_PROGRESS'
                  const isLast     = i === arr.length - 1

                  return (
                    <div key={task.id} className="flex gap-3">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          done
                            ? 'bg-teal-500 border-teal-500'
                            : inProgress
                            ? 'bg-white border-teal-500'
                            : 'bg-white border-gray-300'
                        }`}>
                          {done ? (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : inProgress ? (
                            <div className="w-2 h-2 rounded-full bg-teal-500" />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold leading-none">{i + 1}</span>
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 my-1 ${done ? 'bg-teal-300' : 'bg-gray-200'}`}
                            style={{ minHeight: '28px' }}
                          />
                        )}
                      </div>

                      {/* Step content */}
                      <div className={`${isLast ? '' : 'pb-5'}`}>
                        <p className={`text-sm font-medium leading-tight ${
                          done || inProgress ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {task.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {done
                            ? fmtTime(task.completed_at)
                            : inProgress
                            ? 'In process'
                            : 'Waiting for approval'}
                        </p>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
