import { AnomalyEvent } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { AlertTriangle, Activity, Thermometer, ArrowUpDown, Bot } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAiAssistant } from "./AiAssistantContext";

const iconMap = {
  torque_spike: AlertTriangle,
  oscillation: Activity,
  temp_warning: Thermometer,
  position_drift: ArrowUpDown,
};

const typeLabels: Record<string, string> = {
  torque_spike: "Torque Spike",
  oscillation: "Position Oscillation",
  temp_warning: "Temperature Warning",
  position_drift: "Position Drift",
};

const typeExplanations: Record<string, string> = {
  torque_spike: "A sudden increase in motor torque, potentially caused by mechanical blockage, valve sticking, or debris. May indicate need for physical inspection.",
  oscillation: "The actuator is hunting around the setpoint — overshooting and correcting repeatedly. Could indicate PID tuning issues or mechanical play.",
  temp_warning: "Internal temperature is approaching operational limits. Continuous high-load operation or poor ventilation may be contributing factors.",
  position_drift: "The feedback position is drifting from the commanded setpoint. This could indicate potentiometer wear, linkage looseness, or calibration drift.",
};

const severityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-warning bg-warning/5",
  low: "border-l-primary bg-primary/5",
};

interface AnomalyLogProps {
  anomalies: AnomalyEvent[];
}

export function AnomalyLog({ anomalies }: AnomalyLogProps) {
  const { openWithQuestion } = useAiAssistant();

  return (
    <div className="space-y-2">
      {anomalies.map((a) => {
        const Icon = iconMap[a.type];
        return (
          <Popover key={a.id}>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex items-start gap-3 rounded-md border-l-4 p-3 cursor-pointer transition-all hover:brightness-110",
                  severityStyles[a.severity]
                )}
              >
                <Icon className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  a.severity === "high" && "text-destructive",
                  a.severity === "medium" && "text-warning",
                  a.severity === "low" && "text-primary",
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{a.message}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <span className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
                  a.severity === "high" && "bg-destructive/20 text-destructive",
                  a.severity === "medium" && "bg-warning/20 text-warning",
                  a.severity === "low" && "bg-primary/20 text-primary",
                )}>
                  {a.severity}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-72 space-y-3" side="left" align="start">
              <div className="space-y-1.5">
                <h4 className="font-semibold text-sm text-foreground">{typeLabels[a.type]}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{typeExplanations[a.type]}</p>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1.5">
                <span className="text-[11px] font-mono text-muted-foreground">Value: {a.value} · Severity: {a.severity}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs"
                onClick={() => openWithQuestion(`Tell me about this ${a.type.replace("_", " ")} anomaly — what caused it and what should I do?`)}
              >
                <Bot className="h-3.5 w-3.5 text-primary" />
                Ask AI for guidance
              </Button>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
