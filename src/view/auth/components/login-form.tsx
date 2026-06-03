import { Link } from "react-router-dom";

import AuthLayout from "./auth-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ROUTES } from "@/router/routes";

export default function LoginForm() {
  return (
    <AuthLayout>
      <div className="mx-auto max-w-116.5">
        <div className="space-y-5"> 
          <div>
            <Label className="mb-2" htmlFor="id-number">
              ID Number
            </Label>

            <Input id="id-number" type="text" />
          </div>

          <div>
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>

            <Input id="password" type="password" />
          </div>

          <div className="flex justify-end">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-muted-foreground cursor-pointer text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="bg-primary-gradient h-10 w-full cursor-pointer rounded-lg text-xl text-primary-foreground"
          >
            Sign In
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
