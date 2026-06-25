import { useState } from 'react'
import type { Page } from '../lib/types'
import MainLayout from '../layout/MainLayout'
import Router from '../router'

interface Props { onLogout: () => void }

export default function AdminPortal({ onLogout }: Props) {
  const [page, setPage] = useState<Page>('dashboard')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  function navigate(target: Page, params?: Record<string, string>) {
    if (params?.userId) setSelectedUserId(params.userId)
    if (params?.departmentId) setSelectedDepartmentId(params.departmentId)
    if (params?.serviceId) setSelectedServiceId(params.serviceId)
    setPage(target)
  }

  return (
    <MainLayout current={page} navigate={navigate} onLogout={onLogout}>
      <Router page={page} navigate={navigate} selectedUserId={selectedUserId} selectedDepartmentId={selectedDepartmentId} selectedServiceId={selectedServiceId} />
    </MainLayout>
  )
}
