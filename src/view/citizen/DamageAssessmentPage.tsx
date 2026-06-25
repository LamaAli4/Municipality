import { useState } from 'react'
import { toast } from 'react-toastify'
import type { CitizenNavigateFn } from '../../lib/types'
import {
  useSubmissionStatus,
  useDamageAssessments,
  useCreateAssessment,
} from '../../services/damageAssessmentService'

interface Props { navigate: CitizenNavigateFn }

// ── Constants ──────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  { value: 'RESIDENTIAL_HOUSE',      label: 'Residential house',      icon: HouseIcon },
  { value: 'RESIDENTIAL_APARTMENT',  label: 'Residential apartment',  icon: ApartmentIcon },
  { value: 'PUBLIC_FACILITY',        label: 'Public facility',        icon: FacilityIcon },
  { value: 'COMMERCIAL_SHOP',        label: 'Commercial shop',        icon: ShopIcon },
  { value: 'AGRICULTURAL_LAND',      label: 'Agricultural land',      icon: LandIcon },
  { value: 'OTHER',                  label: 'Other',                  icon: OtherIcon },
]

const DAMAGE_LEVELS = [
  {
    value: 'MINOR',
    label: 'Minor',
    desc: 'Broken windows, damaged paint',
    color: 'border-green-400 bg-green-50 text-green-700',
    dot: 'bg-green-500',
    idle: 'border-gray-200 hover:border-green-300',
  },
  {
    value: 'AVERAGE',
    label: 'Average',
    desc: 'Wall cracks, damage to services',
    color: 'border-yellow-400 bg-yellow-50 text-yellow-700',
    dot: 'bg-yellow-500',
    idle: 'border-gray-200 hover:border-yellow-300',
  },
  {
    value: 'SEVERE',
    label: 'Severe',
    desc: 'Partial collapse, damage to services',
    color: 'border-orange-400 bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
    idle: 'border-gray-200 hover:border-orange-300',
  },
  {
    value: 'TOTAL_COLLAPSE',
    label: 'Total collapse',
    desc: 'Uninhabitable, complete destruction',
    color: 'border-red-400 bg-red-50 text-red-700',
    dot: 'bg-red-500',
    idle: 'border-gray-200 hover:border-red-300',
  },
]

const GOVERNORATES = ['GAZA', 'MIDDLE', 'KHAN_YOUNIS', 'RAFAH', 'NORTH']
const GOV_LABEL: Record<string, string> = {
  GAZA: 'Gaza', MIDDLE: 'Middle', KHAN_YOUNIS: 'Khan Younis', RAFAH: 'Rafah', NORTH: 'North',
}

const STRUCTURAL = ['Walls', 'Ceiling', 'Foundations']
const SERVICES    = ['Water', 'Sanitation', 'Electricity']

// ── Small icon components ──────────────────────────────────────────────────────

function HouseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function ApartmentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <path d="M9 3v18M3 9h6M3 15h6M15 9h6M15 15h6"/>
    </svg>
  )
}
function FacilityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V12h6v9M12 7v1"/>
      <path d="M12 10h.01"/>
    </svg>
  )
}
function ShopIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}
function LandIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
      <path d="M12 6v6l4 2"/>
      <path d="M2 12h2M20 12h2M12 2v2M12 20v2"/>
    </svg>
  )
}
function OtherIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  )
}

// ── Already submitted view ─────────────────────────────────────────────────────

