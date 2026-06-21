import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import RadioOption from '@/components/ui/RadioOption'
import { BtnCancel, BtnConfirm } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AddUserIcon, SaveIcon } from '@/lib/icons'

export default function AddEmployeeModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<'employee' | 'manager'>('employee')

  return (
    <Modal title="Add a new employee" icon={<AddUserIcon />} onClose={onClose}>
      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">Employee information</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Input label="Full Name"      placeholder="Enter the name quadrilateral" />
        <Input label="Job number"     placeholder="Ex: 1002" />
        <Input label="Email"          placeholder="ex:ahmed15@gmail.com" />
        <Input label="Mobile number"  placeholder="05********" />
      </div>

      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">Job information</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input label="Section"    placeholder="" />
        <Input label="Job title"  placeholder="" />
      </div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Authority (Job Role)</label>
        <div className="flex gap-6">
          <RadioOption label="employee"           checked={role === 'employee'} onChange={() => setRole('employee')} />
          <RadioOption label="Department manager" checked={role === 'manager'}  onChange={() => setRole('manager')}  />
        </div>
      </div>

      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">account settings</p>
      </div>
      <div className="border border-gray-200 rounded-xl p-4 mb-2">
        <p className="font-semibold text-gray-700 text-sm">Send a temporary password</p>
        <p className="text-xs text-gray-400 mt-1">An email will be sent to the employee to activate their account.</p>
      </div>

      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Save data" icon={<SaveIcon />} />
      </div>
    </Modal>
  )
}
