import { useState } from 'react'
import type { CitizenPage } from '../lib/types'
import CitizenLayout from '../layout/CitizenLayout'
import HomePage from '../view/citizen/HomePage'
import ServicesPage from '../view/citizen/ServicesPage'
import ServiceDetailPage from '../view/citizen/ServiceDetailPage'
import ServiceRequestPage from '../view/citizen/ServiceRequestPage'
import MyRequestsPage from '../view/citizen/MyRequestsPage'
import RequestDetailPage from '../view/citizen/RequestDetailPage'
import ComplaintsPage from '../view/citizen/ComplaintsPage'
import NewComplaintPage from '../view/citizen/NewComplaintPage'
import UtilityBillsPage from '../view/citizen/UtilityBillsPage'
import PayBillPage from '../view/citizen/PayBillPage'
import DamageAssessmentPage from '../view/citizen/DamageAssessmentPage'
import CitizenNotificationsPage from '../view/citizen/NotificationsPage'
import CitizenAccountPage from '../view/citizen/AccountPage'

interface Props { onLogout: () => void }

export default function CitizenPortal({ onLogout }: Props) {
  const [page, setPage] = useState<CitizenPage>('home')

  function renderPage() {
    switch (page) {
      case 'home':                return <HomePage navigate={setPage} />
      case 'services':            return <ServicesPage navigate={setPage} />
      case 'service-detail':      return <ServiceDetailPage navigate={setPage} />
      case 'service-request':     return <ServiceRequestPage navigate={setPage} />
      case 'my-requests':         return <MyRequestsPage navigate={setPage} />
      case 'request-detail':      return <RequestDetailPage navigate={setPage} />
      case 'complaints':          return <ComplaintsPage navigate={setPage} />
      case 'new-complaint':       return <NewComplaintPage navigate={setPage} />
      case 'utility-bills':       return <UtilityBillsPage navigate={setPage} />
      case 'pay-bill':            return <PayBillPage navigate={setPage} />
      case 'damage-assessment':   return <DamageAssessmentPage navigate={setPage} />
      case 'notifications':       return <CitizenNotificationsPage />
      case 'account':             return <CitizenAccountPage />
    }
  }

  return (
    <CitizenLayout current={page} navigate={setPage} onLogout={onLogout}>
      {renderPage()}
    </CitizenLayout>
  )
}
