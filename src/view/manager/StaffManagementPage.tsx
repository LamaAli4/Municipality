import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import { SearchBar } from '@/components/ui/SearchBar'
import StatCard from '@/components/ui/StatCard'
import { EditIcon, TrashIcon, AddUserIcon, StaffIcon } from '@/lib/icons'
import Modal from '@/components/ui/Modal'
import { BtnCancel, BtnConfirm } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const employees = [
  { id: 1, name: 'Ali Hassan', section: 'Water Section', status: 'Active' as const, tasks: 3 },
  { id: 2, name: 'Sara Ahmed', section: 'Building Section', status: 'Active' as const, tasks: 5 },
  { id: 3, name: 'Omar Khalid', section: 'Roads Section', status: 'Inactive' as const, tasks: 0 },
  { id: 4, name: 'Fatima Noor', section: 'Water Section', status: 'Active' as const, tasks: 2 },
  { id: 5, name: 'Yasser Al-Amin', section: 'Building Section', status: 'Active' as const, tasks: 4 },
]

export default function ManagerStaffPage() {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total employees" value={String(employees.length)} icon={<StaffIcon size={22} color="white" />} />
        <StatCard label="Active employees" value={String(employees.filter(e => e.status === 'Active').length)} icon={<StaffIcon size={22} color="white" />} />
        <StatCard label="Inactive employees" value={String(employees.filter(e => e.status === 'Inactive').length)} icon={<StaffIcon size={22} color="white" />} />
      </div>

      <div className="flex items-center justify-between">
        <SearchBar placeholder="Search staff..." />
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium ml-4" style={{ background: 'linear-gradient(135deg,#0d9488,#0a7569)' }}>
          <AddUserIcon /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Section</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Tasks</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={emp.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{emp.name}</td>
                <td className="px-4 py-3 text-gray-600">{emp.section}</td>
                <td className="px-4 py-3"><Badge status={emp.status} /></td>
                <td className="px-4 py-3 text-gray-600">{emp.tasks}</td>
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
        <Modal title="Add Employee" icon={<AddUserIcon />} onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <Input label="Full name" placeholder="Enter full name" />
            <Input label="Section" placeholder="Select section" />
            <Input label="Email" placeholder="Enter email" />
          </div>
          <div className="flex justify-between mt-6">
            <BtnCancel onClick={() => setShowAdd(false)} />
            <BtnConfirm label="Add Employee" />
          </div>
        </Modal>
      )}
    </div>
  )
}
