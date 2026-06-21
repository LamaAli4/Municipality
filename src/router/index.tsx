import type { Page, NavigateFn } from '@/lib/types'
import DashboardPage    from '@/view/DashboardPage'
import CitizensPage     from '@/view/CitizensPage'
import CitizenDetailPage from '@/view/CitizenDetailPage'
import StaffPage        from '@/view/StaffPage'
import DepartmentPage   from '@/view/DepartmentPage'
import SectionPage      from '@/view/SectionPage'
import ServicePage      from '@/view/ServicePage'
import AddServicePage   from '@/view/AddServicePage'
import LogsPage         from '@/view/LogsPage'
import NotificationsPage from '@/view/NotificationsPage'
import AccountPage      from '@/view/AccountPage'
import LoginPage        from '@/view/auth/LoginPage'

interface RouterProps {
  page: Page
  navigate: NavigateFn
}

export default function Router({ page, navigate }: RouterProps) {
  switch (page) {
    case 'dashboard':      return <DashboardPage navigate={navigate} />
    case 'citizens':       return <CitizensPage navigate={navigate} />
    case 'citizen-detail': return <CitizenDetailPage navigate={navigate} />
    case 'staff':          return <StaffPage />
    case 'department':     return <DepartmentPage navigate={navigate} />
    case 'sections':       return <SectionPage navigate={navigate} />
    case 'service':        return <ServicePage navigate={navigate} />
    case 'add-service':    return <AddServicePage navigate={navigate} />
    case 'logs':           return <LogsPage />
    case 'notifications':  return <NotificationsPage />
    case 'account':        return <AccountPage />
    case 'login':          return <LoginPage navigate={navigate} />
    default:               return <DashboardPage navigate={navigate} />
  }
}
