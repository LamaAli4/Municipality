import type { EmployeeNavigateFn } from '../../lib/types'

interface Props { navigate: EmployeeNavigateFn }

type TaskStatus = 'New tasks' | 'Under implementation' | 'Waiting for documents' | 'Re-editing' | 'Resuming' | 'Completed / Rejected'

interface Task {
  id: number
  taskNum: string
  service: string
  citizen: string
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string
  status: TaskStatus
}

const tasks: Task[] = [
  { id: 1, taskNum: 'TSK-241', service: 'Water subscription', citizen: 'Ahmed Muhammad', priority: 'High', dueDate: '1/3/2024', status: 'New tasks' },
  { id: 2, taskNum: 'TSK-238', service: 'Building permit', citizen: 'Sara Hassan', priority: 'Medium', dueDate: '5/3/2024', status: 'New tasks' },
  { id: 3, taskNum: 'TSK-230', service: 'Road repair', citizen: 'Omar Khalid', priority: 'Low', dueDate: '8/3/2024', status: 'Under implementation' },
  { id: 4, taskNum: 'TSK-225', service: 'Electricity connection', citizen: 'Fatima Ali', priority: 'High', dueDate: '3/3/2024', status: 'Under implementation' },
  { id: 5, taskNum: 'TSK-219', service: 'Water subscription', citizen: 'Yasser Noor', priority: 'Medium', dueDate: '28/2/2024', status: 'Waiting for documents' },
  { id: 6, taskNum: 'TSK-215', service: 'Building permit', citizen: 'Layla Said', priority: 'High', dueDate: '25/2/2024', status: 'Re-editing' },
  { id: 7, taskNum: 'TSK-210', service: 'Infrastructure', citizen: 'Tariq Fahad', priority: 'Low', dueDate: '20/2/2024', status: 'Resuming' },
  { id: 8, taskNum: 'TSK-205', service: 'Water subscription', citizen: 'Hind Ali', priority: 'Medium', dueDate: '15/2/2024', status: 'Completed / Rejected' },
  { id: 9, taskNum: 'TSK-200', service: 'Road repair', citizen: 'Nasser Saleh', priority: 'Low', dueDate: '10/2/2024', status: 'Completed / Rejected' },
]

const columns: { status: TaskStatus; color: string }[] = [
  { status: 'New tasks', color: '#0d9488' },
  { status: 'Under implementation', color: '#0d9488' },
  { status: 'Waiting for documents', color: '#0d9488' },
  { status: 'Re-editing', color: '#0d9488' },
  { status: 'Resuming', color: '#0d9488' },
  { status: 'Completed / Rejected', color: '#0d9488' },
]

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}

export default function TaskBoardPage({ navigate }: Props) {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Task Board</h1>
        <p className="text-sm text-gray-500">Manage and track your assigned tasks</p>
      </div>

      <div className="flex flex-wrap gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.status)
          return (
            <div key={col.status} className="flex-shrink-0 w-56">
              {/* Column header */}
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-t-xl text-white text-sm font-semibold"
                style={{ background: '#0d3a47' }}
              >
                <span className="text-xs leading-tight">{col.status}</span>
                <span className="w-5 h-5 bg-teal-500 rounded-full text-xs flex items-center justify-center font-bold">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="bg-gray-100 rounded-b-xl p-2 space-y-2 min-h-32">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate('task-detail')}
                    className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400 font-mono">#{task.taskNum}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight mb-1">{task.service}</p>
                    <p className="text-xs text-gray-500 mb-2">{task.citizen}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Due {task.dueDate}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center py-6 text-gray-300 text-xs">No tasks</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
