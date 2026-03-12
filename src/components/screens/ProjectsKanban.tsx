import { useState, useEffect } from "react";
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

export default function ProjectsKanban() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { isAdmin } = useAuth();
  const [activeStatusIndex, setActiveStatusIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => { setCurrentPage(0); }, [activeStatusIndex]);

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

  const activeStatus = allStatuses[activeStatusIndex];
  const filteredProjects = projects.filter((p) => p.status === activeStatus);
  const totalPages = Math.ceil(filteredProjects.length / CARDS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  );

  return (
    <div style={{ padding: "16px", maxWidth: "1600px", margin: "0 auto" }}>

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* En-tête */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827" }}>Gestion des Projets</h1>
        {isAdmin && (
          <Button onClick={handleAddProject} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
              Ajouter un Nouveau Projet
          </Button>
        )}
      </div>

      {/* Bandeau lecture seule */}
      {!isAdmin && (
        <div style={{ marginBottom: "16px" }}>
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              Vous êtes en mode lecture seule.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Onglets de statut — scroll horizontal sans barre visible */}
      <div
        className="hide-scrollbar"
        style={{
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties}
      >
        <div style={{ display: "flex", gap: "8px", minWidth: "max-content" }}>
          {allStatuses.map((status, index) => {
            const count = projects.filter((p) => p.status === status).length;
            const isActive = activeStatusIndex === index;
            return (
              <button
                key={status}
                onClick={() => setActiveStatusIndex(index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: isActive ? "#2563eb" : "#f3f4f6",
                  color: isActive ? "white" : "#374151",
                  transition: "background-color 0.15s",
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: isActive ? "white" : statusColors[status],
                  flexShrink: 0,
                }} />
                <span>{status}({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* En-tête de la colonne active */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: statusColors[activeStatus] }} />
        <span style={{ fontWeight: 600, color: "#111827" }}>{activeStatus}</span>
        <span style={{ fontSize: "14px", color: "#6b7280", marginLeft: "4px" }}>{filteredProjects.length}</span>
      </div>

      {/* Liste des cartes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {paginatedProjects.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>Aucun projet dans ce statut</p>
        ) : (
          paginatedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleEditProject(project)}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h4 style={{ fontWeight: 500, color: "#111827", fontSize: "14px", lineHeight: 1.4 }}>{project.name}</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  <Badge variant="outline" className="text-xs font-normal">{project.department}</Badge>
                  <Badge style={{ backgroundColor: priorityColors[project.priority], color: "white" }} className="text-xs">
                    {project.priority}
                  </Badge>
                  {isProjectDelayed(project.endDate, project.status) && (
                    <Badge className="bg-red-600 text-white text-xs">RETARD</Badge>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4b5563" }}>
                  <span>Avancement</span>
                  <span style={{ fontWeight: 500 }}>{formatProgressValue(project.progress)}%</span>
                </div>
                <Progress value={formatProgressValue(project.progress)} className="h-1.5" />
              </div>
              <div style={{ fontSize: "12px", color: "#4b5563" }}>
                <span style={{ fontWeight: 500 }}>Chef de projet:</span> {project.projectManager}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              padding: "6px", borderRadius: "6px", border: "none", background: "none",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              opacity: currentPage === 0 ? 0.3 : 1,
            }}
          >
            <ChevronLeft style={{ width: 18, height: 18, color: "#374151" }} />
          </button>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>{currentPage + 1} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            style={{
              padding: "6px", borderRadius: "6px", border: "none", background: "none",
              cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages - 1 ? 0.3 : 1,
            }}
          >
            <ChevronRight style={{ width: 18, height: 18, color: "#374151" }} />
          </button>
        </div>
      )}

      {/* Modal */}
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
