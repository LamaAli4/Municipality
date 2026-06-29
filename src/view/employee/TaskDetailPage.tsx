import { useState } from 'react'
import type { EmployeeNavigateFn } from '../../lib/types'
import {
  ChevronLeftIcon, ApproveIcon, RefuseIcon, RequestDocsIcon, TransferIcon,
  WarningIcon, UploadIcon,
} from '../../lib/icons'
import Modal from '../../components/ui/Modal'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { useTaskDetail, useCompleteTask, useRejectTask } from '../../services/tasksService'
import { useRequestDocuments } from '../../services/requestsService'

interface Props {
  navigate: EmployeeNavigateFn
  taskId: string | null
}

type ProcedureKey = 'approve' | 'refuse' | 'docs' | 'reapply' | 'cancel'

const PROCEDURES: { key: ProcedureKey; label: string; color: string; icon: React.ReactNode }[] = [
  { key: 'approve',  label: 'Approve the task',                    color: 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100',        icon: <ApproveIcon /> },
  { key: 'refuse',   label: 'Refuse the task',                     color: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',             icon: <RefuseIcon /> },
  { key: 'docs',     label: 'Request for missing documents',        color: 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100', icon: <RequestDocsIcon /> },
  { key: 'reapply',  label: 'Re-application for former employee',   color: 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100',         icon: <TransferIcon /> },
  { key: 'cancel',   label: 'Cancel assignment',                    color: 'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100',         icon: <RefuseIcon /> },
]

const PROCEDURE_WARNINGS: Record<ProcedureKey, string> = {
  approve:  'Are you sure you want to approve this task?',
  refuse:   'Are you sure you want to refuse this task?',
  docs:     'This will notify the citizen to submit the missing documents.',
  reapply:  'This will reassign the task to another employee.',
  cancel:   'Are you sure you want to cancel your assignment for this task?',
}

const STATUS_BADGE: Record<string, string> = {
  IN_PROGRESS: 'bg-orange-100 text-orange-700',
  BACKLOG:     'bg-gray-100 text-gray-600',
  COMPLETED:   'bg-teal-100 text-teal-700',
  APPROVED:    'bg-teal-100 text-teal-700',
  FAILED:      'bg-red-100 text-red-700',
}

function fmt(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function fmtStatus(s: string | undefined) {
  return s?.replace(/_/g, ' ') ?? '—'
}

function StepDot({ done, active }: { done: boolean; active: boolean }) {
  if (done) return (
    <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
  )
  if (active) return <div className="w-7 h-7 rounded-full border-4 border-teal-500 bg-white shrink-0" />
  return <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-white shrink-0" />
}

export default function TaskDetailPage({ navigate, taskId }: Props) {
  const [activeModal, setActiveModal] = useState<ProcedureKey | null>(null)
  const { data: task, isLoading } = useTaskDetail(taskId)
  const { data: citizenDocs = [], isError: docsError } = useRequestDocuments(task?.request_id)
  const { mutate: completeTask, isPending: completing, error: completeErr } = useCompleteTask()
  const { mutate: rejectTask,   isPending: rejecting,  error: rejectErr  } = useRejectTask()

  function handleApprove() {
    if (!task) return
    completeTask(task.id, { onSuccess: () => { setActiveModal(null); navigate('task-board') } })
  }

  function handleReject(reason: string) {
    if (!task) return
    rejectTask({ id: task.id, rejection_reason: reason }, { onSuccess: () => { setActiveModal(null); navigate('task-board') } })
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
  )

  const sibling = [...(task?.sibling_tasks ?? [])].sort((a, b) => a.task_order - b.task_order)
  const totalSteps = sibling.length

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Back */}
      <button onClick={() => navigate('task-board')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Task board
      </button>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Request and task details</h1>
          <p className="text-sm text-gray-500">Service: {task?.request?.service_name ?? '—'}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${STATUS_BADGE[task?.status ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
          {fmtStatus(task?.status)}
        </span>
      </div>

      {/* 3-column cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Request data */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">Request data</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Service type</p>
              <p className="text-gray-700 font-medium">{task?.request?.service_name ?? '—'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Request #</p>
                <p className="text-gray-700 font-medium">#{task?.request_id ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Submission date</p>
                <p className="text-gray-700 font-medium">{fmt(task?.request?.submitted_at)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Request status</p>
                <p className="text-gray-700 font-medium">{fmtStatus(task?.request?.status)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Payment</p>
                <p className="text-gray-700 font-medium">{fmtStatus(task?.request?.payment_status)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task data */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">Task data</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Task name</p>
              <p className="text-gray-700 font-medium">{task?.name ?? '—'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Step</p>
                <p className="text-gray-700 font-medium">
                  {task ? `${task.task_order} of ${totalSteps}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Est. hours</p>
                <p className="text-gray-700 font-medium">{task ? `${task.estimated_time_hours}h` : '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Assigned at</p>
                <p className="text-gray-700 font-medium">{fmt(task?.assigned_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Completed at</p>
                <p className="text-gray-700 font-medium">{fmt(task?.completed_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available procedures */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">Available procedures</h2>
          <div className="space-y-2">
            {PROCEDURES.map(proc => (
              <button
                key={proc.key}
                onClick={() => setActiveModal(proc.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${proc.color}`}
              >
                {proc.icon}
                {proc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task description + stepper */}
      {sibling.length > 0 && (
        <div className="bg-teal-800 rounded-xl p-5 text-white">
          <h2 className="font-semibold text-sm mb-1">Task description</h2>
          <p className="text-teal-200 text-sm mb-5">{task?.name}</p>

          {/* Horizontal stepper */}
          <div className="flex items-center mb-5 overflow-x-auto pb-1">
            {sibling.map((t, i) => {
              const done   = t.status === 'COMPLETED' || t.status === 'APPROVED'
              const active = t.id === task?.id
              return (
                <div key={t.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5 min-w-20 text-center">
                    <StepDot done={done} active={active} />
                    <span className={`text-xs leading-tight ${active ? 'text-white font-semibold' : done ? 'text-teal-300' : 'text-teal-500'}`}>
                      {t.name}
                    </span>
                  </div>
                  {i < sibling.length - 1 && (
                    <div className={`h-0.5 w-10 mx-1 shrink-0 mb-4 ${done ? 'bg-teal-400' : 'bg-teal-700'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {sibling.map(t => {
              const done   = t.status === 'COMPLETED' || t.status === 'APPROVED'
              const active = t.id === task?.id
              return (
                <div key={t.id} className="flex items-center gap-1.5 text-sm">
                  {done ? (
                    <div className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  ) : active ? (
                    <div className="w-5 h-5 rounded-full bg-teal-400 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-teal-600 shrink-0" />
                  )}
                  <span className={done ? 'text-teal-200' : active ? 'text-white font-medium' : 'text-teal-500'}>
                    {t.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Documents row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">
            <span className="text-teal-600">Citizen</span> documents
          </h2>
          {docsError ? (
            <div className="text-center py-6 text-gray-400 text-sm">Documents not available</div>
          ) : citizenDocs.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">No documents uploaded</div>
          ) : (
            <ul className="space-y-2">
              {citizenDocs.map(doc => (
                <li key={doc.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-teal-500 shrink-0">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                  </div>
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-medium text-teal-600 hover:text-teal-800"
                    >
                      View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">Internal documents</h2>
          <div className="text-center py-4 text-gray-400 text-sm">No internal documents</div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors">
            <UploadIcon /> Upload a new document
          </button>
        </div>
      </div>

      {/* Procedure modals */}
      {activeModal && (
        <ProcedureModal
          proc={PROCEDURES.find(p => p.key === activeModal)!}
          warning={PROCEDURE_WARNINGS[activeModal]}
          taskId={task?.id ?? ''}
          serviceName={task?.request?.service_name ?? '—'}
          assignedAt={fmt(task?.assigned_at)}
          onClose={() => setActiveModal(null)}
          onApprove={activeModal === 'approve' ? handleApprove : undefined}
          onReject={activeModal === 'refuse'  ? handleReject  : undefined}
          isPending={completing || rejecting}
          apiError={
            activeModal === 'approve' ? (completeErr as any)?.response?.data?.message :
            activeModal === 'refuse'  ? (rejectErr  as any)?.response?.data?.message :
            undefined
          }
        />
      )}
    </div>
  )
}

function ProcedureModal({ proc, warning, taskId, serviceName, assignedAt, onClose, onApprove, onReject, isPending, apiError }: {
  proc: typeof PROCEDURES[number]
  warning: string
  taskId: string; serviceName: string; assignedAt: string
  onClose: () => void
  onApprove?: () => void
  onReject?: (reason: string) => void
  isPending?: boolean
  apiError?: string
}) {
  const [notes, setNotes] = useState('')

  function handleConfirm() {
    if (onApprove) { onApprove(); return }
    if (onReject)  { onReject(notes); return }
    onClose()
  }

  return (
    <Modal title={proc.label} icon={proc.icon} onClose={onClose}>
      <div className="border border-gray-200 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-400">Task ID</p>
          <p className="font-semibold text-gray-800">#{taskId}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Service</p>
          <p className="font-semibold text-gray-800">{serviceName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Assigned at</p>
          <p className="font-medium text-gray-700">{assignedAt}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 mb-4">
        <WarningIcon />
        <p className="text-sm text-amber-800">{warning}</p>
      </div>

      {apiError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{apiError}</p>
      )}

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">
          {onReject ? <>Rejection reason <span className="text-red-500">*</span></> : 'Notes (optional)'}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={onReject ? 'Enter the reason for rejection...' : 'Add any notes related to the task...'}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      <div className="flex justify-between">
        <BtnCancel onClick={onClose} />
        <BtnConfirm
          label={isPending ? 'Please wait...' : 'Confirm'}
          onClick={handleConfirm}
          disabled={isPending || (!!onReject && !notes.trim())}
        />
      </div>
    </Modal>
  )
}
