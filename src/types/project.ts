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

export type Department = string;

export interface Project {
  id: string;
  name: string;
  department: Department;
  status: Status;
  priority: Priority;
  progress: number;
  previousMonthProgress: number | null;
  projectManager: string;
  partners: string;
  startDate: string;
  endDate: string;
  comments: string;
  isDelayed: boolean;
}

export const statusColors: Record<Status, string> = {
  "En exécution": "#F59E0B",
  "En etude": "#9333EA",
  "Cloturé": "#60A5FA",
  "En attente de Go pour production": "#86EFAC",
  "En production": "#16A34A",
  "En pause": "#6B7280",
  "Non demarre": "#94A3B8",
  "Abandonne": "#DC2626",
  "En service": "#22C55E",
};

export const priorityColors: Record<Priority, string> = {
  "Haute": "#DC2626",
  "Moyenne": "#F97316",
  "Basse": "#6B7280",
};
