import { forwardRef } from 'react'
import type { LabelHTMLAttributes } from 'react'

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => (
    <label ref={ref} className={`block text-base font-normal text-gray-600 ${className}`} {...props} />
  )
)
Label.displayName = 'Label'
