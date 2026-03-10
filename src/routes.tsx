import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import DashboardOverview from "./components/screens/DashboardOverview";
import ProjectsKanban from "./components/screens/ProjectsKanban";
import TimelineGantt from "./components/screens/TimelineGantt";
import { Login } from "./components/screens/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthWrapper } from "./components/AuthWrapper";

/**
 * ROUTER CONFIGURATION
 * 
 * Structure:
 * - AuthWrapper wraps everything (provides AuthProvider)
 * - /login - Public login page
 * - / - Protected routes (wrapped in ProtectedRoute)
 *   - Dashboard, Kanban, Timeline
 */

export const router = createBrowserRouter([
  {
    element: <AuthWrapper><Login /></AuthWrapper>,
    path: "/login",
  },
  {
    element: (
      <AuthWrapper>
        <ProtectedRoute>
          <Root />
        </ProtectedRoute>
      </AuthWrapper>
    ),
    path: "/",
    children: [
      { index: true, Component: DashboardOverview },
      { path: "projets", Component: ProjectsKanban },
      { path: "chronologie", Component: TimelineGantt },
    ],
  },
]);
