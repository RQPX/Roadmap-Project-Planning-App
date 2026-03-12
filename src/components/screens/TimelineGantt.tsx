import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { statusColors } from "../../types/project";
import { useProjects } from "../../contexts/ProjectsContext";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { Info } from "lucide-react";
import { formatProgressValue } from "../../utils/formatProgress";

const WEEK_WIDTH = 60;
const ROW_HEIGHT = 52;
const DEPT_ROW_HEIGHT = 32;
const NAME_PANEL_WIDTH_DESKTOP = 280;
const NAME_PANEL_WIDTH_MOBILE = 140;

function parseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  try {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const parts = dateStr.substring(0, 10).split("-");
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) return d;
    }
    if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
      const parts = dateStr.split("/");
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!isNaN(d.getTime())) return d;
    }
    const iso = new Date(dateStr);
    if (!isNaN(iso.getTime())) return iso;
    return null;
  } catch { return null; }
}

export default function TimelineGantt() {
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { projects, loading } = useProjects();
  const { isDirecteur } = useAuth();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const NAME_PANEL_WIDTH = isMobile ? NAME_PANEL_WIDTH_MOBILE : NAME_PANEL_WIDTH_DESKTOP;

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleLeftScroll = () => {
    if (rightPanelRef.current && leftPanelRef.current)
      rightPanelRef.current.scrollTop = leftPanelRef.current.scrollTop;
  };
  const handleRightScroll = () => {
    if (leftPanelRef.current && rightPanelRef.current)
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop;
    if (headerRef.current && rightPanelRef.current)
      headerRef.current.scrollLeft = rightPanelRef.current.scrollLeft;
  };

  const { timelineStart, weeks, availableYears } = useMemo(() => {
    if (!projects || projects.length === 0)
      return { timelineStart: new Date("2020-01-01"), weeks: [], availableYears: [] };

    const allDates = projects
      .flatMap((p) => [parseDate(p.startDate), parseDate(p.endDate)])
      .filter((d): d is Date => d !== null && !isNaN(d.getTime()));

    let start = allDates.length > 0
      ? new Date(Math.min(...allDates.map((d) => d.getTime())))
      : new Date("2020-01-01");

    // Forcer la fin à au moins fin 2026
    let end = allDates.length > 0
      ? new Date(Math.max(...allDates.map((d) => d.getTime())))
      : new Date("2026-12-31");
    end = new Date(Math.max(end.getTime(), new Date("2026-12-31").getTime()));

    start = new Date(start);
    start.setDate(start.getDate() - 14);
    start.setDate(1);
    end = new Date(end);
    end.setMonth(end.getMonth() + 2);

    const weeks: Date[] = [];
    const cursor = new Date(start);
    while (cursor <= end && weeks.length < 400) {
      weeks.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 7);
    }

    const years = Array.from(new Set(weeks.map((w) => w.getFullYear()))).sort();

    return { timelineStart: start, weeks, availableYears: years };
  }, [projects]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) => {
    const deptMatch = filterDepartment === "all" || project.department === filterDepartment;
    const statusMatch = filterStatus === "all" || project.status === filterStatus;
    return deptMatch && statusMatch;
  });

  const projectsByDept = filteredProjects.reduce((acc, project) => {
    const dept = project.department || "Autre";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  const getBarStyle = (startDateStr: string, endDateStr: string) => {
    const start = parseDate(startDateStr);
    const end = parseDate(endDateStr);
    if (!start || !end) return null;
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const leftWeeks = (start.getTime() - timelineStart.getTime()) / msPerWeek;
    const widthWeeks = Math.max(0.5, (end.getTime() - start.getTime()) / msPerWeek);
    return {
      left: `${Math.max(0, leftWeeks * WEEK_WIDTH)}px`,
      width: `${widthWeeks * WEEK_WIDTH}px`,
    };
  };

  const totalTimelineWidth = weeks.length * WEEK_WIDTH;

  const rows: Array<{ type: "dept"; dept: string } | { type: "project"; project: typeof projects[0] }> = [];
  for (const [dept, deptProjects] of Object.entries(projectsByDept)) {
    rows.push({ type: "dept", dept });
    for (const project of deptProjects) rows.push({ type: "project", project });
  }

  const scrollToYear = (year: number) => {
    const targetWeekIndex = weeks.findIndex((w) => w.getFullYear() === year);
    if (targetWeekIndex >= 0 && rightPanelRef.current) {
      const scrollLeft = targetWeekIndex * WEEK_WIDTH;
      rightPanelRef.current.scrollLeft = scrollLeft;
      if (headerRef.current) headerRef.current.scrollLeft = scrollLeft;
    }
  };

  const monthGroups: { label: string; year: number; weekCount: number }[] = [];
  weeks.forEach((week) => {
    const month = week.toLocaleDateString("fr-FR", { month: "short" });
    const year = week.getFullYear();
    const last = monthGroups[monthGroups.length - 1];
    if (last && last.label === month && last.year === year) {
      last.weekCount++;
    } else {
      monthGroups.push({ label: month, year, weekCount: 1 });
    }
  });

  const yearGroups = monthGroups.reduce((acc, group) => {
    const prev = acc[acc.length - 1];
    if (prev && prev.year === group.year) {
      prev.weekCount += group.weekCount;
      return acc;
    }
    acc.push({ year: group.year, weekCount: group.weekCount });
    return acc;
  }, [] as { year: number; weekCount: number }[]);

  return (
    <div style={{ padding: "16px", maxWidth: "1600px", margin: "0 auto" }}>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .gantt-right::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827", marginBottom: "12px" }}>
          Chronogramme Global
        </h1>

        {isDirecteur && (
          <Alert className="bg-blue-50 border-blue-200" style={{ marginBottom: "12px" }}>
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              Vous êtes en mode lecture seule.
            </AlertDescription>
          </Alert>
        )}

        {/* Filtres */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <div style={{ minWidth: "180px" }}>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger><SelectValue placeholder="Département" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {Array.from(new Set(projects.map((p) => p.department))).filter(Boolean).sort().map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div style={{ minWidth: "220px" }}>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Non demarre">Non démarré</SelectItem>
                <SelectItem value="En etude">En étude</SelectItem>
                <SelectItem value="En exécution">En exécution</SelectItem>
                <SelectItem value="En attente de Go pour production">En attente Go production</SelectItem>
                <SelectItem value="En production">En production</SelectItem>
                <SelectItem value="En service">En service</SelectItem>
                <SelectItem value="En pause">En pause</SelectItem>
                <SelectItem value="Cloturé">Clôturé</SelectItem>
                <SelectItem value="Abandonne">Abandonné</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Navigation par année */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#6b7280", marginRight: "4px" }}>Aller à :</span>
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => scrollToYear(year)}
              style={{
                padding: "4px 14px",
                borderRadius: "9999px",
