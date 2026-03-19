import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  status?: "normal" | "warning" | "critical";
  gradient?: string;
}

export function MetricCard({ title, value, unit, icon: Icon, trend, status = "normal", gradient = "gradient-card-blue" }: MetricCardProps) {
  return (
    <Card className={cn(
      "border transition-all hover:scale-[1.02] hover:shadow-lg",
      gradient,
      status === "warning" && "gradient-card-amber",
      status === "critical" && "gradient-card-rose",
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>
          <div className={cn(
            "rounded-xl p-2.5 backdrop-blur-sm",
            status === "normal" && "bg-primary/15 text-primary",
            status === "warning" && "bg-warning/15 text-warning",
            status === "critical" && "bg-destructive/15 text-destructive",
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend === "up" && "bg-destructive/10 text-destructive",
              trend === "down" && "bg-success/10 text-success",
              trend === "stable" && "bg-muted text-muted-foreground",
            )}>
              {trend === "up" ? "↑ Rising" : trend === "down" ? "↓ Falling" : "→ Stable"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}