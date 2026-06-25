import { useEffect, useState } from 'react'
import Modal from '../../components/ui/Modal'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { EditIcon, SaveIcon } from '../../lib/icons'
import { useSection, useUpdateSection } from '../../services/sectionsService'

interface Props {
  onClose: () => void
  sectionId: string
  departmentId: string | null
}

export default function EditSectionModal({ onClose, sectionId, departmentId }: Props) {
  const { data: section, isLoading } = useSection(sectionId)
  const updateSection = useUpdateSection()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (section) {
      setName(section.name)
      setDescription(section.description ?? '')
    }
  }, [section])

  function handleSave() {
    if (!name.trim() || !departmentId) return
    updateSection.mutate(
      { id: sectionId, department_id: String(departmentId), name, description },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal title="Edit section" icon={<EditIcon />} onClose={onClose}>
      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Section name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      )}
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={updateSection.isPending ? 'Saving…' : 'Save changes'}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={isLoading || updateSection.isPending}
        />
      </div>
    </Modal>
  )
}
