import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { machineStatus } from "@/lib/mockData";
import type { MachineState } from "@/lib/mockData";
import { Power, Pause, PowerOff } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const stateConfig: Record<MachineState, { label: string; color: string; icon: typeof Power; bgClass: string }> = {
  running: { label: "Running", color: "hsl(160 70% 45%)", icon: Power, bgClass: "bg-success/15 text-success" },
  stillstand: { label: "Stillstand", color: "hsl(38 95% 55%)", icon: Pause, bgClass: "bg-warning/15 text-warning" },
  off: { label: "Off", color: "hsl(0 75% 50%)", icon: PowerOff, bgClass: "bg-destructive/15 text-destructive" },
};

const stateColorMap: Record<MachineState, string> = {
  running: "hsl(160 70% 45%)",
  stillstand: "hsl(38 95% 55%)",
  off: "hsl(0 75% 50%)",
};

export function MachineStatusPanel() {
  const { state, uptime, lastStateChange, history } = machineStatus;
  const cfg = stateConfig[state];
  const Icon = cfg.icon;

  // Summarize history into segments for visualization
  const segments: { start: number; end: number; state: MachineState }[] = [];
  let current = history[0];
  let segStart = 0;
  for (let i = 1; i < history.length; i++) {
    if (history[i].state !== current.state) {
      segments.push({ start: segStart, end: i - 1, state: current.state });
      current = history[i];
      segStart = i;
    }
  }
  segments.push({ start: segStart, end: history.length - 1, state: current.state });

  const chartData = segments.map((s, i) => ({
    name: `${s.start}m–${s.end}m`,
    duration: s.end - s.start + 1,
    state: s.state,
  }));

  return (
    <div className="space-y-4">
      {/* Current State Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
            <div className={`rounded-full p-4 ${cfg.bgClass}`}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Current State</p>
              <p className="text-2xl font-bold font-mono text-foreground">{cfg.label}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-8">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Uptime</p>
            <p className="text-3xl font-bold font-mono text-foreground">{uptime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-8">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Last State Change</p>
            <p className="text-3xl font-bold font-mono text-foreground">{lastStateChange}</p>
          </CardContent>
        </Card>
      </div>

      {/* State Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">State Timeline (last 2h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 18% 18%)" />
                <XAxis dataKey="name" stroke="hsl(215 15% 55%)" fontSize={11} />
                <YAxis stroke="hsl(215 15% 55%)" fontSize={11} label={{ value: "Minutes", angle: -90, position: "insideLeft", style: { fill: "hsl(215 15% 55%)", fontSize: 11 } }} />
                <Tooltip
                  contentStyle={{ background: "hsl(225 22% 11%)", border: "1px solid hsl(225 18% 18%)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value: number, _name: string, props: any) => [`${value} min`, stateConfig[props.payload.state as MachineState].label]}
                />
                <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={stateColorMap[entry.state]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            {(["running", "stillstand", "off"] as MachineState[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stateColorMap[s] }} />
                <span className="text-xs text-muted-foreground">{stateConfig[s].label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
