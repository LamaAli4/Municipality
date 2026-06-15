export default function ManagerNotificationsPage() {
  const notifications = [
    { id: 1, title: 'New Employee Added', message: 'Omar Khalid has been added to Water Supply Section.', time: '1 hour ago', unread: true },
    { id: 2, title: 'Performance Report Ready', message: 'Monthly performance report for Water Department is ready.', time: '1 day ago', unread: true },
    { id: 3, title: 'Section Update', message: 'Sewage Section capacity has been updated to 6 employees.', time: '2 days ago', unread: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
        <p className="text-sm text-gray-500">Department manager alerts and updates</p>
      </div>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${n.unread ? 'border-l-4 border-l-teal-500' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {n.unread && <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{n.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
