import { useState } from "react";
import { Plus, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Project, Status, statusColors, priorityColors } from "../../types/project";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ProjectModal } from "../ProjectModal";
import { Card, CardHeader, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { Alert, AlertDescription } from "../ui/alert";
import { formatProgressValue, isProjectDelayed } from "../../utils/formatProgress";
import { toast } from "sonner@2.0.3";

// Nombre de cartes affichées par page dans chaque colonne
const CARDS_PER_PAGE = 5;

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

// Composant de pagination pour chaque colonne du Kanban
function ColumnPagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  // N'afficher la pagination que s'il y a plus d'une page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        disabled={currentPage === 0}
        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </button>
      <span className="text-xs text-gray-500">
        {currentPage + 1} / {totalPages}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        disabled={currentPage === totalPages - 1}
        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}

export default function ProjectsKanban() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { isAdmin } = useAuth();

  // État de pagination : un numéro de page par colonne (clé = statut)
  const [columnPages, setColumnPages] = useState<Record<string, number>>({});

  // Retourne le numéro de page courant pour un statut donné (0 par défaut)
  const getPage = (status: string) => columnPages[status] ?? 0;

  // Avancer d'une page dans une colonne
  const nextPage = (status: string) => {
    setColumnPages((prev) => ({ ...prev, [status]: (prev[status] ?? 0) + 1 }));
  };

  // Reculer d'une page dans une colonne
  const prevPage = (status: string) => {
    setColumnPages((prev) => ({ ...prev, [status]: Math.max(0, (prev[status] ?? 0) - 1) }));
  };

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
        // Mise à jour d'un projet existant
        await updateProject(project.id, project);
      } else {
        // Création d'un nouveau projet
        const { id, ...projectData } = project;
        await createProject(projectData);
      }
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
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
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec titre et bouton d'ajout */}
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

      {/* Bandeau informatif pour les directeurs en lecture seule */}
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

      {/* Tableau Kanban : scroll horizontal pour voir toutes les colonnes */}
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-max px-6">
          {allStatuses.map((status) => {
            // Tous les projets de cette colonne
            const statusProjects = projects.filter((p) => p.status === status);

            // Calcul de la pagination pour cette colonne
            const totalPages = Math.ceil(statusProjects.length / CARDS_PER_PAGE);
            const currentPage = getPage(status);

            // Extraire uniquement les projets de la page courante
            const paginatedProjects = statusProjects.slice(
              currentPage * CARDS_PER_PAGE,
              (currentPage + 1) * CARDS_PER_PAGE
            );

            return (
              <div
                key={status}
                className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 flex flex-col"
              >
                {/* En-tête de la colonne : couleur, nom du statut, compteur total */}
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

                {/* Liste des cartes projets (page courante uniquement) */}
                <div className="space-y-3 flex-1">
                  {paginatedProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleEditProject(project)}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-3"
                    >
                      {/* Nom du projet + badges département, priorité, retard */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {project.name}
                        </h4>
                        <div className="flex items-center flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs font-normal">
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
                          {/* Badge RETARD automatique : date de fin dépassée et statut non clôturé */}
                          {isProjectDelayed(project.endDate, project.status) && (
                            <Badge className="bg-red-600 text-white text-xs">
                              RETARD
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Avancement</span>
                          <span className="font-medium">{formatProgressValue(project.progress)}%</span>
                        </div>
                        <Progress value={formatProgressValue(project.progress)} className="h-1.5" />
                      </div>

                      {/* Chef de projet */}
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Chef de projet:</span>{" "}
                        {project.projectManager}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination en bas de chaque colonne (masquée si <= 5 projets) */}
                <ColumnPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrev={() => prevPage(status)}
                  onNext={() => nextPage(status)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de création / édition / suppression de projet */}
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
