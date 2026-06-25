import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'

export interface SubmissionStatus {
  has_submitted: boolean
}

export interface DamageAssessment {
  id: string
  property_type: string
  damage_level: string
  governorate: string
  area?: string
  street?: string
  structural_damage?: string[]
  service_damage?: string[]
  description?: string
  status?: string
  created_at: string
}

export interface CreateAssessmentPayload {
  property_type: string
  damage_level: string
  governorate: string
  area?: string
  street?: string
  structural_damage?: string[]
  service_damage?: string[]
  description?: string
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
