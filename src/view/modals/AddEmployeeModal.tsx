import { useState, useRef, useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import RadioOption from '../../components/ui/RadioOption'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AddUserIcon, SaveIcon } from '../../lib/icons'
import { useSections } from '../../services/sectionsService'
import { useCreateEmployee } from '../../services/adminService'
import type { City } from '../../services/adminService'
import { toast } from 'react-toastify'

const CITIES: { value: City; label: string }[] = [
  { value: 'GAZA',   label: 'Gaza'        },
  { value: 'NORTH',  label: 'North Gaza'  },
  { value: 'MIDDLE', label: 'Middle Area' },
  { value: 'KHAN',   label: 'Khan Younis' },
  { value: 'RAFAH',  label: 'Rafah'       },
]

function CustomSelect({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const label = options.find(o => o.value === value)?.label ?? placeholder ?? ''

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition"
      >
        <span className={value ? 'text-gray-700' : 'text-gray-400'}>{label || placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {placeholder && (
            <li>
              <button type="button" onClick={() => { onChange(''); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm ${value === '' ? 'bg-teal-600 text-white font-medium' : 'text-gray-400 hover:bg-teal-50'}`}>
                {placeholder}
              </button>
            </li>
          )}
          {options.map(opt => (
            <li key={opt.value}>
              <button type="button" onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${opt.value === value ? 'bg-teal-600 text-white font-medium' : 'text-gray-700 hover:bg-teal-50'}`}>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

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
    const fullEmpId = employeeId.trim() ? `EMP-${employeeId.trim()}` : undefined
    try {
      await createEmployee.mutateAsync({
        full_name:   fullName,
        email,
        password:    generateTempPassword(),
        phone:       phone     || undefined,
        employee_id: fullEmpId,
        section_id:  sectionId || undefined,
        city:        city      || undefined,
        role,
      })
      onClose()
    } catch (err: any) {
      const msg = err?.response?.data?.message
      if (msg) toast.error(msg)
    }
  }

  return (
    <Modal title="Add a new employee" icon={<AddUserIcon />} onClose={onClose}>

      {/* ── Employee information ─────────────────────────── */}
      <div className="border-l-4 border-primary pl-3 mb-4">
        <p className="font-semibold text-gray-800">Employee information</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Input label="Full Name"     placeholder="Enter full name"       value={fullName}   onChange={e => setFullName(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job number</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-teal-500 focus-within:border-teal-500">
            <span className="px-3 py-2.5 bg-gray-100 text-gray-500 text-sm font-medium border-r border-gray-300 select-none">EMP-</span>
            <input
              type="text"
              placeholder="001"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-3 py-2.5 text-sm text-gray-700 outline-none bg-white"
            />
          </div>
        </div>
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
          <CustomSelect
            value={sectionId}
            onChange={setSectionId}
            options={sections.map(s => ({ value: s.id, label: s.name }))}
            placeholder="Select section"
          />
        </div>
        <Input label="Job title" placeholder="" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <CustomSelect
            value={city}
            onChange={v => setCity(v as City | '')}
            options={CITIES}
            placeholder="Select city"
          />
        </div>
      </div>
      {/* <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Authority (Job Role)</label>
        <div className="flex gap-6">
          <RadioOption label="employee"           checked={role === 'EMPLOYEE'}           onChange={() => setRole('EMPLOYEE')} />
          <RadioOption label="Department manager" checked={role === 'DEPARTMENT_MANAGER'} onChange={() => setRole('DEPARTMENT_MANAGER')} />
        </div>
      </div> */}

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
