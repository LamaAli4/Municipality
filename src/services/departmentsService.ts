import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'

export interface Department {
  id: string
  name: string
  description?: string
  sections_count?: number
  _count?: { sections: number }
}

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: () =>
      axiosInstance.get('/departments', { params: { activeOnly: true } }).then(r => r.data.data),
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      axiosInstance.post('/departments', data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department created successfully')
    },
    onError: () => toast.error('Failed to create department'),
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department deleted successfully')
    },
    onError: () => toast.error('Failed to delete department'),
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; description: string; is_active?: boolean }) =>
      axiosInstance.patch(`/departments/${id}`, data).then(r => r.data.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      queryClient.invalidateQueries({ queryKey: ['department', id] })
      toast.success('Department updated successfully')
    },
    onError: () => toast.error('Failed to update department'),
  })
}

export function useDepartment(id: string | null) {
  return useQuery<Department>({
    queryKey: ['department', id],
    queryFn: () => axiosInstance.get(`/departments/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}
