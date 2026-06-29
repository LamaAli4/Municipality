import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import type { Role } from './lib/types'
import AuthPortal from './portals/AuthPortal'
import LandingPage from './view/LandingPage'
import AdminPortal from './portals/AdminPortal'
import CitizenPortal from './portals/CitizenPortal'
// import ManagerPortal from './portals/ManagerPortal'
import EmployeePortal from './portals/EmployeePortal'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function AppContent() {
  const { user, isAuthenticated, logout, isLoading, initializeAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    logout()
    queryClient.clear()
    navigate('/login')
  }

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role.toLowerCase() as Role
      const currentPath = location.pathname
      const authPaths = ['/', '/login', '/register', '/forgot-password', '/otp', '/reset-password']
      if (authPaths.includes(currentPath)) {
        if (role === 'admin') navigate('/admin', { replace: true })
        else if (role === 'citizen') navigate('/citizen', { replace: true })
        // else if (role === 'department_manager') navigate('/manager', { replace: true })
        else navigate('/employee', { replace: true })
      } else if (role === 'admin' && currentPath !== '/admin') navigate('/admin', { replace: true })
      else if (role === 'citizen' && currentPath !== '/citizen') navigate('/citizen', { replace: true })
      // else if (role === 'department_manager' && currentPath !== '/manager') navigate('/manager', { replace: true })
      else if (role === 'employee' && currentPath !== '/employee') navigate('/employee', { replace: true })
    }
  }, [isAuthenticated, user, navigate, location.pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-teal-600 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthPortal />} />
      <Route path="/register" element={<AuthPortal />} />
      <Route path="/forgot-password" element={<AuthPortal />} />
      <Route path="/otp" element={<AuthPortal />} />
      <Route path="/reset-password" element={<AuthPortal />} />
      <Route path="/admin" element={<ProtectedRoute><AdminPortal onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/citizen" element={<ProtectedRoute><CitizenPortal onLogout={handleLogout} /></ProtectedRoute>} />
      {/* <Route path="/manager" element={<ProtectedRoute><ManagerPortal onLogout={handleLogout} /></ProtectedRoute>} /> */}
      <Route path="/employee" element={<ProtectedRoute><EmployeePortal onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
