import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import InfoCard from '../../components/ui/InfoCard'
import WarningBox from '../../components/ui/WarningBox'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { DisableUserIcon } from '../../lib/icons'
import axiosInstance from '../../lib/axios'
import { toast } from 'react-toastify'

interface Props {
  onClose: () => void
  onSuccess?: () => void
  userId: string
  userName: string
  nationalId: string
  phone: string
  currentStatus: string
}

export default function DisableCitizenModal({ onClose, onSuccess, userId, userName, nationalId, phone, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const fields: [string, string][] = [
    ['Full name',      userName],
    ['ID number',      nationalId || '—'],
    ['Phone number',   phone || '—'],
    ['Current status', currentStatus],
  ]

  function handleConfirm() {
    setLoading(true)
    axiosInstance.post(`/admin/users/${userId}/disable`)
      .then(() => {
        toast.success('Account disabled successfully')
        onSuccess?.()
        onClose()
      })
      .catch(() => toast.error('Failed to disable account'))
      .finally(() => setLoading(false))
  }

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
        <BtnConfirm label={loading ? 'Disabling…' : 'Confirm'} onClick={handleConfirm} disabled={loading} />
      </div>
    </Modal>
  )
}
