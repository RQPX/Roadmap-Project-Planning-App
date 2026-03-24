import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { statusColors } from "../../types/project";
import { useProjects } from "../../contexts/ProjectsContext";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { Info } from "lucide-react";
import { formatProgressValue } from "../../utils/formatProgress";

const ROW_HEIGHT = 48;
const MONTH_WIDTH = 110;
const NAME_WIDTH = 260;
const EXCLUDED_STATUSES = ["Cloturé", "Abandonne"];
const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

interface Activity {
  date: Date;
  text: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  date: string;
  text: string;
  projectName: string;
}

function parseComments(comments: string | null | undefined): Activity[] {
  if (!comments) return [];
  const results: Activity[] = [];

  // Normalize: replace "DD.MM.YYYY." with "DD-MM-YYYY "
  const normalized = comments
    .replace(/(\d{2})\.(\d{2})\.(\d{4})\./g, "$1-$2-$3 ")
    .replace(/(\d{2})\.(\d{2})\.(\d{4})/g, "$1-$2-$3 ");

  // Split on date pattern DD-MM-YYYY (with optional space/colon after)
  const parts = normalized.split(/(?=\d{2}-\d{2}-\d{4})/);

  for (const part of parts) {
    const match = part.match(/^(\d{2})-(\d{2})-(\d{4})\s*:?\s*([\s\S]*)/);
    if (!match) continue;

    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const year = parseInt(match[3]);
    const text = match[4].trim().replace(/\s+/g, " ").substring(0, 200);

    if (month < 0 || month > 11 || day < 1 || day > 31) continue;
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) continue;
    if (!text) continue;

    results.push({ date, text });
  }

  return results.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function TimelineGantt() {
  const { projects, loading } = useProjects();
  const { isDirecteur } = useAuth();
  const [filterDirection, setFilterDirection] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, date: "", text: "", projectName: "" });
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRightScroll = () => {
    if (headerRef.current && rightPanelRef.current)
      headerRef.current.scrollLeft = rightPanelRef.current.scrollLeft;
    if (leftPanelRef.current && rightPanelRef.current)
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop;
  };

  const activeProjects = useMemo(() =>
    projects.filter((p) => !EXCLUDED_STATUSES.includes(p.status)),
    [projects]
  );

  const allDirections = useMemo(() =>
    Array.from(new Set(activeProjects.map((p) => p.department).filter(Boolean))).sort(),
    [activeProjects]
  );

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(new Date().getFullYear());
    activeProjects.forEach((p) => {
      parseComments(p.comments).forEach((e) => years.add(e.date.getFullYear()));
    });
    return Array.from(years).sort();
  }, [activeProjects]);

  const filteredProjects = useMemo(() =>
    filterDirection === "all"
      ? activeProjects
      : activeProjects.filter((p) => p.department === filterDirection),
    [activeProjects, filterDirection]
  );

  const totalWidth = 12 * MONTH_WIDTH;

  // Convert date to X position in pixels
  const getX = (date: Date): number => {
    const startOfYear = new Date(selectedYear, 0, 1).getTime();
    const endOfYear = new Date(selectedYear + 1, 0, 1).getTime();
    const ratio = (date.getTime() - startOfYear) / (endOfYear - startOfYear);
    return Math.max(0, Math.min(totalWidth, ratio * totalWidth));
  };

  const showTooltip = (e: React.MouseEvent, activity: Activity, projectName: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top - 10,
      date: activity.date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
      text: activity.text,
      projectName,
    });
  };

  const hideTooltip = () => setTooltip((t) => ({ ...t, visible: false }));

  if (loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ padding: "16px", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
      <style>{`.gantt-hide::-webkit-scrollbar{display:none}`}</style>

      {/* Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: "absolute",
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          backgroundColor: "#1f2937",
          color: "white",
          borderRadius: "8px",
          padding: "10px 14px",
          fontSize: "12px",
          maxWidth: "320px",
          zIndex: 1000,
          pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600, color: "#93c5fd", marginBottom: "4px", fontSize: "11px" }}>
            {tooltip.projectName}
          </div>
          <div style={{ color: "#fbbf24", fontWeight: 600, marginBottom: "6px", fontSize: "11px" }}>
            📅 {tooltip.date}
          </div>
          <div style={{ color: "#e5e7eb" }}>{tooltip.text}</div>
        </div>
      )}

      <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827", marginBottom: "16px" }}>
        Chronogramme Global
      </h1>

      {isDirecteur && (
        <Alert className="bg-blue-50 border-blue-200" style={{ marginBottom: "12px" }}>
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 text-sm">Vous êtes en mode lecture seule.</AlertDescription>
        </Alert>
      )}

      {/* Filtres */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
        <div style={{ minWidth: "180px" }}>
          <Select value={filterDirection} onValueChange={setFilterDirection}>
            <SelectTrigger><SelectValue placeholder="Direction" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les directions</SelectItem>
              {allDirections.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Année :</span>
          {availableYears.map((year) => (
            <button key={year} onClick={() => setSelectedYear(year)}
              style={{
                padding: "4px 14px", borderRadius: "9999px", fontSize: "13px", fontWeight: 500,
                cursor: "pointer", border: "1px solid",
                borderColor: selectedYear === year ? "#2563eb" : "#d1d5db",
                backgroundColor: selectedYear === year ? "#2563eb" : "white",
                color: selectedYear === year ? "white" : "#374151",
              }}>
              {year}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader style={{ padding: "12px 16px" }}>
          <CardTitle style={{ fontSize: "16px" }}>
            Activités des Projets — {selectedYear}
            <span style={{ fontSize: "13px", fontWeight: 400, color: "#6b7280", marginLeft: "8px" }}>
              ({filteredProjects.length} projets · survoler les points pour voir les détails)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ display: "flex", borderTop: "1px solid #e5e7eb" }}>

            {/* Panneau gauche */}
            <div style={{ flexShrink: 0, width: `${NAME_WIDTH}px`, borderRight: "1px solid #e5e7eb" }}>
              <div style={{ height: "48px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                Projets
              </div>
              <div ref={leftPanelRef} className="gantt-hide"
                style={{ maxHeight: "520px", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" } as React.CSSProperties}>
                {filteredProjects.map((project) => {
                  const activities = parseComments(project.comments).filter(
                    (a) => a.date.getFullYear() === selectedYear
                  );
                  return (
                    <div key={project.id} style={{ height: `${ROW_HEIGHT}px`, padding: "0 12px", borderBottom: "1px solid #f3f4f6", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={project.name}>
                        {project.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: statusColors[project.status] || "#9ca3af", flexShrink: 0 }} />
                        <span style={{ fontSize: "10px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {project.department} · {formatProgressValue(project.progress)}% · {activities.length} activité{activities.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panneau droit */}
            <div style={{ flex: 1, overflow: "hidden" }}>

              {/* En-tête mois */}
              <div ref={headerRef} className="gantt-hide"
                style={{ overflowX: "hidden", height: "48px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ width: `${totalWidth}px`, display: "flex", height: "100%" }}>
                  {MONTHS_FR.map((label, month) => {
                    const isCurrentMonth = month === new Date().getMonth() && selectedYear === new Date().getFullYear();
                    return (
                      <div key={month} style={{
                        width: `${MONTH_WIDTH}px`, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 600,
                        color: isCurrentMonth ? "#2563eb" : "#374151",
                        borderRight: "1px solid #e5e7eb",
                        backgroundColor: isCurrentMonth ? "#eff6ff" : "transparent",
                      }}>
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lignes des projets */}
              <div ref={rightPanelRef} onScroll={handleRightScroll} className="gantt-hide"
                style={{ overflowX: "auto", overflowY: "auto", maxHeight: "520px", scrollbarWidth: "none" } as React.CSSProperties}>
                <div style={{ width: `${totalWidth}px` }}>
                  {filteredProjects.map((project) => {
                    const allActivities = parseComments(project.comments);
                    const yearActivities = allActivities.filter((a) => a.date.getFullYear() === selectedYear);
                    const color = statusColors[project.status] || "#6b7280";

                    return (
                      <div key={project.id} style={{ height: `${ROW_HEIGHT}px`, position: "relative", borderBottom: "1px solid #f3f4f6", width: `${totalWidth}px` }}>

                        {/* Grille mois */}
                        {MONTHS_FR.map((_, month) => {
                          const isCurrentMonth = month === new Date().getMonth() && selectedYear === new Date().getFullYear();
                          return (
                            <div key={month} style={{
                              position: "absolute", top: 0, bottom: 0,
                              left: `${month * MONTH_WIDTH}px`,
                              width: `${MONTH_WIDTH}px`,
                              borderRight: "1px solid #f3f4f6",
                              backgroundColor: isCurrentMonth ? "rgba(239,246,255,0.5)" : "transparent",
                            }} />
                          );
                        })}

                        {/* Ligne de fond */}
                        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", backgroundColor: "#e5e7eb" }} />

                        {/* Ligne de connexion entre premier et dernier point */}
                        {yearActivities.length >= 2 && (() => {
                          const firstX = getX(yearActivities[0].date);
                          const lastX = getX(yearActivities[yearActivities.length - 1].date);
                          return (
                            <div style={{
                              position: "absolute", top: "50%", transform: "translateY(-50%)",
                              left: `${firstX}px`, width: `${lastX - firstX}px`,
                              height: "3px", backgroundColor: color, opacity: 0.35, zIndex: 1,
                            }} />
                          );
                        })()}

                        {/* Points d'activité */}
                        {yearActivities.map((activity, ai) => {
                          const x = getX(activity.date);
                          return (
                            <div
                              key={ai}
                              onMouseEnter={(e) => showTooltip(e, activity, project.name)}
                              onMouseLeave={hideTooltip}
                              onMouseMove={(e) => showTooltip(e, activity, project.name)}
                              style={{
                                position: "absolute",
                                top: "50%", left: `${x}px`,
                                transform: "translate(-50%, -50%)",
                                width: "12px", height: "12px",
                                borderRadius: "50%",
                                backgroundColor: color,
                                border: "2px solid white",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                                cursor: "pointer",
                                zIndex: 2,
                              }}
                            />
                          );
                        })}

                        {/* Aucune activité cette année */}
                        {yearActivities.length === 0 && (
                          <div style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", fontSize: "11px", color: "#d1d5db", fontStyle: "italic" }}>
                            Aucune activité en {selectedYear}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Légende */}
      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Légende :</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#374151", border: "2px solid white", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
          <span style={{ fontSize: "12px", color: "#6b7280" }}>Activité (survoler pour détails)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 24, height: 3, backgroundColor: "#6b7280", opacity: 0.35 }} />
          <span style={{ fontSize: "12px", color: "#6b7280" }}>Période d'activité</span>
        </div>
        {Object.entries(statusColors)
          .filter(([s]) => !EXCLUDED_STATUSES.includes(s))
          .map(([status, color]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>{status}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
