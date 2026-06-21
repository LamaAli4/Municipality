import { useState } from 'react'
import type { CitizenNavigateFn } from '@/lib/types'

interface Props { navigate: CitizenNavigateFn }

const propertyTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural']
const damageLevels = ['Minor', 'Moderate', 'Severe', 'Critical']

export default function DamageAssessmentPage({ navigate }: Props) {
  const [propertyType, setPropertyType] = useState('')
  const [damageLevel, setDamageLevel] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Damage Assessment</h1>
        <p className="text-sm text-gray-500">Report damage to your property for assessment</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl space-y-6">
        {/* Property Information */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Property Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Owner Name</label>
              <input type="text" placeholder="Full name" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">National ID</label>
              <input type="text" placeholder="ID number" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Property Address</label>
              <input type="text" placeholder="Street address" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City / District</label>
              <input type="text" placeholder="City or district" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
        </section>

        {/* Property Type */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">Property Type</h2>
          <div className="grid grid-cols-4 gap-3">
            {propertyTypes.map(t => (
              <button
                key={t}
                onClick={() => setPropertyType(t)}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  propertyType === t ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-teal-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Damage Level */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">Damage Level</h2>
          <div className="grid grid-cols-4 gap-3">
            {damageLevels.map((level, i) => {
              const colors = ['bg-yellow-100 border-yellow-400 text-yellow-700', 'bg-orange-100 border-orange-400 text-orange-700', 'bg-red-100 border-red-400 text-red-700', 'bg-red-200 border-red-600 text-red-800']
              const isSelected = damageLevel === level
              return (
                <button
                  key={level}
                  onClick={() => setDamageLevel(level)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected ? colors[i] : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {level}
                </button>
              )
            })}
          </div>
        </section>

        {/* Damage Details */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Damage Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date of Damage</label>
              <input type="date" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Cause of Damage</label>
              <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select cause</option>
                <option>Flood</option>
                <option>Fire</option>
                <option>Earthquake</option>
                <option>Storm</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                placeholder="Describe the damage in detail..."
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Photos */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">Damage Photos</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 cursor-pointer">
            <svg className="mx-auto mb-2 text-gray-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="text-sm text-gray-500">Upload damage photos</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB each</p>
          </div>
        </section>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate('home')}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate('my-requests')}
            className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
