import AuthLayout from "./auth-layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/router/routes";

export default function OtpForm() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center mt-2">
        <p className="text-muted-foreground text-center text-sm mb-6! px-4">
          Enter 6-digit code sent to your mobile number
        </p>

        <div className="mb-8 flex items-center gap-3">
          {[1, 2, 3].map((item) => (
            <Input
              key={item}
              maxLength={1}
              className="h-10 w-14 text-center text-lg"
            />
          ))}
          <div className="mx-1 h-1 w-3 rounded-full bg-primary-gradient" />

          {[4, 5, 6].map((item) => (
            <Input
              key={item}
              maxLength={1}
              className="h-10 w-14 text-center text-lg"
            />
          ))}
        </div>

        <Button
          asChild
          className="bg-primary-gradient mb-5 h-10 w-full cursor-pointer rounded-lg text-white"
        >
          <Link to={ROUTES.RESET_PASSWORD}>Verify Code</Link>
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
