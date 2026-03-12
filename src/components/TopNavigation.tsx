import { useState, useEffect } from "react";
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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
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

      <div style={{ padding: "12px 16px", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {isDesktop ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      backgroundColor: isActive ? "#2563eb" : "transparent",
                      color: isActive ? "white" : "#374151",
                      fontWeight: 500,
                      transition: "background-color 0.15s",
                    }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <span style={{ fontWeight: 600, color: "#1f2937", fontSize: "14px" }}>Gestion Projets</span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isDesktop && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Avatar className={`h-9 w-9 ${isAdmin ? "bg-blue-600" : "bg-gray-600"}`}>
                  <AvatarFallback className={`${isAdmin ? "bg-blue-600" : "bg-gray-600"} text-white text-sm`}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>{user?.name}</span>
                  {isDirecteur && <span style={{ fontSize: "12px", color: "#6b7280" }}>Lecture seule</span>}
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <LogOut style={{ width: 16, height: 16 }} />
                  <span>Déconnexion</span>
                </Button>
              </div>
            )}

            {!isDesktop && (
              <button
                style={{ padding: "8px", borderRadius: "8px", background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen
                  ? <X style={{ width: 20, height: 20, color: "#374151" }} />
                  : <Menu style={{ width: 20, height: 20, color: "#374151" }} />
                }
              </button>
            )}
          </div>
        </div>

        {!isDesktop && mobileMenuOpen && (
          <div style={{ marginTop: "12px", paddingBottom: "8px", borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#2563eb" : "transparent",
                    color: isActive ? "white" : "#374151",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  <Icon style={{ width: 20, height: 20 }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div style={{ borderTop: "1px solid #f3f4f6", margin: "8px 0" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Avatar className={`h-8 w-8 ${isAdmin ? "bg-blue-600" : "bg-gray-600"}`}>
                  <AvatarFallback className={`${isAdmin ? "bg-blue-600" : "bg-gray-600"} text-white text-xs`}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>{user?.name}</span>
                  {isDirecteur && <span style={{ fontSize: "12px", color: "#6b7280" }}>Lecture seule</span>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut style={{ width: 16, height: 16, marginRight: "4px" }} />
                <span style={{ fontSize: "14px" }}>Déconnexion</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
