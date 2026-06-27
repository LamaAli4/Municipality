import { useState } from 'react'
import type { EmployeePage } from '../lib/types'
import EmployeeLayout from '../layout/EmployeeLayout'
import TaskBoardPage from '../view/employee/TaskBoardPage'
import TaskDetailPage from '../view/employee/TaskDetailPage'
// import EmployeeNotificationsPage from '../view/employee/NotificationsPage'
import EmployeeAccountPage from '../view/employee/AccountPage'

interface Props { onLogout: () => void }

export default function EmployeePortal({ onLogout }: Props) {
  const [page, setPage]     = useState<EmployeePage>('task-board')
  const [taskId, setTaskId] = useState<string | null>(null)

  function navigate(target: EmployeePage, params?: Record<string, string>) {
    if (params?.taskId) setTaskId(params.taskId)
    setPage(target)
  }

  function renderPage() {
    switch (page) {
      case 'task-board':    return <TaskBoardPage navigate={navigate} />
      case 'task-detail':   return <TaskDetailPage navigate={navigate} taskId={taskId} />
      // case 'notifications': return <EmployeeNotificationsPage />
      case 'account':       return <EmployeeAccountPage onLogout={onLogout} />
    }
  }

  return (
    <EmployeeLayout current={page} navigate={navigate} onLogout={onLogout}>
      {renderPage()}
    </EmployeeLayout>
  )
}
