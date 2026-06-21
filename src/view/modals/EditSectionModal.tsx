import Modal from '@/components/ui/Modal'
import { BtnCancel, BtnConfirm } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditIcon, SaveIcon } from '@/lib/icons'

export default function EditSectionModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Edit section" icon={<EditIcon />} onClose={onClose}>
      <div className="space-y-4">
        <Input label="Section name" value="Installations section" />
        <Input label="Department"   value="Water Department"      />
      </div>
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Save changes" icon={<SaveIcon />} />
      </div>
    </Modal>
  )
}
