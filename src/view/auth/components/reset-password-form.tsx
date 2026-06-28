import AuthLayout from "./auth-layout";
import { Link } from "react-router-dom";
function Eye({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}
function EyeOff({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
}
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

import { ROUTES } from "@/router/routes";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout>
      <div className="space-y-5">
        <div>
          <Label htmlFor="password" className="mb-2">
            Enter your new Password
          </Label>

          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground h-5 w-5" />
              ) : (
                <Eye className="text-muted-foreground h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password" className="mb-2">
            Rewrite your new Password
          </Label>

          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="text-muted-foreground h-5 w-5" />
              ) : (
                <Eye className="text-muted-foreground h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            to={ROUTES.LOGIN}
            className="text-muted-foreground text-sm hover:underline"
          >
            Back to login
          </Link>
        </div>

        <Button
          type="submit"
          className="bg-primary-gradient h-10 w-full cursor-pointer rounded-lg text-white"
        >
          Reset Password
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Don't have an account?{" "}
          <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
