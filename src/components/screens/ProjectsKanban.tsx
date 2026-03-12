import { useState } from "react";
import { Plus, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Project, Status, statusColors, priorityColors } from "../../types/project";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ProjectModal } from "../ProjectModal";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { Alert, AlertDescription } from "../ui/alert";
import { formatProgressValue, isProjectDelayed } from "../../utils/formatProgress";
import { toast } from "sonner@2.0.3";

// Nombre de cartes par page dans chaque colonne
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

// Composant pagination affiché en bas de chaque colonne
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
      <span className="text-xs text-gray-500">{currentPage + 1} / {totalPages}</span>
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

  // Pagination par colonne
  const [columnPages, setColumnPages] = useState<Record<string, number>>({});
  const getPage = (status: string) => columnPages[status] ?? 0;
  const nextPage = (status: string) =>
    setColumnPages((prev) => ({ ...prev, [status]: (prev[status] ?? 0) + 1 }));
  const prevPage = (status: string) =>
    setColumnPages((prev) => ({ ...prev, [status]: Math.max(0, (prev[status] ?? 0) - 1) }));

  // Filtre par statut actif — utilisé sur mobile pour naviguer entre colonnes
  const [activeStatusIndex, setActiveStatusIndex] = useState(0);

  const handleAddProject = () => {
    if (!isAdmin) { toast.error("Permissions insuffisantes"); return; }
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (project: Project) => {
    if (!isAdmin) { toast.error("Permissions insuffisantes"); return; }
    try {
      if (selectedProject) {
        await updateProject(project.id, project);
      } else {
        const { id, ...projectData } = project;
        await createProject(projectData);
      }
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) { console.error(error); }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!isAdmin) { toast.error("Permissions insuffisantes"); return; }
    try {
      await deleteProject(projectId);
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) { console.error(error); }
  };

  // Composant carte projet réutilisable
  const ProjectCard = ({ project }: { project: Project }) => (
    <div
      onClick={() => handleEditProject(project)}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-3"
    >
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">{project.name}</h4>
        <div className="flex items-center flex-wrap gap-1">
          <Badge variant="outline" className="text-xs font-normal">{project.department}</Badge>
          <Badge style={{ backgroundColor: priorityColors[project.priority], color: "white" }} className="text-xs">
            {project.priority}
          </Badge>
          {/* Badge RETARD automatique si date dépassée et projet non clôturé */}
          {isProjectDelayed(project.endDate, project.status) && (
            <Badge className="bg-red-600 text-white text-xs">RETARD</Badge>
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
        <span className="font-medium">Chef de projet:</span> {project.projectManager}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Gestion des Projets</h1>
        {isAdmin && (
          <Button onClick={handleAddProject} size="sm" className="bg-blue-600 hover:bg-blue-700 md:size-lg">
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Ajouter un Nouveau Projet</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        )}
      </div>

      {/* Bandeau lecture seule */}
      {!isAdmin && (
        <div className="max-w-[1600px] mx-auto">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              Vous êtes en mode lecture seule.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* =============================================
          VUE MOBILE : une colonne à la fois avec navigation par onglets
          Masquée sur desktop (md:hidden)
      ============================================= */}
      <div className="md:hidden">
        {/* Sélecteur de statut mobile : scroll horizontal d'onglets */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {allStatuses.map((status, index) => {
              const count = projects.filter((p) => p.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setActiveStatusIndex(index)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeStatusIndex === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: activeStatusIndex === index ? "white" : statusColors[status] }}
                  />
                  <span>{status}</span>
                  <span className={`ml-1 ${activeStatusIndex === index ? "text-blue-200" : "text-gray-400"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Colonne active sur mobile */}
        {(() => {
          const status = allStatuses[activeStatusIndex];
          const statusProjects = projects.filter((p) => p.status === status);
          const totalPages = Math.ceil(statusProjects.length / CARDS_PER_PAGE);
          const currentPage = getPage(status);
          const paginatedProjects = statusProjects.slice(
            currentPage * CARDS_PER_PAGE,
            (currentPage + 1) * CARDS_PER_PAGE
          );
          return (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[status] }} />
                  <h3 className="font-semibold text-gray-900 text-sm">{status}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">{statusProjects.length}</Badge>
              </div>
              <div className="space-y-3">
                {paginatedProjects.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-4">Aucun projet</p>
                ) : (
                  paginatedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                )}
              </div>
              <ColumnPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => prevPage(status)}
                onNext={() => nextPage(status)}
              />
            </div>
          );
        })()}
      </div>

      {/* =============================================
          VUE DESKTOP : toutes les colonnes en scroll horizontal
          Masquée sur mobile (hidden md:block)
      ============================================= */}
      <div className="hidden md:block w-full overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-max px-2">
          {allStatuses.map((status) => {
            const statusProjects = projects.filter((p) => p.status === status);
            const totalPages = Math.ceil(statusProjects.length / CARDS_PER_PAGE);
            const currentPage = getPage(status);
            const paginatedProjects = statusProjects.slice(
              currentPage * CARDS_PER_PAGE,
              (currentPage + 1) * CARDS_PER_PAGE
            );
            return (
              <div key={status} className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[status] }} />
                    <h3 className="font-semibold text-gray-900">{status}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">{statusProjects.length}</Badge>
                </div>
                <div className="space-y-3 flex-1">
                  {paginatedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
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

      {/* Modal création / édition */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProject(null); }}
        project={selectedProject}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}
