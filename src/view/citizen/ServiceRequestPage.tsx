import { useState } from 'react'
import type { CitizenNavigateFn } from '@/lib/types'
import { ChevronLeftIcon, UploadIcon, ArrowRightIcon } from '@/lib/icons'

interface Props { navigate: CitizenNavigateFn }

const docs = [
  { name: 'Property Deed', hint: 'PDF,JPG or PNG (max 5MB)' },
  { name: 'Architectural Plans', hint: 'PDF,JPG or PNG (max 5MB)' },
  { name: 'Engineer Report', hint: 'PDF,JPG or PNG (max 5MB)' },
  { name: 'Owner ID Copy', hint: 'PDF,JPG or PNG (max 5MB)' },
]

const paymentMethods = ['Credit / Debit Card', 'Bank Transfer', 'Online Banking']

export default function ServiceRequestPage({ navigate }: Props) {
  const [step, setStep] = useState(1)
  const [payMethod, setPayMethod] = useState('Credit / Debit Card')

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('service-detail')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Services
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">New services request</h1>
        <p className="text-sm text-gray-500">Water subscription request</p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <StepItem num={1} label="Document Upload" sublabel="Step 1" active={step === 1} done={step > 1} />
          <div className={`flex-1 h-0.5 ${step > 1 ? 'bg-teal-500' : 'bg-gray-200'}`} />
          <StepItem num={2} label="Payment" sublabel="Step  2" active={step === 2} done={false} />
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-800">Document Upload</h2>
            <p className="text-sm text-gray-500">Upload all required documents for your request</p>
          </div>
          {docs.map(doc => (
            <div key={doc.name} className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UploadIcon />
                <div>
                  <p className="font-medium text-gray-700 text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.hint}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700">
                Choose File
              </button>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
            >
              Next <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-gray-800">Payment</h2>
            <p className="text-sm text-gray-500">Complete your payment to submit the request</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Building Permit fee</span>
              <span className="font-medium">$500.00</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Processing fee</span>
              <span className="font-medium">$25.00</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-teal-600">$525.00</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
            <div className="space-y-2">
              {paymentMethods.map(m => (
                <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${payMethod === m ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                  <input type="radio" checked={payMethod === m} onChange={() => setPayMethod(m)} className="accent-teal-600" />
                  <span className="text-sm text-gray-700">{m}</span>
                </label>
              ))}
            </div>
          </div>

          {payMethod === 'Credit / Debit Card' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">CVV</label>
                  <input type="text" placeholder="000" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => navigate('my-requests')}
              className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
            >
              Submit & Pay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StepItem({ num, label, sublabel, active, done }: { num: number; label: string; sublabel: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active || done ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
        {done
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{num === 1 ? <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></> : <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>}</svg>
        }
      </div>
      <span className={`text-xs font-semibold ${active ? 'text-teal-600' : 'text-gray-400'}`}>{sublabel}</span>
      <span className={`text-xs ${active ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}
