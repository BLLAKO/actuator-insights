import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDevices } from "@/lib/mockData";
import type { DeviceInfo, MachineState } from "@/lib/mockData";
import { ArrowLeft, Cpu, MapPin, Wifi, Server } from "lucide-react";

const statusBadge: Record<MachineState, { label: string; className: string }> = {
  running: { label: "Running", className: "bg-success/15 text-success border-success/30" },
  stillstand: { label: "Stillstand", className: "bg-warning/15 text-warning border-warning/30" },
  off: { label: "Offline", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

function DeviceCard({ device, onClick }: { device: DeviceInfo; onClick: () => void }) {
  const badge = statusBadge[device.status];
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-secondary/50"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 py-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <Cpu className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{device.name}</p>
          <p className="text-xs text-muted-foreground truncate">{device.model} — {device.location}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
          <span className="font-mono text-xs text-muted-foreground">HP {device.healthScore}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DeviceDetail({ device, onBack }: { device: DeviceInfo; onBack: () => void }) {
  const badge = statusBadge[device.status];
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to devices
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{device.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{device.model}</p>
            </div>
            <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">{device.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">{device.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <Wifi className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">IP Address</p>
                <p className="text-sm font-mono font-medium text-foreground">{device.ipAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <Server className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Firmware</p>
                <p className="text-sm font-mono font-medium text-foreground">{device.firmware}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <Cpu className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Last Seen</p>
                <p className="text-sm font-medium text-foreground">{device.lastSeen}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Specifications</h3>
            <div className="divide-y divide-border rounded-lg border">
              {device.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between px-4 py-2.5">
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-mono font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DevicesPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockDevices.find((d) => d.id === selectedId);

  if (selected) {
    return <DeviceDetail device={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {mockDevices.length} devices available on the network
      </p>
      {mockDevices.map((device) => (
        <DeviceCard key={device.id} device={device} onClick={() => setSelectedId(device.id)} />
      ))}
    </div>
  );
}
