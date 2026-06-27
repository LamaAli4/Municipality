import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'

export interface Service {
  id: string
  name: string
  description: string
  department_id: string
  department?: { id: string; name: string }
  fee: number
  estimated_processing_days: number
  status: string
  is_active: boolean
}

export interface WorkflowTask {
  id: string
  name: string
  description: string
  task_order: number
  estimated_time_hours: number
}

export interface RequiredDocument {
  id: string
  name: string
  description?: string
  type?: string
  is_active: boolean
}

export interface ServiceDetail extends Service {
  workflow_tasks: WorkflowTask[]
  required_documents: RequiredDocument[]
}

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => axiosInstance.get('/services').then(r => r.data.data),
  })
}

export function useAdminServices(status?: string) {
  return useQuery<Service[]>({
    queryKey: ['admin', 'services', status ?? 'all'],
    queryFn: () =>
      axiosInstance
        .get('/admin/services', { params: { activeOnly: true, ...(status ? { status } : {}) } })
        .then(r => r.data.data),
  })
}

export interface WorkflowTaskInput {
  name: string
  description: string
  section_id: number
  estimated_time_hours: number
}

export interface CreateServicePayload {
  name: string
  description: string
  department_id: number
  fee: number
  estimated_processing_days: number
  workflow_tasks: WorkflowTaskInput[]
}

export interface UpdateServicePayload {
  name?: string
  description?: string
  fee?: number
  estimated_processing_days?: number
  is_active?: boolean
  status?: string
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServicePayload) =>
      axiosInstance.post('/admin/services', data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      toast.success('Service created successfully')
    },
    onError: () => toast.error('Failed to create service'),
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/admin/services/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      toast.success('Service deleted successfully')
    },
    onError: () => toast.error('Failed to delete service'),
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateServicePayload & { id: string }) =>
      axiosInstance.patch(`/admin/services/${id}`, data).then(r => r.data.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'service', id] })
      queryClient.invalidateQueries({ queryKey: ['service', id] })
      toast.success('Service updated successfully')
    },
    onError: () => toast.error('Failed to update service'),
  })
}

export function useAddWorkflowTask() {
  return useMutation({
    mutationFn: ({ serviceId, ...data }: WorkflowTaskInput & { serviceId: string }) =>
      axiosInstance.post(`/admin/services/${serviceId}/workflow`, data).then(r => r.data.data),
    onError: () => toast.error('Failed to add workflow task'),
  })
}

export function useServiceDetail(id: string | null) {
  return useQuery<ServiceDetail>({
    queryKey: ['service', id ?? '1'],
    queryFn: () => axiosInstance.get(`/services/${id ?? '1'}`).then(r => r.data.data),
  })
}

export function useDeleteServiceDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ serviceId, documentId }: { serviceId: string; documentId: string }) =>
      axiosInstance.delete(`/admin/services/${serviceId}/documents/${documentId}`),
    onSuccess: (_, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service', serviceId, 'documents'] })
      toast.success('Document removed')
    },
    onError: () => toast.error('Failed to remove document'),
  })
}

export function useAddServiceDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ serviceId, ...data }: { serviceId: string; name: string; description: string; type: string }) =>
      axiosInstance.post(`/admin/services/${serviceId}/documents`, data).then(r => r.data.data),
    onSuccess: (_, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service', serviceId, 'documents'] })
      toast.success('Document added')
    },
    onError: () => toast.error('Failed to add document'),
  })
}

export function useServiceDocuments(serviceId: string | null) {
  return useQuery<RequiredDocument[]>({
    queryKey: ['admin', 'service', serviceId, 'documents'],
    queryFn: () =>
      axiosInstance
        .get(`/admin/services/${serviceId}/documents`, { params: { activeOnly: true } })
        .then(r => r.data.data),
    enabled: !!serviceId,
  })
}

export function useAdminServiceWorkflow(serviceId: string | null) {
  return useQuery<WorkflowTask[]>({
    queryKey: ['admin', 'service', serviceId, 'workflow'],
    queryFn: () => axiosInstance.get(`/admin/services/${serviceId}/workflow`).then(r => r.data.data),
    enabled: !!serviceId,
  })
}

export function useAdminServiceDetail(id: string | null) {
  return useQuery<ServiceDetail>({
    queryKey: ['admin', 'service', id],
    queryFn: () => axiosInstance.get(`/admin/services/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}

export function usePublishService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.post(`/admin/services/${id}/publish`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      toast.success('Service published')
    },
    onError: () => toast.error('Failed to publish service'),
  })
}

export function useArchiveService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.post(`/admin/services/${id}/archive`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      toast.success('Service archived')
    },
    onError: () => toast.error('Failed to archive service'),
  })
}
