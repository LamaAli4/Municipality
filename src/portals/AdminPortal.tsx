import { useState } from 'react'
import type { Page } from '../lib/types'
import MainLayout from '../layout/MainLayout'
import Router from '../router'

interface Props { onLogout: () => void }

export default function AdminPortal({ onLogout }: Props) {
  const [page, setPage] = useState<Page>('dashboard')

  return (
    <MainLayout current={page} navigate={setPage} onLogout={onLogout}>
      <Router page={page} navigate={setPage} />
    </MainLayout>
  )
}
