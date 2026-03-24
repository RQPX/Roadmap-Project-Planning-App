import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { statusColors } from "../../types/project";
import { useProjects } from "../../contexts/ProjectsContext";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { Info } from "lucide-react";
import { formatProgressValue } from "../../utils/formatProgress";

const ROW_HEIGHT = 44;
const MONTH_WIDTH = 120;
const NAME_WIDTH = 260;

const EXCLUDED_STATUSES = ["Cloturé", "Abandonne"];

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function parseComments(comments: string | null | undefined): { date: Date; text: string }[] {
  if (!comments) return [];
  const results: { date: Date; text: string }[] = [];
  // Regex: matches DD-MM-YYYY at start of each entry
  const regex = /(\d{2}-\d{2}-\d{4})\s+([^0-9\-][^\d\-]*(?:\d(?!\d{1}-\d{2}-\d{4})[^\d\-]*)*)/g;
  // Split by date pattern
  const parts = comments.split(/(?=\d{2}-\d{2}-\d{4})/);
  for (const part of parts) {
    const match = part.match(/^(\d{2})-(\d{2})-(\d{4})\s*(.*)/s);
    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const year = parseInt(match[3]);
      const text = match[4].trim().replace(/\s+/g, " ");
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && text) {
        results.push({ date, text });
      }
    }
  }
  return results.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function TimelineGantt() {
  const { projects, loading } = useProjects();
  const { isDirecteur } = useAuth();
  const [filterDirection, setFilterDirection] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleRightScroll = () => {
    if (headerRef.current && rightPanelRef.current)
      headerRef.current.scrollLeft = rightPanelRef.current.scrollLeft;
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
    activeProjects.forEach((p) => {
      const entries = parseComments(p.comments);
      entries.forEach((e) => years.add(e.date.getFullYear()));
    });
    years.add(new Date().getFullYear());
    return Array.from(years).sort();
  }, [activeProjects]);

  const filteredProjects = useMemo(() =>
    filterDirection === "all"
      ? activeProjects
      : activeProjects.filter((p) => p.department === filterDirection),
    [activeProjects, filterDirection]
  );

  // Months for selected year: Jan–Dec
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i, year: selectedYear }));
  const totalWidth = months.length * MONTH_WIDTH;

  const getActivityLeft = (date: Date): number => {
    const dayOfYear = Math.floor((date.getTime() - new Date(selectedYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    const daysInYear = 365;
    return (dayOfYear / daysInYear) * totalWidth;
  };

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
    <div style={{ padding: "16px", maxWidth: "1600px", margin: "0 auto" }}>
      <style>{`.gantt-hide::-webkit-scrollbar{display:none}`}</style>

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

        {/* Sélecteur d'année */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Année :</span>
          {availableYears.map((year) => (
            <button key={year} onClick={() => setSelectedYear(year)}
              style={{ padding: "4px 14px", borderRadius: "9999px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: selectedYear === year ? "#2563eb" : "#d1d5db", backgroundColor: selectedYear === year ? "#2563eb" : "white", color: selectedYear === year ? "white" : "#374151" }}>
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
              ({filteredProjects.length} projets actifs)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ display: "flex", borderTop: "1px solid #e5e7eb" }}>

            {/* Panneau gauche — noms */}
            <div style={{ flexShrink: 0, width: `${NAME_WIDTH}px`, borderRight: "1px solid #e5e7eb" }}>
              {/* Header */}
              <div style={{ height: "48px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                Projets
              </div>
              {filteredProjects.map((project) => (
                <div key={project.id} style={{ height: `${ROW_HEIGHT}px`, padding: "0 12px", borderBottom: "1px solid #f3f4f6", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={project.name}>
                    {project.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: statusColors[project.status] || "#9ca3af", flexShrink: 0 }} />
                    <span style={{ fontSize: "10px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.department} · {formatProgressValue(project.progress)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Panneau droit — timeline */}
            <div style={{ flex: 1, overflow: "hidden" }}>

              {/* En-tête mois */}
              <div ref={headerRef} className="gantt-hide" style={{ overflowX: "hidden", height: "48px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ width: `${totalWidth}px`, display: "flex", height: "100%" }}>
                  {months.map(({ month }) => (
                    <div key={month} style={{ width: `${MONTH_WIDTH}px`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: month === new Date().getMonth() && selectedYear === new Date().getFullYear() ? "#2563eb" : "#374151", borderRight: "1px solid #e5e7eb", backgroundColor: month === new Date().getMonth() && selectedYear === new Date().getFullYear() ? "#eff6ff" : "transparent" }}>
                      {MONTHS_FR[month]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lignes des projets */}
              <div ref={rightPanelRef} onScroll={handleRightScroll} className="gantt-hide"
                style={{ overflowX: "auto", overflowY: "auto", maxHeight: "520px", scrollbarWidth: "none" } as React.CSSProperties}>
                <div style={{ width: `${totalWidth}px` }}>
                  {filteredProjects.map((project) => {
                    const activities = parseComments(project.comments).filter(
                      (a) => a.date.getFullYear() === selectedYear
                    );
                    return (
                      <div key={project.id} style={{ height: `${ROW_HEIGHT}px`, position: "relative", borderBottom: "1px solid #f3f4f6", width: `${totalWidth}px` }}>

                        {/* Grille verticale par mois */}
                        {months.map(({ month }) => (
                          <div key={month} style={{ position: "absolute", top: 0, bottom: 0, left: `${month * MONTH_WIDTH}px`, borderRight: "1px solid #f3f4f6", width: `${MONTH_WIDTH}px` }} />
                        ))}

                        {/* Ligne horizontale de fond */}
                        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", backgroundColor: "#f3f4f6" }} />

                        {/* Marqueurs d'activité */}
                        {activities.map((activity, ai) => {
                          const left = getActivityLeft(activity.date);
                          const color = statusColors[project.status] || "#6b7280";
                          return (
                            <div key={ai} title={`${activity.date.toLocaleDateString("fr-FR")} — ${activity.text}`}
                              style={{ position: "absolute", top: "50%", left: `${left}px`, transform: "translate(-50%, -50%)", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: color, border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", cursor: "pointer", zIndex: 2, flexShrink: 0 }}
                            />
                          );
                        })}

                        {/* Ligne de progression entre premier et dernier marqueur */}
                        {activities.length >= 2 && (() => {
                          const first = getActivityLeft(activities[0].date);
                          const last = getActivityLeft(activities[activities.length - 1].date);
                          const color = statusColors[project.status] || "#6b7280";
                          return (
                            <div style={{ position: "absolute", top: "50%", left: `${first}px`, width: `${last - first}px`, height: "3px", backgroundColor: color, opacity: 0.4, transform: "translateY(-50%)", zIndex: 1 }} />
                          );
                        })()}

                        {/* Message si aucune activité cette année */}
                        {activities.length === 0 && (
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
        <span style={{ fontSize: "12px", color: "#6b7280" }}>Légende :</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#374151", border: "2px solid white", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
          <span style={{ fontSize: "12px", color: "#6b7280" }}>Activité (survoler pour détails)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 24, height: 3, backgroundColor: "#6b7280", opacity: 0.4 }} />
          <span style={{ fontSize: "12px", color: "#6b7280" }}>Période d'activité</span>
        </div>
        {Object.entries(statusColors).filter(([s]) => !EXCLUDED_STATUSES.includes(s)).slice(0, 5).map(([status, color]) => (
          <div key={status} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
            <span style={{ fontSize: "11px", color: "#6b7280" }}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
