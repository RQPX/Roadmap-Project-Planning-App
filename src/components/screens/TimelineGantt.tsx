import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { statusColors } from "../../types/project";
import { useProjects } from "../../contexts/ProjectsContext";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { Info } from "lucide-react";
import { formatProgressValue } from "../../utils/formatProgress";

const WEEK_WIDTH = 80;
const ROW_HEIGHT = 52;
const DEPT_ROW_HEIGHT = 32;
const NAME_PANEL_WIDTH = 300;

function parseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  try {
    // Handle ISO format from Airtable: "2024-01-15" or "2024-01-15T00:00:00.000Z"
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      // Force parse as local date to avoid timezone offset issues
      const parts = dateStr.substring(0, 10).split("-");
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) return d;
    }
    // Handle DD/MM/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
      const parts = dateStr.split("/");
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!isNaN(d.getTime())) return d;
    }
    // Fallback
    const iso = new Date(dateStr);
    if (!isNaN(iso.getTime())) return iso;
    return null;
  } catch {
    return null;
  }
}

export default function TimelineGantt() {
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { projects, loading } = useProjects();
  const { isDirecteur } = useAuth();

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const handleLeftScroll = () => {
    if (rightPanelRef.current && leftPanelRef.current) {
      rightPanelRef.current.scrollTop = leftPanelRef.current.scrollTop;
    }
  };

  const handleRightScroll = () => {
    if (leftPanelRef.current && rightPanelRef.current) {
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
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

  const { timelineStart, weeks } = useMemo(() => {
    const allDates = projects
      .flatMap((p) => [parseDate(p.startDate), parseDate(p.endDate)])
      .filter((d): d is Date => d !== null && !isNaN(d.getTime()));

    let start = allDates.length > 0
      ? new Date(Math.min(...allDates.map((d) => d.getTime())))
      : new Date("2021-01-01");

    let end = allDates.length > 0
      ? new Date(Math.max(...allDates.map((d) => d.getTime())))
      : new Date("2027-12-31");

    start = new Date(start);
    start.setDate(start.getDate() - 14);
    start.setDate(1);

    end = new Date(end);
    end.setDate(end.getDate() + 30);

    const weeks: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      weeks.push(new Date(d));
      if (weeks.length > 260) break;
    }

    return { timelineStart: start, weeks };
  }, [projects]);

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
    for (const project of deptProjects) {
      rows.push({ type: "project", project });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <h1 className="text-3xl font-semibold text-gray-900">Chronogramme Global</h1>

        {isDirecteur && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Vous êtes en mode lecture seule. Vous pouvez visualiser la chronologie de tous les projets.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-4">
          <div className="w-48">
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
          <div className="w-64">
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
      </div>

      <Card className="max-w-[1600px] mx-auto">
        <CardHeader><CardTitle>Vue Chronologique</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="flex border-t">
            {/* LEFT PANEL */}
            <div className="flex-shrink-0 border-r border-gray-200" style={{ width: `${NAME_PANEL_WIDTH}px` }}>
              <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 font-medium text-sm text-gray-700">
                Projets
              </div>
              <div
                ref={leftPanelRef}
                onScroll={handleLeftScroll}
                style={{ height: "600px", overflowY: "auto", overflowX: "hidden" }}
              >
                {rows.map((row, i) =>
                  row.type === "dept" ? (
                    <div
                      key={`dept-left-${i}`}
                      className="bg-blue-50 px-4 flex items-center font-semibold text-sm text-blue-900 border-b border-gray-200"
                      style={{ height: `${DEPT_ROW_HEIGHT}px` }}
                    >
                      {row.dept}
                    </div>
                  ) : (
                    <div
                      key={`proj-left-${i}`}
                      className="px-4 border-b border-gray-100 hover:bg-gray-50 flex flex-col justify-center"
                      style={{ height: `${ROW_HEIGHT}px` }}
                    >
                      <div className="text-sm font-medium text-gray-900 leading-tight truncate" title={row.project.name}>
                        {row.project.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">
                        {row.project.projectManager}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ flex: 1, overflowX: "auto" }}>
              <div style={{ width: `${totalTimelineWidth}px`, minWidth: "100%" }}>
                {/* Week headers */}
                <div className="h-12 bg-gray-50 border-b border-gray-200 flex">
                  {weeks.map((week, i) => (
                    <div
                      key={i}
                      className="border-r border-gray-200 px-1 py-2 text-xs text-center flex-shrink-0"
                      style={{ width: `${WEEK_WIDTH}px` }}
                    >
                      <div className="font-medium text-gray-600">
                        {week.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bars */}
                <div
                  ref={rightPanelRef}
                  onScroll={handleRightScroll}
                  style={{ height: "600px", overflowY: "auto" }}
                >
                  {rows.map((row, i) =>
                    row.type === "dept" ? (
                      <div
                        key={`dept-right-${i}`}
                        className="bg-blue-50 border-b border-gray-200"
                        style={{ height: `${DEPT_ROW_HEIGHT}px`, width: `${totalTimelineWidth}px` }}
                      />
                    ) : (
                      <div
                        key={`bar-${i}`}
                        className="border-b border-gray-100 relative"
                        style={{ height: `${ROW_HEIGHT}px`, width: `${totalTimelineWidth}px` }}
                      >
                        {/* Vertical grid lines */}
                        {weeks.map((_, wi) => (
                          <div
                            key={wi}
                            className="absolute top-0 bottom-0 border-r border-gray-100"
                            style={{ left: `${wi * WEEK_WIDTH}px` }}
                          />
                        ))}

                        {/* Bar */}
                        {(() => {
                          const barStyle = getBarStyle(row.project.startDate, row.project.endDate);
                          if (!barStyle) return (
                            <div className="absolute top-3 left-1 text-xs text-gray-400 italic">
                              dates manquantes
                            </div>
                          );
                          const color = statusColors[row.project.status] || "#9CA3AF";
                          return (
                            <div
                              className="absolute top-2 h-8 rounded px-2 flex items-center shadow-sm overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ left: barStyle.left, width: barStyle.width, backgroundColor: color, minWidth: "36px" }}
                              title={`${row.project.name}\nStatut: ${row.project.status}\nAvancement: ${formatProgressValue(row.project.progress)}%\nDébut: ${row.project.startDate}\nFin prévue: ${row.project.endDate}`}
                            >
                              <span className="text-xs text-white font-semibold whitespace-nowrap">
                                {formatProgressValue(row.project.progress)}%
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
