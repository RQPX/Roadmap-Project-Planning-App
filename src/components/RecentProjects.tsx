import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin, Calendar } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Downtown Office Complex",
    location: "Seattle, WA",
    progress: 75,
    status: "In Progress",
    deadline: "Dec 2024",
    image: "https://images.unsplash.com/photo-1741026414013-b0e8908a6862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc1NjY0NzY2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    name: "Residential Tower",
    location: "Portland, OR",
    progress: 45,
    status: "In Progress",
    deadline: "Mar 2025",
    image: "https://images.unsplash.com/photo-1744320056308-d1907f15e6b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMGNvbnN0cnVjdGlvbiUyMHByb2dyZXNzfGVufDF8fHx8MTc1NjY1NTM5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    name: "Shopping Center Renovation",
    location: "Vancouver, BC",
    progress: 90,
    status: "Near Completion",
    deadline: "Jan 2025",
    image: "https://images.unsplash.com/photo-1568151769173-e7784208c098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU2NjIzMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function RecentProjects() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="aspect-video relative">
              <ImageWithFallback
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge 
                  variant={project.progress > 80 ? "default" : "secondary"}
                  className="bg-white/90 text-gray-800"
                >
                  {project.status}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium truncate">{project.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.deadline}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}