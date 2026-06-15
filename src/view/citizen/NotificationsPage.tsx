export default function CitizenNotificationsPage() {
  const notifications = [
    { id: 1, title: 'Request Update', message: 'Your Building Permit request (#REQ-2024-001) has moved to site inspection stage.', time: '2 hours ago', unread: true },
    { id: 2, title: 'Payment Confirmed', message: 'Payment of $525.00 for Building Permit has been confirmed.', time: '1 day ago', unread: true },
    { id: 3, title: 'Complaint Resolved', message: 'Your complaint about water supply interruption has been resolved.', time: '3 days ago', unread: false },
    { id: 4, title: 'Bill Due', message: 'Your Water Bill for January 2024 ($85.00) is due on 15/2/2024.', time: '5 days ago', unread: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
        <p className="text-sm text-gray-500">Stay updated on your requests and services</p>
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
