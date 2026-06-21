import { useState } from 'react'
import type { NavigateFn } from '@/lib/types'
import { ChevronLeftIcon, ChevronRightIcon, LogsIcon, ServiceIcon, CheckIcon, ImagePlaceholderIcon } from '@/lib/icons'
import Badge from '@/components/ui/Badge'
import DisableCitizenModal from './modals/DisableCitizenModal'

const personalFields: [string, string][] = [
  ['Full name',          'Ahmed Ali'],
  ['ID number',          '123456789'],
  ['Phone number',       '0591562456'],
  ['Date of birth',      '15\\1\\1990'],
  ['Registration date',  '14\\5\\2024'],
  ['The address',        'Gaza, Al-Nasr'],
  ['Email',              'Ahmed Ali1234@gmail.com'],
  ['Last seen',          '15-6-202410:30Am'],
]

export default function CitizenDetailPage({ navigate }: { navigate: NavigateFn }) {
  const [showDisable, setShowDisable] = useState(false)

  return (
    <div>
      {showDisable && <DisableCitizenModal onClose={() => setShowDisable(false)} />}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('citizens')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium"
        >
          <ChevronLeftIcon /> Back To Citizens management
        </button>
        <button
          onClick={() => setShowDisable(true)}
          className="bg-red-400 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Disable account
        </button>
      </div>

      {/* Personal Info + Verification */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3 pb-3 border-b border-gray-100">Personal information</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {personalFields.map(([label, value]) => (
              <div key={label}>
                <p className="font-semibold text-gray-700 mb-0.5">{label}</p>
                <p className="text-gray-500">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">Verification documents</h2>
          <div className="bg-gray-100 rounded-xl h-28 flex items-center justify-center mb-3">
            <ImagePlaceholderIcon />
          </div>
          <div className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2 bg-gray-50">
            <CheckIcon /><span className="font-semibold text-gray-700 text-sm">Verified</span>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">Verified by: System Administrator</p>
        </div>
      </div>

      {/* Requests */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <LogsIcon /><h2 className="font-bold text-gray-800">Requests</h2>
          </div>
          <button className="text-primary text-sm font-medium flex items-center gap-1">
            View all <ChevronRightIcon />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50">
            {['Request Num', 'Request Type', 'Date', 'Status'].map(h => (
              <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['#REQ1', 'Building permit',    '15\\5\\2025', 'Complete'   ],
              ['#REQ2', 'Water subscription', '10\\6\\2025', 'In process' ],
            ].map(([n, t, d, s]) => (
              <tr key={n} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-600">{n}</td>
                <td className="px-5 py-3 text-gray-500">{t}</td>
                <td className="px-5 py-3 text-gray-500">{d}</td>
                <td className="px-5 py-3"><Badge status={s} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Billing + Complaints */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            title: 'Billing and payments',
            headers: ['Invoice', 'Period', 'Status'],
            rows: [['Water bill', 'Mar\\2024', 'paid'], ['Water bill', 'Feb\\2024', 'paid']],
          },
          {
            title: 'Complaints and reports',
            headers: ['Type', 'Date', 'Status'],
            rows: [['Water outage', '1\\5\\2025', 'Done'], ['broken lights', '10\\6\\2025', 'In process']],
          },
        ].map(({ title, headers, rows }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <ServiceIcon /><h2 className="font-bold text-gray-800">{title}</h2>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50">
                {headers.map(h => <th key={h} className="text-left px-4 py-2.5 font-semibold text-gray-600">{h}</th>)}
              </tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    {r.map((cell, j) => (
                      <td key={j} className="px-4 py-2.5">
                        {j === r.length - 1 ? <Badge status={cell} /> : <span className="text-gray-500">{cell}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
