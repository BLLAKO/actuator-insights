import { cn } from "@/lib/utils";

interface HealthGaugeProps {
  score: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Healthy";
  if (score >= 60) return "Caution";
  return "Critical";
}

function getGradientId(score: number) {
  if (score >= 80) return "gaugeGradGreen";
  if (score >= 60) return "gaugeGradAmber";
  return "gaugeGradRed";
}

export function HealthGauge({ score }: HealthGaugeProps) {
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
          <defs>
            <linearGradient id="gaugeGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(185 80% 50%)" />
              <stop offset="100%" stopColor="hsl(160 70% 45%)" />
            </linearGradient>
            <linearGradient id="gaugeGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(45 95% 55%)" />
              <stop offset="100%" stopColor="hsl(25 90% 50%)" />
            </linearGradient>
            <linearGradient id="gaugeGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(350 80% 55%)" />
              <stop offset="100%" stopColor="hsl(0 75% 50%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="75" cy="75" r="58"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            opacity="0.4"
          />
          <circle
            cx="75" cy="75" r="58"
            fill="none"
            stroke={`url(#${getGradientId(score)})`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
            filter="url(#glow)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono text-4xl font-bold", getScoreColor(score))}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      <div className="text-center">
        <span className={cn("text-sm font-semibold uppercase tracking-wider", getScoreColor(score))}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}