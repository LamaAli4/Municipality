import type { NavigateFn } from '../lib/types'
import { ChevronLeftIcon } from '../lib/icons'
import { useAdminDamageAssessmentDetail } from '../services/damageAssessmentService'

interface Props {
  navigate: NavigateFn
  assessmentId: string | null
}

const STATUS_BADGE: Record<string, string> = {
  SUBMITTED:    'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-orange-100 text-orange-700',
  APPROVED:     'bg-teal-100 text-teal-700',
  REJECTED:     'bg-red-100 text-red-600',
  RESOLVED:     'bg-green-100 text-green-700',
}

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

export default function AdminDamageAssessmentDetailPage({ navigate, assessmentId }: Props) {
  const { data: assessment, isLoading } = useAdminDamageAssessmentDetail(assessmentId)

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
  )

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('damage-assessments')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600"
      >
        <ChevronLeftIcon /> Back To Damage Assessments
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">Damage Assessment Details</h1>
        <p className="text-sm text-gray-500">Full details of the submitted damage report</p>
      </div>

      {assessment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Header card */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {assessment.location[0]?.toUpperCase() ?? 'D'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Assessment #{String(Number(assessment.id)).padStart(3, '0')}</p>
                  <p className="font-semibold text-gray-800 truncate">{assessment.location}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${STATUS_BADGE[assessment.status ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                {(assessment.status ?? '').replace(/_/g, ' ')}
              </span>
            </div>

            {/* Meta row */}
            <div className="bg-teal-600 text-white rounded-xl p-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-teal-200 text-xs mb-0.5">Submitted</p>
                <p className="font-medium">{fmt(assessment.submitted_at ?? assessment.created_at)}</p>
              </div>
              <div>
                <p className="text-teal-200 text-xs mb-0.5">Property Type</p>
                <p className="font-medium">{assessment.property_type ?? '—'}</p>
              </div>
              <div>
                <p className="text-teal-200 text-xs mb-0.5">Damage Severity</p>
                <p className="font-medium">{assessment.damage_severity}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{assessment.description}</p>
            </div>

            {/* Images */}
            {assessment.images && assessment.images.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-semibold text-gray-800 mb-3">Attached Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {assessment.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-gray-100 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={img.file_url}
                        alt={img.name ?? img.file_name ?? `Image ${idx + 1}`}
                        className="w-full h-36 object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — info sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Assessment Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID</span>
                  <span className="text-gray-700 font-medium">#{String(Number(assessment.id)).padStart(3, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[assessment.status ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                    {(assessment.status ?? '').replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Severity</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_BADGE[assessment.damage_severity] ?? 'bg-gray-100 text-gray-600'}`}>
                    {assessment.damage_severity}
                  </span>
                </div>
                {assessment.property_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Property</span>
                    <span className="text-gray-700">{assessment.property_type}</span>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Location</span>
                  <span className="text-gray-700 text-right">{assessment.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Submitted</span>
                  <span className="text-gray-700">{fmt(assessment.submitted_at ?? assessment.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Images</span>
                  <span className="text-gray-700">{assessment.images?.length ?? 0}</span>
                </div>

                {assessment.citizen && (
                  <>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-400 font-medium mb-2">Citizen</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name</span>
                      <span className="text-gray-700 font-medium">{assessment.citizen.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">National ID</span>
                      <span className="text-gray-700">{assessment.citizen.national_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone</span>
                      <span className="text-gray-700">{assessment.citizen.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
