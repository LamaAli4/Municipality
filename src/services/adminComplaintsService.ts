import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import type { ComplaintPhoto } from './complaintsService'

export interface AdminComplaint {
  id: string
  citizen_id: string
  title: string
  category: string
  priority: string
  location?: string
  description: string
  status: string
  submitted_at: string
  created_at: string
  photo?: ComplaintPhoto | null
}

export interface AdminComplaintsFilter {
  status?: string
  category?: string
  priority?: string
}

export function useAdminComplaints(filters: AdminComplaintsFilter = {}) {
  const params: Record<string, string> = {}
  if (filters.status)   params.status   = filters.status
  if (filters.category) params.category = filters.category
  if (filters.priority) params.priority = filters.priority

  return useQuery<AdminComplaint[]>({
    queryKey: ['admin-complaints', filters],
    queryFn: () => axiosInstance.get('/admin/complaints', { params }).then(r => r.data.data),
    staleTime: 0,
  })
}

export function useAdminComplaintDetail(id: string | null) {
  return useQuery<AdminComplaint>({
    queryKey: ['admin-complaint', id],
    queryFn: () => axiosInstance.get(`/admin/complaints/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}
