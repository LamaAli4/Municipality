import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'

interface SubmitDocumentInput {
  required_document_id: string
  file_name: string
  file_type: string
  file_url: string
  file_id: string
  file_path: string
}

interface SubmitRequestPayload {
  service_id: string
  documents: SubmitDocumentInput[]
  payment?: {
    serial_number: string
    provider: string
    file_type: string
    file_url: string
    file_id: string
    file_path: string
  }
}

export interface ApiRequest {
  id: string
  service_id?: string
  service_name?: string
  service?: { name: string }
  user?: { full_name: string }
  status: string
  submitted_at?: string
  created_at: string
  payment_status?: string
  current_task_id?: string
}

export interface TimelineTask {
  id: string
  name: string
  description?: string
  status: string
  completed_at?: string | null
  task_order: number
  assigned_to?: { full_name: string }
  assigned_employee_id?: string | null
  estimated_time_hours?: number
  rejection_reason?: string | null
}

export interface EmbeddedDocument {
  id: string
  name: string
  file_url?: string
  file_type?: string
  category?: string
  uploaded_at?: string
}

export interface RequestDetail {
  id: string
  service_id?: string
  service_name?: string
  service?: { name: string; fee?: number }
  status: string
  payment_status?: string
  current_task_id?: string
  submitted_at?: string
  created_at: string
  notes?: string
  assigned_to?: { full_name: string }
  estimated_completion_date?: string
  tasks?: TimelineTask[]
  documents?: EmbeddedDocument[]
}

export function useRequestDetail(id: string | null) {
  return useQuery<RequestDetail>({
    queryKey: ['request', id],
    queryFn: () => axiosInstance.get(`/requests/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}

export function useMyRequests() {
  return useQuery<ApiRequest[]>({
    queryKey: ['requests'],
    queryFn: () => axiosInstance.get('/requests').then(r => r.data.data),
  })
}

export function useSubmitRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SubmitRequestPayload) =>
      axiosInstance.post('/requests', data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}

export function useAdminRequests() {
  return useQuery<ApiRequest[]>({
    queryKey: ['admin', 'requests'],
    queryFn: () => axiosInstance.get('/admin/requests').then(r => r.data.data),
    retry: false,
  })
}

export function useSubmitPayment() {
  return useMutation({
    mutationFn: ({ requestId, ...data }: {
      requestId: string
      serial_number: string
      provider: string
      file_type: string
      file_url: string
      file_id: string
      file_path: string
    }) => axiosInstance.post(`/service-requests/${requestId}/payments`, data).then(r => r.data),
  })
}

export function useRequestDocuments(requestId: string | null | undefined) {
  return useQuery<EmbeddedDocument[]>({
    queryKey: ['request', requestId, 'documents'],
    queryFn: () => axiosInstance.get(`/requests/${requestId}/documents`).then(r => r.data.data),
    enabled: !!requestId,
    retry: false,
  })
}
