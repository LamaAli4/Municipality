import { useState } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { EditIcon, TrashIcon, PlusIcon } from '@/lib/icons'
import Modal from '@/components/ui/Modal'
import { BtnCancel, BtnConfirm } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const sections = [
  { id: 1, name: 'Water Supply Section', employees: 8, services: 3 },
  { id: 2, name: 'Sewage Section', employees: 5, services: 2 },
  { id: 3, name: 'Meter Reading Section', employees: 4, services: 1 },
]

export default function ManagerDeptPage() {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Department Management</h1>
        <p className="text-sm text-gray-500">Water Department — manage sections</p>
      </div>

      <div className="flex items-center justify-between">
        <SearchBar placeholder="Search sections..." />
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium ml-4" style={{ background: 'linear-gradient(135deg,#0d9488,#0a7569)' }}>
          <PlusIcon /> Add Section
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Section name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Employees</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Services</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.employees}</td>
                <td className="px-4 py-3 text-gray-600">{s.services}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button><EditIcon /></button>
                    <button><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add Section" icon={<PlusIcon />} onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <Input label="Section name" placeholder="Enter section name" />
          </div>
          <div className="flex justify-between mt-6">
            <BtnCancel onClick={() => setShowAdd(false)} />
            <BtnConfirm label="Add Section" />
          </div>
        </Modal>
      )}
    </div>
  )
}
