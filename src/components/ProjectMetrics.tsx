import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { DollarSign, CheckCircle, Clock, Users } from "lucide-react";

const metrics = [
  {
    title: "Budget Spent",
    value: "$186,420",
    total: "$250,000",
    percentage: 74,
    icon: DollarSign,
    color: "text-blue-600",
  },
  {
    title: "Tasks Completed",
    value: "23",
    total: "31",
    percentage: 74,
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Days Remaining",
    value: "45",
    total: "90",
    percentage: 50,
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Team Members",
    value: "12",
    total: "15",
    percentage: 80,
    icon: Users,
    color: "text-purple-600",
  },
];

export function ProjectMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">/ {metric.total}</span>
                </div>
                <Progress value={metric.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}