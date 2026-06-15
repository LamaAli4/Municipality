import { useState } from 'react'
import type { Role } from './lib/types'
import AuthPortal from './portals/AuthPortal'
import AdminPortal from './portals/AdminPortal'
import CitizenPortal from './portals/CitizenPortal'
import ManagerPortal from './portals/ManagerPortal'
import EmployeePortal from './portals/EmployeePortal'

export default function App() {
  const [role, setRole] = useState<Role | null>(null)

  if (!role)              return <AuthPortal onLogin={setRole} />
  if (role === 'admin')   return <AdminPortal onLogout={() => setRole(null)} />
  if (role === 'citizen') return <CitizenPortal onLogout={() => setRole(null)} />
  if (role === 'manager') return <ManagerPortal onLogout={() => setRole(null)} />
  return                         <EmployeePortal onLogout={() => setRole(null)} />
}
