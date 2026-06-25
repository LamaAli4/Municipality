import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { PlusIcon, EditIcon, TrashIcon } from '../lib/icons'
import SectionHeader from '../components/ui/SectionHeader'
import { PrimaryBtn } from '../components/ui/Button'
import { SearchBar } from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import { useAdminServices, useDeleteService, usePublishService, useArchiveService } from '../services/servicesService'
import type { Service } from '../services/servicesService'
import DeleteModal from './modals/DeleteModal'

const STATUS_OPTIONS = ['', 'DRAFT', 'PUBLISHED', 'ARCHIVED'] as const

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT:     'bg-yellow-100 text-yellow-700',
  ARCHIVED:  'bg-gray-100 text-gray-500',
}

export default function ServicePage({ navigate }: { navigate: NavigateFn }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [deletingService, setDeletingService] = useState<Service | null>(null)

  const { data: services = [], isLoading } = useAdminServices(status || undefined)
  const deleteService = useDeleteService()
  const publishService = usePublishService()
  const archiveService = useArchiveService()

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
    <div>
      <SectionHeader
        title="Municipal services administration"
        subtitle="Presentation and management of services provided to citizens"
        action={
          <PrimaryBtn
            label="Add a new service"
            icon={<PlusIcon />}
            onClick={() => navigate('add-service')}
          />
        }
      />

      <SearchBar placeholder="Search by service name" onSearch={setSearch}>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s || 'All statuses'}</option>
          ))}
        </select>
      </SearchBar>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Service name', 'Status', 'Fee', 'Proc. days', 'Edit', 'Delete'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No services found</td>
              </tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{s.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {s.status}
                    </span>
                    {s.status === 'DRAFT' && (
                      <button
                        onClick={() => publishService.mutate(s.id)}
                        disabled={publishService.isPending}
                        className="text-xs font-medium text-green-600 hover:text-green-800 disabled:opacity-50"
                      >
                        Publish
                      </button>
                    )}
                    {s.status === 'PUBLISHED' && (
                      <button
                        onClick={() => archiveService.mutate(s.id)}
                        disabled={archiveService.isPending}
                        className="text-xs font-medium text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{s.fee}</td>
                <td className="px-4 py-3 text-gray-500">{s.estimated_processing_days}d</td>
                <td className="px-4 py-3"><button className="text-gray-400 hover:text-primary" onClick={() => navigate('service-detail', { serviceId: s.id })}><EditIcon /></button></td>
                <td className="px-4 py-3"><button className="text-gray-400 hover:text-red-500" onClick={() => setDeletingService(s)}><TrashIcon /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </div>

    {deletingService && (
      <DeleteModal
        title="Delete service"
        message={`Are you sure you want to delete "${deletingService.name}"? This action cannot be undone.`}
        isPending={deleteService.isPending}
        onClose={() => setDeletingService(null)}
        onConfirm={() => deleteService.mutate(deletingService.id, { onSuccess: () => setDeletingService(null) })}
      />
    )}
    </>
  )
}
