import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Bot, Info } from "lucide-react";
import { useAiAssistant } from "./AiAssistantContext";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  status?: "normal" | "warning" | "critical";
  gradient?: string;
}

const metricDetails: Record<string, { description: string; range: string; tip: string }> = {
  Torque: {
    description: "Motor torque measures the rotational force applied by the actuator. Spikes may indicate mechanical resistance or valve sticking.",
    range: "Normal: 400–900 Nmm · Threshold: 1,000 Nmm",
    tip: "Tell me more about the torque readings",
  },
  Temperature: {
    description: "Internal temperature of the actuator motor. Rising temps can indicate continuous operation, high load, or ambient heat.",
    range: "Normal: 20–40°C · Warning: 40°C · Max: 50°C",
    tip: "What's happening with the temperature?",
  },
  Power: {
    description: "Real-time electrical power consumption. Correlates with motor activity and torque demands during valve movement.",
    range: "Typical: 3–6 W · Idle: ~1 W",
    tip: "Analyze the power consumption patterns",
  },
  Position: {
    description: "Current feedback position vs the commanded setpoint. Drift between these values may signal calibration issues or mechanical wear.",
    range: "Accuracy target: ±2% of setpoint",
    tip: "How accurate is the position tracking?",
  },
};

export function MetricCard({ title, value, unit, icon: Icon, trend, status = "normal", gradient = "gradient-card-blue" }: MetricCardProps) {
  const { openWithQuestion } = useAiAssistant();
  const details = metricDetails[title];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className={cn(
          "border transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer group",
          gradient,
          status === "warning" && "gradient-card-amber",
          status === "critical" && "gradient-card-rose",
        )}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                  <Info className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
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
      </PopoverTrigger>
      {details && (
        <PopoverContent className="w-72 space-y-3" side="bottom" align="start">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-sm text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{details.description}</p>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
            <p className="text-[11px] font-mono text-muted-foreground">{details.range}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              openWithQuestion(details.tip);
            }}
          >
            <Bot className="h-3.5 w-3.5 text-primary" />
            Ask AI about {title.toLowerCase()}
          </Button>
        </PopoverContent>
      )}
    </Popover>
  );
}
