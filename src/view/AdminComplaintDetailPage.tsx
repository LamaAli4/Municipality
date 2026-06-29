import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { ChevronLeftIcon } from '../lib/icons'
import { useAdminComplaintDetail, useResolveComplaint } from '../services/adminComplaintsService'

interface Props {
  navigate: NavigateFn
  complaintId: string | null
}

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

function fmt(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function AdminComplaintDetailPage({ navigate, complaintId }: Props) {
  const { data: complaint, isLoading } = useAdminComplaintDetail(complaintId)
  const { mutate: resolve, isPending } = useResolveComplaint()
  const [result, setResult] = useState('')

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
  )

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('complaints')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600"
      >
        <ChevronLeftIcon /> Back To Complaints
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">Complaint details</h1>
        <p className="text-sm text-gray-500">View full details of this citizen complaint</p>
      </div>

      {complaint && (
        <>
        {/* Start Review banner */}
        {complaint.status === 'SUBMITTED' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">This complaint hasn't been reviewed yet</p>
                <p className="text-xs text-amber-600">Click "Start Review" to begin working on this complaint and notify the citizen</p>
              </div>
            </div>
            <button
              disabled={isPending}
              onClick={() => resolve({ id: complaint.id, status: 'UNDER_REVIEW' })}
              className="shrink-0 px-5 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              {isPending ? 'Saving...' : 'Start Review'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">

            {/* Header card */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {complaint.title[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">CMP-{String(Number(complaint.id)).padStart(3, '0')}</p>
                  <p className="font-semibold text-gray-800 truncate">{complaint.title}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${STATUS_BADGE[complaint.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {complaint.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Meta row */}
            <div className="bg-teal-600 text-white rounded-xl p-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-teal-200 text-xs mb-0.5">Submission date</p>
                <p className="font-medium">{fmt(complaint.submitted_at)}</p>
              </div>
              <div>
                <p className="text-teal-200 text-xs mb-0.5">Category</p>
                <p className="font-medium">{complaint.category.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-teal-200 text-xs mb-0.5">Priority</p>
                <p className="font-medium">{complaint.priority}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{complaint.description}</p>
            </div>

            {/* Photo */}
            {complaint.photo?.file_url && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-semibold text-gray-800 mb-3">Attached photo</h2>
                <img
                  src={complaint.photo.file_url}
                  alt={complaint.photo.name}
                  className="rounded-lg max-h-64 object-cover"
                />
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Complaint info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Complaint info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Complaint #</span>
                  <span className="text-gray-700 font-medium">CMP-{String(Number(complaint.id)).padStart(3, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[complaint.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {complaint.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_BADGE[complaint.priority] ?? 'bg-gray-100 text-gray-600'}`}>
                    {complaint.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-gray-700 font-medium">{complaint.category.replace(/_/g, ' ')}</span>
                </div>
                {complaint.location && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400 shrink-0">Location</span>
                    <span className="text-gray-700 text-right">{complaint.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Submitted</span>
                  <span className="text-gray-700">{fmt(complaint.submitted_at)}</span>
                </div>
                {complaint.citizen && (
                  <>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-400 font-medium mb-2">Citizen</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name</span>
                      <span className="text-gray-700 font-medium">{complaint.citizen.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone</span>
                      <span className="text-gray-700">{complaint.citizen.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h2 className="font-semibold text-gray-800">Actions</h2>

                {complaint.status === 'UNDER_REVIEW' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">
                        Decision / Result <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={result}
                        onChange={e => setResult(e.target.value)}
                        placeholder="Describe the outcome or resolution..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      />
                    </div>
                    <button
                      disabled={isPending || !result.trim()}
                      onClick={() => resolve({ id: complaint.id, status: 'RESOLVED', result })}
                      className="w-full py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition"
                      style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
                    >
                      {isPending ? 'Saving...' : 'Mark as Resolved'}
                    </button>
                    <button
                      disabled={isPending || !result.trim()}
                      onClick={() => resolve({ id: complaint.id, status: 'CLOSED', result })}
                      className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      Close Complaint
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  )
}
