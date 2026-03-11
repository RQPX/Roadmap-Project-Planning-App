import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { AlertCircle, Activity, TrendingUp, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { statusColors } from "../../types/project";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { Alert, AlertDescription } from "../ui/alert";
import { formatProgress, formatProgressValue, isProjectDelayed } from "../../utils/formatProgress";

export default function DashboardOverview() {
  const { isAdmin, isDirecteur } = useAuth();
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const activeProjects = projects.filter(
    (p) =>
      p.status === "En exécution" ||
      p.status === "En production" ||
      p.status === "En etude"
  ).length;

  const delayedProjects = projects.filter((p) => isProjectDelayed(p.endDate, p.status)).length;

  const averageProgress =
    projects.length > 0
      ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
      : 0;

  // Convert average progress to percentage if needed
  const averageProgressPercent = formatProgressValue(averageProgress);

  // Calculate status distribution for pie chart
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

  // Get recently updated projects
  const recentlyUpdated = [...projects]
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    .slice(0, 8);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Vue d'ensemble des Projets
        </h1>
      </div>

      {/* Directeur Alert */}
      {isDirecteur && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Vous êtes en mode lecture seule. Les statistiques affichées sont à jour mais vous ne pouvez pas modifier les données.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Projets Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="text-4xl font-bold text-gray-900">
                {activeProjects}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Projets en Retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="text-4xl font-bold text-red-600">
                {delayedProjects}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux d'Avancement Moyen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="text-4xl font-bold text-gray-900">
                {averageProgressPercent}%
              </div>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Chart and Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}`
                  }
                  outerRadius={100}
                  fill="#8884d8"
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
                  formatter={(value) => (
                    <span className="text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Projets</span>
                <span className="text-lg font-semibold">{projects.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En Exécution</span>
                <span className="text-lg font-semibold">
                  {projects.filter((p) => p.status === "En exécution").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En Production</span>
                <span className="text-lg font-semibold">
                  {projects.filter((p) => p.status === "En production").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En Service</span>
                <span className="text-lg font-semibold">
                  {projects.filter((p) => p.status === "En service").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clôturés</span>
                <span className="text-lg font-semibold">
                  {projects.filter((p) => p.status === "Cloturé").length}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-sm text-gray-600">Départements Actifs</span>
                <span className="text-lg font-semibold">5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Updated Table */}
      <Card>
        <CardHeader>
          <CardTitle>Récemment Mis à Jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Nom du Projet
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Département
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Avancement
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Date de Fin Prévue
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentlyUpdated.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {project.department}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        style={{
                          backgroundColor: statusColors[project.status],
                          color: "white",
                        }}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={formatProgressValue(project.progress)} className="h-2 w-24" />
                        <span className="text-xs text-gray-600">{formatProgressValue(project.progress)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
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