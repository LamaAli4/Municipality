import AuthLayout from "./auth-layout";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

function Upload({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
}

export default function RegisterForm() {
  return (
    <AuthLayout maxWidth="max-w-[1000px]">
      <div className="flex gap-20">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <Label htmlFor="username" className="mb-2">
              Username
            </Label>

            <Input id="username" />
          </div>

          <div>
            <Label htmlFor="id-number" className="mb-2">
              ID Number
            </Label>

            <Input id="id-number" />
          </div>

          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>

            <Input id="email" type="email" />
          </div>

          <div>
            <Label htmlFor="phone" className="mb-2">
              Phone Number
            </Label>

            <Input id="phone" />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-1 flex-col gap-8">
          <div>
            <Label htmlFor="governorate" className="mb-2">
              Governorate
            </Label>

            <Input id="governorate" />
          </div>

          <div>
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>

            <Input id="password" type="password" />
          </div>

          <div>
            <Label className="mb-2 block text-sm leading-5">
              Upload a selfie holding ID and another
              <br />
              photo of your ID card
            </Label>

            <label className="flex h-31.5 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#545F71] hover:bg-gray-50">
              <input type="file" className="hidden" />

              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />

              <span className="text-sm text-muted-foreground">
                Upload Image
              </span>
            </label>
          </div>

          <Button
            type="submit"
            className="bg-primary-gradient h-10 w-full cursor-pointer rounded-lg text-xl text-primary-foreground"
          >
            Next
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
