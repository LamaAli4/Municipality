export default function EmployeeNotificationsPage() {
  const notifications = [
    { id: 1, title: 'New Task Assigned', message: 'Task #TSK-241 (Water subscription) has been assigned to you. Due date: 1/3/2024.', time: '30 minutes ago', unread: true },
    { id: 2, title: 'Document Submitted', message: 'Citizen Ahmed Muhammad has submitted the requested documents for TSK-241.', time: '3 hours ago', unread: true },
    { id: 3, title: 'Task Due Soon', message: 'Task #TSK-225 is due in 2 days. Please update the status.', time: '1 day ago', unread: false },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
        <p className="text-sm text-gray-500">Task updates and alerts</p>
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
