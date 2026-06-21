import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import RadioOption from '@/components/ui/RadioOption'
import WarningBox from '@/components/ui/WarningBox'
import { BtnCancel, BtnConfirm } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditIcon, SaveIcon } from '@/lib/icons'

export default function EditEmployeeModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<'employee' | 'manager'>('employee')

  return (
    <Modal title="Modify employee data" icon={<EditIcon />} onClose={onClose}>
      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">Employee information</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Input label="Employee name" value="Ahmed Ali"       readOnly />
        <Input label="Job number"    value="EMP-2024-001"    readOnly />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <EditIcon /><p className="font-semibold text-gray-800">Modify data</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input label="Section"    value="Water Department" icon={<EditIcon />} />
        <Input label="Job title"  value="Senior engineer"  icon={<EditIcon />} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Authority (Job Role)</label>
        <div className="flex gap-6">
          <RadioOption label="employee"           checked={role === 'employee'} onChange={() => setRole('employee')} />
          <RadioOption label="Department manager" checked={role === 'manager'}  onChange={() => setRole('manager')}  />
        </div>
      </div>

      <WarningBox text="Note: Changing departments may affect the tasks currently assigned to the employee in the central system." />

      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Save changes" icon={<SaveIcon />} />
      </div>
    </Modal>
  )
}
