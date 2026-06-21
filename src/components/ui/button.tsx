import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

interface BtnProps {
  onClick?: () => void
  label?: string
  icon?: ReactNode
  className?: string
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function Button({ className, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2.5 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function BtnCancel({ onClick, label = 'Cancel' }: BtnProps) {
  return (
    <button
      onClick={onClick}
      className="btn-cancel text-gray-800 font-semibold px-8 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
    >
      {label}
    </button>
  )
}

export function BtnConfirm({ onClick, label = 'Confirm', icon }: BtnProps) {
  return (
    <button
      onClick={onClick}
      className="btn-confirm text-white font-semibold px-8 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      {icon}{label}
    </button>
  )
}

export function PrimaryBtn({ onClick, label, icon }: BtnProps) {
  return (
    <button
      onClick={onClick}
      className="btn-confirm text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity text-sm"
    >
      {icon}{label}
    </button>
  )
}
