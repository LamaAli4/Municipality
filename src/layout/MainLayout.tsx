import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Page, NavigateFn } from '../lib/types'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface MainLayoutProps {
  current: Page
  navigate: NavigateFn
  onLogout?: () => void
  children: ReactNode
}

export default function MainLayout({ current, navigate, onLogout, children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        current={current}
        navigate={navigate}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          onLogout={onLogout}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
