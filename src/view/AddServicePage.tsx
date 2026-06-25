import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '../lib/icons'
import { PrimaryBtn } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { useDepartments } from '../services/departmentsService'
import { useSections } from '../services/sectionsService'
import { useCreateService, useAddServiceDocument } from '../services/servicesService'
import { toast } from 'react-toastify'
import { z } from 'zod'

const serviceSchema = z.object({
  name:           z.string().min(1, { message: 'Service name is required' }),
  departmentId:   z.string().min(1, { message: 'Please select a department' }),
  fee:            z.string().min(1, { message: 'Fee is required' }),
  processingDays: z.string().min(1, { message: 'Processing time is required' }),
  tasks: z.array(z.object({
    name:                 z.string(),
    description:          z.string(),
    section_id:           z.string(),
    estimated_time_hours: z.string(),
  })).refine(
    tasks => tasks.some(t => t.name.trim() && t.section_id),
    { message: 'Add at least one workflow step with a section selected' }
  ),
})

interface TaskInput {
  name: string
  description: string
  section_id: string
  estimated_time_hours: string
}

interface DocInput {
  name: string
  description: string
  type: string
}

const emptyTask = (): TaskInput => ({ name: '', description: '', section_id: '', estimated_time_hours: '' })
const emptyDoc  = (): DocInput  => ({ name: '', description: '', type: 'MANDATORY' })

const DOC_TYPES = ['MANDATORY', 'OPTIONAL']

export default function AddServicePage({ navigate }: { navigate: NavigateFn }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [fee, setFee] = useState('')
  const [processingDays, setProcessingDays] = useState('')
  const [tasks, setTasks] = useState<TaskInput[]>([emptyTask()])
  const [docs, setDocs] = useState<DocInput[]>([])

  const { data: departments = [] } = useDepartments()
  const { data: sections = [] } = useSections(departmentId || null)
  const createService = useCreateService()
  const addDocument = useAddServiceDocument()

  function updateTask(i: number, field: keyof TaskInput, value: string) {
    setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }

  function updateDoc(i: number, field: keyof DocInput, value: string) {
    setDocs(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d))
  }

  async function handleDeploy() {
    const result = serviceSchema.safeParse({ name, departmentId, fee, processingDays, tasks })
    if (!result.success) {
      result.error.issues.forEach(e => toast.error(e.message))
      return
    }
    const validTasks = tasks.filter(t => t.name.trim() && t.section_id)

    try {
      const service = await createService.mutateAsync({
        name,
        description,
        department_id: Number(departmentId),
        fee: Number(fee),
        estimated_processing_days: Number(processingDays),
        workflow_tasks: validTasks.map(t => ({
          name: t.name,
          description: t.description,
          section_id: Number(t.section_id),
          estimated_time_hours: Number(t.estimated_time_hours) || 0,
        })),
      })

      const validDocs = docs.filter(d => d.name.trim())
      for (const doc of validDocs) {
        await addDocument.mutateAsync({ serviceId: String(service.id), ...doc })
      }

      navigate('service')
    } catch {
      // mutations show their own error toasts
    }
  }

  const isPending = createService.isPending || addDocument.isPending

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('service')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium"
        >
          <ChevronLeftIcon /> Back to service management
        </button>
        <PrimaryBtn
          label={isPending ? 'Deploying…' : 'Deploy the service'}
          onClick={handleDeploy}
          disabled={isPending}
        />
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-1">Add a new service</h1>
      <p className="text-sm text-gray-500 mb-6">
        Adding a new municipal service for citizens and specifying the requirements and procedures
      </p>

      <div className="grid grid-cols-3 gap-4">
        {/* Basic Info */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">Basic service information</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input label="Service name" placeholder="Enter the service name" value={name} onChange={e => setName(e.target.value)} />
            <Textarea label="Description" placeholder="Enter a detailed description of the service." value={description} onChange={e => setDescription(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Department</label>
                <select
                  value={departmentId}
                  onChange={e => { setDepartmentId(e.target.value); setTasks([emptyTask()]) }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <Input label="Fees" placeholder="e.g. 50" type="number" value={fee} onChange={e => setFee(e.target.value)} />
              <Input label="Processing time (days)" placeholder="e.g. 14" type="number" value={processingDays} onChange={e => setProcessingDays(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Required documents */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-sm">Required documents</h2>
              <button
                onClick={() => setDocs(prev => [...prev, emptyDoc()])}
                className="w-7 h-7 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <PlusIcon />
              </button>
            </div>
            <div className="p-4">
              {docs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <button
                    onClick={() => setDocs([emptyDoc()])}
                    className="w-10 h-10 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <PlusIcon />
                  </button>
                  <p className="text-sm text-gray-500">Add a document</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {docs.map((doc, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">Doc {i + 1}</span>
                        <button onClick={() => setDocs(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400">
                          <TrashIcon />
                        </button>
                      </div>
                      <input placeholder="Document name" value={doc.name} onChange={e => updateDoc(i, 'name', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input placeholder="Description" value={doc.description} onChange={e => updateDoc(i, 'description', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <select value={doc.type} onChange={e => updateDoc(i, 'type', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
                        {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Workflow steps */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-sm">Workflow steps</h2>
              <button onClick={() => setTasks(prev => [...prev, emptyTask()])}
                className="w-7 h-7 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <PlusIcon />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {tasks.map((task, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Step {i + 1}</span>
                    {tasks.length > 1 && (
                      <button onClick={() => setTasks(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400">
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                  <input placeholder="Task name" value={task.name} onChange={e => updateTask(i, 'name', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input placeholder="Description" value={task.description} onChange={e => updateTask(i, 'description', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <select value={task.section_id} onChange={e => updateTask(i, 'section_id', e.target.value)} disabled={!departmentId}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="">Select section</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input placeholder="Est. hours" type="number" value={task.estimated_time_hours} onChange={e => updateTask(i, 'estimated_time_hours', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
