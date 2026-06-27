import { useState } from 'react'
import type { CitizenPage, CitizenNavigateFn } from '../lib/types'
import {
  HomeIcon,
  ServiceIcon,
  MyRequestIcon,
  ComplaintsIcon,
  // BillsIcon,
  DamageIcon,
  // BellIcon,
  AccountIcon,
  ChevronRightIcon,
} from '../lib/icons'
import Logo from '../assets/logo.png'
import { useMyProfile } from '../services/profileService'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

interface Props {
  current: CitizenPage
  navigate: CitizenNavigateFn
  onLogout: () => void
  children: React.ReactNode
}

const mainNav: { key: CitizenPage; label: string; Icon: React.FC }[] = [
  { key: 'home',              label: 'Home',              Icon: HomeIcon        },
  { key: 'services',          label: 'Services',          Icon: ServiceIcon     },
  { key: 'my-requests',       label: 'My Request',        Icon: MyRequestIcon   },
  { key: 'complaints',        label: 'Complaints',        Icon: ComplaintsIcon  },
  // { key: 'utility-bills', label: 'Utility Bills',     Icon: BillsIcon       },
  { key: 'damage-assessment', label: 'Damage assessment', Icon: DamageIcon      },
]

const bottomNav: { key: CitizenPage; label: string; Icon: React.FC }[] = [
  // { key: 'notifications', label: 'Notifications', Icon: BellIcon   },
  { key: 'account', label: 'Account', Icon: AccountIcon },
]

function isActive(current: CitizenPage, key: CitizenPage): boolean {
  if (current === key) return true
  if (key === 'services'    && (current === 'service-detail' || current === 'service-request')) return true
  if (key === 'my-requests' && current === 'request-detail')   return true
  if (key === 'complaints'  && current === 'new-complaint')    return true
  // if (key === 'utility-bills' && current === 'pay-bill')    return true
  return false
}

function NavItem({
  item, current, navigate, collapsed, onClose,
}: {
  item: typeof mainNav[number]
  current: CitizenPage
  navigate: CitizenNavigateFn
  collapsed: boolean
  onClose: () => void
}) {
  const active = isActive(current, item.key)
  return (
    <button
      onClick={() => { navigate(item.key); onClose() }}
      title={collapsed ? item.label : undefined}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
        collapsed ? 'justify-center' : ''
      } ${active ? 'bg-sidebar-active text-white' : 'text-teal-100 hover:bg-white/10'}`}
    >
      <span className="shrink-0"><item.Icon /></span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{item.label}</span>
          <span className="shrink-0"><ChevronRightIcon /></span>
        </>
      )}
    </button>
  )
}

function SidebarContent({
  current, navigate, collapsed, onClose,
}: {
  current: CitizenPage
  navigate: CitizenNavigateFn
  collapsed: boolean
  onClose: () => void
}) {
  return (
    <div className="flex flex-col h-full" style={{ background: '#0d3a47' }}>
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-white/10 ${collapsed ? 'justify-center px-2' : ''}`}>
        <img src={Logo} alt="" className="w-8 h-8 shrink-0" />
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-xs font-bold text-teal-300">Thecnho</p>
            <p className="text-xs font-bold text-white">Amar</p>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 pt-4 space-y-1 overflow-y-auto">
        {mainNav.map(item => (
          <NavItem key={item.key} item={item} current={current} navigate={navigate} collapsed={collapsed} onClose={onClose} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-1">
        {bottomNav.map(item => (
          <NavItem key={item.key} item={item} current={current} navigate={navigate} collapsed={collapsed} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}

export default function CitizenLayout({ current, navigate, onLogout, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: profile } = useMyProfile()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`fixed top-0 left-0 h-full w-56 z-50 transform transition-transform duration-300 md:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent current={current} navigate={navigate} collapsed={false} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Tablet: icon-only sidebar */}
      <div className="hidden md:flex lg:hidden w-16 shrink-0 flex-col h-screen">
        <SidebarContent current={current} navigate={navigate} collapsed={true} onClose={() => {}} />
      </div>

      {/* Desktop: full sidebar */}
      <div className="hidden lg:flex w-56 shrink-0 flex-col h-screen">
        <SidebarContent current={current} navigate={navigate} collapsed={false} onClose={() => {}} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0" style={{ background: '#0d3a47' }}>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">
              {profile ? initials(profile.full_name) : '…'}
            </div>
            <span className="text-white text-sm font-medium hidden sm:block">
              {profile?.full_name ?? '…'}
            </span>
            <button onClick={onLogout} className="text-teal-300 text-xs hover:text-white underline ml-1">
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
