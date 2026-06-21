import { useState } from 'react'
import type { CitizenNavigateFn } from '@/lib/types'

interface Props { navigate: CitizenNavigateFn }

const categories = ['All', 'Infrastructure', 'Water', 'Electricity', 'Roads', 'Buildings']

const services = [
  { id: 1, name: 'Building Permit', category: 'Buildings', desc: 'Apply for a permit to construct or modify a building', days: 15, fee: 500 },
  { id: 2, name: 'Water Subscription', category: 'Water', desc: 'Subscribe to water supply services for your property', days: 7, fee: 150 },
  { id: 3, name: 'Electricity Connection', category: 'Electricity', desc: 'Connect your property to the electricity grid', days: 10, fee: 300 },
  { id: 4, name: 'Road Damage Report', category: 'Roads', desc: 'Report damage to roads and request repairs', days: 5, fee: 0 },
  { id: 5, name: 'Infrastructure Inspection', category: 'Infrastructure', desc: 'Request an inspection of local infrastructure', days: 8, fee: 200 },
  { id: 6, name: 'Water Meter Installation', category: 'Water', desc: 'Install a new water meter for your property', days: 5, fee: 250 },
]

export default function ServicesPage({ navigate }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = services.filter(s => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Services</h1>
        <p className="text-sm text-gray-500">Browse and apply for available government services</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-teal-600 text-white'
                : 'border border-teal-300 text-teal-700 hover:bg-teal-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">{service.category}</span>
            <h3 className="font-semibold text-gray-800 mt-2 mb-1">{service.name}</h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.desc}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{service.days} days</span>
              <span>{service.fee === 0 ? 'Free' : `$${service.fee}`}</span>
            </div>
            <button
              onClick={() => navigate('service-detail')}
              className="w-full py-2 rounded-lg text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
            >
              Submit the application
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
