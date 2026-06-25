import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon } from '../../lib/icons'
import { useComplaintDetail } from '../../services/complaintsService'

interface Props {
  navigate: CitizenNavigateFn
  complaintId: string | null
}

const STATUS_LABEL: Record<string, string> = {
  UNDER_REVIEW: 'Under Review',
  PENDING:      'Pending',
  RESOLVED:     'Resolved',
  REJECTED:     'Rejected',
  CLOSED:       'Closed',
}

const STATUS_BADGE: Record<string, string> = {
  'Under Review': 'bg-orange-100 text-orange-700',
  'Pending':      'bg-yellow-100 text-yellow-700',
  'Resolved':     'bg-teal-100 text-teal-700',
  'Rejected':     'bg-red-100 text-red-700',
  'Closed':       'bg-gray-100 text-gray-600',
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

export default function ComplaintDetailPage({ navigate, complaintId }: Props) {
  const { data: complaint, isLoading } = useComplaintDetail(complaintId)

  const statusLabel = STATUS_LABEL[complaint?.status ?? ''] ?? complaint?.status ?? '—'

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
        <p className="text-sm text-gray-500">View the details of your submitted complaint</p>
      </div>

      {complaint && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">

            {/* Header card */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {complaint.title[0]}
                </div>
                <span className="font-semibold text-gray-800">{complaint.title}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_BADGE[statusLabel] ?? 'bg-gray-100 text-gray-600'}`}>
                {statusLabel}
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
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Complaint info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[statusLabel] ?? 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
