import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'

export interface Section {
  id: string
  name: string
  description?: string
  department_id: string
  department?: { name: string }
  employees_count?: number
  _count?: { employees: number }
  is_active: boolean
}

export function useDeleteSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, department_id }: { id: string; department_id: string }) =>
      axiosInstance.delete(`/sections/${id}`).then(r => r.data),
    onSuccess: (_, { department_id }) => {
      queryClient.invalidateQueries({ queryKey: ['sections', department_id] })
      queryClient.invalidateQueries({ queryKey: ['sections', 'all'] })
      toast.success('Section deleted successfully')
    },
    onError: () => toast.error('Failed to delete section'),
  })
}

export function useUpdateSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, department_id, ...rest }: { id: string; department_id: string; name: string; description: string; is_active?: boolean }) =>
      axiosInstance.patch(`/sections/${id}`, { department_id, ...rest }).then(r => r.data.data),
    onSuccess: (_, { id, department_id }) => {
      queryClient.invalidateQueries({ queryKey: ['section', id] })
      queryClient.invalidateQueries({ queryKey: ['sections', department_id] })
      queryClient.invalidateQueries({ queryKey: ['sections', 'all'] })
      toast.success('Section updated successfully')
    },
    onError: () => toast.error('Failed to update section'),
  })
}

export function useCreateSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ department_id, ...rest }: { department_id: string; name: string; description: string }) =>
      axiosInstance.post('/sections', { department_id, ...rest }).then(r => r.data.data),
    onSuccess: (_, { department_id }) => {
      queryClient.invalidateQueries({ queryKey: ['sections', department_id] })
      queryClient.invalidateQueries({ queryKey: ['sections', 'all'] })
      toast.success('Section created successfully')
    },
    onError: () => toast.error('Failed to create section'),
  })
}

export function useSection(id: string | null) {
  return useQuery<Section>({
    queryKey: ['section', id],
    queryFn: () => axiosInstance.get(`/sections/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}

export function useSections(departmentId?: string | null) {
  return useQuery<Section[]>({
    queryKey: ['sections', departmentId ?? 'all'],
    queryFn: () =>
      axiosInstance.get('/sections', {
        params: { activeOnly: true, ...(departmentId ? { departmentId: Number(departmentId) } : {}) },
      }).then(r => r.data.data),
  })
}
