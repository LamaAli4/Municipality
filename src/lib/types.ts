// ── Roles ──────────────────────────────────────────────────────────
export type Role = 'admin' | 'citizen' | 'department_manager' | 'employee'

// ── Admin pages ────────────────────────────────────────────────────
export type Page =
  | 'dashboard' | 'citizens' | 'citizen-detail' | 'staff'
  | 'department' | 'sections' | 'service' | 'add-service' | 'service-detail'
  | 'logs' | 'notifications' | 'account' | 'login'

export type NavigateFn = (page: Page, params?: Record<string, string>) => void

// ── Citizen pages ──────────────────────────────────────────────────
export type CitizenPage =
  | 'home' | 'services' | 'service-detail' | 'service-request'
  | 'my-requests' | 'request-detail' | 'complaints' | 'new-complaint'
  | 'utility-bills' | 'pay-bill' | 'damage-assessment'
  | 'notifications' | 'account'

export type CitizenNavigateFn = (page: CitizenPage, params?: Record<string, string>) => void

// ── Department Manager pages ───────────────────────────────────────
export type ManagerPage =
  | 'staff' | 'department-mgmt' | 'performance' | 'notifications' | 'account'

export type ManagerNavigateFn = (page: ManagerPage) => void

// ── Employee pages ─────────────────────────────────────────────────
export type EmployeePage =
  | 'task-board' | 'task-detail' | 'notifications' | 'account'

export type EmployeeNavigateFn = (page: EmployeePage) => void

// ── Auth pages ─────────────────────────────────────────────────────
export type AuthPage =
  | 'signin' | 'create-account' | 'forgot-password' | 'otp' | 'reset-password'

// ── Admin data models ──────────────────────────────────────────────
export interface Citizen { id: number; name: string; idNum: string; status: 'Active' | 'pending' | 'Inactive' }
export interface Employee { id: number; name: string; section: string; status: 'Active' | 'Inactive'; tasks: number }
export interface Department { id: number; name: string; desc: string; sections: number }
export interface Section { id: number; name: string; dept: string; employees: number }
export interface Service { id: number; name: string; dept: string; date: string }
export interface LogEntry { id: number; datetime: string; user: string; proc: string; result: 'successful' | 'to fail' }
export interface Request { num: string; type: string; date: string; status: string }

// ── Citizen data models ────────────────────────────────────────────
export interface ServiceItem {
  id: number
  name: string
  category: string
  description: string
  estimatedDays: number
  fee: number
  requiredDocs: string[]
  steps: string[]
}

export interface RequestItem {
  id: number
  service: string
  requestNum: string
  submitDate: string
  status: 'In process' | 'Complete' | 'Rejected' | 'Waiting for documents'
  timeline: { date: string; label: string; done: boolean }[]
}

export interface ComplaintItem {
  id: number
  title: string
  service: string
  date: string
  status: 'In process' | 'Complete' | 'Rejected'
  description: string
}

export interface BillItem {
  id: number
  service: string
  amount: number
  dueDate: string
  status: 'Unpaid' | 'In process' | 'Paid'
  period: string
}

// ── Employee data models ───────────────────────────────────────────
export interface TaskItem {
  id: number
  taskNum: string
  service: string
  citizen: string
  section: string
  attributionDate: string
  dueDate: string
  status: 'New tasks' | 'Under implementation' | 'Waiting for documents' | 'Re-editing' | 'Resuming' | 'Completed / Rejected'
  priority: 'High' | 'Medium' | 'Low'
  notes?: string
}
