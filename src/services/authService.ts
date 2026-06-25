import axiosInstance from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { SignInInput } from '@/schemas/authSchema'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-toastify'

interface FileDoc {
  file_name: string
  file_type: string
  file_url: string
  file_id: string
}

export interface SignUpPayload {
  full_name: string
  email: string
  password: string
  national_id: string
  phone: string
  address: string
  city: string
  verification_documents: {
    id_document: FileDoc
    id_selfie: FileDoc
  }
}

export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (data: SignInInput) => {
      const response = await axiosInstance.post('/auth/login', data)
      return response.data.data
    },
    onSuccess: (data, variables) => {
      const userRole = data.user.role.toLowerCase()
      const selectedRole = variables.role.toLowerCase()

      if (userRole !== selectedRole) {
        toast.error(`Invalid credentials. This account is registered as ${userRole}, not ${selectedRole}.`)
        return
      }

      setAuth(data.user, data.access_token, data.refresh_token)
      toast.success('Login successful! Redirecting...')
    },
    onError: (error: any) => {
      const message: string = error.response?.data?.message || error.message || 'Login failed'
      const lower = message.toLowerCase()
      if (lower.includes('pending')) {
        toast.warning('Your account is pending admin verification. Please wait for approval.')
      } else if (lower.includes('inactive')) {
        toast.error('Your account is inactive. Please contact the administrator to activate your account.')
      } else if (error.response?.status === 401) {
        toast.error('Invalid credentials. Please check your ID and password.')
      } else {
        toast.error(message)
      }
    },
  })
}

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpPayload) => {
      const response = await axiosInstance.post('/auth/signup', data)
      return response.data.data
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(message)
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { identifier: string }) => {
      const res = await axiosInstance.post('/auth/forgot-password', data)
      return res.data.data
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to send OTP'
      toast.error(message)
    },
  })
}

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: { identifier: string; code: string }) => {
      const res = await axiosInstance.post('/auth/verify-otp', data)
      return res.data.data
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'OTP verification failed'
      toast.error(message)
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { reset_token: string; new_password: string }) => {
      const res = await axiosInstance.post('/auth/reset-password', data)
      return res.data.data
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Password reset failed'
      toast.error(message)
    },
  })
}

export const useSignOut = () => {
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/auth/logout')
    },
    onSuccess: () => {
      logout()
      toast.success('Logged out successfully')
    },
    onError: () => {
      toast.error('Failed to logout. Please try again.')
    },
  })
}
