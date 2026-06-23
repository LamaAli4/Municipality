import { useNavigate, useLocation } from 'react-router-dom'
import type { AuthPage } from '../lib/types'
import SignInPage from '../view/auth/SignInPage'
import CreateAccountPage from '../view/auth/CreateAccountPage'
import ForgotPasswordPage from '../view/auth/ForgotPasswordPage'
import OTPPage from '../view/auth/OTPPage'
import ResetPasswordPage from '../view/auth/ResetPasswordPage'

const PAGE_TO_PATH: Record<AuthPage, string> = {
  'signin': '/login',
  'create-account': '/register',
  'forgot-password': '/forgot-password',
  'otp': '/otp',
  'reset-password': '/reset-password',
}

const PATH_TO_PAGE: Record<string, AuthPage> = {
  '/login': 'signin',
  '/register': 'create-account',
  '/forgot-password': 'forgot-password',
  '/otp': 'otp',
  '/reset-password': 'reset-password',
}

export default function AuthPortal() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const page: AuthPage = PATH_TO_PAGE[pathname] ?? 'signin'
  const nav = (p: AuthPage) => navigate(PAGE_TO_PATH[p])

  if (page === 'signin')          return <SignInPage navigate={nav} />
  if (page === 'create-account')  return <CreateAccountPage navigate={nav} />
  if (page === 'forgot-password') return <ForgotPasswordPage navigate={nav} />
  if (page === 'otp')             return <OTPPage navigate={nav} />
  return                                 <ResetPasswordPage navigate={nav} />
}
