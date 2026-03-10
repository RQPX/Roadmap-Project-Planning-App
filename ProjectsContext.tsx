import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Project } from "../types/project";
import * as airtableService from "../services/airtable";
import { toast } from "sonner@2.0.3";
import { mockProjects } from "../data/mockProjects";

/**
 * PROJECTS DATA CONTEXT
 * 
 * Manages project data from Airtable with CRUD operations.
 * Falls back to mock data if Airtable is not configured.
 */

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
  refreshProjects: () => Promise<void>;
  createProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if Airtable is configured
      if (airtableService.isAirtableConfigured()) {
        const data = await airtableService.fetchProjects();
        setProjects(data);
        setUsingMockData(false);
        console.log(`✅ ${data.length} projets chargés depuis Airtable`);
      } else {
        // Use mock data as fallback
        setProjects(mockProjects);
        setUsingMockData(true);
        console.warn("⚠️ Airtable non configuré. Utilisation des données de test.");
        toast.warning("Mode démonstration", {
          description: "Configurez Airtable pour utiliser vos données réelles",
        });
      }
    } catch (err) {
      console.error("Erreur lors du chargement des projets:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      
      // Fallback to mock data on error
      setProjects(mockProjects);
      setUsingMockData(true);
      
      toast.error("Erreur de chargement", {
        description: "Impossible de charger les projets depuis Airtable. Mode démonstration activé.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProjectHandler = async (project: Omit<Project, "id">) => {
    try {
      if (usingMockData) {
        // Mock creation
        const newProject: Project = {
          ...project,
          id: `mock-${Date.now()}`,
        };
        setProjects((prev) => [newProject, ...prev]);
        toast.success("Projet créé (mode test)");
      } else {
        const newProject = await airtableService.createProject(project);
        setProjects((prev) => [newProject, ...prev]);
        toast.success("Projet créé avec succès");
      }
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : "Impossible de créer le projet",
      });
      throw err;
    }
  };

  const updateProjectHandler = async (id: string, updates: Partial<Omit<Project, "id">>) => {
    try {
      if (usingMockData) {
        // Mock update
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
        toast.success("Projet mis à jour (mode test)");
      } else {
        const updatedProject = await airtableService.updateProject(id, updates);
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? updatedProject : p))
        );
        toast.success("Projet mis à jour avec succès");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : "Impossible de mettre à jour le projet",
      });
      throw err;
    }
  };

  const deleteProjectHandler = async (id: string) => {
    try {
      if (usingMockData) {
        // Mock deletion
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success("Projet supprimé (mode test)");
      } else {
        await airtableService.deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success("Projet supprimé avec succès");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : "Impossible de supprimer le projet",
      });
      throw err;
    }
  };

  const value: ProjectsContextType = {
    projects,
    loading,
    error,
    usingMockData,
    refreshProjects: loadProjects,
    createProject: createProjectHandler,
    updateProject: updateProjectHandler,
    deleteProject: deleteProjectHandler,
  };

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects doit être utilisé dans un ProjectsProvider");
  }
  return context;
}
