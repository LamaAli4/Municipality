import Modal from '@/components/ui/Modal'
import { BtnCancel, BtnConfirm } from '@/components/ui/button'
import { TrashIcon } from '@/lib/icons'

interface DeleteModalProps {
  title: string
  message: string
  onClose: () => void
}

export default function DeleteModal({ title, message, onClose }: DeleteModalProps) {
  return (
    <Modal title={title} icon={<TrashIcon />} onClose={onClose}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-between">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Delete" />
      </div>
    </Modal>
  )
}
