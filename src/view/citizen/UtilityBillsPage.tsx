import { useState } from 'react'
import type { CitizenNavigateFn } from '../../lib/types'

interface Props { navigate: CitizenNavigateFn }

const bills = [
  { id: 1, service: 'Water Bill', period: 'January 2024', amount: 85, dueDate: '15/2/2024', status: 'Unpaid' as const },
  { id: 2, service: 'Electricity Bill', period: 'January 2024', amount: 230, dueDate: '20/2/2024', status: 'In process' as const },
  { id: 3, service: 'Water Bill', period: 'December 2023', amount: 78, dueDate: '15/1/2024', status: 'Paid' as const },
  { id: 4, service: 'Electricity Bill', period: 'December 2023', amount: 195, dueDate: '20/1/2024', status: 'Paid' as const },
]

const borderColors: Record<string, string> = {
  'Unpaid': 'border-l-red-400',
  'In process': 'border-l-orange-400',
  'Paid': 'border-l-teal-500',
}

const badgeColors: Record<string, string> = {
  'Unpaid': 'bg-red-100 text-red-700',
  'In process': 'bg-orange-100 text-orange-700',
  'Paid': 'bg-teal-100 text-teal-700',
}

export default function UtilityBillsPage({ navigate }: Props) {
  const [filter, setFilter] = useState<'All' | 'Unpaid' | 'In process' | 'Paid'>('All')

  const filtered = filter === 'All' ? bills : bills.filter(b => b.status === filter)

  const unpaidTotal = bills.filter(b => b.status === 'Unpaid').reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Utility Bills</h1>
        <p className="text-sm text-gray-500">View and pay your utility bills</p>
      </div>

      {/* Summary */}
      {unpaidTotal > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-red-800">Outstanding Balance</p>
            <p className="text-2xl font-bold text-red-600">${unpaidTotal}</p>
          </div>
          <button
            onClick={() => navigate('pay-bill')}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 font-medium"
          >
            Pay All
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(['All', 'Unpaid', 'In process', 'Paid'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? 'bg-teal-600 text-white' : 'border border-gray-300 text-gray-600 hover:border-teal-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bill cards */}
      <div className="space-y-3">
        {filtered.map(bill => (
          <div key={bill.id} className={`bg-white rounded-xl border-l-4 shadow-sm border border-gray-100 p-4 ${borderColors[bill.status]}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{bill.service}</p>
                <p className="text-xs text-gray-400 mt-0.5">{bill.period} • Due {bill.dueDate}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-bold text-gray-800">${bill.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[bill.status]}`}>{bill.status}</span>
                </div>
                {bill.status === 'Unpaid' && (
                  <button
                    onClick={() => navigate('pay-bill')}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
