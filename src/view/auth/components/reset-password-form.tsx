import AuthLayout from "./auth-layout";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
