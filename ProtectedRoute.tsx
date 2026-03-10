import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * PROTECTED ROUTE COMPONENT
 * 
 * Requires authentication to access routes.
 * Redirects to login if user is not authenticated.
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
