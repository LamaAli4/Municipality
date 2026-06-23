import axiosInstance from '@/lib/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SignInInput, SignUpInput } from '@/schemas/authSchema'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-toastify'

export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (data: SignInInput) => {
      const response = await axiosInstance.post('/auth/login', data)
      return response.data.data
    },
    onSuccess: (data, variables) => {
      // Verify that the user's role matches the selected role
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
      const message = error.response?.data?.message || error.message || 'Login failed'
      if (error.response?.status === 401) {
        toast.error('Invalid credentials. Please check your ID and password.')
      } else {
        toast.error(message)
      }
    },
  })
}

export const useSignUp = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (data: SignUpInput) => {
      const response = await axiosInstance.post('/auth/signup', data)
      return response.data.data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token)
      toast.success('Account created successfully! Redirecting...')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Registration failed'
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
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Logout failed'
      toast.error('Failed to logout. Please try again.')
    },
  })
}
