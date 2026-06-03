import { Navigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;
