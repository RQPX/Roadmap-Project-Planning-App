import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Plus, TrendingUp } from "lucide-react";
import { ProjectMetrics } from "./ProjectMetrics";
import { GanttPreview } from "./GanttPreview";
import { RecentProjects } from "./RecentProjects";

export function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome section with Add New Project button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Project Dashboard</h2>
          <p className="text-muted-foreground">
            Manage and track your construction projects
          </p>
        </div>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {/* Key Metrics */}
      <ProjectMetrics />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Project Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Downtown Office Complex</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>75% Complete</span>
              </div>
              <Progress value={75} className="h-3" />
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">Jan 15, 2024</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">Dec 30, 2024</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">$250,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Preview */}
          <GanttPreview />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Projects</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed This Year</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Budget</span>
                <span className="font-medium">$2.1M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Team Members</span>
                <span className="font-medium">45</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Electrical Inspection</p>
                  <p className="text-xs text-muted-foreground">Downtown Office</p>
                </div>
                <p className="text-xs text-orange-600 font-medium">2 days</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Foundation Pour</p>
                  <p className="text-xs text-muted-foreground">Residential Tower</p>
                </div>
                <p className="text-xs text-blue-600 font-medium">5 days</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Final Walkthrough</p>
                  <p className="text-xs text-muted-foreground">Shopping Center</p>
                </div>
                <p className="text-xs text-green-600 font-medium">1 week</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Projects */}
      <RecentProjects />
    </div>
  );
}