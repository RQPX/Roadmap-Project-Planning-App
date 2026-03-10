import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const tasks = [
  { name: "Foundation", progress: 100, startWeek: 1, duration: 3, status: "completed" },
  { name: "Framing", progress: 85, startWeek: 3, duration: 4, status: "in-progress" },
  { name: "Electrical", progress: 45, startWeek: 5, duration: 3, status: "in-progress" },
  { name: "Plumbing", progress: 20, startWeek: 6, duration: 3, status: "pending" },
  { name: "Drywall", progress: 0, startWeek: 8, duration: 2, status: "pending" },
];

const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

export function GanttPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Project Timeline</span>
          <span className="text-sm font-normal text-muted-foreground">
            (Next 12 weeks)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Week headers */}
          <div className="flex items-center">
            <div className="w-20 text-xs font-medium text-muted-foreground">Task</div>
            <div className="flex-1 flex">
              {weeks.map((week) => (
                <div key={week} className="flex-1 text-center text-xs text-muted-foreground">
                  W{week}
                </div>
              ))}
            </div>
          </div>
          
          {/* Task bars */}
          {tasks.map((task) => (
            <div key={task.name} className="flex items-center">
              <div className="w-20 text-xs font-medium truncate">{task.name}</div>
              <div className="flex-1 flex relative h-6">
                {weeks.map((week) => (
                  <div key={week} className="flex-1 border-r border-border/30 last:border-r-0" />
                ))}
                <div
                  className="absolute top-1 bottom-1 rounded-sm flex items-center px-1"
                  style={{
                    left: `${((task.startWeek - 1) / 12) * 100}%`,
                    width: `${(task.duration / 12) * 100}%`,
                    backgroundColor: 
                      task.status === "completed" ? "#22c55e" :
                      task.status === "in-progress" ? "#3b82f6" : "#94a3b8"
                  }}
                >
                  <div 
                    className="h-full bg-white/20 rounded-sm"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}