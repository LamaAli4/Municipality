import { useState } from 'react'
import PageWrapper from '../components/ui/PageWrapper'
import type { NavigateFn } from '../lib/types'
import type { Department } from '../services/departmentsService'
import { useDepartments, useDeleteDepartment } from '../services/departmentsService'
import { useSections } from '../services/sectionsService'
import { SearchIcon, PlusIcon, EyeIcon, EditIcon, TrashIcon } from '../lib/icons'
import SectionHeader from '../components/ui/SectionHeader'
import { PrimaryBtn } from '../components/ui/Button'
import AddDepartmentModal from './modals/AddDepartmentModal'
import EditDepartmentModal from './modals/EditDepartmentModal'
import DeleteModal from './modals/DeleteModal'
import Pagination from '../components/ui/Pagination'

type Modal = 'add' | 'edit' | 'delete' | null

export default function DepartmentPage({ navigate }: { navigate: NavigateFn }) {
  const [modal, setModal] = useState<Modal>(null)
  const [selected, setSelected] = useState<Department | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5
  const { data: departments = [], isLoading, isError } = useDepartments()
  const { data: allSections = [] } = useSections()
  const deleteDepartment = useDeleteDepartment()

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function sectionsCount(deptId: string) {
    return allSections.filter(s => s.department_id === deptId).length
  }

  function openEdit(d: Department) {
    setSelected(d)
    setModal('edit')
  }

  function openDelete(d: Department) {
    setSelected(d)
    setModal('delete')
  }

  return (
    <PageWrapper>
    <div>
      {modal === 'add' && <AddDepartmentModal onClose={() => setModal(null)} />}
      {modal === 'edit' && selected && (
        <EditDepartmentModal department={selected} onClose={() => setModal(null)} />
      )}
      {modal === 'delete' && selected && (
        <DeleteModal
          title="Delete department"
          message="Are you sure you want to delete this department? This action cannot be undone."
          onClose={() => setModal(null)}
          onConfirm={() => deleteDepartment.mutate(selected.id, { onSuccess: () => setModal(null) })}
          isPending={deleteDepartment.isPending}
        />
      )}

      <SectionHeader
        title="Department management"
        subtitle="Presentation and management of departments in the municipality"
        action={<PrimaryBtn label="Add Department" icon={<PlusIcon />} onClick={() => setModal('add')} />}
      />

      <div className="search-gradient rounded-xl p-4 mb-6">
        <div className="bg-white rounded-lg flex items-center gap-2 px-3 py-2.5 shadow-sm">
          <SearchIcon />
          <input
            className="flex-1 outline-none text-sm text-gray-600 bg-transparent"
            placeholder="Enter the name of the department"
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-400 text-sm">Loading departments…</div>
      )}
      {isError && (
        <div className="text-center py-12 text-red-500 text-sm">Failed to load departments</div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                {['#', 'Department name', 'Description', 'Num sections', 'View', 'Edit', 'Delete'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={d.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{d.name}</td>
                  <td className="px-4 py-3 text-gray-500">{d.description ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{sectionsCount(d.id)} sections</td>
                  <td className="px-4 py-3">
                    <button onClick={() => navigate('sections', { departmentId: d.id })}><EyeIcon /></button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(d)}><EditIcon /></button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openDelete(d)}><TrashIcon /></button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No departments found</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
    </PageWrapper>
  )
}
