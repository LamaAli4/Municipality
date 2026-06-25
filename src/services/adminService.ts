import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'

export interface AdminUser {
  id: string
  full_name: string
  email: string
  phone?: string
  national_id?: string
  employee_id?: string | null
  section_id?: string | null
  address?: string
  city?: string
  is_verified: boolean
  account_status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'INACTIVE' | 'REJECTED'
  is_active: boolean
  role: 'ADMIN' | 'CITIZEN' | 'EMPLOYEE' | 'DEPARTMENT_MANAGER'
  created_at: string
  updated_at?: string
  last_login_at?: string
  citizen_profile?: {
    verification_document?: string
    id_selfie?: string
    rejection_reason?: string | null
    verified_at?: string | null
  }
}

export function useAdminUsers(role = 'CITIZEN', account_status?: string) {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'users', role, account_status ?? 'all'],
    queryFn: () =>
      axiosInstance.get('/admin/users', {
        params: { role, ...(account_status ? { account_status } : {}) },
      }).then(r => r.data.data),
  })
}

export function useAdminUser(id: string | null) {
  return useQuery<AdminUser>({
    queryKey: ['admin', 'user', id],
    queryFn: () => axiosInstance.get(`/admin/users/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}

export function useVerifyUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.post(`/admin/users/${id}/verify`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Account approved successfully')
    },
    onError: () => toast.error('Failed to approve account'),
  })
}

export function useRejectUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rejection_reason }: { id: string; rejection_reason: string }) =>
      axiosInstance.post(`/admin/users/${id}/reject`, { rejection_reason }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Account rejected')
    },
    onError: () => toast.error('Failed to reject account'),
  })
}

export function useDisableUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.post(`/admin/users/${id}/disable`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Account disabled successfully')
    },
    onError: () => toast.error('Failed to disable account'),
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/admin/users/${id}`, { is_active: true, account_status: 'ACTIVE' }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Account activated successfully')
    },
    onError: () => toast.error('Failed to activate account'),
  })
}

export type City = 'GAZA' | 'MIDDLE' | 'KHAN' | 'RAFAH' | 'NORTH'

export interface CreateEmployeePayload {
  full_name: string
  email: string
  password: string
  phone?: string
  employee_id?: string
  section_id?: string
  city?: City
  role: 'EMPLOYEE' | 'DEPARTMENT_MANAGER'
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEmployeePayload) =>
      axiosInstance.post('/admin/users', data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Employee created successfully')
    },
    onError: (err: unknown) => {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response
      if (res?.status === 409) {
        const msg = res.data?.message ?? ''
        if (msg.toLowerCase().includes('email')) toast.error('Email already exists')
        else toast.error('Employee ID is already in use — please use a different job number')
      } else {
        toast.error('Failed to create employee')
      }
    },
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: {
      id: string
      section_id?: string
      role?: 'EMPLOYEE' | 'DEPARTMENT_MANAGER'
      account_status?: AdminUser['account_status']
      is_active?: boolean
      is_verified?: boolean
      password?: string
    }) => axiosInstance.patch(`/admin/users/${id}`, data).then(r => r.data.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'user', id] })
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Employee updated successfully')
    },
    onError: () => toast.error('Failed to update employee'),
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/admin/users/${id}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Employee deleted successfully')
    },
    onError: () => toast.error('Failed to delete employee'),
  })
}
