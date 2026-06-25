import { useState } from 'react'
import type { Page, NavigateFn } from '../lib/types'
import {
  DashboardIcon, CitizensIcon, StaffIcon, DepartmentIcon,
  ServiceIcon, ComplaintsIcon, BellIcon, AccountIcon, ChevronRightIcon,
} from '../lib/icons'
import Logo from '../assets/logo.png'

const navItems = [
  { key: 'dashboard'  as Page, label: 'Control panel',      Icon: DashboardIcon  },
  { key: 'citizens'   as Page, label: 'Citizens management', Icon: CitizensIcon   },
  { key: 'staff'      as Page, label: 'Staff management',    Icon: StaffIcon      },
  { key: 'department' as Page, label: 'Department',          Icon: DepartmentIcon },
  { key: 'service'    as Page, label: 'Service management',  Icon: ServiceIcon    },
  { key: 'complaints' as Page, label: 'Complaints',          Icon: ComplaintsIcon },
  // TODO: System logs — deferred
  // { key: 'logs' as Page, label: 'System logs', Icon: LogsIcon },
]

const bottomItems = [
  { key: 'notifications' as Page, label: 'Notifications', Icon: BellIcon    },
  { key: 'account'       as Page, label: 'Account',        Icon: AccountIcon },
]

function isActive(current: Page, itemKey: Page): boolean {
  if (current === itemKey) return true
  if (current === 'citizen-detail'   && itemKey === 'citizens')    return true
  if (current === 'sections'         && itemKey === 'department')  return true
  if (current === 'add-service'      && itemKey === 'service')     return true
  if (current === 'service-detail'   && itemKey === 'service')     return true
  if (current === 'complaint-detail' && itemKey === 'complaints')  return true
  return false
}

interface SidebarProps {
  current: Page
  navigate: NavigateFn
  mobileOpen: boolean
  onClose: () => void
}

function NavItem({
  item, current, navigate, collapsed, onClose,
}: {
  item: typeof navItems[number]
  current: Page
  navigate: NavigateFn
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
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronRightIcon />
        </>
      )}
    </button>
  )
}

function SidebarContent({
  current, navigate, collapsed, onClose,
}: {
  current: Page
  navigate: NavigateFn
  collapsed: boolean
  onClose: () => void
}) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#0d3a47' }}
    >
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

      {/* Nav */}
      <div className="flex-1 px-2 pt-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.key} item={item} current={current} navigate={navigate} collapsed={collapsed} onClose={onClose} />
        ))}
      </div>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-1">
        {bottomItems.map(item => (
          <NavItem key={item.key} item={item} current={current} navigate={navigate} collapsed={collapsed} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}

export default function Sidebar({ current, navigate, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* ── Mobile overlay ───────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Mobile drawer ────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full w-56 z-50 transform transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent current={current} navigate={navigate} collapsed={false} onClose={onClose} />
      </div>

      {/* ── Tablet: icon-only sidebar ────────────────────── */}
      <div className="hidden md:flex lg:hidden w-16 shrink-0 flex-col h-screen">
        <SidebarContent current={current} navigate={navigate} collapsed={true} onClose={() => {}} />
      </div>

      {/* ── Desktop: full sidebar ────────────────────────── */}
      <div className="hidden lg:flex w-52 shrink-0 flex-col h-screen">
        <SidebarContent current={current} navigate={navigate} collapsed={false} onClose={() => {}} />
      </div>
    </>
  )
}
