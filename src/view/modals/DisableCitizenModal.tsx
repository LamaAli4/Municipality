import Modal from '../../components/ui/Modal'
import InfoCard from '../../components/ui/InfoCard'
import WarningBox from '../../components/ui/WarningBox'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { DisableUserIcon } from '../../lib/icons'

const fields: [string, string][] = [
  ['Full name',       'Ahmed Ali'   ],
  ['ID number',       '123456789'   ],
  ['Phone number',    '053222222'   ],
  ['Current status',  'Active'      ],
]

export default function DisableCitizenModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Deactivate the citizen's account" icon={<DisableUserIcon />} onClose={onClose}>
      <InfoCard fields={fields} />
      <WarningBox text="Warning: Disabling the account will prevent the citizen from logging into the system and accessing available electronic services." />
      <Textarea
        label="Reason for disabling (optional)"
        placeholder="Write the reason for deactivating the account"
      />
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Confirm" />
      </div>
    </Modal>
  )
}
