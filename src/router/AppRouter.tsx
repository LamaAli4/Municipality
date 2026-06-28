import { ROUTES } from "./routes";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Login from "@/view/auth/screens/login";
import Register from "@/view/auth/screens/register";
import ForgotPassword from "@/view/auth/screens/forgot-password";
import Otp from "@/view/auth/screens/otp";
import ResetPassword from "@/view/auth/screens/reset-password";

type AppRoute = {
  path: string;
  element: ReactNode;
};

const appRoutes: AppRoute[] = [
  // {
  //   path: ROUTES.HOME,
  //   element: <Dashboard />,
  // },
];

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.OTP} element={<Otp />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}
