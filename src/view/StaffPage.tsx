import { useState } from 'react'
import { StaffIcon, CitizensIcon, DisableUserIcon, EditIcon, TrashIcon, AddUserIcon } from '../lib/icons'
import StatCard from '../components/ui/StatCard'
import CountUp from '../components/ui/CountUp'
import PageWrapper from '../components/ui/PageWrapper'
import Badge from '../components/ui/Badge'
import { SearchBar } from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import SectionHeader from '../components/ui/SectionHeader'
import { PrimaryBtn } from '../components/ui/Button'
import AddEmployeeModal from './modals/AddEmployeeModal'
import DeleteModal from './modals/DeleteModal'
import { useAdminUsers, useDeleteEmployee } from '../services/adminService'
import type { AdminUser } from '../services/adminService'
import { useSections } from '../services/sectionsService'
import EditEmployeeModal from './modals/EditEmployeeModal'

const PAGE_SIZE = 5

type RoleFilter = 'ALL' | 'ADMIN' | 'CITIZEN' | 'EMPLOYEE' | 'DEPARTMENT_MANAGER'

const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: 'ALL',                label: 'All'              },
  { value: 'ADMIN',              label: 'Admin'            },
  { value: 'CITIZEN',            label: 'Citizen'          },
  { value: 'EMPLOYEE',           label: 'Employee'         },
  { value: 'DEPARTMENT_MANAGER', label: 'Dept. Manager'    },
]

export default function StaffPage() {
  const [showAdd, setShowAdd]           = useState(false)
  const [editUser, setEditUser]         = useState<AdminUser | null>(null)
  const [deleteUser, setDeleteUser]     = useState<AdminUser | null>(null)
  const [search, setSearch]             = useState('')
  const [roleFilter, setRoleFilter]     = useState<RoleFilter>('ALL')
  const [page, setPage]                 = useState(1)

  const { data: employees = [], isLoading: loadingEmp } = useAdminUsers('EMPLOYEE')
  const { data: managers  = [], isLoading: loadingMgr } = useAdminUsers('DEPARTMENT_MANAGER')
  const { data: admins    = [], isLoading: loadingAdm } = useAdminUsers('ADMIN')
  const { data: citizens  = [], isLoading: loadingCit } = useAdminUsers('CITIZEN')
  const { data: allSections = [] }                      = useSections()
  const deleteEmployee = useDeleteEmployee()

  const isLoading = loadingEmp || loadingMgr || loadingAdm || loadingCit
  const allStaff  = [...admins, ...citizens, ...employees, ...managers]

  const sectionMap = Object.fromEntries(allSections.map(s => [s.id, s.name]))

  const filtered = allStaff
    .filter(u => roleFilter === 'ALL' || u.role === roleFilter)
    .filter(u =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCount   = allStaff.filter(e => e.account_status === 'ACTIVE').length
  const inactiveCount = allStaff.filter(e => e.account_status === 'INACTIVE').length

  return (
    <PageWrapper>
    <div>
      {showAdd  && <AddEmployeeModal onClose={() => setShowAdd(false)} />}
      {editUser && <EditEmployeeModal user={editUser} onClose={() => setEditUser(null)} />}
      {deleteUser && (
        <DeleteModal
          title="Delete employee"
          message={`Are you sure you want to delete "${deleteUser.full_name}"? This action cannot be undone.`}
          isPending={deleteEmployee.isPending}
          onClose={() => setDeleteUser(null)}
          onConfirm={() =>
            deleteEmployee.mutate(deleteUser.id, { onSuccess: () => setDeleteUser(null) })
          }
        />
      )}

      <SectionHeader
        title="Department staff management"
        action={
          <PrimaryBtn
            label="Add a new employee"
            icon={<AddUserIcon />}
            onClick={() => setShowAdd(true)}
          />
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total employees"    value={<CountUp to={allStaff.length} />} icon={<StaffIcon />}       />
        <StatCard label="Active employees"   value={<CountUp to={activeCount} />}     icon={<CitizensIcon />}    />
        <StatCard label="Inactive employees" value={<CountUp to={inactiveCount} />}   icon={<DisableUserIcon />} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <SearchBar placeholder="Search by employee name or email" onSearch={v => { setSearch(v); setPage(1) }} />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {ROLE_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setRoleFilter(tab.value); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              roleFilter === tab.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Employee', 'Section', 'Status', 'Role', 'Edit', 'Delete'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No employees found</td></tr>
            ) : paginated.map((e, i) => (
              <tr key={e.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{e.full_name}</p>
                  <p className="text-xs text-gray-400">{e.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {e.section_id ? (sectionMap[e.section_id] ?? e.section_id) : '—'}
                </td>
                <td className="px-4 py-3"><Badge status={e.account_status} /></td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {e.role === 'DEPARTMENT_MANAGER' ? 'Dept. Manager'
                    : e.role === 'ADMIN'   ? 'Admin'
                    : e.role === 'CITIZEN' ? 'Citizen'
                    : 'Employee'}
                </td>
                <td className="px-4 py-3">
                  <button className="text-gray-400 hover:text-primary" onClick={() => setEditUser(e)}>
                    <EditIcon />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button className="text-gray-400 hover:text-red-500" onClick={() => setDeleteUser(e)}>
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>
    </div>
    </PageWrapper>
  )
}
