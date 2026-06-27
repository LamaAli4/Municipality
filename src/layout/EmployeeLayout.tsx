import { useState } from 'react'
import type { EmployeePage, EmployeeNavigateFn } from '../lib/types'
import { KanbanIcon, AccountIcon, ChevronRightIcon } from '../lib/icons'
import Logo from '../assets/logo.png'
import { useMyProfile } from '../services/profileService'

interface Props {
  current: EmployeePage
  navigate: EmployeeNavigateFn
  onLogout: () => void
  children: React.ReactNode
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function SidebarContent({ current, navigate, onClose }: {
  current: EmployeePage
  navigate: EmployeeNavigateFn
  onLogout?: () => void
  onClose?: () => void
}) {
  function go(page: EmployeePage) {
    navigate(page)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full text-white" style={{ background: '#0d3a47' }}>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
        <img src={Logo} alt="" className="w-8 h-8 shrink-0" />
        <div>
          <div className="text-xs font-bold leading-tight text-teal-300">Thecnho <span className="text-white">Amar</span></div>
          <div className="text-xs text-teal-200 mt-0.5">Employee Portal</div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-2">
        <button
          onClick={() => go('task-board')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            current === 'task-board' || current === 'task-detail'
              ? 'bg-sidebar-active text-white'
              : 'text-teal-100 hover:bg-white/10'
          }`}
        >
          <span className="flex items-center gap-2.5"><KanbanIcon />Task board</span>
          <ChevronRightIcon />
        </button>
      </nav>

      <div className="mx-4 border-t border-white/20 mb-2" />
      <div className="px-2 pb-4 space-y-0.5">
        <button
          onClick={() => go('account')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            current === 'account' ? 'bg-sidebar-active text-white' : 'text-teal-100 hover:bg-white/10'
          }`}
        >
          <span className="flex items-center gap-2.5"><AccountIcon />Account</span>
          <ChevronRightIcon />
        </button>
      </div>

    </div>
  )
}

export default function EmployeeLayout({ current, navigate, onLogout, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data: profile } = useMyProfile()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-44 flex-shrink-0">
        <SidebarContent current={current} navigate={navigate} />
</aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Mobile drawer */}
      <aside className={`fixed top-0 left-0 h-full w-56 z-50 lg:hidden transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent current={current} navigate={navigate} onClose={() => setDrawerOpen(false)} />
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0" style={{ background: '#0d3a47' }}>
          <button
            className="lg:hidden p-2 text-white rounded-lg hover:bg-white/10"
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">
                {profile ? initials(profile.full_name) : 'EA'}
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">
                {profile?.full_name ?? '...'}
              </span>
            </div>
            <button onClick={onLogout} className="text-teal-300 text-xs hover:text-white underline">Logout</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
