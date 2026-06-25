import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { EditIcon, SaveIcon } from '../../lib/icons'
import { useUpdateDepartment } from '../../services/departmentsService'

interface Props {
  onClose: () => void
  department: { id: string; name: string; description?: string }
}

export default function EditDepartmentModal({ onClose, department }: Props) {
  const [name, setName] = useState(department.name)
  const [description, setDescription] = useState(department.description ?? '')
  const updateDepartment = useUpdateDepartment()

  function handleSave() {
    if (!name.trim()) return
    updateDepartment.mutate({ id: department.id, name, description }, { onSuccess: onClose })
  }

  return (
    <Modal title="Edit department" icon={<EditIcon />} onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Department name"
          placeholder="Department name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Textarea
          label="Description"
          placeholder="Department description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={updateDepartment.isPending ? 'Saving…' : 'Save'}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={updateDepartment.isPending}
        />
      </div>
    </Modal>
  )
}
