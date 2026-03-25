import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isAuthenticated()) {
        return <Navigate to="/admin" />; 
    }
    return <>{children}</>;
}
