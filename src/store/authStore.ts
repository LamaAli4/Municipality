import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string, refreshToken?: string) => void
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token, refreshToken) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
    set({ user, token, refreshToken, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false })
  },

  initializeAuth: () => {
    set({ isLoading: true })
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const refreshToken = localStorage.getItem('refreshToken')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({ user, token, refreshToken, isAuthenticated: true, isLoading: false })
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false })
      }
    } else {
      set({ isLoading: false })
    }
  },
}))
