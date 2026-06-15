const statusStyles: Record<string, string> = {
  Active:       'bg-teal-100 text-teal-700 border border-teal-300',
  active:       'bg-teal-100 text-teal-700 border border-teal-300',
  Inactive:     'bg-red-100 text-red-500 border border-red-300',
  inactive:     'bg-red-100 text-red-500 border border-red-300',
  pending:      'bg-orange-100 text-orange-500 border border-orange-300',
  Pending:      'bg-orange-100 text-orange-500 border border-orange-300',
  'In process': 'bg-orange-100 text-orange-600 border border-orange-300',
  Complete:     'bg-teal-100 text-teal-700 border border-teal-300',
  Rejected:     'bg-red-200 text-red-600 border border-red-300',
  successful:   'bg-teal-100 text-teal-700 border border-teal-300',
  'to fail':    'bg-red-200 text-red-600 border border-red-300',
  paid:         'bg-teal-100 text-teal-700 border border-teal-300',
  Done:         'bg-teal-100 text-teal-700 border border-teal-300',
  Verified:     'bg-teal-100 text-teal-700 border border-teal-300',
}

export default function Badge({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
