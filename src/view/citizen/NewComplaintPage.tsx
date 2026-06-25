import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon } from '../../lib/icons'
import { useCreateComplaint } from '../../services/complaintsService'
import axiosInstance from '../../lib/axios'

interface Props { navigate: CitizenNavigateFn }

const CATEGORIES = [
  { value: 'SERVICE_QUALITY',   label: 'Service Quality' },
  { value: 'EMPLOYEE_CONDUCT',  label: 'Employee Conduct' },
  { value: 'BILLING',           label: 'Billing' },
  { value: 'FACILITY',          label: 'Facility' },
  { value: 'OTHER',             label: 'Other' },
]

const PRIORITIES = [
  { value: 'LOW',    label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH',   label: 'High' },
]

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-400'

async function uploadPhoto(file: File) {
  const auth = await axiosInstance.get('/auth/imagekit/upload-auth').then(r => r.data.data)
  const form = new FormData()
  form.append('file', file)
  form.append('fileName', file.name)
  form.append('publicKey', auth.publicKey)
  form.append('signature', auth.signature)
  form.append('expire', String(auth.expire))
  form.append('token', auth.token)
  form.append('folder', '/complaints')
  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Photo upload failed')
  const data = await res.json() as { url: string; fileId: string; filePath: string }
  return {
    file_name: file.name,
    file_type: file.type,
    file_url:  data.url,
    file_id:   data.fileId,
    file_path: data.filePath,
  }
}

export default function NewComplaintPage({ navigate }: Props) {
  const [title,       setTitle]       = useState('')
  const [category,    setCategory]    = useState('')
  const [priority,    setPriority]    = useState('MEDIUM')
  const [location,    setLocation]    = useState('')
  const [description, setDescription] = useState('')
  const [photoFile,   setPhotoFile]   = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { mutate: submit, isPending } = useCreateComplaint()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function removePhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit() {
    if (!title.trim())       { toast.error('Please enter a complaint title'); return }
    if (!category)           { toast.error('Please select a category');        return }
    if (!description.trim()) { toast.error('Please enter a description');      return }

    let photo: object | undefined
    if (photoFile) {
      try {
        setIsUploading(true)
        photo = await uploadPhoto(photoFile)
      } catch {
        toast.error('Failed to upload photo')
        setIsUploading(false)
        return
      } finally {
        setIsUploading(false)
      }
    }

    submit(
      { title, category, priority, location: location || undefined, description, photo },
      {
        onSuccess: () => {
          toast.success('Complaint submitted successfully')
          navigate('complaints')
        },
        onError: () => toast.error('Failed to submit complaint'),
      }
    )
  }

  const busy = isPending || isUploading

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('complaints')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600"
      >
        <ChevronLeftIcon /> Back To Complaints
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-800">Submit New Complaint</h1>
        <p className="text-sm text-gray-500">Report issues to the municipality</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl space-y-5">

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Complaint Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Brief description of the issue"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className={inputCls}>
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Street name, landmark, or area"
            className={inputCls}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Provide detailed description of the issue..."
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Attach Photos <span className="text-gray-400 font-normal">(Optional)</span>
          </label>

          {photoPreview ? (
            <div className="relative w-fit">
              <img src={photoPreview} alt="Preview" className="h-36 rounded-xl object-cover border border-gray-200" />
              <button
                onClick={removePhoto}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
              <p className="text-xs text-gray-400 mt-1">{photoFile?.name}</p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
              </svg>
              <p className="text-sm text-gray-500 mt-2">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB (max 5 images)</p>
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => navigate('complaints')}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={busy}
            className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
          >
            {isUploading ? 'Uploading photo...' : isPending ? 'Submitting...' : 'Submit Complaints'}
          </button>
        </div>
      </div>
    </div>
  )
}
