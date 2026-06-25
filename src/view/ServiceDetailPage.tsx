import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { ChevronLeftIcon, PlusIcon, TrashIcon, SaveIcon } from '../lib/icons'
import { PrimaryBtn } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { useDepartments } from '../services/departmentsService'
import { useSections } from '../services/sectionsService'
import {
  useAdminServiceDetail,
  useAdminServiceWorkflow,
  useServiceDocuments,
  useAddServiceDocument,
  useDeleteServiceDocument,
  useUpdateService,
  useAddWorkflowTask,
} from '../services/servicesService'
import { useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

interface Props {
  navigate: NavigateFn
  serviceId: string | null
}

export default function ServiceDetailPage({ navigate, serviceId }: Props) {
  const [tab, setTab] = useState<'basic' | 'workflow'>('basic')

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('service')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium"
        >
          <ChevronLeftIcon /> Back to service management
        </button>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-1">Service steps</h1>
      <p className="text-sm text-gray-500 mb-6">Modifying and adding to service details and documents</p>

      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {(['basic', 'workflow'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'basic' ? 'Basic information' : 'Work procedures'}
          </button>
        ))}
      </div>

      {tab === 'basic'
        ? <BasicInfoTab serviceId={serviceId} navigate={navigate} />
        : <WorkflowTab serviceId={serviceId} />
      }
    </div>
  )
}

function BasicInfoTab({ serviceId, navigate }: { serviceId: string | null; navigate: NavigateFn }) {
  const { data: detail, isLoading } = useAdminServiceDetail(serviceId)
  const { data: departments = [] } = useDepartments()
  const updateService = useUpdateService()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [fee, setFee] = useState('')
  const [processingDays, setProcessingDays] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [initialized, setInitialized] = useState(false)

  if (detail && !initialized) {
    setName(detail.name)
    setDescription(detail.description)
    setFee(String(detail.fee))
    setProcessingDays(String(detail.estimated_processing_days))
    setStatus(detail.status)
    setInitialized(true)
  }

  function handleSave() {
    if (!serviceId || !name.trim()) return
    updateService.mutate(
      { id: serviceId, name, description, fee: Number(fee), estimated_processing_days: Number(processingDays), status },
      { onSuccess: () => navigate('service') }
    )
  }

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading…</div>

  return (
    <div className="max-w-2xl space-y-4">
      <Input label="Service name" value={name} onChange={e => setName(e.target.value)} />
      <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Fee" type="number" value={fee} onChange={e => setFee(e.target.value)} />
        <Input label="Processing days" type="number" value={processingDays} onChange={e => setProcessingDays(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Department</label>
        <select
          value={detail?.department_id ?? ''}
          disabled
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50"
        >
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
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
      <div className="flex justify-end pt-2">
        <PrimaryBtn
          label={updateService.isPending ? 'Saving…' : 'Save changes'}
          icon={<SaveIcon />}
          onClick={handleSave}
          disabled={updateService.isPending}
        />
      </div>
    </div>
  )
}

function WorkflowTab({ serviceId }: { serviceId: string | null }) {
  const { data: tasks = [], isLoading } = useAdminServiceWorkflow(serviceId)
  const { data: detail } = useAdminServiceDetail(serviceId)
  const { data: sections = [] } = useSections(detail?.department_id ?? null)
  const addTask = useAddWorkflowTask()
  const queryClient = useQueryClient()

  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newSection, setNewSection] = useState('')
  const [newHours, setNewHours] = useState('')

  function handleAddTask() {
    if (!serviceId || !newName.trim() || !newSection) return
    addTask.mutate(
      { serviceId, name: newName, description: newDesc, section_id: Number(newSection), estimated_time_hours: Number(newHours) || 0 },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['admin', 'service', serviceId, 'workflow'] })
          setShowAdd(false)
          setNewName(''); setNewDesc(''); setNewSection(''); setNewHours('')
        }
      }
    )
  }

  async function handleDelete(taskId: string) {
    try {
      await axiosInstance.delete(`/admin/services/${serviceId}/workflow/${taskId}`)
      queryClient.invalidateQueries({ queryKey: ['admin', 'service', serviceId, 'workflow'] })
      toast.success('Step removed')
    } catch {
      toast.error('Failed to remove step')
    }
  }

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading…</div>

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Workflow steps */}
      <div className="col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">Workflow steps</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
          >
            <PlusIcon /> Add a step
          </button>
        </div>

        {showAdd && (
          <div className="border border-primary/30 rounded-xl p-4 mb-4 space-y-3 bg-primary/5">
            <p className="text-sm font-semibold text-gray-700">New step</p>
            <input placeholder="Step name" value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <select value={newSection} onChange={e => setNewSection(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select responsible section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input placeholder="Estimated hours" type="number" value={newHours} onChange={e => setNewHours(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Cancel</button>
              <button onClick={handleAddTask} disabled={addTask.isPending}
                className="text-sm font-medium bg-primary text-white rounded-lg px-4 py-1.5 hover:bg-primary/90 disabled:opacity-50">
                {addTask.isPending ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {tasks.length === 0 && !showAdd && (
            <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
              No workflow steps yet. Click "Add a step" to get started.
            </div>
          )}
          {tasks.map((task, i) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{task.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
                <div className="flex gap-6 mt-3 text-sm text-gray-500">
                  <span><span className="font-medium text-gray-700">Estimated Time</span> {task.estimated_time_hours}h</span>
                </div>
              </div>
              <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500 self-start">
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      <DocumentsPanel serviceId={serviceId} />
    </div>
  )
}

const DOC_TYPES = ['MANDATORY', 'OPTIONAL']

function DocumentsPanel({ serviceId }: { serviceId: string | null }) {
  const { data: documents = [], isLoading } = useServiceDocuments(serviceId)
  const addDocument = useAddServiceDocument()
  const deleteDocument = useDeleteServiceDocument()

  const [showAdd, setShowAdd] = useState(false)
  const [docName, setDocName] = useState('')
  const [docDesc, setDocDesc] = useState('')
  const [docType, setDocType] = useState('MANDATORY')

  function handleAdd() {
    if (!serviceId || !docName.trim()) return
    addDocument.mutate(
      { serviceId, name: docName, description: docDesc, type: docType },
      {
        onSuccess: () => {
          setShowAdd(false)
          setDocName(''); setDocDesc(''); setDocType('MANDATORY')
        }
      }
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden self-start">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-bold text-gray-800 text-sm">Required documents</h2>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
        >
          <PlusIcon />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {showAdd && (
          <div className="border border-primary/30 rounded-lg p-3 space-y-2 bg-primary/5">
            <input
              placeholder="Document name"
              value={docName}
              onChange={e => setDocName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Description"
              value={docDesc}
              onChange={e => setDocDesc(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Cancel</button>
              <button
                onClick={handleAdd}
                disabled={addDocument.isPending}
                className="text-xs font-medium bg-primary text-white rounded-lg px-3 py-1 hover:bg-primary/90 disabled:opacity-50"
              >
                {addDocument.isPending ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="text-center text-gray-400 text-sm py-4">Loading…</p>
        ) : documents.length === 0 && !showAdd ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <button onClick={() => setShowAdd(true)} className="w-10 h-10 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
              <PlusIcon />
            </button>
            <p className="text-sm text-gray-500">Add a document</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc, i) => (
              <li key={doc.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 font-medium truncate">{doc.name}</p>
                </div>
                <button
                  onClick={() => serviceId && deleteDocument.mutate({ serviceId, documentId: doc.id })}
                  className="text-gray-300 hover:text-red-500 shrink-0"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
