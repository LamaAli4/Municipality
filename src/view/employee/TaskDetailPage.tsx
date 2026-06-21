import { useState } from 'react'
import type { EmployeeNavigateFn } from '@/lib/types'
import { ChevronLeftIcon, ApproveIcon, RefuseIcon, RequestDocsIcon, TransferIcon, WarningIcon } from '@/lib/icons'
import Modal from '@/components/ui/Modal'
import { BtnCancel, BtnConfirm } from '@/components/ui/button'

interface Props { navigate: EmployeeNavigateFn }

type ProcedureKey = 'approve' | 'refuse' | 'docs' | 'transfer'

const procedures: { key: ProcedureKey; label: string; color: string; icon: React.ReactNode }[] = [
  { key: 'approve',   label: 'Approve the task',            color: 'bg-teal-100 text-teal-700 hover:bg-teal-200', icon: <ApproveIcon /> },
  { key: 'refuse',    label: 'Refuse the task',             color: 'bg-red-100 text-red-700 hover:bg-red-200',   icon: <RefuseIcon /> },
  { key: 'docs',      label: 'Request for missing documents', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200', icon: <RequestDocsIcon /> },
  { key: 'transfer',  label: 'Send application for other employee', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200', icon: <TransferIcon /> },
]

const citizenDocs = [
  { name: 'Property Deed', status: 'loaded' },
  { name: 'Architectural Plans', status: 'under review' },
  { name: 'Owner ID Copy', status: 'loaded' },
]

const internalDocs = [
  { name: 'Initial inspection report', status: 'pending' },
  { name: 'Field site photos', status: 'pending' },
]

export default function TaskDetailPage({ navigate }: Props) {
  const [activeModal, setActiveModal] = useState<ProcedureKey | null>(null)

  return (
    <div className="p-6 space-y-5">
      <button onClick={() => navigate('task-board')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Task board
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Request and task details</h1>
          <p className="text-sm text-gray-500">Service: Water subscription</p>
        </div>
        <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">Under implementation</span>
      </div>

      {/* Three panel grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Request data */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">Request data</h2>
          <div className="space-y-3 text-sm">
            {[
              ['Service type', 'Water subscription'],
              ['Citizen name', 'Ahmed Muhammad'],
              ['The address', 'Riyadh, Al-Nakheel'],
              ['Phone number', '+966 50 123 4567'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-gray-400">{k}</p>
                <p className="text-gray-700 font-medium">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Task data */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">Task data</h2>
          <div className="space-y-3 text-sm">
            {[
              ['Task number', '# TSK-241'],
              ['Attribution date', '15/2/2024'],
              ['Due date', '1/3/2024'],
              ['Section', 'Water Department'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-gray-400">{k}</p>
                <p className="text-gray-700 font-medium">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Task documents</p>
            <p className="text-sm text-teal-700 font-medium">Reviewing documents</p>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-gray-600">Started</span>
              <span className="text-gray-400 ml-auto">15/2/2024</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-gray-600">Application received</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-gray-600">Documents review</span>
            </div>
          </div>
        </div>

        {/* Available procedures */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 pb-2 border-b border-gray-100">Available procedures</h2>
          <div className="space-y-2">
            {procedures.map(proc => (
              <button
                key={proc.key}
                onClick={() => setActiveModal(proc.key)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${proc.color}`}
              >
                {proc.icon}
                {proc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document panels */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 text-center">Citizen documents</h2>
          <div className="space-y-2">
            {citizenDocs.map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${doc.status === 'loaded' ? 'bg-teal-100' : 'bg-yellow-100'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={doc.status === 'loaded' ? '#0d9488' : '#f59e0b'} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{doc.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${doc.status === 'loaded' ? 'bg-teal-100 text-teal-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-700 text-sm mb-3 text-center">Internal documents</h2>
          <div className="space-y-2">
            {internalDocs.map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{doc.name}</span>
                </div>
                <button className="text-teal-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            ))}
            <button className="w-full text-center text-xs text-teal-600 py-2 border border-dashed border-teal-300 rounded-lg hover:bg-teal-50">
              + Upload a new document
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'approve' && (
        <ProcedureModal
          title="Approve the task"
          icon={<ApproveIcon />}
          warning="Are you sure you want to accept this task?"
          taskNum="# TSK-241"
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'refuse' && (
        <ProcedureModal
          title="Refuse the task"
          icon={<RefuseIcon />}
          warning="Are you sure you want to refuse this task?"
          taskNum="# TSK-241"
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'docs' && (
        <ProcedureModal
          title="Request for missing documents"
          icon={<RequestDocsIcon />}
          warning="This will notify the citizen to submit missing documents."
          taskNum="# TSK-241"
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'transfer' && (
        <ProcedureModal
          title="Transfer to other employee"
          icon={<TransferIcon />}
          warning="This will reassign the task to another employee."
          taskNum="# TSK-241"
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  )
}

function ProcedureModal({ title, icon, warning, taskNum, onClose }: {
  title: string; icon: React.ReactNode; warning: string; taskNum: string; onClose: () => void
}) {
  return (
    <Modal title={title} icon={icon} onClose={onClose}>
      <div className="border border-gray-200 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-gray-400">Task number</p><p className="font-semibold text-gray-800">{taskNum}</p></div>
        <div><p className="text-xs text-gray-400">Service</p><p className="font-semibold text-gray-800">Water subscription</p></div>
        <div><p className="text-xs text-gray-400">Citizen's name</p><p className="font-medium text-gray-700">Ahmed Muhammad</p></div>
        <div><p className="text-xs text-gray-400">Section</p><p className="font-medium text-gray-700">Water Department</p></div>
        <div><p className="text-xs text-gray-400">Attribution date</p><p className="font-medium text-gray-700">15/2/2024</p></div>
        <div><p className="text-xs text-gray-400">due date</p><p className="font-medium text-gray-700">1/3/2024</p></div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 mb-4">
        <WarningIcon />
        <p className="text-sm text-amber-800">{warning}</p>
      </div>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea rows={3} placeholder="Add any notes related to the task..." className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
      </div>
      <div className="flex justify-between">
        <BtnCancel onClick={onClose} />
        <BtnConfirm label="Confirm" onClick={onClose} />
      </div>
    </Modal>
  )
}
