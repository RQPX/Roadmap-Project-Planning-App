import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Status, Department, statusColors } from "../../types/project";
import { ScrollArea } from "../ui/scroll-area";
import { useProjects } from "../../contexts/ProjectsContext";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { Info } from "lucide-react";

export default function TimelineGantt() {
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { projects, loading } = useProjects();
  const { isDirecteur } = useAuth();

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

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const deptMatch =
      filterDepartment === "all" || project.department === filterDepartment;
    const statusMatch =
      filterStatus === "all" || project.status === filterStatus;
    return deptMatch && statusMatch;
  });

  // Group by department
  const projectsByDept = filteredProjects.reduce((acc, project) => {
    if (!acc[project.department]) {
      acc[project.department] = [];
    }
    acc[project.department].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  // Calculate position on timeline
  const getProjectPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timelineStart = new Date("2026-01-01");
    const timelineEnd = new Date("2026-04-30");

    const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
    const projectStart = start.getTime() - timelineStart.getTime();
    const projectDuration = end.getTime() - start.getTime();

    const left = Math.max(0, (projectStart / totalDuration) * 100);
    const width = Math.min(
      100 - left,
      (projectDuration / totalDuration) * 100
    );

    return { left: `${left}%`, width: `${width}%` };
  };

  // Generate week markers for timeline header
  const weeks: Date[] = [];
  const startWeek = new Date("2026-01-01");
  const endWeek = new Date("2026-04-30");
  for (let d = new Date(startWeek); d <= endWeek; d.setDate(d.getDate() + 7)) {
    weeks.push(new Date(d));
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Filters */}
      <div className="max-w-[1600px] mx-auto space-y-4">
        <h1 className="text-3xl font-semibold text-gray-900">
          Chronogramme Global
        </h1>

        {/* Viewer Alert */}
        {!isDirecteur && (
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
              <SelectTrigger>
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="DSI">DSI</SelectItem>
                <SelectItem value="DAF">DAF</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="DGP">DGP</SelectItem>
                <SelectItem value="DDEV">DDEV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-64">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Non démarré">Non démarré</SelectItem>
                <SelectItem value="En étude">En étude</SelectItem>
                <SelectItem value="En exécution">En exécution</SelectItem>
                <SelectItem value="En attente de Go pour production">
                  En attente de Go pour production
                </SelectItem>
                <SelectItem value="En production">En production</SelectItem>
                <SelectItem value="En service">En service</SelectItem>
                <SelectItem value="En pause">En pause</SelectItem>
                <SelectItem value="Clôturé">Clôturé</SelectItem>
                <SelectItem value="Abandonné">Abandonné</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <Card className="max-w-[1600px] mx-auto">
        <CardHeader>
          <CardTitle>Vue Chronologique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            {/* Left Panel - Project Names */}
            <div className="w-80 flex-shrink-0 border-r border-gray-200">
              <div className="h-12 border-b border-gray-200 flex items-center px-4 bg-gray-50 font-medium text-sm">
                Projets
              </div>
              <ScrollArea className="h-[600px]">
                {Object.entries(projectsByDept).map(([dept, projects]) => (
                  <div key={dept}>
                    <div className="bg-blue-50 px-4 py-2 font-medium text-sm text-blue-900 sticky top-0">
                      {dept}
                    </div>
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="text-sm font-medium text-gray-900 leading-tight">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {project.projectManager}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Right Panel - Timeline */}
            <div className="flex-1 overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Timeline Header */}
                <div className="h-12 border-b border-gray-200 flex bg-gray-50">
                  {weeks.map((week, index) => (
                    <div
                      key={index}
                      className="flex-1 border-r border-gray-200 px-2 py-2 text-xs text-center"
                    >
                      <div className="font-medium">
                        {week.toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline Bars */}
                <ScrollArea className="h-[600px]">
                  <div className="relative">
                    {Object.entries(projectsByDept).map(([dept, projects]) => (
                      <div key={dept}>
                        <div className="h-8 bg-blue-50 border-b border-gray-100" />
                        {projects.map((project) => (
                          <div
                            key={project.id}
                            className="h-[52px] border-b border-gray-100 relative"
                          >
                            {/* Grid lines */}
                            {weeks.map((_, index) => (
                              <div
                                key={index}
                                className="absolute border-r border-gray-200 h-full"
                                style={{
                                  left: `${(index / weeks.length) * 100}%`,
                                }}
                              />
                            ))}

                            {/* Project bar */}
                            <div
                              className="absolute top-2 h-8 rounded px-2 flex items-center shadow-sm"
                              style={{
                                ...getProjectPosition(
                                  project.startDate,
                                  project.endDate
                                ),
                                backgroundColor: statusColors[project.status],
                              }}
                            >
                              <span className="text-xs text-white font-medium truncate">
                                {project.progress}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}