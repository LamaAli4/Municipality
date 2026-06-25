import { useState } from 'react'
import type { NavigateFn } from '../lib/types'
import { ChevronLeftIcon, ChevronRightIcon, LogsIcon, ServiceIcon, CheckIcon, ImagePlaceholderIcon } from '../lib/icons'
import Badge from '../components/ui/Badge'
import DisableCitizenModal from './modals/DisableCitizenModal'
import { useAdminUser, useVerifyUser, useRejectUser, useDisableUser } from '../services/adminService'

function fmt(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function CitizenDetailPage({ navigate, userId }: { navigate: NavigateFn; userId: string | null }) {
  const { data: user, isLoading, isError } = useAdminUser(userId)
  const verifyUser  = useVerifyUser()
  const rejectUser  = useRejectUser()
  const disableUser = useDisableUser()

  const [showDisable, setShowDisable] = useState(false)
  const [showReject,  setShowReject]  = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  return (
    <div>
      {showDisable && user && (
        <DisableCitizenModal
          onClose={() => setShowDisable(false)}
          onSuccess={() => setShowDisable(false)}
          userId={user.id}
          userName={user.full_name}
          nationalId={user.national_id ?? ''}
          phone={user.phone ?? ''}
          currentStatus={user.account_status}
        />
      )}

      {showReject && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-bold text-gray-800 text-lg">Reject Registration</h2>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (e.g. National ID document is unclear or invalid)"
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReject(false)} className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectUser.mutate({ id: user!.id, rejection_reason: rejectReason }, {
                    onSuccess: () => { setShowReject(false); setRejectReason('') },
                  })
                }}
                disabled={rejectUser.isPending}
                className="px-5 py-2 rounded-xl bg-red-400 hover:bg-red-500 text-white text-sm font-semibold disabled:opacity-60"
              >
                {rejectUser.isPending ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('citizens')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium"
        >
          <ChevronLeftIcon /> Back To Citizens management
        </button>
        <div className="flex gap-2">
          {user?.account_status === 'PENDING_VERIFICATION' && (
            <>
              <button
                onClick={() => setShowReject(true)}
                className="border border-red-400 text-red-500 hover:bg-red-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => verifyUser.mutate(user.id)}
                disabled={verifyUser.isPending}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {verifyUser.isPending ? 'Approving…' : 'Approve account'}
              </button>
            </>
          )}
          {user?.account_status === 'ACTIVE' && (
            <button
              onClick={() => setShowDisable(true)}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Disable account
            </button>
          )}
          {/* INACTIVE / REJECTED → no action buttons */}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-16 text-gray-400 text-sm">Loading citizen details…</div>
      )}
      {isError && (
        <div className="text-center py-16 text-red-500 text-sm">Failed to load citizen details</div>
      )}

      {!isLoading && !isError && user && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1 lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-3 pb-3 border-b border-gray-100">Personal information</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {([
                  ['Full name',         user.full_name],
                  ['National ID',       user.national_id ?? '—'],
                  ['Phone number',      user.phone ?? '—'],
                  ['City',              user.city ?? '—'],
                  ['Registration date', fmt(user.created_at)],
                  ['Last seen',         fmt(user.last_login_at)],
                  ['Address',           user.address ?? '—'],
                  ['Email',             user.email],
                  ['Status',            user.account_status],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <p className="font-semibold text-gray-700 mb-0.5">{label}</p>
                    {label === 'Status'
                      ? <Badge status={value} />
                      : <p className="text-gray-500">{value}</p>
                    }
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-3">Verification documents</h2>
              {user.citizen_profile?.verification_document ? (
                <a
                  href={user.citizen_profile.verification_document}
                  target="_blank"
                  rel="noreferrer"
                  className="flex bg-gray-100 rounded-xl h-28 items-center justify-center mb-3 hover:bg-teal-50 hover:border hover:border-teal-200 transition-all group"
                >
                  <div className="flex flex-col items-center gap-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-xs text-teal-600 font-medium">View ID Document</span>
                  </div>
                </a>
              ) : (
                <div className="bg-gray-100 rounded-xl h-28 flex items-center justify-center mb-3">
                  <ImagePlaceholderIcon />
                </div>
              )}
              {user.citizen_profile?.id_selfie ? (
                <a
                  href={user.citizen_profile.id_selfie}
                  target="_blank"
                  rel="noreferrer"
                  className="flex bg-gray-100 rounded-xl h-20 items-center justify-center mb-3 hover:bg-teal-50 hover:border hover:border-teal-200 transition-all overflow-hidden"
                >
                  <img
                    src={user.citizen_profile.id_selfie}
                    alt="ID Selfie"
                    className="h-full w-full object-cover rounded-xl"
                    onError={e => {
                      const img = e.target as HTMLImageElement
                      img.style.display = 'none'
                      img.parentElement!.innerHTML = '<span class="text-xs text-teal-600 font-medium">View Selfie</span>'
                    }}
                  />
                </a>
              ) : (
                <div className="bg-gray-100 rounded-xl h-20 flex items-center justify-center mb-3">
                  <ImagePlaceholderIcon />
                </div>
              )}
              <div className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2 bg-gray-50">
                <CheckIcon />
                <Badge status={user.account_status} />
              </div>
            </div>
          </div>

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
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400 text-sm">No requests available</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Billing and payments',   headers: ['Invoice', 'Period', 'Status'] },
              { title: 'Complaints and reports', headers: ['Type', 'Date', 'Status'] },
            ].map(({ title, headers }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <ServiceIcon /><h2 className="font-bold text-gray-800">{title}</h2>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50">
                    {headers.map(h => <th key={h} className="text-left px-4 py-2.5 font-semibold text-gray-600">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    <tr>
                      <td colSpan={headers.length} className="text-center py-6 text-gray-400 text-sm">No data available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
