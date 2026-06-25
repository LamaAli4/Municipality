import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'

export interface ComplaintPhoto {
  name: string
  file_type: string
  file_url: string
  file_id: string
}

export interface Complaint {
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

export interface CreateComplaintPayload {
  title: string
  category: string
  priority: string
  location?: string
  description: string
  photo?: {
    file_name: string
    file_type: string
    file_url: string
    file_id: string
    file_path: string
  }
}

export function useComplaints() {
  return useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: () => axiosInstance.get('/complaints').then(r => r.data.data),
    staleTime: 0,
  })
}

export function useComplaintDetail(id: string | null) {
  return useQuery<Complaint>({
    queryKey: ['complaint', id],
    queryFn: () => axiosInstance.get(`/complaints/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}

export function useCreateComplaint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateComplaintPayload) =>
      axiosInstance.post('/complaints', payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
  })
}
