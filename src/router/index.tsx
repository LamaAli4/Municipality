import type { Page, NavigateFn } from '../lib/types'
import DashboardPage    from '../view/DashboardPage'
import CitizensPage     from '../view/CitizensPage'
import CitizenDetailPage from '../view/CitizenDetailPage'
import StaffPage        from '../view/StaffPage'
import DepartmentPage   from '../view/DepartmentPage'
import SectionPage      from '../view/SectionPage'
import ServicePage      from '../view/ServicePage'
import AddServicePage   from '../view/AddServicePage'
import ServiceDetailPage from '../view/ServiceDetailPage'
import AdminComplaintsPage from '../view/AdminComplaintsPage'
import AdminComplaintDetailPage from '../view/AdminComplaintDetailPage'
// import LogsPage from '../view/LogsPage'
import NotificationsPage from '../view/NotificationsPage'
import AccountPage      from '../view/AccountPage'
import LoginPage        from '../view/auth/LoginPage'

interface RouterProps {
  page: Page
  navigate: NavigateFn
  selectedUserId?: string | null
  selectedDepartmentId?: string | null
  selectedServiceId?: string | null
  selectedComplaintId?: string | null
}

export default function Router({ page, navigate, selectedUserId, selectedDepartmentId, selectedServiceId, selectedComplaintId }: RouterProps) {
  switch (page) {
    case 'dashboard':         return <DashboardPage navigate={navigate} />
    case 'citizens':          return <CitizensPage navigate={navigate} />
    case 'citizen-detail':    return <CitizenDetailPage navigate={navigate} userId={selectedUserId ?? null} />
    case 'staff':             return <StaffPage />
    case 'department':        return <DepartmentPage navigate={navigate} />
    case 'sections':          return <SectionPage navigate={navigate} departmentId={selectedDepartmentId ?? null} />
    case 'service':           return <ServicePage navigate={navigate} />
    case 'add-service':       return <AddServicePage navigate={navigate} />
    case 'service-detail':    return <ServiceDetailPage navigate={navigate} serviceId={selectedServiceId ?? null} />
    case 'complaints':        return <AdminComplaintsPage navigate={navigate} />
    case 'complaint-detail':  return <AdminComplaintDetailPage navigate={navigate} complaintId={selectedComplaintId ?? null} />
    // case 'logs': return <LogsPage />
    case 'notifications':     return <NotificationsPage />
    case 'account':           return <AccountPage />
    case 'login':             return <LoginPage navigate={navigate} />
    default:                  return <DashboardPage navigate={navigate} />
  }
}
