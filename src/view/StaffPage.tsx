import { useState } from 'react'
import { employees } from '../lib/data'
import { StaffIcon, CitizensIcon, DisableUserIcon, EditIcon, TrashIcon, AddUserIcon } from '../lib/icons'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { SearchBar, FilterBtn } from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import SectionHeader from '../components/ui/SectionHeader'
import { PrimaryBtn } from '../components/ui/Button'
import AddEmployeeModal from './modals/AddEmployeeModal'
import EditEmployeeModal from './modals/EditEmployeeModal'
import DisableEmployeeModal from './modals/DisableEmployeeModal'

type Modal = 'add' | 'edit' | 'disable' | null

export default function StaffPage() {
  const [modal, setModal] = useState<Modal>(null)
  const [search, setSearch] = useState('')

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )
  const activeCount   = employees.filter(e => e.status === 'Active').length
  const inactiveCount = employees.filter(e => e.status === 'Inactive').length

  return (
    <div>
      {modal === 'add'     && <AddEmployeeModal     onClose={() => setModal(null)} />}
      {modal === 'edit'    && <EditEmployeeModal    onClose={() => setModal(null)} />}
      {modal === 'disable' && <DisableEmployeeModal onClose={() => setModal(null)} />}

      <SectionHeader
        title="Department staff management"
        action={
          <PrimaryBtn
            label="Add a new employee"
            icon={<AddUserIcon />}
            onClick={() => setModal('add')}
          />
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total employees"    value="500"                    icon={<StaffIcon />}       />
        <StatCard label="Active employees"   value={String(activeCount)}    icon={<CitizensIcon />}    />
        <StatCard label="Inactive employees" value={String(inactiveCount)}  icon={<DisableUserIcon />} />
      </div>

      <SearchBar placeholder="Search by employee name or number." onSearch={setSearch}>
        <FilterBtn />
      </SearchBar>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Employee', 'Section', 'Status', 'Tasks', 'Edit', 'Delete'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{e.id}</td>
                <td className="px-4 py-3 text-gray-700">{e.name}</td>
                <td className="px-4 py-3 text-gray-500">{e.section}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setModal('disable')}>
                    <Badge status={e.status} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                    {e.tasks} tasks
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setModal('edit')}><EditIcon /></button>
                </td>
                <td className="px-4 py-3"><button><TrashIcon /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </div>
  )
}
