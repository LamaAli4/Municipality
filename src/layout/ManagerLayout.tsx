import type { ManagerPage, ManagerNavigateFn } from '../lib/types'
import { StaffIcon, DepartmentIcon, PerformanceIcon, BellIcon, AccountIcon, ChevronRightIcon } from '../lib/icons'
import Logo from '../assets/logo.png'

interface Props {
  current: ManagerPage
  navigate: ManagerNavigateFn
  onLogout: () => void
  children: React.ReactNode
}

const mainNav: { key: ManagerPage; label: string; icon: React.ReactNode }[] = [
  { key: 'staff',           label: 'Staff management',      icon: <StaffIcon /> },
  { key: 'department-mgmt', label: 'Department management', icon: <DepartmentIcon /> },
  { key: 'performance',     label: 'Performance panel',     icon: <PerformanceIcon /> },
]

const bottomNav: { key: ManagerPage; label: string; icon: React.ReactNode }[] = [
  { key: 'notifications', label: 'Notifications', icon: <BellIcon /> },
  { key: 'account',       label: 'Account',       icon: <AccountIcon /> },
]

export default function ManagerLayout({ current, navigate, onLogout, children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-52 flex flex-col flex-shrink-0 text-white" style={{ background: '#0d3a47' }}>
        <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
          <img src={Logo} alt="" className="w-8 h-8" />
          <div>
            <div className="text-xs font-bold leading-tight text-teal-300">Thecnho <span className="text-white">Amar</span></div>
            <div className="text-xs text-teal-200 mt-0.5">Dept. Manager</div>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {mainNav.map(item => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                current === item.key ? 'bg-sidebar-active text-white' : 'text-teal-100 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
              <ChevronRightIcon />
            </button>
          ))}
        </nav>

        <div className="mx-4 border-t border-white/20 mb-2" />
        <div className="px-2 pb-4 space-y-0.5">
          {bottomNav.map(item => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                current === item.key ? 'bg-sidebar-active text-white' : 'text-teal-100 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
              <ChevronRightIcon />
            </button>
          ))}
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 flex items-center justify-between px-6 flex-shrink-0" style={{ background: '#0d3a47' }}>
          <div />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">KA</div>
              <span className="text-white text-sm font-medium">Khalid Al-Rashid</span>
            </div>
            <button onClick={onLogout} className="text-teal-300 text-xs hover:text-white underline">Logout</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
