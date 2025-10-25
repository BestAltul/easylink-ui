// src/auth/AuthGuard.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }) {
  const { isAuthenticated, authReady } = useAuth();
  const loc = useLocation();

  if (!authReady) {
    return <div style={{ minHeight: "60vh" }} />; 
  }
  if (!isAuthenticated) {
    return <Navigate to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  }
  return children;
}