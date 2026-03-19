import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Flame, Trophy, Shield, Zap, Star, Award } from "lucide-react";
import { healthScore, mockAnomalies } from "@/lib/mockData";

interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  color: string;
}

const streakDays = 12;
const uptimeHours = 284;
const anomaliesResolved = 47;

const xpCurrent = 2350;
const xpNextLevel = 3000;
const level = 7;

const achievements: Achievement[] = [
  {
    id: "streak7",
    label: "Week Warrior",
    description: "7-day streak without critical anomaly",
    icon: Flame,
    earned: true,
    color: "text-[hsl(38_95%_55%)]",
  },
  {
    id: "perfect24",
    label: "Perfect Day",
    description: "Health score 90+ for 24 hours",
    icon: Star,
    earned: true,
    color: "text-[hsl(200_100%_55%)]",
  },
  {
    id: "uptime200",
    label: "Iron Runner",
    description: "200+ hours cumulative uptime",
    icon: Shield,
    earned: true,
    color: "text-[hsl(165_75%_46%)]",
  },
  {
    id: "fast_response",
    label: "Quick Fix",
    description: "Resolve anomaly within 5 minutes",
    icon: Zap,
    earned: true,
    color: "text-[hsl(265_80%_62%)]",
  },
  {
    id: "streak30",
    label: "Monthly Legend",
    description: "30-day streak — no critical alerts",
    icon: Trophy,
    earned: false,
    color: "text-muted-foreground",
  },
  {
    id: "resolve100",
    label: "Centurion",
    description: "Resolve 100 anomalies total",
    icon: Award,
    earned: false,
    color: "text-muted-foreground",
  },
];

export function GamificationPanel() {
  const xpPercent = Math.round((xpCurrent / xpNextLevel) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Streak & XP Card */}
      <Card className="gradient-card-amber border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="rounded-lg bg-[hsl(38_95%_55%/0.15)] p-1.5">
              <Flame className="h-4 w-4 text-[hsl(38_95%_55%)]" />
            </div>
            Maintenance Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(38_95%_55%/0.12)] border border-[hsl(38_95%_55%/0.2)]">
              <span className="font-mono text-3xl font-bold text-[hsl(38_95%_55%)]">{streakDays}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Days without critical alert</p>
              <p className="text-xs text-muted-foreground">Best streak: 21 days</p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Level {level} — Operator</span>
              <span className="font-mono text-xs text-muted-foreground">{xpCurrent} / {xpNextLevel} XP</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[hsl(38_95%_55%)] to-[hsl(25_90%_50%)] transition-all duration-1000"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {xpNextLevel - xpCurrent} XP to Level {level + 1} — Senior Operator
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="font-mono text-lg font-bold text-foreground">{uptimeHours}h</p>
              <p className="text-[10px] text-muted-foreground">Uptime</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="font-mono text-lg font-bold text-foreground">{anomaliesResolved}</p>
              <p className="text-[10px] text-muted-foreground">Resolved</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="font-mono text-lg font-bold text-foreground">{healthScore}</p>
              <p className="text-[10px] text-muted-foreground">Avg Health</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card className="gradient-card-violet border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="rounded-lg bg-[hsl(265_80%_62%/0.15)] p-1.5">
              <Trophy className="h-4 w-4 text-[hsl(265_80%_62%)]" />
            </div>
            Achievements
            <span className="ml-auto rounded-full bg-[hsl(265_80%_62%/0.12)] border border-[hsl(265_80%_62%/0.2)] px-2 py-0.5 font-mono text-xs text-[hsl(265_80%_62%)]">
              {achievements.filter((a) => a.earned).length}/{achievements.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2.5">
            {achievements.map((ach) => {
              const Icon = ach.icon;
              return (
                <div
                  key={ach.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-2.5 transition-all",
                    ach.earned
                      ? "border-border/60 bg-muted/30"
                      : "border-border/20 bg-muted/10 opacity-45"
                  )}
                >
                  <div className={cn("shrink-0", ach.color)}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium", ach.earned ? "text-foreground" : "text-muted-foreground")}>
                      {ach.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{ach.description}</p>
                  </div>
                  {ach.earned && (
                    <span className="shrink-0 text-[10px] font-medium text-success">✓ Earned</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
