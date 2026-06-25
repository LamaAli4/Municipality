import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'

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

export function useAdminRequests() {
  return useQuery<ApiRequest[]>({
    queryKey: ['admin', 'requests'],
    queryFn: () => axiosInstance.get('/admin/requests').then(r => r.data.data),
    retry: false,
  })
}
