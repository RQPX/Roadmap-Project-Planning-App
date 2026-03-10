import { FolderKanban, CheckSquare, Calendar, Settings } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { id: "projects", label: "Projects", icon: FolderKanban, active: true },
  { id: "tasks", label: "Tasks", icon: CheckSquare, active: false },
  { id: "timeline", label: "Timeline", icon: Calendar, active: false },
  { id: "settings", label: "Settings", icon: Settings, active: false },
];

export function Navigation() {
  return (
    <nav className="bg-background border-b border-border px-6 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2 px-4 py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}