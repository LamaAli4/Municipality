import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import { toast } from 'react-toastify'
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
  updated_at: string
  photo?: ComplaintPhoto | null
  citizen?: { full_name: string; national_id: string; phone: string }
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
    staleTime: 0,
  })
}

export function useResolveComplaint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, result }: { id: string; status: 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED'; result?: string }) => {
      if (status === 'UNDER_REVIEW') {
        return axiosInstance.patch(`/admin/complaints/${id}/under-review`).then(r => r.data)
      }
      return axiosInstance.patch(`/admin/complaints/${id}/resolve`, { status, ...(result ? { result } : {}) }).then(r => r.data)
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-complaint', id] })
      qc.invalidateQueries({ queryKey: ['admin-complaints'] })
      toast.success('Complaint updated successfully')
    },
    onError: () => toast.error('Failed to update complaint'),
  })
}
