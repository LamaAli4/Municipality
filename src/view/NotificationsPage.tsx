import { LogsIcon, CheckIcon } from '@/lib/icons'
import SectionHeader from '@/components/ui/SectionHeader'

export default function NotificationsPage() {
  return (
    <div>
      <SectionHeader
        title="Notifications"
        subtitle="Follow the latest updates and notifications for your account"
        action={
          <button className="btn-confirm text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm">
            <CheckIcon /> Select all as read
          </button>
        }
      />

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-4 relative">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-primary shrink-0 mt-1">
          <LogsIcon />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800">12 applications awaiting approval</p>
          <p className="text-sm text-gray-500 mt-1">
            There are 12 applications awaiting approval for more than 3 days. Please review the delayed
            applications to avoid citizen complaints.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-gray-400">An hour ago</span>
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
