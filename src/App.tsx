import { RouterProvider } from "react-router";
import { router } from "./routes";

/**
 * FRENCH PROJECT MANAGEMENT DASHBOARD
 * 
 * WeWeb Export Ready ✅
 * 
 * This application is optimized for export to WeWeb and other no-code platforms.
 * All components use standard, exportable patterns with no third-party plugins.
 * 
 * Key Documentation:
 * - WEWEB_EXPORT_GUIDE.md - Complete export guide with integration steps
 * - EXPORT_CHECKLIST.md - Step-by-step checklist for export process
 * - README.md - Project overview and features
 * - /guidelines/Guidelines.md - Development standards
 * 
 * Architecture:
 * - 3 pages: Dashboard (/), Kanban (/projets), Timeline (/chronologie)
 * - 1 modal: Project CRUD form
 * - Role-based access: Admin (full CRUD) vs Viewer (read-only)
 * - Mock data in /data/mockProjects.ts (replace with WeWeb collection)
 * - Types in /types/project.ts (use for collection schema)
 * 
 * Tech Stack:
 * - React 18 + TypeScript
 * - React Router for navigation
 * - Tailwind CSS v4 for styling
 * - shadcn/ui for components (exportable)
 * - Recharts for charts (SVG-based)
 */

export default function App() {
  return <RouterProvider router={router} />;
}