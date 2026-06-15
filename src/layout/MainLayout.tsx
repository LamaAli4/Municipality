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
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar current={current} navigate={navigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
