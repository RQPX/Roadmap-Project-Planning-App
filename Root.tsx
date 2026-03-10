import { Outlet } from "react-router";
import { TopNavigation } from "./TopNavigation";
import { Toaster } from "./ui/sonner";
import { ProjectsProvider } from "../contexts/ProjectsContext";

/**
 * ROOT LAYOUT COMPONENT
 * 
 * Provides layout and data context to all protected pages.
 * 
 * Note: AuthProvider is now at the top level (in routes.ts)
 * so that ProtectedRoute can access it.
 */

export default function Root() {
  return (
    <ProjectsProvider>
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <Outlet />
        <Toaster />
      </div>
    </ProjectsProvider>
  );
}