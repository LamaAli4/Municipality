import type { ReactNode } from 'react'

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  readOnly?: boolean
  icon?: ReactNode
}

export function Input({ label, placeholder, value, onChange, type = 'text', readOnly, icon }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none
            focus:border-primary focus:ring-1 focus:ring-primary/30 transition
            ${readOnly ? 'bg-gray-50' : 'bg-white'}
            ${icon ? 'pr-8' : ''}`}
        />
        {icon && <span className="absolute right-2.5 top-2.5 text-primary">{icon}</span>}
      </div>
    </div>
  )
}

interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  rows?: number
}

export function Textarea({ label, placeholder, value, onChange, className = '', rows = 4 }: TextareaProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600
          outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition resize-none bg-white ${className}`}
      />
    </div>
  )
}
