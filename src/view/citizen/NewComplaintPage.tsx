import type { CitizenNavigateFn } from '@/lib/types'
import { ChevronLeftIcon } from '@/lib/icons'

interface Props { navigate: CitizenNavigateFn }

export default function NewComplaintPage({ navigate }: Props) {
  return (
    <div className="space-y-6">
      <button onClick={() => navigate('complaints')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Complaints
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">Submit New Complaint</h1>
        <p className="text-sm text-gray-500">Describe your issue and we'll look into it</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700">Related Service</label>
          <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">Select a service</option>
            <option>Building Permit</option>
            <option>Water Subscription</option>
            <option>Electricity Connection</option>
            <option>Road Damage Report</option>
            <option>Utility Bills</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Complaint Title</label>
          <input
            type="text"
            placeholder="Brief title for your complaint"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={5}
            placeholder="Describe your complaint in detail..."
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Attachment (optional)</label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 cursor-pointer">
            <svg className="mx-auto mb-2 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
            </svg>
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate('complaints')}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate('complaints')}
            className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            Submit Complaint
          </button>
        </div>
      </div>
    </div>
  )
}
