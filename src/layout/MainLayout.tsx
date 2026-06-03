import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-360">
      <Outlet />
    </div>
  );
}
