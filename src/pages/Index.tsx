import { AiAssistantProvider } from "@/components/AiAssistantContext";
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
import { TelemetryCharts } from "@/components/TelemetryCharts";
import { mockTelemetry, mockAnomalies, healthScore } from "@/lib/mockData";
import { Activity, Thermometer, Zap, RotateCcw, Gauge, Monitor, Cpu } from "lucide-react";

const latest = mockTelemetry[mockTelemetry.length - 1];

export default function Index() {
  return (
    <div className="dark min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
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
          <TabsContent value="dashboard" className="space-y-5">
            {/* ── Section 1: Overview ── */}
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

            {/* ── Section 2: Analysis — Charts + Predictions + Anomalies side-by-side ── */}
            <div className="grid gap-4 lg:grid-cols-5">
              {/* Charts take 3/5 */}
              <div className="lg:col-span-3">
                <TelemetryCharts />
              </div>

              {/* Right sidebar: Predictions + Anomalies stacked */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <PredictivePanel />

                <Card className="border-border/50 flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <AlertTriangleIcon />
                      Anomaly Log
                      <span className="ml-auto rounded-full bg-destructive/15 border border-destructive/20 px-2 py-0.5 font-mono text-xs text-destructive">
                        {mockAnomalies.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnomalyLog anomalies={mockAnomalies} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ── Section 3: Gamification ── */}
            <GamificationPanel />
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
