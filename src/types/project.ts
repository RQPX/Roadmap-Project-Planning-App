/**
 * PROJECT DATA TYPES
 * 
 * WeWeb Export Note:
 * These TypeScript interfaces define the exact schema needed for your WeWeb collection.
 * Create a "Projects" collection with these field names and types.
 */

export type Status =
  | "En exécution"
  | "En etude"
  | "Cloturé"
  | "En attente de Go pour production"
  | "En production"
  | "En pause"
  | "Non demarre"
  | "Abandonne"
  | "En service";

export type Priority = "Haute" | "Moyenne" | "Basse";

export type Department = "DSI" | "DAF" | "RH" | "DGP" | "DDEV";

/**
 * Main Project Interface
 * 
 * WeWeb Collection Fields:
 * - id: Text (unique identifier)
 * - name: Text
 * - department: Text with options (DSI, DAF, RH, DGP, DDEV)
 * - status: Text with 9 options (see Status type)
 * - priority: Text with 3 options (Haute, Moyenne, Basse)
 * - progress: Number (0-100)
 * - projectManager: Text
 * - partners: Text
 * - startDate: Date
 * - endDate: Date
 * - comments: Long Text
 * - isDelayed: Boolean (can be computed field in WeWeb)
 */
export interface Project {
  id: string;
  name: string;
  department: Department;
  status: Status;
  priority: Priority;
  progress: number;
  projectManager: string;
  partners: string;
  startDate: string;
  endDate: string;
  comments: string;
  isDelayed: boolean;
}

/**
 * Status Color Mapping
 * 
 * WeWeb Note: Use these hex colors for badges and status indicators
 * Can be configured as CSS variables or formula-based styling in WeWeb
 */
export const statusColors: Record<Status, string> = {
  "En exécution": "#F59E0B", // Yellow/Beige
  "En etude": "#9333EA", // Purple
  "Cloturé": "#60A5FA", // Light Blue
  "En attente de Go pour production": "#86EFAC", // Light Green
  "En production": "#16A34A", // Dark Green
  "En pause": "#6B7280", // Gray
  "Non demarre": "#94A3B8", // Gray-blue
  "Abandonne": "#DC2626", // Deep Red
  "En service": "#22C55E", // Bright Green
};

/**
 * Priority Color Mapping
 * 
 * WeWeb Note: Use these hex colors for priority badges
 */
export const priorityColors: Record<Priority, string> = {
  "Haute": "#DC2626", // Red
  "Moyenne": "#F97316", // Orange
  "Basse": "#6B7280", // Gray
};