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

  // Skeleton de chargement pendant la récupération des données Airtable
  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calcul des KPIs
  const activeProjects = projects.filter(
    (p) => p.status === "En exécution" || p.status === "En production" || p.status === "En etude"
  ).length;

  const delayedProjects = projects.filter((p) => isProjectDelayed(p.endDate, p.status)).length;

  const averageProgress =
    projects.length > 0
      ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
      : 0;

  const averageProgressPercent = formatProgressValue(averageProgress);

  // Données pour le graphique camembert
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

  // 8 projets les plus récents (triés par date de fin)
  const recentlyUpdated = [...projects]
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    .slice(0, 8);

  return (
    // padding réduit sur mobile (p-4), normal sur desktop (md:p-6)
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-4 md:space-y-6">

      {/* Titre */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Vue d'ensemble des Projets
        </h1>
      </div>

      {/* Bandeau lecture seule pour les directeurs */}
      {isDirecteur && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 text-sm">
            Vous êtes en mode lecture seule. Les statistiques affichées sont à jour mais vous ne pouvez pas modifier les données.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards : 1 colonne sur mobile, 3 sur desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Activity className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{activeProjects}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Projets en Retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-7 w-7 md:h-8 md:w-8 text-red-600" />
              <div className="text-3xl md:text-4xl font-bold text-red-600">{delayedProjects}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Taux d'Avancement Moyen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{averageProgressPercent}%</div>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Graphique + Statistiques : empilés sur mobile, côte à côte sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* Camembert répartition par statut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Hauteur réduite sur mobile */}
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) =>
                    percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                  outerRadius={90}
                  dataKey="value"
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Statistiques rapides avec tous les statuts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Statistiques Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-semibold text-gray-700">Total Projets</span>
              <span className="text-lg font-bold">{projects.length}</span>
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
                <div key={status} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                  <span className={`text-sm font-semibold ${count === 0 ? "text-gray-300" : "text-gray-800"}`}>
                    {count}
                  </span>
                </div>
              );
            })}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-gray-600">En retard</span>
              <span className={`text-sm font-semibold ${delayedProjects > 0 ? "text-red-600" : "text-gray-300"}`}>
                {delayedProjects}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau récemment mis à jour — scroll horizontal sur mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Récemment Mis à Jour</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nom du Projet</th>
                  {/* Colonnes masquées sur très petits écrans */}
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 hidden sm:table-cell">Département</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Avancement</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 hidden md:table-cell">Date Fin Prévue</th>
                </tr>
              </thead>
              <tbody>
                {recentlyUpdated.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 max-w-[180px] truncate">
                      {project.name}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{project.department}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        style={{ backgroundColor: statusColors[project.status], color: "white" }}
                        className="text-xs whitespace-nowrap"
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={formatProgressValue(project.progress)} className="h-2 w-16 md:w-24" />
                        <span className="text-xs text-gray-600">{formatProgressValue(project.progress)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">
                      {new Date(project.endDate).toLocaleDateString("fr-FR")}
                    </td>
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
