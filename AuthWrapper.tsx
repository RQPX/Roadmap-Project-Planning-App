import { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext";

/**
 * AUTH WRAPPER COMPONENT
 * 
 * Provides AuthProvider at the top level for the entire app.
 * This allows ProtectedRoute to access useAuth.
 */

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
