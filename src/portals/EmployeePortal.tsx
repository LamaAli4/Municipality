import { useState } from 'react'
import type { EmployeePage } from '../lib/types'
import EmployeeLayout from '../layout/EmployeeLayout'
import TaskBoardPage from '../view/employee/TaskBoardPage'
import TaskDetailPage from '../view/employee/TaskDetailPage'
import EmployeeNotificationsPage from '../view/employee/NotificationsPage'
import EmployeeAccountPage from '../view/employee/AccountPage'

interface Props { onLogout: () => void }

export default function EmployeePortal({ onLogout }: Props) {
  const [page, setPage] = useState<EmployeePage>('task-board')

  function renderPage() {
    switch (page) {
      case 'task-board':    return <TaskBoardPage navigate={setPage} />
      case 'task-detail':   return <TaskDetailPage navigate={setPage} />
      case 'notifications': return <EmployeeNotificationsPage />
      case 'account':       return <EmployeeAccountPage />
    }
  }

  return (
    <EmployeeLayout current={page} navigate={setPage} onLogout={onLogout}>
      {renderPage()}
    </EmployeeLayout>
  )
}
