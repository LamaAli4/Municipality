import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon } from '../../lib/icons'
import { useDamageAssessmentDetail } from '../../services/damageAssessmentService'
import type { DamageAssessmentImageResponse } from '../../services/damageAssessmentService'
import PageWrapper from '../../components/ui/PageWrapper'

interface Props {
  navigate: CitizenNavigateFn
  assessmentId: string | null
}

const PROPERTY_LABEL: Record<string, string> = {
  RESIDENTIAL_HOUSE:     'Residential House',
  RESIDENTIAL_APARTMENT: 'Residential Apartment',
  PUBLIC_FACILITY:       'Public Facility',
  COMMERCIAL_SHOP:       'Commercial Shop',
  AGRICULTURAL_LAND:     'Agricultural Land',
  OTHER:                 'Other',
}

const SEVERITY_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  MINOR:    { label: 'Minor',    color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  MODERATE: { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  SEVERE:   { label: 'Severe',   color: 'bg-red-100 text-red-700',     dot: 'bg-red-500' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SUBMITTED: { label: 'Submitted', color: 'bg-orange-100 text-orange-600' },
  PENDING:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-600' },
  APPROVED:  { label: 'Approved',  color: 'bg-teal-100 text-teal-700' },
  REJECTED:  { label: 'Rejected',  color: 'bg-red-100 text-red-600' },
  REVIEWED:  { label: 'Reviewed',  color: 'bg-blue-100 text-blue-600' },
}

function fmt(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function getImageUrl(img: DamageAssessmentImageResponse | string): string {
  if (typeof img === 'string') return img
  return img.file_url
}

function getImageName(img: DamageAssessmentImageResponse | string, i: number): string {
  if (typeof img === 'string') return `Image ${i + 1}`
  return img.name ?? img.file_name ?? `Image ${i + 1}`
}

export default function DamageAssessmentDetailPage({ navigate, assessmentId }: Props) {
  const { data: assessment, isLoading } = useDamageAssessmentDetail(assessmentId)

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
  )

  if (!assessment) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Assessment not found</div>
  )

  const propertyLabel = PROPERTY_LABEL[assessment.property_type] ?? assessment.property_type ?? '—'
  const severity      = SEVERITY_CONFIG[assessment.damage_severity]
  const status        = STATUS_CONFIG[assessment.status ?? ''] ?? { label: assessment.status ?? 'Unknown', color: 'bg-gray-100 text-gray-600' }
  const images        = (assessment.images ?? []) as (DamageAssessmentImageResponse | string)[]

  return (
    <PageWrapper>
      <div className="space-y-5">
        <button
          onClick={() => navigate('damage-assessment')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600"
        >
          <ChevronLeftIcon /> Back To Damage Assessment
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-800">Assessment details</h1>
          <p className="text-sm text-gray-500">Damage assessment report for your property</p>
        </div>

        {/* Header card */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                <path d="M9 21V12h6v9"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-800">
              {propertyLabel !== '—' ? propertyLabel : 'Damage Assessment'}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Meta bar */}
        <div className="bg-teal-600 text-white rounded-xl p-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-teal-200 text-xs mb-0.5">Submitted</p>
            <p className="font-medium">{fmt(assessment.submitted_at ?? assessment.created_at)}</p>
          </div>
          <div>
            <p className="text-teal-200 text-xs mb-0.5">Location</p>
            <p className="font-medium truncate">{assessment.location || '—'}</p>
          </div>
          <div>
            <p className="text-teal-200 text-xs mb-0.5">Damage severity</p>
            <div className="flex items-center gap-1.5">
              {severity && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severity.dot}`} />}
              <p className="font-medium">{severity?.label ?? assessment.damage_severity}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* ── Left (2/3) ─────────────────────────── */}
          <div className="col-span-2 space-y-4">

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-3">Description</h2>
              {assessment.description ? (
                <p className="text-sm text-gray-600 leading-relaxed">{assessment.description}</p>
              ) : (
                <p className="text-sm text-gray-400">No description provided</p>
              )}
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">
                Uploaded images
                <span className="ml-2 text-xs font-normal text-gray-400">({images.length})</span>
              </h2>
              {images.length === 0 ? (
                <p className="text-sm text-gray-400">No images uploaded</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <a
                      key={i}
                      href={getImageUrl(img)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative"
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={getImageName(img, i)}
                        className="w-full h-28 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                        <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right (1/3) ────────────────────────── */}
          <div className="space-y-4">

            {/* Property info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Property info</h2>
              <div className="space-y-3">
                {assessment.property_type && (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs text-gray-400 mt-0.5 shrink-0">Type</span>
                      <span className="text-sm text-gray-700 text-right font-medium">{propertyLabel}</span>
                    </div>
                    <div className="border-t border-gray-100" />
                  </>
                )}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-gray-400 mt-0.5 shrink-0">Location</span>
                  <span className="text-sm text-gray-700 text-right">{assessment.location || '—'}</span>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-gray-400 mt-0.5 shrink-0">Severity</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severity?.color ?? 'bg-gray-100 text-gray-600'}`}>
                    {severity?.label ?? assessment.damage_severity}
                  </span>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-gray-400 mt-0.5 shrink-0">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-gray-400 mt-0.5 shrink-0">Submitted</span>
                  <span className="text-sm text-gray-700">{fmt(assessment.submitted_at ?? assessment.created_at)}</span>
                </div>
                {assessment.updated_at && (
                  <>
                    <div className="border-t border-gray-100" />
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs text-gray-400 mt-0.5 shrink-0">Updated</span>
                      <span className="text-sm text-gray-700">{fmt(assessment.updated_at)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
