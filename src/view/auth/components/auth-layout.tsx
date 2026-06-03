import type { ReactNode } from "react";
import logo from "@/assets/logo.png";

type AuthLayoutProps = {
  children: ReactNode;
  maxWidth?: string;
};

export default function AuthLayout({
  children,
  maxWidth = "max-w-121.5",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full justify-center px-6 py-10">
      <div className={`w-full ${maxWidth}`}>
        <div className="mb-10 flex flex-col items-center">
          <img src={logo} alt="Techno Amar" className="mb-4 h-45 w-40" />
          <h1>Techno Amar</h1>
        </div>

        {children}
      </div>
    </div>
  );
}
