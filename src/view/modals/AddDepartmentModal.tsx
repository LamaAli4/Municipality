import Modal from '../../components/ui/Modal'
import WarningBox from '../../components/ui/WarningBox'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { EditIcon, SaveIcon } from '../../lib/icons'

export default function AddDepartmentModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Add a new department" icon={<EditIcon />} onClose={onClose}>
      <div className="space-y-4">
        <Input label="Department name" placeholder="Department new" />
        <Textarea label="Description"  placeholder="Department description" />
      </div>
      <WarningBox text="The will be a new department added to the list of sections immediately after saving, and you can customize access permissions later through the section settings." />
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Save" icon={<SaveIcon />} />
      </div>
    </Modal>
  )
}
