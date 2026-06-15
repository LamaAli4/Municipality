import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon } from '../../lib/icons'

interface Props { navigate: CitizenNavigateFn }

const timeline = [
  { label: 'Application submitted', date: '12/1/2024', done: true },
  { label: 'Application received', date: '13/1/2024', done: true },
  { label: 'Under initial review', date: '15/1/2024', done: true },
  { label: 'Site inspection', date: '20/1/2024', done: false },
  { label: 'Technical approval', date: '—', done: false },
  { label: 'Permit issued', date: '—', done: false },
]

const docs = [
  { name: 'Property Deed', status: 'Verified' },
  { name: 'Architectural Plans', status: 'Under review' },
  { name: 'Owner ID Copy', status: 'Verified' },
]

export default function RequestDetailPage({ navigate }: Props) {
  return (
    <div className="space-y-6">
      <button onClick={() => navigate('my-requests')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To My Requests
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Building Permit</h1>
          <p className="text-sm text-gray-500">#REQ-2024-001 • Submitted 12/1/2024</p>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">In process</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Info + Timeline */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Request Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Service', 'Building Permit'],
                ['Department', 'Buildings & Infrastructure'],
                ['Request Number', '#REQ-2024-001'],
                ['Submission Date', '12/1/2024'],
                ['Expected Completion', '27/1/2024'],
                ['Service Fee', '$525.00 (Paid)'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-gray-400 text-xs mb-0.5">{k}</p>
                  <p className="text-gray-700 font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Documents</h2>
            <div className="space-y-3">
              {docs.map(doc => (
                <div key={doc.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    doc.status === 'Verified' ? 'bg-teal-100 text-teal-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Request Timeline</h2>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 ${item.done ? 'bg-teal-500' : 'bg-gray-200'}`} />
                  {i < timeline.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${item.done ? 'bg-teal-300' : 'bg-gray-200'}`} style={{ minHeight: '20px' }} />}
                </div>
                <div className="pb-3">
                  <p className={`text-sm font-medium ${item.done ? 'text-gray-800' : 'text-gray-400'}`}>{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
