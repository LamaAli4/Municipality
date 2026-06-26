import { useState, useRef, useEffect } from 'react'
import PageWrapper from '../components/ui/PageWrapper'
import type { NavigateFn } from '../lib/types'
import { PlusIcon, EditIcon, TrashIcon } from '../lib/icons'
import SectionHeader from '../components/ui/SectionHeader'
import { PrimaryBtn } from '../components/ui/Button'
import { SearchBar } from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import { useAdminServices, useDeleteService, usePublishService, useArchiveService } from '../services/servicesService'
import type { Service } from '../services/servicesService'
import DeleteModal from './modals/DeleteModal'

const STATUS_OPTIONS = [
  { value: '',          label: 'All statuses' },
  { value: 'DRAFT',     label: 'DRAFT'        },
  { value: 'PUBLISHED', label: 'PUBLISHED'    },
  { value: 'ARCHIVED',  label: 'ARCHIVED'     },
]

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const label = STATUS_OPTIONS.find(o => o.value === value)?.label ?? 'All statuses'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[130px]"
      >
        <span>{label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 right-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {STATUS_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  opt.value === value
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-teal-50'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT:     'bg-yellow-100 text-yellow-700',
  ARCHIVED:  'bg-gray-100 text-gray-500',
}

export default function ServicePage({ navigate }: { navigate: NavigateFn }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const PAGE_SIZE = 5

  const { data: services = [], isLoading } = useAdminServices(status || undefined)
  const deleteService = useDeleteService()
  const publishService = usePublishService()
  const archiveService = useArchiveService()

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <PageWrapper>
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

      <SearchBar placeholder="Search by service name" onSearch={v => { setSearch(v); setPage(1) }}>
        <StatusSelect value={status} onChange={v => { setStatus(v); setPage(1) }} />
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
            ) : paginated.map((s, i) => (
              <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
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
        <Pagination current={page} total={totalPages} onChange={setPage} />
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
    </PageWrapper>
  )
}
