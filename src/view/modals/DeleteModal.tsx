import Modal from '../../components/ui/Modal'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { TrashIcon } from '../../lib/icons'

interface DeleteModalProps {
  title: string
  message: string
  onClose: () => void
  onConfirm?: () => void
  isPending?: boolean
}

export default function DeleteModal({ title, message, onClose, onConfirm, isPending }: DeleteModalProps) {
  return (
    <Modal title={title} icon={<TrashIcon />} onClose={onClose}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-between">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={isPending ? 'Deleting…' : 'Delete'}
          onClick={onConfirm}
          disabled={isPending}
        />
      </div>
    </Modal>
  )
}
