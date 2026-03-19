import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TelemetryPoint } from "@/lib/mockData";
import { Activity, Thermometer, Zap, RotateCcw } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from "recharts";

const chartGrid = "hsl(240 20% 20%)";
const chartAxis = "hsl(220 20% 55%)";
const chartTooltip = { background: "hsl(238 30% 13%)", border: "1px solid hsl(240 20% 20%)", borderRadius: 8, fontSize: 12 };

interface TelemetryChartsProps {
  data?: TelemetryPoint[];
}

export function TelemetryCharts({ data }: TelemetryChartsProps) {
  // Fallback handled upstream — data is always provided
  const chartData = data ?? [];

  return (
    <Tabs defaultValue="torque" className="space-y-3">
      <TabsList className="bg-secondary/80">
        <TabsTrigger value="torque">Torque</TabsTrigger>
        <TabsTrigger value="position">Position</TabsTrigger>
        <TabsTrigger value="temperature">Temp</TabsTrigger>
        <TabsTrigger value="power">Power</TabsTrigger>
      </TabsList>

      <TabsContent value="torque">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Motor Torque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="torqueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200 100% 55%)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(200 100% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis dataKey="time" stroke={chartAxis} fontSize={10} tickFormatter={(v) => `${v}m`} />
                  <YAxis stroke={chartAxis} fontSize={10} />
                  <Tooltip contentStyle={chartTooltip} labelFormatter={(v) => `${v} min`} />
                  <ReferenceLine y={1000} stroke="hsl(0 80% 55%)" strokeDasharray="5 5" label={{ value: "Threshold", fill: "hsl(0 80% 55%)", fontSize: 10 }} />
                  <Area type="monotone" dataKey="torque" stroke="hsl(200 100% 55%)" fill="url(#torqueGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="position">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-3.5 w-3.5 text-primary" />
              Setpoint vs Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis dataKey="time" stroke={chartAxis} fontSize={10} tickFormatter={(v) => `${v}m`} />
                  <YAxis stroke={chartAxis} fontSize={10} domain={[0, 110]} />
                  <Tooltip contentStyle={chartTooltip} labelFormatter={(v) => `${v} min`} />
                  <Line type="monotone" dataKey="setpoint" stroke="hsl(200 100% 55%)" strokeWidth={2} dot={false} name="Setpoint" />
                  <Line type="monotone" dataKey="feedback" stroke="hsl(165 75% 46%)" strokeWidth={2} dot={false} name="Feedback" strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="temperature">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Thermometer className="h-3.5 w-3.5 text-warning" />
              Internal Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38 95% 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(38 95% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis dataKey="time" stroke={chartAxis} fontSize={10} tickFormatter={(v) => `${v}m`} />
                  <YAxis stroke={chartAxis} fontSize={10} />
                  <Tooltip contentStyle={chartTooltip} labelFormatter={(v) => `${v} min`} />
                  <ReferenceLine y={50} stroke="hsl(0 80% 55%)" strokeDasharray="5 5" label={{ value: "Max Limit", fill: "hsl(0 80% 55%)", fontSize: 10 }} />
                  <Area type="monotone" dataKey="temperature" stroke="hsl(38 95% 55%)" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="power">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Power Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(165 75% 46%)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(165 75% 46%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis dataKey="time" stroke={chartAxis} fontSize={10} tickFormatter={(v) => `${v}m`} />
                  <YAxis stroke={chartAxis} fontSize={10} />
                  <Tooltip contentStyle={chartTooltip} labelFormatter={(v) => `${v} min`} />
                  <Area type="monotone" dataKey="power" stroke="hsl(165 75% 46%)" fill="url(#powerGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
