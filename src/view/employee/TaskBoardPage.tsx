import { useState } from 'react'
import type { EmployeeNavigateFn } from '../../lib/types'
import { useTaskBoard, useAssignTask, type BoardTask } from '../../services/tasksService'
import Modal from '../../components/ui/Modal'
import { BtnCancel, BtnConfirm } from '../../components/ui/Button'
import { WarningIcon } from '../../lib/icons'

interface Props { navigate: EmployeeNavigateFn }

const COLUMNS = [
  { key: 'backlog'     as const, label: 'Backlog',     color: '#64748b' },
  { key: 'in_progress' as const, label: 'In Progress', color: '#0d9488' },
  { key: 'completed'   as const, label: 'Completed',   color: '#16a34a' },
  { key: 'failed'      as const, label: 'Failed',      color: '#dc2626' },
]

function fmt(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function taskNum(id: string) {
  return `TSK-${String(id).padStart(3, '0')}`
}

function TaskCard({ task, onClick }: { task: BoardTask; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-400 font-mono">#{taskNum(task.id)}</span>
        <span className="text-xs text-gray-400">Req #{task.request_id}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-tight mb-1">{task.name}</p>
      <p className="text-xs text-gray-500 mb-2">{task.estimated_time_hours}h estimated</p>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {task.assigned_at ? `Assigned ${fmt(task.assigned_at)}` : 'Not assigned yet'}
      </div>
    </div>
  )
}

export default function TaskBoardPage({ navigate }: Props) {
  const { data: board, isLoading } = useTaskBoard()
  const [assignTask, setAssignTask] = useState<BoardTask | null>(null)
  const { mutate: assign, isPending, error } = useAssignTask()
  const [notes, setNotes] = useState('')

  function handleCardClick(task: BoardTask, col: typeof COLUMNS[number]) {
    if (col.key === 'backlog') {
      setNotes('')
      setAssignTask(task)
    } else {
      navigate('task-detail', { taskId: task.id })
    }
  }

  function handleAssign() {
    if (!assignTask) return
    assign(assignTask.id, { onSuccess: () => setAssignTask(null) })
  }

  const errMsg = (error as any)?.response?.data?.message

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Task Board</h1>
        <p className="text-sm text-gray-500">Manage and track your assigned tasks</p>
      </div>

      {isLoading && (
        <div className="text-center py-16 text-gray-400 text-sm">Loading board...</div>
      )}

      {board && (
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
          {COLUMNS.map(col => {
            const tasks = board[col.key] ?? []
            return (
              <div key={col.key} className="flex-shrink-0 w-56 md:w-60">
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-t-xl text-white text-sm font-semibold"
                  style={{ background: col.color }}
                >
                  <span className="text-xs leading-tight">{col.label}</span>
                  <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center font-bold">
                    {tasks.length}
                  </span>
                </div>
                <div className="bg-gray-100 rounded-b-xl p-2 space-y-2 min-h-32">
                  {tasks.length === 0 ? (
                    <div className="text-center py-6 text-gray-300 text-xs">No tasks</div>
                  ) : tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => handleCardClick(task, col)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Assign to myself modal */}
      {assignTask && (
        <Modal title="Assign to myself" onClose={() => setAssignTask(null)}>
          <div className="border border-gray-200 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Task number</p>
              <p className="font-semibold text-gray-800">#{taskNum(assignTask.id)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Request</p>
              <p className="font-semibold text-gray-800">#{assignTask.request_id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Task name</p>
              <p className="font-medium text-gray-700">{assignTask.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Estimated</p>
              <p className="font-medium text-gray-700">{assignTask.estimated_time_hours}h</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 mb-4">
            <WarningIcon />
            <p className="text-sm text-amber-800">Are you sure you want to assign this task to yourself?</p>
          </div>

          {errMsg && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{errMsg}</p>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any notes related to the task..."
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="flex justify-between">
            <BtnCancel onClick={() => setAssignTask(null)} />
            <BtnConfirm label={isPending ? 'Assigning...' : 'Confirm'} onClick={handleAssign} disabled={isPending} />
          </div>
        </Modal>
      )}
    </div>
  )
}
