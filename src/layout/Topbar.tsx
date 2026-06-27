import { useMyProfile } from '../services/profileService'

interface Props {
  onLogout?: () => void
  onMenuClick?: () => void
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Topbar({ onLogout, onMenuClick }: Props) {
  const { data: profile } = useMyProfile()

  return (
    <div className="h-14 flex items-center justify-between gap-4 px-4 md:px-6 shrink-0" style={{ background: '#0d3a47' }}>
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {profile ? initials(profile.full_name) : '…'}
        </div>
        <span className="text-white font-medium text-sm hidden sm:block">
          {profile?.full_name ?? '…'}
        </span>
        {onLogout && (
          <button onClick={onLogout} className="text-teal-300 text-xs hover:text-white underline ml-1">
            Logout
          </button>
        )}
      </div>
    </div>
  )
}
