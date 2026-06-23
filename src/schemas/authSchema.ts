import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['citizen', 'admin', 'manager', 'employee']),
})

export const signUpSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  national_id: z.string().min(9, 'National ID must be exactly 9 digits').max(9, 'National ID must be exactly 9 digits'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(1, 'Please select a city'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).superRefine((data, ctx) => {
  if (!/^\d{9}$/.test(data.national_id)) {
    ctx.addIssue({ code: 'custom', message: 'National ID must contain digits only', path: ['national_id'] })
  }
  if (!/[A-Z]/.test(data.password)) {
    ctx.addIssue({ code: 'custom', message: 'Password must contain at least one uppercase letter', path: ['password'] })
  }
  if (!/[0-9]/.test(data.password)) {
    ctx.addIssue({ code: 'custom', message: 'Password must contain at least one number', path: ['password'] })
  }
  if (!/[^A-Za-z0-9]/.test(data.password)) {
    ctx.addIssue({ code: 'custom', message: 'Password must contain at least one special character (e.g. @#$)', path: ['password'] })
  }
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ code: 'custom', message: "Passwords don't match", path: ['confirmPassword'] })
  }
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
