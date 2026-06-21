import Modal from '@/components/ui/Modal'
import { BtnCancel, BtnConfirm } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon, SaveIcon } from '@/lib/icons'

export default function AddSectionModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Add new section" icon={<PlusIcon />} onClose={onClose}>
      <div className="space-y-4">
        <Input label="Section name" placeholder="Enter section name" />
        <Input label="Department"   placeholder="Select department"  />
      </div>
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Save" icon={<SaveIcon />} />
      </div>
    </Modal>
  )
}
