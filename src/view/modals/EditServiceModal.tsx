import { useEffect, useState } from 'react'
import Modal from '../../components/ui/Modal'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { EditIcon, SaveIcon } from '../../lib/icons'
import { useUpdateService, useAdminServiceDetail } from '../../services/servicesService'
import type { Service } from '../../services/servicesService'

const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

interface Props {
  service: Service
  onClose: () => void
}

export default function EditServiceModal({ service, onClose }: Props) {
  const { data: detail, isLoading } = useAdminServiceDetail(service.id)
  const updateService = useUpdateService()

  const [name, setName] = useState(service.name)
  const [description, setDescription] = useState(service.description)
  const [fee, setFee] = useState(String(service.fee))
  const [processingDays, setProcessingDays] = useState(String(service.estimated_processing_days))
  const [status, setStatus] = useState(service.status)

  useEffect(() => {
    if (!detail) return
    setName(detail.name)
    setDescription(detail.description)
    setFee(String(detail.fee))
    setProcessingDays(String(detail.estimated_processing_days))
    setStatus(detail.status)
  }, [detail])

  function handleSave() {
    if (!name.trim()) return
    updateService.mutate(
      {
        id: service.id,
        name,
        description,
        fee: Number(fee),
        estimated_processing_days: Number(processingDays),
        status,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal title="Edit service" icon={<EditIcon />} onClose={onClose}>
      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="space-y-4">
          <Input label="Service name" value={name} onChange={e => setName(e.target.value)} />
          <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fee" type="number" value={fee} onChange={e => setFee(e.target.value)} />
            <Input label="Processing days" type="number" value={processingDays} onChange={e => setProcessingDays(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-6">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={updateService.isPending ? 'Saving…' : 'Save changes'}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={isLoading || updateService.isPending}
        />
      </div>
    </Modal>
  )
}
