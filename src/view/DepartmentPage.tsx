import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { departments } from '../lib/data'
import { SearchIcon, PlusIcon, EyeIcon, TrashIcon } from '../lib/icons'
import SectionHeader from '../components/ui/SectionHeader'
import { PrimaryBtn } from '../components/ui/Button'
import AddDepartmentModal from './modals/AddDepartmentModal'
import DeleteModal from './modals/DeleteModal'

type Modal = 'add' | 'delete' | null

export default function DepartmentPage({ navigate }: { navigate: NavigateFn }) {
  const [modal, setModal] = useState<Modal>(null)
  const [search, setSearch] = useState('')

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {modal === 'add'    && <AddDepartmentModal onClose={() => setModal(null)} />}
      {modal === 'delete' && (
        <DeleteModal
          title="Delete department"
          message="Are you sure you want to delete this department? This action cannot be undone."
          onClose={() => setModal(null)}
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
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Department name', 'Description', 'Num sections', 'View', 'Delete'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{d.id}</td>
                <td className="px-4 py-3 text-gray-700">{d.name}</td>
                <td className="px-4 py-3 text-gray-500">{d.desc}</td>
                <td className="px-4 py-3 text-gray-500">{d.sections} sections</td>
                <td className="px-4 py-3">
                  <button onClick={() => navigate('sections')}><EyeIcon /></button>
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
