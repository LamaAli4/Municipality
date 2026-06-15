import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon } from '../../lib/icons'

interface Props { navigate: CitizenNavigateFn }

const requiredDocs = ['Property Deed', 'Architectural Plans', 'Owner ID Copy', 'Site Survey', 'Previous permit (if any)']
const steps = [
  'Submit application and required documents',
  'Initial review by department (2-3 days)',
  'Site inspection scheduled',
  'Technical review and approval',
  'Payment of fees',
  'Permit issued',
]

export default function ServiceDetailPage({ navigate }: Props) {
  return (
    <div className="space-y-6">
      <button onClick={() => navigate('services')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Services
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">Building Permit</h1>
        <p className="text-sm text-gray-500">Infrastructure • Buildings Department</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main info */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Service Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Service type', 'Building permit'],
                ['Department', 'Buildings & Infrastructure'],
                ['Processing time', '15 working days'],
                ['Service fee', '$500'],
                ['Validity period', '1 year from issue'],
                ['Renewal', 'Available 30 days before expiry'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-gray-400 text-xs mb-0.5">{k}</p>
                  <p className="text-gray-700 font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Service Path</h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Required Documents</h2>
            <ul className="space-y-2">
              {requiredDocs.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => navigate('service-request')}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            Start Application
          </button>
        </div>
      </div>
    </div>
  )
}
