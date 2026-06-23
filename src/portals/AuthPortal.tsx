import { useState } from 'react'
import type { AuthPage } from '../lib/types'
import SignInPage from '../view/auth/SignInPage'
import CreateAccountPage from '../view/auth/CreateAccountPage'
import ForgotPasswordPage from '../view/auth/ForgotPasswordPage'
import OTPPage from '../view/auth/OTPPage'
import ResetPasswordPage from '../view/auth/ResetPasswordPage'

export default function AuthPortal() {
  const [page, setPage] = useState<AuthPage>('signin')

  const nav = (p: AuthPage) => setPage(p)

  if (page === 'signin')         return <SignInPage navigate={nav} />
  if (page === 'create-account') return <CreateAccountPage navigate={nav} />
  if (page === 'forgot-password')return <ForgotPasswordPage navigate={nav} />
  if (page === 'otp')            return <OTPPage navigate={nav} />
  return                                <ResetPasswordPage navigate={nav} />
}
