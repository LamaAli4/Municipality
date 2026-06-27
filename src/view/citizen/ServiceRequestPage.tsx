import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon, UploadIcon, ArrowRightIcon } from '../../lib/icons'
import { useServiceDetail } from '../../services/servicesService'
import { useSubmitRequest } from '../../services/requestsService'
import PageWrapper from '../../components/ui/PageWrapper'
import axiosInstance from '../../lib/axios'

interface Props {
  navigate: CitizenNavigateFn
  serviceId: string | null
}

async function uploadFile(file: File) {
  const auth = await axiosInstance.get('/auth/imagekit/upload-auth').then(r => r.data.data)
  const form = new FormData()
  form.append('file', file)
  form.append('fileName', file.name)
  form.append('publicKey', auth.publicKey)
  form.append('signature', auth.signature)
  form.append('expire', String(auth.expire))
  form.append('token', auth.token)
  form.append('folder', '/service-requests')
  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json() as { url: string; fileId: string; filePath: string }
  return { file_url: data.url, file_id: data.fileId, file_path: data.filePath }
}

const paymentMethods = ['Credit / Debit Card', 'Bank Transfer', 'Online Banking']

export default function ServiceRequestPage({ navigate, serviceId }: Props) {
  const { data: service, isLoading } = useServiceDetail(serviceId)
  const submitRequest = useSubmitRequest()

  const [step, setStep]           = useState(1)
  const [files, setFiles]         = useState<Record<string, File>>({})
  const [uploading, setUploading] = useState(false)
  const [payMethod, setPayMethod] = useState('Credit / Debit Card')
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const isPaid = (service?.fee ?? 0) > 0
  const totalSteps = isPaid ? 2 : 1

  function handleFileChange(docId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      e.target.value = ''
      return
    }
    setFiles(prev => ({ ...prev, [docId]: file }))
  }

  function handleNext() {
    if (!service) return
    const mandatory = service.required_documents.filter(d => d.type !== 'OPTIONAL')
    const missing   = mandatory.filter(d => !files[d.id])
    if (missing.length > 0) {
      toast.error(`Please upload: ${missing.map(d => d.name).join(', ')}`)
      return
    }
    setStep(2)
  }

  async function handleSubmit() {
    if (!serviceId || !service) return
    try {
      setUploading(true)
      const documents = await Promise.all(
        Object.entries(files).map(async ([docId, file]) => {
          const uploaded = await uploadFile(file)
          return { required_document_id: docId, file_name: file.name, file_type: file.type, ...uploaded }
        })
      )
      await submitRequest.mutateAsync({ service_id: serviceId, documents })
      toast.success('Request submitted successfully')
      navigate('my-requests')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Failed to submit request')
    } finally {
      setUploading(false)
    }
  }

  const busy = uploading || submitRequest.isPending

  return (
    <PageWrapper>
    <div className="space-y-6">
      <button onClick={() => navigate('service-detail')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Service
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">New Service Request</h1>
        {service && <p className="text-sm text-gray-500">{service.name}</p>}
      </div>

      {isLoading && <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}

      {!isLoading && service && (
        <>
          {/* Stepper — only show if paid */}
          {isPaid && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-6">
                <StepItem num={1} label="Document Upload" sublabel="Step 1" active={step === 1} done={step > 1} />
                <div className={`flex-1 h-0.5 ${step > 1 ? 'bg-teal-500' : 'bg-gray-200'}`} />
                <StepItem num={2} label="Payment"         sublabel="Step 2" active={step === 2} done={false} />
              </div>
            </div>
          )}

          {/* Step 1 — Documents */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <h2 className="font-semibold text-gray-800">Document Upload</h2>
                <p className="text-sm text-gray-500">Upload the required documents to submit your request</p>
              </div>

              {service.required_documents.length === 0 ? (
                <p className="text-sm text-gray-400">No documents required for this service</p>
              ) : service.required_documents.map(doc => (
                <div
                  key={doc.id}
                  className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-between transition-colors ${
                    files[doc.id] ? 'border-teal-400 bg-teal-50' : 'border-gray-300 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UploadIcon />
                    <div>
                      <p className="font-medium text-gray-700 text-sm">
                        {doc.name}
                        {doc.type === 'OPTIONAL' && <span className="ml-2 text-xs text-gray-400 font-normal">(Optional)</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {files[doc.id] ? files[doc.id].name : 'PDF only (max 5MB)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {files[doc.id] && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    <button
                      onClick={() => fileRefs.current[doc.id]?.click()}
                      className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      {files[doc.id] ? 'Change' : 'Choose File'}
                    </button>
                    <input
                      ref={el => { fileRefs.current[doc.id] = el }}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={e => handleFileChange(doc.id, e)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                {isPaid ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
                  >
                    Next <ArrowRightIcon />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={busy}
                    className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
                  >
                    {uploading ? 'Uploading...' : submitRequest.isPending ? 'Submitting...' : 'Submit Request'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Payment (paid services only) */}
          {step === 2 && isPaid && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <h2 className="font-semibold text-gray-800">Payment</h2>
                <p className="text-sm text-gray-500">Complete your payment to submit the request</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{service.name} fee</span>
                  <span className="font-medium">${service.fee}.00</span>
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-teal-600">${service.fee}.00</span>
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
                <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
                >
                  {uploading ? 'Uploading...' : submitRequest.isPending ? 'Submitting...' : 'Submit & Pay'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </PageWrapper>
  )
}

function StepItem({ num, label, sublabel, active, done }: { num: number; label: string; sublabel: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active || done ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
        {done
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : num === 1
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        }
      </div>
      <span className={`text-xs font-semibold ${active ? 'text-teal-600' : 'text-gray-400'}`}>{sublabel}</span>
      <span className={`text-xs ${active ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}
