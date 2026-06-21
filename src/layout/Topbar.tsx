import { BellIcon } from '@/lib/icons'

interface Props { onLogout?: () => void }

export default function Topbar({ onLogout }: Props) {
  return (
    <div className="h-14 flex items-center justify-end gap-4 px-6 shrink-0" style={{ background: '#0d3a47' }}>
      <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
        AM
      </div>
      <span className="text-white font-medium text-sm">Admin Muhammad</span>
      {onLogout && (
        <button onClick={onLogout} className="text-teal-300 text-xs hover:text-white underline ml-1">
          Logout
        </button>
      )}
    </div>
  )
}
