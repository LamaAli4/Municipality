import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
}

export function Input({ label, icon, type = 'text', readOnly, className, ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <input
          type={type}
          readOnly={readOnly}
          className={cn(
            'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none',
            'focus:border-primary focus:ring-1 focus:ring-primary/30 transition',
            readOnly ? 'bg-gray-50' : 'bg-white',
            icon && 'pr-8',
            className,
          )}
          {...props}
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
