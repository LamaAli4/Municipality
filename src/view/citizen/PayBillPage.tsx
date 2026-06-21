import { useState } from 'react'
import type { CitizenNavigateFn } from '@/lib/types'
import { ChevronLeftIcon } from '@/lib/icons'

interface Props { navigate: CitizenNavigateFn }

export default function PayBillPage({ navigate }: Props) {
  const [method, setMethod] = useState('Credit / Debit Card')

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('utility-bills')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Utility Bills
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">Pay The Bill</h1>
        <p className="text-sm text-gray-500">Water Bill • January 2024</p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-3xl">
        {/* Bill details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Bill Details</h2>
          <div className="space-y-3 text-sm">
            {[
              ['Service', 'Water Bill'],
              ['Account number', 'WB-2024-00142'],
              ['Billing period', 'January 2024'],
              ['Due date', '15/2/2024'],
              ['Consumption', '12.4 m³'],
              ['Rate', '$6.85/m³'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-500">{k}</span>
                <span className="text-gray-800 font-medium">{v}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
              <span>Total Amount</span>
              <span className="text-red-600">$85.00</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Payment Method</h2>
          <div className="space-y-2">
            {['Credit / Debit Card', 'Bank Transfer', 'Online Banking'].map(m => (
              <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${method === m ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                <input type="radio" checked={method === m} onChange={() => setMethod(m)} className="accent-teal-600" />
                <span className="text-sm text-gray-700">{m}</span>
              </label>
            ))}
          </div>

          {method === 'Credit / Debit Card' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">CVV</label>
                  <input type="text" placeholder="000" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('utility-bills')}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold mt-2"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            Pay $85.00
          </button>
        </div>
      </div>
    </div>
  )
}
