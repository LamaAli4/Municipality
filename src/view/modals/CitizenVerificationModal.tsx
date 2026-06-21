import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import InfoCard from '@/components/ui/InfoCard'
import RadioOption from '@/components/ui/RadioOption'
import { BtnCancel, BtnConfirm } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { VerifyIcon, ImagePlaceholderIcon } from '@/lib/icons'

const fields: [string, string][] = [
  ['Full name',          'Ahmed Murtaja'],
  ['Registration date',  '15\\5\\2025' ],
  ['ID number',          '123456789'   ],
  ['Phone number',       '053222222'   ],
]

export default function CitizenVerificationModal({ onClose }: { onClose: () => void }) {
  const [decision, setDecision] = useState<'accept' | 'reject'>('reject')

  return (
    <Modal title="Citizen account verification" icon={<VerifyIcon />} onClose={onClose}>
      <InfoCard fields={fields} />

      <div className="mt-5">
        <p className="font-semibold text-gray-700 mb-3">Verification documents</p>
        <div className="grid grid-cols-2 gap-3">
          {['ID photo', 'A personal photo with ID'].map(caption => (
            <div key={caption} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-36 bg-gray-100 flex items-center justify-center">
                <ImagePlaceholderIcon />
              </div>
              <p className="text-center text-xs text-gray-500 py-1.5 bg-white border-t border-gray-100">{caption}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="font-semibold text-gray-700 mb-3">Decision</p>
        <div className="flex gap-6">
          <RadioOption label="Accept verification" checked={decision === 'accept'} onChange={() => setDecision('accept')} />
          <RadioOption label="Reject verification" checked={decision === 'reject'} onChange={() => setDecision('reject')} />
        </div>
      </div>

      {decision === 'reject' && (
        <div className="mt-4">
          <Textarea placeholder="Write the reason for rejection in detail...." className="bg-red-50 border-red-200" />
        </div>
      )}

      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Confirm" />
      </div>
    </Modal>
  )
}
