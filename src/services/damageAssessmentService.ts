import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'

export interface SubmissionStatus {
  has_submitted: boolean
}

export interface DamageAssessmentImageResponse {
  id?: string
  name?: string
  file_name?: string
  file_type?: string
  file_url: string
  file_id?: string
  uploaded_at?: string
}

export interface DamageAssessment {
  id: string
  citizen_id?: string
  property_type?: string
  damage_severity: string
  location: string
  description: string
  images: DamageAssessmentImageResponse[]
  status?: string
  submitted_at?: string
  created_at: string
  updated_at?: string
}

export interface AssessmentImage {
  file_name: string
  file_url: string
  file_id: string
  file_type: string
}

export interface CreateAssessmentPayload {
  property_type: string
  damage_severity: string
  location: string
  description: string
  images: AssessmentImage[]
}

export function useSubmissionStatus() {
  return useQuery<SubmissionStatus>({
    queryKey: ['damage-assessment', 'status'],
    queryFn: () => axiosInstance.get('/damage-assessments/submission-status').then(r => r.data.data),
  })
}

export function useDamageAssessments() {
  return useQuery<DamageAssessment[]>({
    queryKey: ['damage-assessments'],
    queryFn: () => axiosInstance.get('/damage-assessments').then(r => r.data.data),
  })
}

export function useDamageAssessmentDetail(id: string | null) {
  return useQuery<DamageAssessment>({
    queryKey: ['damage-assessment', id],
    queryFn: () => axiosInstance.get(`/damage-assessments/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}

export interface AdminDamageAssessment extends DamageAssessment {
  citizen?: { full_name: string; national_id: string; phone: string }
}

export function useAdminDamageAssessments(filters: { status?: string; damage_severity?: string; location?: string } = {}) {
  return useQuery<AdminDamageAssessment[]>({
    queryKey: ['admin', 'damage-assessments', filters],
    queryFn: () => {
      const params: Record<string, string> = {}
      if (filters.status)          params.status          = filters.status
      if (filters.damage_severity) params.damage_severity = filters.damage_severity
      if (filters.location)        params.location        = filters.location
      return axiosInstance.get('/admin/damage-assessments', { params }).then(r => r.data.data)
    },
    staleTime: 0,
  })
}

export function useAdminDamageAssessmentDetail(id: string | null) {
  return useQuery<AdminDamageAssessment>({
    queryKey: ['admin', 'damage-assessment', id],
    queryFn: () => axiosInstance.get(`/admin/damage-assessments/${id}`).then(r => r.data.data),
    enabled: !!id,
    staleTime: 0,
  })
}

export function useCreateAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAssessmentPayload) =>
      axiosInstance.post('/damage-assessments', payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['damage-assessment', 'status'] })
      qc.invalidateQueries({ queryKey: ['damage-assessments'] })
    },
  })
}
