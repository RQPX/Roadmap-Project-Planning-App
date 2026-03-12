import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { AlertCircle, Activity, TrendingUp, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { statusColors } from "../../types/project";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { Alert, AlertDescription } from "../ui/alert";
import { formatProgressValue, isProjectDelayed } from "../../utils/formatProgress";

export default function DashboardOverview() {
  const { isDirecteur } = useAuth();
  const { projects, loading } = useProjects();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsLarge(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: "16px" }}>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const activeProjects = projects.filter(
    (p) => p.status === "En exécution" || p.status === "En production" || p.status === "En etude"
  ).length;

  const delayedProjects = projects.filter((p) => isProjectDelayed(p.endDate, p.status)).length;

  const averageProgress =
    projects.length > 0
      ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
      : 0;

  const averageProgressPercent = formatProgressValue(averageProgress);

  const statusDistribution = Object.entries(
    projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status as keyof typeof statusColors],
  }));

  const recentlyUpdated = [...projects]
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    .slice(0, 8);

  return (
    <div style={{ padding: isDesktop ? "24px" : "16px", maxWidth: "1600px", margin: "0 auto" }}>

      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: isDesktop ? "30px" : "22px", fontWeight: 600, color: "#111827" }}>
          Vue d'ensemble des Projets
        </h1>
      </div>

      {isDirecteur && (
        <div style={{ marginBottom: "16px" }}>
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              Vous êtes en mode lecture seule. Les statistiques affichées sont à jour mais vous ne pouvez pas modifier les données.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: "16px", marginBottom: "24px" }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Activity style={{ width: isDesktop ? 32 : 28, height: isDesktop ? 32 : 28, color: "#2563eb" }} />
              <div style={{ fontSize: isDesktop ? "36px" : "30px", fontWeight: 700, color: "#111827" }}>{activeProjects}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Projets en Retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <AlertCircle style={{ width: isDesktop ? 32 : 28, height: isDesktop ? 32 : 28, color: "#dc2626" }} />
              <div style={{ fontSize: isDesktop ? "36px" : "30px", fontWeight: 700, color: "#dc2626" }}>{delayedProjects}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Taux d'Avancement Moyen</CardTitle>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <TrendingUp style={{ width: isDesktop ? 32 : 28, height: isDesktop ? 32 : 28, color: "#16a34a" }} />
              <div style={{ fontSize: isDesktop ? "36px" : "30px", fontWeight: 700, color: "#111827" }}>{averageProgressPercent}%</div>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Graphique + Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isLarge ? "repeat(2, 1fr)" : "1fr", gap: "24px", marginBottom: "24px" }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: isDesktop ? "18px" : "16px" }}>Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
                  outerRadius={90}
                  dataKey="value"
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ fontSize: "12px" }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: isDesktop ? "18px" : "16px" }}>Statistiques Rapides</CardTitle>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>Total Projets</span>
              <span style={{ fontSize: "18px", fontWeight: 700 }}>{projects.length}</span>
            </div>
            {[
              { label: "En exécution",   status: "En exécution",                     color: "#F59E0B" },
              { label: "En étude",        status: "En etude",                         color: "#9333EA" },
              { label: "Non démarré",     status: "Non demarre",                      color: "#94A3B8" },
              { label: "En attente Go",   status: "En attente de Go pour production", color: "#86EFAC" },
              { label: "En production",   status: "En production",                    color: "#16A34A" },
              { label: "En service",      status: "En service",                       color: "#22C55E" },
              { label: "En pause",        status: "En pause",                         color: "#6B7280" },
              { label: "Clôturé",         status: "Cloturé",                          color: "#60A5FA" },
              { label: "Abandonné",       status: "Abandonne",                        color: "#DC2626" },
            ].map(({ label, status, color }) => {
              const count = projects.filter((p) => p.status === status).length;
              return (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", color: "#4b5563" }}>{label}</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: count === 0 ? "#d1d5db" : "#1f2937" }}>{count}</span>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "14px", color: "#4b5563" }}>En retard</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: delayedProjects > 0 ? "#dc2626" : "#d1d5db" }}>{delayedProjects}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: isDesktop ? "18px" : "16px" }}>Récemment Mis à Jour</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "500px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>Nom du Projet</th>
                  {isDesktop && <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>Département</th>}
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>Statut</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>Avancement</th>
                  {isDesktop && <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>Date Fin Prévue</th>}
                </tr>
              </thead>
              <tbody>
                {recentlyUpdated.map((project) => (
                  <tr key={project.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#111827", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.name}
                    </td>
                    {isDesktop && (
                      <td style={{ padding: "12px 16px" }}>
                        <Badge variant="outline" className="text-xs">{project.department}</Badge>
                      </td>
                    )}
                    <td style={{ padding: "12px 16px" }}>
                      <Badge style={{ backgroundColor: statusColors[project.status], color: "white", fontSize: "12px", whiteSpace: "nowrap" }}>
                        {project.status}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Progress value={formatProgressValue(project.progress)} className="h-2" style={{ width: isDesktop ? "96px" : "64px" }} />
                        <span style={{ fontSize: "12px", color: "#4b5563" }}>{formatProgressValue(project.progress)}%</span>
                      </div>
                    </td>
                    {isDesktop && (
                      <td style={{ padding: "12px 16px", fontSize: "14px", color: "#4b5563" }}>
                        {new Date(project.endDate).toLocaleDateString("fr-FR")}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
