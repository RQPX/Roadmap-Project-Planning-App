import { useState } from "react";
import { Plus, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Project, Status, statusColors, priorityColors } from "../../types/project";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ProjectModal } from "../ProjectModal";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardHeader, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { Alert, AlertDescription } from "../ui/alert";
import { formatProgressValue } from "../../utils/formatProgress";
import { toast } from "sonner@2.0.3";

const allStatuses: Status[] = [
  "Non demarre",
  "En etude",
  "En exécution",
  "En attente de Go pour production",
  "En production",
  "En service",
  "En pause",
  "Cloturé",
  "Abandonne",
];

export default function ProjectsKanban() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { isAdmin, isDirecteur } = useAuth();

  const handleAddProject = () => {
    if (!isAdmin) {
      toast.error("Vous n'avez pas les permissions pour ajouter un projet");
      return;
    }
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (project: Project) => {
    if (!isAdmin) {
      toast.error("Vous n'avez pas les permissions pour modifier un projet");
      return;
    }
    
    try {
      if (selectedProject) {
        // Update existing project
        await updateProject(project.id, project);
      } else {
        // Add new project
        const { id, ...projectData } = project;
        await createProject(projectData);
      }
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      // Error already handled by ProjectsContext
      console.error(error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!isAdmin) {
      toast.error("Vous n'avez pas les permissions pour supprimer un projet");
      return;
    }
    try {
      await deleteProject(projectId);
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      // Error already handled by ProjectsContext
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900">
          Gestion des Projets
        </h1>
        {isAdmin && (
          <Button
            onClick={handleAddProject}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Nouveau Projet
          </Button>
        )}
      </div>

      {/* Viewer Alert */}
      {!isAdmin && (
        <div className="max-w-[1600px] mx-auto">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Vous êtes en mode lecture seule. Vous pouvez consulter tous les projets mais ne pouvez pas les modifier ou les supprimer.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Kanban Board */}
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-max px-6">
          {allStatuses.map((status) => {
            const statusProjects = projects.filter((p) => p.status === status);
            return (
              <div
                key={status}
                className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: statusColors[status] }}
                    />
                    <h3 className="font-semibold text-gray-900">{status}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {statusProjects.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {statusProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleEditProject(project)}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-3"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {project.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {project.department}
                          </Badge>
                          <Badge
                            style={{
                              backgroundColor: priorityColors[project.priority],
                              color: "white",
                            }}
                            className="text-xs"
                          >
                            {project.priority}
                          </Badge>
                          {project.isDelayed && (
                            <Badge className="bg-red-600 text-white text-xs">
                              RETARD
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Avancement</span>
                          <span className="font-medium">{formatProgressValue(project.progress)}%</span>
                        </div>
                        <Progress value={formatProgressValue(project.progress)} className="h-1.5" />
                      </div>

                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Chef de projet:</span>{" "}
                        {project.projectManager}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}