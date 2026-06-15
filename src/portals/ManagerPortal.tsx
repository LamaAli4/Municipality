import { useState } from 'react'
import type { ManagerPage } from '../lib/types'
import ManagerLayout from '../layout/ManagerLayout'
import StaffManagementPage from '../view/manager/StaffManagementPage'
import DepartmentManagementPage from '../view/manager/DepartmentManagementPage'
import PerformancePanelPage from '../view/manager/PerformancePanelPage'
import ManagerNotificationsPage from '../view/manager/NotificationsPage'
import ManagerAccountPage from '../view/manager/AccountPage'

interface Props { onLogout: () => void }

export default function ManagerPortal({ onLogout }: Props) {
  const [page, setPage] = useState<ManagerPage>('staff')

  function renderPage() {
    switch (page) {
      case 'staff':           return <StaffManagementPage />
      case 'department-mgmt': return <DepartmentManagementPage />
      case 'performance':     return <PerformancePanelPage />
      case 'notifications':   return <ManagerNotificationsPage />
      case 'account':         return <ManagerAccountPage />
    }
  }

  return (
    <ManagerLayout current={page} navigate={setPage} onLogout={onLogout}>
      {renderPage()}
    </ManagerLayout>
  )
}
