import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  address?: string
  city?: string
  national_id?: string
  role: string
  created_at: string
  last_login_at?: string
}

export function useMyProfile() {
  return useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: () => axiosInstance.get('/users/me').then(r => r.data.data),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Pick<Profile, 'full_name' | 'phone' | 'address' | 'city'>>) =>
      axiosInstance.patch('/users/me', data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated successfully')
    },
    onError: () => toast.error('Failed to update profile'),
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: string) =>
      axiosInstance.patch('/users/me', { password }).then(r => r.data.data),
    onSuccess: () => toast.success('Password updated successfully'),
    onError: () => toast.error('Failed to update password'),
  })
}
