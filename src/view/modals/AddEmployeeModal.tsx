import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import RadioOption from '../../components/ui/RadioOption'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AddUserIcon, SaveIcon } from '../../lib/icons'
import { useSections } from '../../services/sectionsService'
import { useCreateEmployee } from '../../services/adminService'
import type { City } from '../../services/adminService'

const CITIES: { value: City; label: string }[] = [
  { value: 'GAZA',   label: 'Gaza'        },
  { value: 'NORTH',  label: 'North Gaza'  },
  { value: 'MIDDLE', label: 'Middle Area' },
  { value: 'KHAN',   label: 'Khan Younis' },
  { value: 'RAFAH',  label: 'Rafah'       },
]

function generateTempPassword() {
  return 'Temp@' + Math.random().toString(36).slice(-8)
}

export default function AddEmployeeModal({ onClose }: { onClose: () => void }) {
  const [fullName,   setFullName]   = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [sectionId,  setSectionId]  = useState('')
  const [city,       setCity]       = useState<City | ''>('')
  const [jobTitle,   setJobTitle]   = useState('')
  const [role, setRole] = useState<'EMPLOYEE' | 'DEPARTMENT_MANAGER'>('EMPLOYEE')

  const { data: sections = [] } = useSections()
  const createEmployee = useCreateEmployee()

  async function handleSave() {
    if (!fullName.trim() || !email.trim()) return
    await createEmployee.mutateAsync({
      full_name:   fullName,
      email,
      password:    generateTempPassword(),
      phone:       phone      || undefined,
      employee_id: employeeId || undefined,
      section_id:  sectionId || undefined,
      city:        city      || undefined,
      role,
    })
    onClose()
  }

  return (
    <Modal title="Add a new employee" icon={<AddUserIcon />} onClose={onClose}>

      {/* ── Employee information ─────────────────────────── */}
      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">Employee information</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Input label="Full Name"     placeholder="Enter full name"       value={fullName}   onChange={e => setFullName(e.target.value)} />
        <Input label="Job number"    placeholder="Ex: 1002"              value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
        <Input label="Email"         placeholder="ex: ahmed@example.com" value={email}      onChange={e => setEmail(e.target.value)} type="email" />
        <Input label="Mobile number" placeholder="05XXXXXXXX"            value={phone}      onChange={e => setPhone(e.target.value)} />
      </div>

      {/* ── Job information ──────────────────────────────── */}
      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">Job information</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select
            value={sectionId}
            onChange={e => setSectionId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
          >
            <option value=""></option>
            {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <Input label="Job title" placeholder="" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value as City | '')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
          >
            <option value="">Select city</option>
            {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Authority (Job Role)</label>
        <div className="flex gap-6">
          <RadioOption label="employee"           checked={role === 'EMPLOYEE'}           onChange={() => setRole('EMPLOYEE')} />
          <RadioOption label="Department manager" checked={role === 'DEPARTMENT_MANAGER'} onChange={() => setRole('DEPARTMENT_MANAGER')} />
        </div>
      </div>

      {/* ── Account settings ─────────────────────────────── */}
      <div className="border-l-4 border-primary pl-3 mb-3">
        <p className="font-semibold text-gray-800">account settings</p>
      </div>
      <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white">
        <p className="font-semibold text-gray-700 text-sm">Send a temporary password</p>
        <p className="text-xs text-gray-400 mt-1">An email will be sent to the employee to activate their account.</p>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="flex justify-between mt-2">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={createEmployee.isPending ? 'Saving…' : 'Save data'}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={createEmployee.isPending || !fullName.trim() || !email.trim()}
        />
      </div>
    </Modal>
  )
}