function AlreadySubmitted({ assessments }: { assessments: ReturnType<typeof useDamageAssessments>['data'] }) {
  const dmgLabel: Record<string, string> = {
    MINOR: 'Minor', AVERAGE: 'Average', SEVERE: 'Severe', TOTAL_COLLAPSE: 'Total collapse',
  }
  const dmgColor: Record<string, string> = {
    MINOR: 'bg-green-100 text-green-700',
    AVERAGE: 'bg-yellow-100 text-yellow-700',
    SEVERE: 'bg-orange-100 text-orange-700',
    TOTAL_COLLAPSE: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Damage assessment</h1>
        <p className="text-sm text-gray-500">Your submitted damage assessments</p>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p className="text-sm text-teal-700 font-medium">You have already submitted a damage assessment.</p>
      </div>

      {assessments && assessments.length > 0 && (
        <div className="space-y-3">
          {assessments.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800 capitalize">
                  {(a.property_type ?? '').replace(/_/g, ' ').toLowerCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dmgColor[a.damage_level] ?? 'bg-gray-100 text-gray-600'}`}>
                  {dmgLabel[a.damage_level] ?? a.damage_level}
                </span>
              </div>
              <p className="text-sm text-gray-500">{GOV_LABEL[a.governorate] ?? a.governorate}{a.area ? ` • ${a.area}` : ''}{a.street ? ` • ${a.street}` : ''}</p>
              {a.description && <p className="text-sm text-gray-600 mt-2">{a.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function DamageAssessmentPage({ navigate: _navigate }: Props) {
  const { data: status, isLoading: loadingStatus } = useSubmissionStatus()
  const { data: assessments } = useDamageAssessments()
  const { mutate: submit, isPending } = useCreateAssessment()

  const [propertyType,     setPropertyType]     = useState('')
  const [damageLevel,      setDamageLevel]      = useState('')
  const [governorate,      setGovernorate]      = useState('GAZA')
  const [area,             setArea]             = useState('')
  const [street,           setStreet]           = useState('')
  const [structural,       setStructural]       = useState<string[]>([])
  const [services,         setServices]         = useState<string[]>([])
  const [description,      setDescription]      = useState('')

  function toggleList(list: string[], setList: (v: string[]) => void, val: string) {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val])
  }

  function handleSubmit() {
    if (!propertyType) { toast.error('Please select a property type'); return }
    if (!damageLevel)  { toast.error('Please select a damage level');  return }

    submit(
      {
        property_type:      propertyType,
        damage_level:       damageLevel,
        governorate,
        area:               area || undefined,
        street:             street || undefined,
        structural_damage:  structural.length ? structural.map(s => s.toUpperCase()) : undefined,
        service_damage:     services.length   ? services.map(s => s.toUpperCase())   : undefined,
        description:        description || undefined,
      },
      {
        onSuccess: () => toast.success('Assessment submitted successfully'),
        onError:   () => toast.error('Failed to submit assessment'),
      }
    )
  }

  if (loadingStatus) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
  )

  if (status?.has_submitted) return <AlreadySubmitted assessments={assessments} />

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Damage assessment</h1>
        <p className="text-sm text-gray-500">Help us assess the damage to your property to expedite the reconstruction process.</p>
      </div>

      {/* Warning */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
        <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-sm text-orange-700">
          For documentation purposes, this information will be used to assess the damage and expedite the reconstruction process. Please ensure the accuracy of the data when entering it.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* ── Left (2/3) ─────────────────────────────────────── */}
        <div className="col-span-2 space-y-5">

          {/* Property type */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Type of damaged property</h2>
            <div className="grid grid-cols-3 gap-3">
              {PROPERTY_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPropertyType(value)}
                  className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border-2 text-xs font-medium transition-colors ${
                    propertyType === value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Damage level */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Estimated damage level</h2>
            <div className="grid grid-cols-2 gap-3">
              {DAMAGE_LEVELS.map(lvl => (
                <button
                  key={lvl.value}
                  onClick={() => setDamageLevel(lvl.value)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                    damageLevel === lvl.value ? lvl.color : `border-gray-200 text-gray-600 ${lvl.idle}`
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${lvl.dot}`} />
                  <div>
                    <p className="text-sm font-semibold">{lvl.label}</p>
                    <p className="text-xs opacity-80 mt-0.5">{lvl.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Geographical location */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Geographical location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Governorate</label>
                <select
                  value={governorate}
                  onChange={e => setGovernorate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {GOVERNORATES.map(g => (
                    <option key={g} value={g}>{GOV_LABEL[g]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Area</label>
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="Ex: Al Nser neighborhood"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Street / neighborhood</label>
                <input
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Street number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Damage details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Damage details</h2>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                Structural damage
              </p>
              <div className="flex gap-2 flex-wrap">
                {STRUCTURAL.map(s => {
                  const active = structural.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleList(structural, setStructural, s)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        active
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-300 text-gray-600 hover:border-teal-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        active ? 'border-teal-500 bg-teal-500' : 'border-gray-400'
                      }`}>
                        {active && (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </span>
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                Damage to services
              </p>
              <div className="flex gap-2 flex-wrap">
                {SERVICES.map(s => {
                  const active = services.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleList(services, setServices, s)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        active
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-300 text-gray-600 hover:border-teal-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        active ? 'border-teal-500 bg-teal-500' : 'border-gray-400'
                      }`}>
                        {active && (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </span>
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right (1/3) ────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Pictures & documents */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Pictures and documents</h2>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Image (mandatory)', accept: 'image/*',  icon: 'image',  required: true  },
                { label: 'Image (mandatory)', accept: 'image/*',  icon: 'image',  required: true  },
                { label: 'Image (mandatory)', accept: 'image/*',  icon: 'image',  required: true  },
                { label: 'Image (optional)',  accept: 'image/*',  icon: 'image',  required: false },
                { label: 'Video (optional)',  accept: 'video/*',  icon: 'video',  required: false },
                { label: 'File (optional)',   accept: '.pdf',     icon: 'file',   required: false },
              ].map((slot, i) => (
                <label
                  key={i}
                  className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors py-4"
                >
                  <input type="file" accept={slot.accept} className="hidden" />
                  {slot.icon === 'image' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                  {slot.icon === 'video' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <path d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                    </svg>
                  )}
                  {slot.icon === 'file' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  )}
                  <span className={`text-[10px] font-medium ${slot.required ? 'text-teal-600' : 'text-gray-400'}`}>
                    {slot.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-gray-400">Allowed file types: JPG, PNG, MP4. Maximum file size: 20 MB.</p>
          </div>

          {/* Additional description */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Additional description</h2>
            <textarea
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write down any notes regarding the damages..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between pt-2">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add another property
        </button>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
        >
          {isPending ? 'Submitting...' : 'Submit'}
          {!isPending && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
