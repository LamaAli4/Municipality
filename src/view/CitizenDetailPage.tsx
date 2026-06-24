import { useState, useEffect } from 'react'
import type { NavigateFn } from '../lib/types'
import { ChevronLeftIcon, ChevronRightIcon, LogsIcon, ServiceIcon, CheckIcon, ImagePlaceholderIcon } from '../lib/icons'
import Badge from '../components/ui/Badge'
import DisableCitizenModal from './modals/DisableCitizenModal'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'

interface CitizenProfile {
  id_document?: { file_url: string }
  id_selfie?: { file_url: string }
}

interface UserDetail {
  id: string
  full_name: string
  email: string
  phone?: string
  national_id?: string
  address?: string
  city?: string
  account_status: string
  is_active: boolean
  created_at: string
  last_login_at?: string
  citizen_profile?: CitizenProfile
}

function fmt(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function CitizenDetailPage({ navigate, userId }: { navigate: NavigateFn; userId: string | null }) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDisable, setShowDisable] = useState(false)
  const [approving, setApproving] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejecting, setRejecting] = useState(false)

  function handleApprove() {
    if (!user) return
    setApproving(true)
    axiosInstance.post(`/admin/users/${user.id}/verify`)
      .then(() => {
        setUser(u => u ? { ...u, account_status: 'ACTIVE', is_active: true } : u)
        toast.success('Account approved successfully')
      })
      .catch(() => toast.error('Failed to approve account'))
      .finally(() => setApproving(false))
  }

  const [activating, setActivating] = useState(false)

  function handleActivate() {
    if (!user) return
    setActivating(true)
    axiosInstance.patch(`/admin/users/${user.id}`, { is_active: true, account_status: 'ACTIVE' })
      .then(() => {
        setUser(u => u ? { ...u, is_active: true, account_status: 'ACTIVE' } : u)
        toast.success('Account activated successfully')
      })
      .catch(() => toast.error('Failed to activate account'))
      .finally(() => setActivating(false))
  }

  function handleReject() {
    if (!user) return
    setRejecting(true)
    axiosInstance.post(`/admin/users/${user.id}/reject`, { rejection_reason: rejectReason })
      .then(() => {
        setUser(u => u ? { ...u, account_status: 'INACTIVE', is_active: false } : u)
        toast.success('Account rejected')
        setShowReject(false)
        setRejectReason('')
      })
      .catch(() => toast.error('Failed to reject account'))
      .finally(() => setRejecting(false))
  }

  useEffect(() => {
    const id = userId ?? '1'
    axiosInstance.get(`/admin/users/${id}`)
      .then(res => {
        if (res.data.success) setUser(res.data.data)
        else setError('Failed to load user details')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [userId])

  return (
    <div>
      {showDisable && user && (
        <DisableCitizenModal
          onClose={() => setShowDisable(false)}
          onSuccess={() => setUser(u => u ? { ...u, is_active: false, account_status: 'INACTIVE' } : u)}
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
                onClick={handleReject}
                disabled={rejecting}
                className="px-5 py-2 rounded-xl bg-red-400 hover:bg-red-500 text-white text-sm font-semibold disabled:opacity-60"
              >
                {rejecting ? 'Rejecting…' : 'Confirm Reject'}
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
                onClick={handleApprove}
                disabled={approving}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {approving ? 'Approving…' : 'Approve account'}
              </button>
            </>
          )}
          {!user?.is_active && (
            <button
              onClick={handleActivate}
              disabled={activating}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {activating ? 'Activating…' : 'Activate account'}
            </button>
          )}
          {user?.is_active && (
            <button
              onClick={() => setShowDisable(true)}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Disable account
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-gray-400 text-sm">Loading citizen details…</div>
      )}
      {error && (
        <div className="text-center py-16 text-red-500 text-sm">{error}</div>
      )}

      {!loading && !error && user && (
        <>
          {/* Personal Info + Verification */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-3 pb-3 border-b border-gray-100">Personal information</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {([
                  ['Full name',          user.full_name],
                  ['National ID',        user.national_id ?? '—'],
                  ['Phone number',       user.phone ?? '—'],
                  ['City',               user.city ?? '—'],
                  ['Registration date',  fmt(user.created_at)],
                  ['Last seen',          fmt(user.last_login_at)],
                  ['Address',            user.address ?? '—'],
                  ['Email',              user.email],
                  ['Status',             user.account_status],
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
              {user.citizen_profile?.id_document?.file_url ? (
                <a
                  href={user.citizen_profile.id_document.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex bg-gray-100 rounded-xl h-28 items-center justify-center mb-3 hover:opacity-80 transition-opacity"
                >
                  <span className="text-xs text-teal-600 font-medium">View ID Document</span>
                </a>
              ) : (
                <div className="bg-gray-100 rounded-xl h-28 flex items-center justify-center mb-3">
                  <ImagePlaceholderIcon />
                </div>
              )}
              {user.citizen_profile?.id_selfie?.file_url ? (
                <a
                  href={user.citizen_profile.id_selfie.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex bg-gray-100 rounded-xl h-16 items-center justify-center mb-3 hover:opacity-80 transition-opacity"
                >
                  <span className="text-xs text-teal-600 font-medium">View Selfie</span>
                </a>
              ) : null}
              <div className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2 bg-gray-50">
                <CheckIcon />
                <span className="font-semibold text-gray-700 text-sm">
                  <Badge status={user.account_status} />
                </span>
              </div>
            </div>
          </div>

          {/* Requests — static placeholder, no API endpoint provided yet */}
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

          {/* Billing + Complaints */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Billing and payments',    headers: ['Invoice', 'Period', 'Status'],  rows: [] as string[][] },
              { title: 'Complaints and reports',  headers: ['Type', 'Date', 'Status'],       rows: [] as string[][] },
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
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={headers.length} className="text-center py-6 text-gray-400 text-sm">No data available</td>
                      </tr>
                    ) : rows.map((r, i) => (
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
        </>
      )}
    </div>
  )
}
