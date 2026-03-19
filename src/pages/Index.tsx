import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthGauge } from "@/components/HealthGauge";
import { MetricCard } from "@/components/MetricCard";
import { AnomalyLog } from "@/components/AnomalyLog";
import { MachineStatusPanel } from "@/components/MachineStatusPanel";
import { DevicesPanel } from "@/components/DevicesPanel";
import { AiAssistant } from "@/components/AiAssistant";
import { GamificationPanel } from "@/components/GamificationPanel";
import { PredictivePanel } from "@/components/PredictivePanel";
import { mockTelemetry, mockAnomalies, healthScore } from "@/lib/mockData";
import { Activity, Thermometer, Zap, RotateCcw, Gauge, Monitor, Cpu } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from "recharts";

const latest = mockTelemetry[mockTelemetry.length - 1];

export default function Index() {
  return (
    <div className="dark min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between gradient-header rounded-xl p-4 -mx-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Belimo Actuator Health Monitor
            </h1>
            <p className="text-sm text-muted-foreground">
              Predictive maintenance dashboard — Real-time telemetry & anomaly detection
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-success/10 border border-success/20 px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-success" />
            <span className="font-mono text-xs text-success">CONNECTED</span>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-secondary/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Activity className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="status" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Monitor className="h-4 w-4" /> Machine Status
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Cpu className="h-4 w-4" /> Devices
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Top Row: Health Score + Metrics */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="md:col-span-1 gradient-card-emerald border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center pb-6">
                  <HealthGauge score={healthScore} />
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-4 md:col-span-4 md:grid-cols-4">
                <MetricCard title="Torque" value={String(latest.torque)} unit="Nmm" icon={Gauge} trend="up" status="warning" gradient="gradient-card-blue" />
                <MetricCard title="Temperature" value={String(latest.temperature)} unit="°C" icon={Thermometer} trend="up" status={latest.temperature > 40 ? "warning" : "normal"} gradient="gradient-card-amber" />
                <MetricCard title="Power" value={String(latest.power)} unit="W" icon={Zap} trend="stable" gradient="gradient-card-emerald" />
                <MetricCard title="Position" value={String(latest.feedback)} unit="%" icon={RotateCcw} trend="stable" gradient="gradient-card-blue" />
              </div>
            </div>

            {/* Predictive Analysis */}
            <PredictivePanel />

            {/* Charts */}
            <Tabs defaultValue="torque" className="space-y-4">
              <TabsList className="bg-secondary/80">
                <TabsTrigger value="torque">Torque</TabsTrigger>
                <TabsTrigger value="position">Position</TabsTrigger>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
                <TabsTrigger value="power">Power</TabsTrigger>
              </TabsList>

              <TabsContent value="torque">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="h-4 w-4 text-primary" />
                      Motor Torque Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockTelemetry}>
                          <defs>
                            <linearGradient id="torqueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(200 100% 55%)" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="hsl(200 100% 55%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 20% 20%)" />
                          <XAxis dataKey="time" stroke="hsl(220 20% 55%)" fontSize={11} tickFormatter={(v) => `${v}m`} />
                          <YAxis stroke="hsl(220 20% 55%)" fontSize={11} />
                          <Tooltip contentStyle={{ background: "hsl(238 30% 13%)", border: "1px solid hsl(240 20% 20%)", borderRadius: 8, fontSize: 12 }} labelFormatter={(v) => `${v} min`} />
                          <ReferenceLine y={1000} stroke="hsl(0 80% 55%)" strokeDasharray="5 5" label={{ value: "Threshold", fill: "hsl(0 80% 55%)", fontSize: 11 }} />
                          <Area type="monotone" dataKey="torque" stroke="hsl(200 100% 55%)" fill="url(#torqueGrad)" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="position">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <RotateCcw className="h-4 w-4 text-primary" />
                      Setpoint vs Feedback Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockTelemetry}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 20% 20%)" />
                          <XAxis dataKey="time" stroke="hsl(220 20% 55%)" fontSize={11} tickFormatter={(v) => `${v}m`} />
                          <YAxis stroke="hsl(220 20% 55%)" fontSize={11} domain={[0, 110]} />
                          <Tooltip contentStyle={{ background: "hsl(238 30% 13%)", border: "1px solid hsl(240 20% 20%)", borderRadius: 8, fontSize: 12 }} labelFormatter={(v) => `${v} min`} />
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
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Thermometer className="h-4 w-4 text-warning" />
                      Internal Temperature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockTelemetry}>
                          <defs>
                            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(38 95% 55%)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(38 95% 55%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 20% 20%)" />
                          <XAxis dataKey="time" stroke="hsl(220 20% 55%)" fontSize={11} tickFormatter={(v) => `${v}m`} />
                          <YAxis stroke="hsl(220 20% 55%)" fontSize={11} />
                          <Tooltip contentStyle={{ background: "hsl(238 30% 13%)", border: "1px solid hsl(240 20% 20%)", borderRadius: 8, fontSize: 12 }} labelFormatter={(v) => `${v} min`} />
                          <ReferenceLine y={50} stroke="hsl(0 80% 55%)" strokeDasharray="5 5" label={{ value: "Max Limit", fill: "hsl(0 80% 55%)", fontSize: 11 }} />
                          <Area type="monotone" dataKey="temperature" stroke="hsl(38 95% 55%)" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="power">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Zap className="h-4 w-4 text-primary" />
                      Power Consumption
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockTelemetry}>
                          <defs>
                            <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(165 75% 46%)" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="hsl(165 75% 46%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 20% 20%)" />
                          <XAxis dataKey="time" stroke="hsl(220 20% 55%)" fontSize={11} tickFormatter={(v) => `${v}m`} />
                          <YAxis stroke="hsl(220 20% 55%)" fontSize={11} />
                          <Tooltip contentStyle={{ background: "hsl(238 30% 13%)", border: "1px solid hsl(240 20% 20%)", borderRadius: 8, fontSize: 12 }} labelFormatter={(v) => `${v} min`} />
                          <Area type="monotone" dataKey="power" stroke="hsl(165 75% 46%)" fill="url(#powerGrad)" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Anomaly Log */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangleIcon />
                  Anomaly Detection Log
                  <span className="ml-auto rounded-full bg-destructive/15 border border-destructive/20 px-2.5 py-0.5 font-mono text-xs text-destructive">
                    {mockAnomalies.length} alerts
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnomalyLog anomalies={mockAnomalies} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Machine Status Tab */}
          <TabsContent value="status">
            <MachineStatusPanel />
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices">
            <DevicesPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant */}
      <AiAssistant />
    </div>
  );
}

function AlertTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  );
}