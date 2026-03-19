import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShieldAlert, Clock, TrendingUp } from "lucide-react";
import { healthScore, mockAnomalies } from "@/lib/mockData";

interface PredictionWindow {
  label: string;
  hours: number;
  probability: number;
}

function computeFailureProbabilities(): PredictionWindow[] {
  // Simple mock prediction based on health score and anomaly severity
  const baseRisk = (100 - healthScore) / 100;
  const highCount = mockAnomalies.filter((a) => a.severity === "high").length;
  const medCount = mockAnomalies.filter((a) => a.severity === "medium").length;
  const anomalyFactor = highCount * 0.12 + medCount * 0.05;

  const p24h = Math.min(0.95, baseRisk * 0.4 + anomalyFactor * 0.8);
  const p7d = Math.min(0.95, baseRisk * 0.65 + anomalyFactor * 1.2);
  const p30d = Math.min(0.95, baseRisk * 0.85 + anomalyFactor * 1.5);

  return [
    { label: "24 hours", hours: 24, probability: Math.round(p24h * 100) },
    { label: "7 days", hours: 168, probability: Math.round(p7d * 100) },
    { label: "30 days", hours: 720, probability: Math.round(p30d * 100) },
  ];
}

function getRiskColor(prob: number) {
  if (prob < 20) return { text: "text-success", bg: "bg-success", bar: "from-success/80 to-success/40", badge: "bg-success/10 text-success" };
  if (prob < 50) return { text: "text-warning", bg: "bg-warning", bar: "from-warning/80 to-warning/40", badge: "bg-warning/10 text-warning" };
  return { text: "text-destructive", bg: "bg-destructive", bar: "from-destructive/80 to-destructive/40", badge: "bg-destructive/10 text-destructive" };
}

function getRiskLabel(prob: number) {
  if (prob < 20) return "Low Risk";
  if (prob < 50) return "Moderate";
  return "High Risk";
}

export function PredictivePanel() {
  const predictions = computeFailureProbabilities();

  return (
    <Card className="gradient-card-violet border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="rounded-lg bg-[hsl(270_75%_60%/0.15)] p-1.5">
            <TrendingUp className="h-4 w-4 text-[hsl(270_75%_60%)]" />
          </div>
          Failure Probability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictions.map((pred) => {
          const colors = getRiskColor(pred.probability);
          return (
            <div key={pred.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Next {pred.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", colors.badge)}>
                    {getRiskLabel(pred.probability)}
                  </span>
                  <span className={cn("font-mono text-lg font-bold", colors.text)}>
                    {pred.probability}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", colors.bar)}
                  style={{ width: `${pred.probability}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Predictions based on current health score ({healthScore}/100), active anomaly count ({mockAnomalies.length}), and severity weighting. Connect real historical data for ML-based accuracy.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}