import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { useAdminUsers, useDisableUser } from '../services/adminService'
import { CitizensIcon, EyeIcon, TrashIcon } from '../lib/icons'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { SearchBar, FilterBtn } from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import SectionHeader from '../components/ui/SectionHeader'
import DeleteModal from './modals/DeleteModal'

export default function CitizensPage({ navigate }: { navigate: NavigateFn }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const PAGE_SIZE = 5

  const { data: users = [], isLoading, isError } = useAdminUsers('CITIZEN')
  const deleteUser = useDisableUser()

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (u.national_id ?? '').includes(search) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {deleteTarget && (
        <DeleteModal
          title="Disable Citizen"
          message={`Are you sure you want to disable "${deleteTarget.name}"?`}
          isPending={deleteUser.isPending}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() =>
            deleteUser.mutate(deleteTarget.id, {
              onSuccess: () => setDeleteTarget(null),
            })
          }
        />
      )}

      <SectionHeader
        title="Citizens management"
        subtitle="View and manage the accounts of citizens registered in the system"
      />

      <div className="mb-6 max-w-xs">
        <StatCard
          label="Total citizens"
          value={isLoading ? '…' : String(users.length)}
          icon={<CitizensIcon />}
        />
      </div>

      <SearchBar placeholder="Enter name, email or national ID" onSearch={v => { setSearch(v); setPage(1) }}>
        <FilterBtn />
      </SearchBar>

      {isLoading && (
        <div className="text-center py-12 text-gray-400 text-sm">Loading citizens…</div>
      )}
      {isError && (
        <div className="text-center py-12 text-red-500 text-sm">Failed to load citizens</div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                {['#', 'Citizen', 'National ID', 'Email', 'Status', 'View', 'Delete'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((u, i) => (
                <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.national_id ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><Badge status={u.account_status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => navigate('citizen-detail', { userId: u.id })}>
                      <EyeIcon />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteTarget({ id: u.id, name: u.full_name })}>
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No citizens found</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
