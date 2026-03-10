import { Link, useLocation } from "react-router";
import { LayoutDashboard, FolderKanban, Calendar, LogOut, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectsContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription } from "./ui/alert";

const navItems = [
  { path: "/", label: "Tableau de Bord", icon: LayoutDashboard },
  { path: "/projets", label: "Projets", icon: FolderKanban },
  { path: "/chronologie", label: "Chronologie", icon: Calendar },
];

export function TopNavigation() {
  const location = useLocation();
  const { user, isAdmin, isDirecteur, logout } = useAuth();
  const { usingMockData } = useProjects();

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      {/* Mock Data Warning */}
      {usingMockData && (
        <div className="max-w-[1600px] mx-auto mb-2">
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              Mode démonstration - Configurez Airtable pour utiliser vos 78 projets réels
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          {/* Role Badge */}
          <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
            {isAdmin ? "Administrateur" : "Directeur"}
          </Badge>

          {/* User Avatar and Name */}
          <div className="flex items-center space-x-3">
            <Avatar className={`h-9 w-9 ${isAdmin ? "bg-blue-600" : "bg-gray-600"}`}>
              <AvatarFallback className={`${isAdmin ? "bg-blue-600" : "bg-gray-600"} text-white text-sm`}>
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              {isDirecteur && (
                <span className="text-xs text-gray-500">Lecture seule</span>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}