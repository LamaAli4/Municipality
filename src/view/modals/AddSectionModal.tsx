import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { PlusIcon, SaveIcon } from '../../lib/icons'
import { useCreateSection } from '../../services/sectionsService'

interface Props {
  onClose: () => void
  departmentId: string | null
}

export default function AddSectionModal({ onClose, departmentId }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createSection = useCreateSection()

  function handleSave() {
    if (!name.trim() || !departmentId) return
    createSection.mutate({ department_id: String(departmentId), name, description }, { onSuccess: onClose })
  }

  return (
    <Modal title="Add new section" icon={<PlusIcon />} onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Section name"
          placeholder="Enter section name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Textarea
          label="Description"
          placeholder="Section description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={createSection.isPending ? 'Saving…' : 'Save'}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={createSection.isPending}
        />
      </div>
    </Modal>
  )
}
