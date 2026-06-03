import { Link } from "react-router-dom";

import AuthLayout from "./auth-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ROUTES } from "@/router/routes";

export default function ForgotPasswordForm() {
  return (
    <AuthLayout>
      <div className="space-y-5">
        <div>
          <Label htmlFor="identifier" className="mb-2">
            Enter Your Phone Number
          </Label>

          <Input id="identifier" type="text" />
        </div>

        <div className="flex justify-end">
          <Link
            to={ROUTES.LOGIN}
            className="text-muted-foreground text-sm hover:underline"
          >
            Login?
          </Link>
        </div>

        <Button
          asChild
          className="bg-primary-gradient h-10 w-full rounded-lg text-white"
        >
          <Link to={ROUTES.OTP}>Send OTP Code</Link>
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
