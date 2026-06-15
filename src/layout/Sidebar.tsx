import type { Page, NavigateFn } from '../lib/types'
import {
  DashboardIcon, CitizensIcon, StaffIcon, DepartmentIcon,
  ServiceIcon, LogsIcon, BellIcon, AccountIcon, ChevronRightIcon,
} from '../lib/icons'
import Logo from '../assets/logo.png'

const navItems = [
  { key: 'dashboard'  as Page, label: 'Control panel',      Icon: DashboardIcon  },
  { key: 'citizens'   as Page, label: 'Citizens management', Icon: CitizensIcon   },
  { key: 'staff'      as Page, label: 'Staff management',    Icon: StaffIcon      },
  { key: 'department' as Page, label: 'Department',          Icon: DepartmentIcon },
  { key: 'service'    as Page, label: 'Service management',  Icon: ServiceIcon    },
  { key: 'logs'       as Page, label: 'System logs',         Icon: LogsIcon       },
]

const bottomItems = [
  { key: 'notifications' as Page, label: 'Notifications', Icon: BellIcon    },
  { key: 'account'       as Page, label: 'Account',        Icon: AccountIcon },
]

function isActive(current: Page, itemKey: Page): boolean {
  if (current === itemKey) return true
  if (current === 'citizen-detail' && itemKey === 'citizens')   return true
  if (current === 'sections'       && itemKey === 'department') return true
  if (current === 'add-service'    && itemKey === 'service')    return true
  return false
}

interface SidebarProps {
  current: Page
  navigate: NavigateFn
}

function NavItem({ item, current, navigate }: { item: typeof navItems[number], current: Page, navigate: NavigateFn }) {
  const active = isActive(current, item.key)
  return (
    <button
      onClick={() => navigate(item.key)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-sidebar-active text-white' : 'text-teal-100 hover:bg-white/10'
      }`}
    >
      <span className="shrink-0"><item.Icon /></span>
      <span className="flex-1 text-left">{item.label}</span>
      <ChevronRightIcon />
    </button>
  )
}

export default function Sidebar({ current, navigate }: SidebarProps) {
  return (
    <div className="w-52 shrink-0 flex flex-col h-screen" style={{ background: '#0d3a47' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
        <img src={Logo} alt="" className="w-8 h-8" />
        <div className="leading-tight">
          <p className="text-xs font-bold text-teal-300">Thecnho</p>
          <p className="text-xs font-bold text-white">Amar</p>
        </div>
      </div>
      <div className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.key} item={item} current={current} navigate={navigate} />
        ))}
      </div>
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
        {bottomItems.map(item => (
          <NavItem key={item.key} item={item} current={current} navigate={navigate} />
        ))}
      </div>
    </div>
  )
}
