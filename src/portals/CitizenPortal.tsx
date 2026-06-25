import { useState } from "react";
import type { CitizenPage } from "../lib/types";
import CitizenLayout from "../layout/CitizenLayout";
import HomePage from "../view/citizen/HomePage";
import ServicesPage from "../view/citizen/ServicesPage";
import ServiceDetailPage from "../view/citizen/ServiceDetailPage";
import ServiceRequestPage from "../view/citizen/ServiceRequestPage";
import MyRequestsPage from "../view/citizen/MyRequestsPage";
import RequestDetailPage from "../view/citizen/RequestDetailPage";
import ComplaintsPage from "../view/citizen/ComplaintsPage";
import NewComplaintPage from "../view/citizen/NewComplaintPage";
import ComplaintDetailPage from "../view/citizen/ComplaintDetailPage";
import UtilityBillsPage from "../view/citizen/UtilityBillsPage";
import PayBillPage from "../view/citizen/PayBillPage";
import DamageAssessmentPage from "../view/citizen/DamageAssessmentPage";
import CitizenNotificationsPage from "../view/citizen/NotificationsPage";
import CitizenAccountPage from "../view/citizen/AccountPage";

interface Props {
  onLogout: () => void;
}

export default function CitizenPortal({ onLogout }: Props) {
  const [page, setPage] = useState<CitizenPage>("home");
  const [serviceId,    setServiceId]    = useState<string | null>(null);
  const [requestId,    setRequestId]    = useState<string | null>(null);
  const [complaintId,  setComplaintId]  = useState<string | null>(null);

  function navigate(target: CitizenPage, params?: Record<string, string>) {
    if (params?.serviceId)   setServiceId(params.serviceId);
    if (params?.requestId)   setRequestId(params.requestId);
    if (params?.complaintId) setComplaintId(params.complaintId);
    setPage(target);
  }

  function renderPage() {
    switch (page) {
      case "home":
        return <HomePage navigate={navigate} />;
      case "services":
        return <ServicesPage navigate={navigate} />;
      case "service-detail":
        return <ServiceDetailPage navigate={navigate} serviceId={serviceId} />;
      case "service-request":
        return <ServiceRequestPage navigate={navigate} />;
      case "my-requests":
        return <MyRequestsPage navigate={navigate} />;
      case "request-detail":
        return <RequestDetailPage navigate={navigate} requestId={requestId} />;
      case "complaints":
        return <ComplaintsPage navigate={navigate} />;
      case "new-complaint":
        return <NewComplaintPage navigate={navigate} />;
      case "complaint-detail":
        return <ComplaintDetailPage navigate={navigate} complaintId={complaintId} />;
      case "utility-bills":
        return <UtilityBillsPage navigate={navigate} />;
      case "pay-bill":
        return <PayBillPage navigate={navigate} />;
      case "damage-assessment":
        return <DamageAssessmentPage navigate={navigate} />;
      case "notifications":
        return <CitizenNotificationsPage />;
      case "account":
        return <CitizenAccountPage />;
    }
  }

  return (
    <CitizenLayout current={page} navigate={navigate} onLogout={onLogout}>
      {renderPage()}
    </CitizenLayout>
  );
}
