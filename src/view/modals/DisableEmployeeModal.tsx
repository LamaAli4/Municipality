import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import WarningBox from '@/components/ui/WarningBox'
import RadioOption from '@/components/ui/RadioOption'
import { BtnCancel, BtnConfirm } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { DisableUserIcon, LogsIcon } from '@/lib/icons'

const info = [
  ['Employee name:', 'Ahmed Ali'        ],
  ['Job number:',    'EMP-2024-001'     ],
  ['Section:',       'Water Department' ],
  ['Current tasks:', '5 tasks'          ],
] as const

export default function DisableEmployeeModal({ onClose }: { onClose: () => void }) {
  const [transfer, setTransfer] = useState(false)

  return (
    <Modal title="Disable employee" icon={<DisableUserIcon />} onClose={onClose}>
      <div className="bg-gray-100 rounded-xl p-4 grid grid-cols-2 gap-2 text-sm mb-4">
        {info.map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>

      <WarningBox text="Warning: Disabling the employee will immediately prevent them from logging into the system and all their current privileges will be revoked." />

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <LogsIcon /><p className="font-semibold text-gray-800">Current tasks</p>
        </div>
        <RadioOption
          label="Transferring tasks to another employee"
          checked={transfer}
          onChange={() => setTransfer(v => !v)}
        />
        {transfer && (
          <div className="mt-2">
            <Input placeholder="Employee name" />
          </div>
        )}
      </div>

      <Textarea
        label="Reason for disabling (optional)"
        placeholder="Write your comments here about the reason for the action."
        className="border-primary/50"
      />

      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Confirm" icon={<DisableUserIcon />} />
      </div>
    </Modal>
  )
}
