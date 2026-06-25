import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { ChevronLeftIcon, ChevronDownIcon, PlusIcon, EyeIcon, EditIcon, TrashIcon } from '../lib/icons'
import { PrimaryBtn } from '../components/ui/Button'
import AddSectionModal from './modals/AddSectionModal'
import EditSectionModal from './modals/EditSectionModal'
import DeleteModal from './modals/DeleteModal'
import SectionDetailModal from './modals/SectionDetailModal'
import { useDepartment } from '../services/departmentsService'
import { useSections, useDeleteSection } from '../services/sectionsService'

type Modal = 'add' | 'edit' | 'delete' | 'view' | null

export default function SectionPage({ navigate, departmentId }: { navigate: NavigateFn; departmentId: string | null }) {
  const [modal, setModal] = useState<Modal>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data: department } = useDepartment(departmentId)
  const { data: sections = [], isLoading, isError } = useSections(departmentId)
  const deleteSection = useDeleteSection()

  const departmentName = department?.name ?? 'Department'

  return (
    <div>
      {modal === 'view' && selectedId && (
        <SectionDetailModal sectionId={selectedId} onClose={() => setModal(null)} />
      )}
      {modal === 'add' && <AddSectionModal onClose={() => setModal(null)} departmentId={departmentId} />}
      {modal === 'edit' && selectedId && (
        <EditSectionModal sectionId={selectedId} departmentId={departmentId} onClose={() => setModal(null)} />
      )}
      {modal === 'delete' && selectedId && (
        <DeleteModal
          title="Delete section"
          message="Are you sure you want to delete this section? This action cannot be undone."
          onClose={() => setModal(null)}
          onConfirm={() =>
            deleteSection.mutate(
              { id: selectedId, department_id: departmentId ?? '' },
              { onSuccess: () => setModal(null) }
            )
          }
          isPending={deleteSection.isPending}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('department')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-2"
          >
            <ChevronLeftIcon /> Back to managing departments
          </button>
          <h1 className="text-xl font-bold text-gray-800">Section Management - {departmentName}</h1>
        </div>
        <PrimaryBtn label="Add new section" icon={<PlusIcon />} onClick={() => setModal('add')} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-end p-3 border-b border-gray-100">
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            {departmentName} <ChevronDownIcon />
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-gray-400 text-sm">Loading sections…</div>
        )}
        {isError && (
          <div className="text-center py-12 text-red-500 text-sm">Failed to load sections</div>
        )}

        {!isLoading && !isError && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                {['#', 'Section', 'Department', 'Num employees', 'View', 'Edit', 'Delete'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((s, i) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.department?.name ?? departmentName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {(s.employees_count ?? s._count?.employees ?? 0)} employees
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelectedId(s.id); setModal('view') }}><EyeIcon /></button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelectedId(s.id); setModal('edit') }}><EditIcon /></button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelectedId(s.id); setModal('delete') }}><TrashIcon /></button>
                  </td>
                </tr>
              ))}
              {sections.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No sections found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
