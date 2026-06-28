import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import RadioOption from '../../components/ui/RadioOption'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { EditIcon, SaveIcon } from '../../lib/icons'
import { useSections } from '../../services/sectionsService'
import { useUpdateEmployee } from '../../services/adminService'
import type { AdminUser } from '../../services/adminService'

export default function EditEmployeeModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [sectionId, setSectionId] = useState(user.section_id ?? '')
  const [jobTitle,  setJobTitle]  = useState('')
  // const [role, setRole] = useState<'EMPLOYEE' | 'DEPARTMENT_MANAGER'>(
  //   user.role === 'DEPARTMENT_MANAGER' ? 'DEPARTMENT_MANAGER' : 'EMPLOYEE'
  // )

  const { data: sections = [] } = useSections()
  const updateEmployee = useUpdateEmployee()

  async function handleSave() {
    await updateEmployee.mutateAsync({
      id:         user.id,
      section_id: sectionId || undefined,
    })
    onClose()
  }

  return (
    <Modal title="Modify employee data" icon={<EditIcon />} onClose={onClose}>

      {/* ── Employee information ─────────────────────────── */}
      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">Employee information</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Input label="Employee name" value={user.full_name}          readOnly />
        <Input label="Job number"    value={user.employee_id ?? '—'} readOnly />
      </div>

      {/* ── Modify data ──────────────────────────────────── */}
      <div className="border-l-4 border-primary pl-3 mb-3">
        <p className="font-semibold text-gray-800">Modify data</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Section — styled select with pencil icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <div className="relative">
            <select
              value={sectionId}
              onChange={e => setSectionId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-600
                bg-white appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
            >
              <option value="">Select section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <span className="absolute right-2.5 top-2.5 text-primary pointer-events-none">
              <EditIcon />
            </span>
          </div>
        </div>

        {/* Job title */}
        <Input
          label="Job title"
          placeholder="e.g. Senior engineer"
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          icon={<EditIcon />}
        />
      </div>

      {/* ── Authority ────────────────────────────────────── */}
      {/* <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Authority (Job Role)</p>
        <div className="flex gap-6">
          <RadioOption label="employee"           checked={role === 'EMPLOYEE'}            onChange={() => setRole('EMPLOYEE')} />
          <RadioOption label="Department manager" checked={role === 'DEPARTMENT_MANAGER'}  onChange={() => setRole('DEPARTMENT_MANAGER')} />
        </div>
      </div> */}

      {/* ── Warning ──────────────────────────────────────── */}
      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2 text-xs text-yellow-700">
        <span className="mt-0.5">⚠️</span>
        <span>Note: Changing departments may affect the tasks currently assigned to the employee in the central system.</span>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={updateEmployee.isPending ? 'Saving...' : 'Save changes'}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={updateEmployee.isPending}
        />
      </div>
    </Modal>
  )
}
