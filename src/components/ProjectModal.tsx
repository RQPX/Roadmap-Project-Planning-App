import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Project, Status, Priority, Department } from "../types/project";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "./ui/badge";
import { formatProgressValue } from "../utils/formatProgress";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const departments: Department[] = ["DSI", "DAF", "RH", "DGP", "DDEV"];
const statuses: Status[] = [
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
const priorities: Priority[] = ["Basse", "Moyenne", "Haute"];

export function ProjectModal({
  isOpen,
  onClose,
  project,
  onSave,
  onDelete,
}: ProjectModalProps) {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    department: "DSI",
    status: "Non demarre",
    priority: "Moyenne",
    progress: 0,
    projectManager: "",
    partners: "",
    startDate: "",
    endDate: "",
    comments: "",
    isDelayed: false,
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        name: "",
        department: "DSI",
        status: "Non demarre",
        priority: "Moyenne",
        progress: 0,
        projectManager: "",
        partners: "",
        startDate: "",
        endDate: "",
        comments: "",
        isDelayed: false,
      });
    }
  }, [project, isOpen]);

  const handleSave = () => {
    if (formData.name && formData.projectManager) {
      onSave(formData as Project);
      toast.success(
        project ? "Projet mis à jour avec succès" : "Projet créé avec succès"
      );
    } else {
      toast.error("Veuillez remplir tous les champs requis");
    }
  };

  const handleDelete = () => {
    if (project && confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      onDelete(project.id);
      toast.success("Projet supprimé avec succès");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {isAdmin ? "Détails du Projet" : "Détails du Projet (Lecture seule)"}
            </DialogTitle>
            {!isAdmin && (
              <Badge variant="secondary" className="text-xs">
                Lecture seule
              </Badge>
            )}
          </div>
          <DialogDescription className="text-sm text-gray-500">
            {isAdmin
              ? "Ajoutez ou modifiez les détails du projet ici."
              : "Consultez les détails du projet. Vous ne pouvez pas modifier ces informations."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nom du Projet */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Projet</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Déploiement Serveurs Cloud"
              disabled={!isAdmin}
            />
          </div>

          {/* Département */}
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select
              value={formData.department}
              onValueChange={(value: Department) =>
                setFormData({ ...formData, department: value })
              }
              disabled={!isAdmin}
            >
              <SelectTrigger id="department">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Status) =>
                setFormData({ ...formData, status: value })
              }
              disabled={!isAdmin}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priorité */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Priority) =>
                setFormData({ ...formData, priority: value })
              }
              disabled={!isAdmin}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chef de Projet */}
          <div className="space-y-2">
            <Label htmlFor="projectManager">Chef de Projet</Label>
            <Input
              id="projectManager"
              value={formData.projectManager}
              onChange={(e) =>
                setFormData({ ...formData, projectManager: e.target.value })
              }
              placeholder="Ex: Sophie Martin"
              disabled={!isAdmin}
            />
          </div>

          {/* Partenaires / Équipe */}
          <div className="space-y-2">
            <Label htmlFor="partners">Partenaires / Équipe</Label>
            <Input
              id="partners"
              value={formData.partners}
              onChange={(e) =>
                setFormData({ ...formData, partners: e.target.value })
              }
              placeholder="Ex: Équipe Infrastructure, Microsoft"
              disabled={!isAdmin}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de Début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                disabled={!isAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de Fin Prévue</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                disabled={!isAdmin}
              />
            </div>
          </div>

          {/* Taux d'Avancement */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="progress">Taux d'Avancement</Label>
              <span className="text-sm font-medium">{formatProgressValue(formData.progress || 0)}%</span>
            </div>
            <Slider
              id="progress"
              value={[formatProgressValue(formData.progress || 0)]}
              onValueChange={([value]) =>
                setFormData({ ...formData, progress: value / 100 })
              }
              min={0}
              max={100}
              step={5}
              disabled={!isAdmin}
            />
          </div>

          {/* Commentaires */}
          <div className="space-y-2">
            <Label htmlFor="comments">Commentaires et Mises à jour</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Ajoutez des notes, commentaires ou mises à jour..."
              rows={4}
              disabled={!isAdmin}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {isAdmin && project && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Supprimer le projet
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              {isAdmin ? "Annuler" : "Fermer"}
            </Button>
            {isAdmin && (
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enregistrer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}