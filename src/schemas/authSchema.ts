import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['citizen', 'admin', 'manager', 'employee']),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
