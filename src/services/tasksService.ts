import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'

export interface BoardTask {
  id: string
  request_id: string
  name: string
  task_order: number
  status: string
  section_id: string
  assigned_employee_id: string | null
  estimated_time_hours: number
  assigned_at: string | null
  completed_at: string | null
  rejection_reason: string | null
}

export interface KanbanBoard {
  backlog:     BoardTask[]
  in_progress: BoardTask[]
  completed:   BoardTask[]
  failed:      BoardTask[]
}

export interface TaskDocument {
  id: string
  request_id: string
  name: string
  file_type: string
  file_url: string
  category: string
}

export interface TaskDetail extends BoardTask {
  request: {
    id: string
    service_id: string
    service_name: string
    status: string
    payment_status: string
    submitted_at: string
    current_task_id: string
  }
  sibling_tasks: BoardTask[]
  documents: TaskDocument[]
}

export function useTaskBoard() {
  return useQuery<KanbanBoard>({
    queryKey: ['tasks', 'board'],
    queryFn: () => axiosInstance.get('/tasks/board').then(r => r.data.data),
    staleTime: 0,
  })
}

export function useTaskDetail(id: string | null) {
  return useQuery<TaskDetail>({
    queryKey: ['task', id],
    queryFn: () => axiosInstance.get(`/tasks/${id}`).then(r => r.data.data),
    enabled: !!id,
  })
}

export function useAssignTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.put(`/tasks/${id}/assign`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', 'board'] }),
  })
}

export function useCompleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.put(`/tasks/${id}/complete`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', 'board'] }),
  })
}

export function useRejectTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rejection_reason }: { id: string; rejection_reason: string }) =>
      axiosInstance.put(`/tasks/${id}/reject`, { rejection_reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', 'board'] }),
  })
}

export function useUploadTaskDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; file_name: string; file_type: string; file_url: string; file_id: string; file_path: string }) =>
      axiosInstance.post(`/tasks/${id}/documents`, body).then(r => r.data),
    onSuccess: (_data, { id }) => qc.invalidateQueries({ queryKey: ['task', id] }),
  })
}
