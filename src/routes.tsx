import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import DashboardOverview from "./components/screens/DashboardOverview";
import ProjectsKanban from "./components/screens/ProjectsKanban";
import TimelineGantt from "./components/screens/TimelineGantt";
import { Login } from "./components/screens/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

/**
 * ROUTER CONFIGURATION
 * 
 * Structure:
 * - /login - Public login page
 * - / - Protected routes (wrapped in ProtectedRoute)
 *   - Dashboard, Kanban, Timeline
 */

export const router = createBrowserRouter([
  {
    element: <Login />,
    path: "/login",
  },
  {
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    path: "/",
    children: [
      { index: true, Component: DashboardOverview },
      { path: "projets", Component: ProjectsKanban },
      { path: "chronologie", Component: TimelineGantt },
    ],
  },
]);
