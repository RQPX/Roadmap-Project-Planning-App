import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Project, Status, Priority } from "../types/project";
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

const statuses: Status[] = [
  "Non demarre", "En etude", "En exécution",
  "En attente de Go pour production", "En production",
  "En service", "En pause", "Cloturé", "Abandonne",
];
const priorities: Priority[] = ["Basse", "Moyenne", "Haute"];

export function ProjectModal({ isOpen, onClose, project, onSave, onDelete }: ProjectModalProps) {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "", department: "", status: "Non demarre", priority: "Moyenne",
    progress: 0, previousMonthProgress: null, projectManager: "",
    partners: "", startDate: "", endDate: "", comments: "", isDelayed: false,
  });

  const toInputDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return "";
    try {
      if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.substring(0, 10);
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const year = parts[2].length === 4 ? parts[2] : `20${parts[2]}`;
        return `${year}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d.toISOString().substring(0, 10);
      return "";
    } catch { return ""; }
  };

  useEffect(() => {
    if (project) {
      setFormData({ ...project, startDate: toInputDate(project.startDate), endDate: toInputDate(project.endDate) });
    } else {
      setFormData({
        name: "", department: "", status: "Non demarre", priority: "Moyenne",
        progress: 0, previousMonthProgress: null, projectManager: "",
        partners: "", startDate: "", endDate: "", comments: "", isDelayed: false,
      });
    }
  }, [project, isOpen]);

  const handleSave = () => {
    if (formData.name && formData.projectManager) {
      onSave(formData as Project);
      toast.success(project ? "Projet mis à jour avec succès" : "Projet créé avec succès");
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
            {!isAdmin && <Badge variant="secondary" className="text-xs">Lecture seule</Badge>}
          </div>
          <DialogDescription className="text-sm text-gray-500">
            {isAdmin ? "Ajoutez ou modifiez les détails du projet ici." : "Consultez les détails du projet."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Nom du Projet</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Déploiement Serveurs Cloud" disabled={!isAdmin} />
          </div>

          <div className="space-y-2">
            <Label>Direction</Label>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Ex: DDLTD" disabled={!isAdmin} />
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={formData.status} onValueChange={(value: Status) => setFormData({ ...formData, status: value })} disabled={!isAdmin}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priorité</Label>
            <Select value={formData.priority} onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })} disabled={!isAdmin}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chef de Projet</Label>
            <Input value={formData.projectManager} onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })} placeholder="Ex: Sophie Martin" disabled={!isAdmin} />
          </div>

          <div className="space-y-2">
            <Label>Partenaires / Équipe</Label>
            <Input value={formData.partners} onChange={(e) => setFormData({ ...formData, partners: e.target.value })} placeholder="Ex: Équipe Infrastructure" disabled={!isAdmin} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de Début</Label>
              <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} disabled={!isAdmin} />
            </div>
            <div className="space-y-2">
              <Label>Date de Fin Prévue</Label>
              <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} disabled={!isAdmin} />
            </div>
          </div>

          {/* Taux d'Avancement actuel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Taux d'Avancement</Label>
              <span className="text-sm font-medium">{formatProgressValue(formData.progress || 0)}%</span>
            </div>
            <Slider
              value={[formatProgressValue(formData.progress || 0)]}
              onValueChange={([value]) => setFormData({ ...formData, progress: value / 100 })}
              min={0} max={100} step={5} disabled={!isAdmin}
            />
          </div>

          {/* Taux d'Avancement Mois Précédent */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Avancement Mois Précédent</Label>
              <span className="text-sm font-medium">
                {formData.previousMonthProgress != null
                  ? `${formatProgressValue(formData.previousMonthProgress)}%`
                  : "—"}
              </span>
            </div>
            <Slider
              value={[formatProgressValue(formData.previousMonthProgress || 0)]}
              onValueChange={([value]) => setFormData({ ...formData, previousMonthProgress: value / 100 })}
              min={0} max={100} step={5} disabled={!isAdmin}
            />
          </div>

          {/* Commentaires */}
          <div className="space-y-2">
            <Label>Commentaires et Mises à jour</Label>
            <Textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Format: JJ-MM-AAAA Texte de l'activité"
              rows={6}
              disabled={!isAdmin}
            />
            <p className="text-xs text-gray-400">Format attendu : 26-02-2026 Description de l'activité</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {isAdmin && project && (
              <Button variant="ghost" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Supprimer le projet
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>{isAdmin ? "Annuler" : "Fermer"}</Button>
            {isAdmin && <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Enregistrer</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
