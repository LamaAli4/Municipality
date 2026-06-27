import { useState } from 'react'
import type { CitizenNavigateFn } from '../../lib/types'
import { useServices } from '../../services/servicesService'
import PageWrapper from '../../components/ui/PageWrapper'

interface Props { navigate: CitizenNavigateFn }

export default function ServicesPage({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const { data: services = [], isLoading, isError } = useServices()

  const tabs = ['All', ...services.map(s => s.name)]

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchTab    = activeTab === 'All' || s.name === activeTab
    return matchSearch && matchTab
  })

  return (
    <PageWrapper>
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Services</h1>
        <p className="text-sm text-gray-500">Browse and apply for available government services</p>
      </div>

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

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab
                ? 'bg-teal-600 text-white'
                : 'border border-teal-300 text-teal-700 hover:bg-teal-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading services...</div>
      )}
      {isError && (
        <div className="text-center py-16 text-red-500 text-sm">Failed to load services</div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400 text-sm">No services found</div>
          ) : filtered.map(service => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{service.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{service.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{service.estimated_processing_days} days</span>
                <span>{service.fee === 0 ? 'Free' : `$${service.fee}`}</span>
              </div>
              <button
                onClick={() => navigate('service-detail', { serviceId: service.id })}
                className="w-full py-2 rounded-lg text-white text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
              >
                Submit the application
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </PageWrapper>
  )
}
