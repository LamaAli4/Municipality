import { forwardRef, isValidElement, Children, cloneElement } from 'react'
import type { ReactNode, ButtonHTMLAttributes, ReactElement } from 'react'

interface BtnProps {
  onClick?: () => void
  label?: string
  icon?: ReactNode
  className?: string
  disabled?: boolean
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', asChild, ...props }, ref) => {
    if (asChild && isValidElement(children)) {
      const child = Children.only(children) as ReactElement<{ className?: string }>
      return cloneElement(child, {
        className: [child.props.className, className].filter(Boolean).join(' '),
      })
    }
    return (
      <button ref={ref} className={className} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

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

export function BtnConfirm({ onClick, label = 'Confirm', icon, disabled }: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-confirm text-white font-semibold px-8 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
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
