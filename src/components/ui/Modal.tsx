import type { ReactNode } from 'react'
import { CloseIcon } from '@/lib/icons'

interface ModalProps {
  title: string
  icon?: ReactNode
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export default function Modal({ title, icon, onClose, children, wide = false }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-white rounded-2xl shadow-2xl ${wide ? 'w-[900px]' : 'w-[560px]'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
            {icon}
            {title}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
