import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext"; 

interface ProtectedRouteProps {
  rolPermitido: "cliente" | "peluquero";
}

export default function ProtectedRoute({ rolPermitido }: ProtectedRouteProps) {
  const { user } = useAuth();
  // 1. Si no hay usuario logueado (o el F5 detectó que el token expiró), va al Login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Si un cliente intenta entrar al panel de peluquero (o viceversa), va al Home
  if (user.type !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está correcto, renderiza la pantalla correspondiente
  return <Outlet />;
}