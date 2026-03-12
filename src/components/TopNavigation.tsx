import { useState } from "react";
import { Link, useLocation } from "react-router";
import { LayoutDashboard, FolderKanban, Calendar, LogOut, AlertCircle, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectsContext";
import { Button } from "./ui/button";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      {usingMockData && (
        <div className="px-4 pt-2">
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              Mode démonstration - Configurez Airtable pour utiliser vos projets réels
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="px-4 md:px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">

          {/* Navigation desktop — cachée sous 768px */}
          <div
            style={{ display: "none" }}
            className="md-nav-desktop"
          >
          </div>

          {/* Navigation toujours visible sur desktop via flex, cachée sur mobile */}
          <div className="items-center space-x-2 hidden"
            ref={(el) => {
              if (el) {
                // Afficher si écran >= 768px
                el.style.display = window.innerWidth >= 768 ? "flex" : "none";
              }
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Titre mobile */}
          <span className="font-semibold text-gray-800 text-sm md:hidden">Gestion Projets</span>

          <div className="flex items-center space-x-3">
            {/* Infos utilisateur desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <Avatar className={`h-9 w-9 ${isAdmin ? "bg-blue-600" : "bg-gray-600"}`}>
                <AvatarFallback className={`${isAdmin ? "bg-blue-600" : "bg-gray-600"} text-white text-sm`}>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                {isDirecteur && <span className="text-xs text-gray-500">Lecture seule</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>

            {/* Bouton burger mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Menu déroulant mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-2 border-t border-gray-100 pt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-100 my-2" />
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-3">
                <Avatar className={`h-8 w-8 ${isAdmin ? "bg-blue-600" : "bg-gray-600"}`}>
                  <AvatarFallback className={`${isAdmin ? "bg-blue-600" : "bg-gray-600"} text-white text-xs`}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  {isDirecteur && <span className="text-xs text-gray-500">Lecture seule</span>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="text-sm">Déconnexion</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
