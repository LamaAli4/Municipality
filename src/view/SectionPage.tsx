import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { sections } from '../lib/data'
import { ChevronLeftIcon, ChevronDownIcon, PlusIcon, EditIcon, TrashIcon } from '../lib/icons'
import { PrimaryBtn } from '../components/ui/Button'
import AddSectionModal from './modals/AddSectionModal'
import EditSectionModal from './modals/EditSectionModal'
import DeleteModal from './modals/DeleteModal'

type Modal = 'add' | 'edit' | 'delete' | null

export default function SectionPage({ navigate }: { navigate: NavigateFn }) {
  const [modal, setModal] = useState<Modal>(null)

  return (
    <div>
      {modal === 'add'    && <AddSectionModal  onClose={() => setModal(null)} />}
      {modal === 'edit'   && <EditSectionModal onClose={() => setModal(null)} />}
      {modal === 'delete' && (
        <DeleteModal
          title="Delete section"
          message="Are you sure you want to delete this section? This action cannot be undone."
          onClose={() => setModal(null)}
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
          <h1 className="text-xl font-bold text-gray-800">Section Management - Water Department</h1>
        </div>
        <PrimaryBtn label="Add new section" icon={<PlusIcon />} onClick={() => setModal('add')} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-end p-3 border-b border-gray-100">
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Water Department <ChevronDownIcon />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Section', 'Department', 'Num employees', 'Edit', 'Delete'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map(s => (
              <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{s.id}</td>
                <td className="px-4 py-3 text-gray-700">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{s.dept}</td>
                <td className="px-4 py-3 text-gray-500">{s.employees} employees</td>
                <td className="px-4 py-3">
                  <button onClick={() => setModal('edit')}><EditIcon /></button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setModal('delete')}><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
