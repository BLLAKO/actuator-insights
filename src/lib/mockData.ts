// Generate realistic mock telemetry data for Belimo actuator

export interface TelemetryPoint {
  timestamp: string;
  time: number; // minutes
  setpoint: number;
  feedback: number;
  torque: number;
  power: number;
  temperature: number;
  direction: "CW" | "CCW" | "STOP";
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  type: "torque_spike" | "temp_warning" | "oscillation" | "position_drift";
  severity: "low" | "medium" | "high";
  message: string;
  value: number;
}

export type MachineState = "running" | "stillstand" | "off";

export interface MachineStatus {
  state: MachineState;
  since: string;
  uptime: string;
  lastStateChange: string;
  history: { time: number; state: MachineState }[];
}

export interface DeviceInfo {
  id: string;
  name: string;
  model: string;
  location: string;
  ipAddress: string;
  firmware: string;
  status: MachineState;
  healthScore: number;
  lastSeen: string;
  description: string;
  specs: { label: string; value: string }[];
}

function generateTelemetry(): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const now = Date.now();

  for (let i = 0; i < 120; i++) {
    const t = i;
    const phase = Math.floor(i / 30);
    let setpoint: number, feedback: number, torque: number, power: number, temperature: number;
    let direction: "CW" | "CCW" | "STOP" = "STOP";

    if (phase === 0) {
      setpoint = Math.min(100, (i / 30) * 100);
      feedback = setpoint - (Math.random() * 2);
      torque = 800 + Math.sin(i * 0.3) * 100 + Math.random() * 50;
      power = 3.5 + (setpoint / 100) * 2 + Math.random() * 0.3;
      direction = "CW";
    } else if (phase === 1) {
      setpoint = 100;
      feedback = 99.2 + Math.random() * 0.8;
      torque = 650 + Math.random() * 40;
      power = 5.2 + Math.random() * 0.2;
      direction = "STOP";
    } else if (phase === 2) {
      setpoint = Math.max(0, 100 - ((i - 60) / 30) * 100);
      feedback = setpoint + (Math.random() * 2);
      const anomalyBoost = (i > 72 && i < 78) ? 400 : 0;
      torque = 750 + anomalyBoost + Math.sin(i * 0.5) * 80 + Math.random() * 50;
      power = 5.0 - (setpoint / 100) * 1.5 + Math.random() * 0.3;
      direction = "CCW";
    } else {
      setpoint = 50 + Math.sin(i * 0.8) * 20;
      feedback = setpoint + Math.sin(i * 1.2) * 8;
      torque = 900 + Math.sin(i * 0.6) * 200 + Math.random() * 100;
      power = 4.5 + Math.sin(i * 0.4) * 1.5 + Math.random() * 0.5;
      direction = i % 4 < 2 ? "CW" : "CCW";
    }

    temperature = 28 + (i / 120) * 15 + Math.sin(i * 0.1) * 2 + Math.random() * 1;

    points.push({
      timestamp: new Date(now - (120 - i) * 60000).toISOString(),
      time: t,
      setpoint: Math.round(setpoint * 10) / 10,
      feedback: Math.round(Math.max(0, Math.min(100, feedback)) * 10) / 10,
      torque: Math.round(torque),
      power: Math.round(power * 100) / 100,
      temperature: Math.round(temperature * 10) / 10,
      direction,
    });
  }
  return points;
}

function generateAnomalies(): AnomalyEvent[] {
  return [
    {
      id: "a1",
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      type: "torque_spike",
      severity: "high",
      message: "Torque spike detected: 1,150 Nmm exceeds threshold (1,000 Nmm)",
      value: 1150,
    },
    {
      id: "a2",
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      type: "oscillation",
      severity: "medium",
      message: "Position oscillation detected: ±8% deviation from setpoint",
      value: 8,
    },
    {
      id: "a3",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      type: "temp_warning",
      severity: "medium",
      message: "Internal temperature rising: 42.3°C approaching limit (50°C)",
      value: 42.3,
    },
    {
      id: "a4",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      type: "position_drift",
      severity: "low",
      message: "Minor position drift: feedback 1.2% below setpoint",
      value: 1.2,
    },
  ];
}

export function computeHealthScore(data: TelemetryPoint[], anomalies: AnomalyEvent[]): number {
  let score = 100;
  anomalies.forEach((a) => {
    if (a.severity === "high") score -= 15;
    if (a.severity === "medium") score -= 8;
    if (a.severity === "low") score -= 3;
  });
  const avgTorque = data.reduce((s, d) => s + d.torque, 0) / data.length;
  if (avgTorque > 900) score -= 10;
  if (avgTorque > 1000) score -= 10;
  const maxTemp = Math.max(...data.map((d) => d.temperature));
  if (maxTemp > 40) score -= 5;
  if (maxTemp > 45) score -= 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateMachineStatus(): MachineStatus {
  const stateHistory: { time: number; state: MachineState }[] = [];
  const states: MachineState[] = ["off", "running", "stillstand", "running", "stillstand", "running"];
  for (let i = 0; i < 120; i++) {
    const idx = Math.min(states.length - 1, Math.floor(i / 20));
    stateHistory.push({ time: i, state: states[idx] });
  }
  return {
    state: "running",
    since: new Date(Date.now() - 35 * 60000).toISOString(),
    uptime: "1h 47m",
    lastStateChange: "35 min ago",
    history: stateHistory,
  };
}

function generateDevices(): DeviceInfo[] {
  return [
    {
      id: "dev-001",
      name: "AHU-1 Supply Damper",
      model: "Belimo LMV-D3-MP",
      location: "Building A — Floor 2, AHU Room",
      ipAddress: "192.168.1.101",
      firmware: "v3.2.1",
      status: "running",
      healthScore: 82,
      lastSeen: "Just now",
      description: "Primary supply air damper actuator for Air Handling Unit 1. Controls fresh air intake modulation.",
      specs: [
        { label: "Nominal Torque", value: "10 Nm" },
        { label: "Operating Voltage", value: "24V AC/DC" },
        { label: "Running Time", value: "90s" },
        { label: "Protection Class", value: "IP54" },
        { label: "Communication", value: "MP-Bus" },
      ],
    },
    {
      id: "dev-002",
      name: "AHU-1 Return Damper",
      model: "Belimo LMV-D3-MP",
      location: "Building A — Floor 2, AHU Room",
      ipAddress: "192.168.1.102",
      firmware: "v3.2.1",
      status: "stillstand",
      healthScore: 91,
      lastSeen: "2 min ago",
      description: "Return air damper actuator for AHU-1. Currently in hold position at 72% open.",
      specs: [
        { label: "Nominal Torque", value: "10 Nm" },
        { label: "Operating Voltage", value: "24V AC/DC" },
        { label: "Running Time", value: "90s" },
        { label: "Protection Class", value: "IP54" },
        { label: "Communication", value: "MP-Bus" },
      ],
    },
    {
      id: "dev-003",
      name: "Chiller Valve CW-3",
      model: "Belimo CCV15-020",
      location: "Building A — Basement, Mechanical Room",
      ipAddress: "192.168.1.103",
      firmware: "v2.8.4",
      status: "running",
      healthScore: 67,
      lastSeen: "Just now",
      description: "Chilled water control valve for zone 3 cooling. Showing elevated torque readings — scheduled for inspection.",
      specs: [
        { label: "Nominal Torque", value: "15 Nm" },
        { label: "Pipe Size", value: "DN20" },
        { label: "Flow Rate", value: "6.3 m³/h" },
        { label: "Protection Class", value: "IP42" },
        { label: "Communication", value: "MP-Bus" },
      ],
    },
    {
      id: "dev-004",
      name: "VAV Box 2F-04",
      model: "Belimo TRY-230-3",
      location: "Building A — Floor 2, Zone 4",
      ipAddress: "192.168.1.104",
      firmware: "v3.0.0",
      status: "off",
      healthScore: 45,
      lastSeen: "3 hours ago",
      description: "Variable Air Volume box actuator — offline. Last disconnected during scheduled maintenance window.",
      specs: [
        { label: "Nominal Torque", value: "5 Nm" },
        { label: "Operating Voltage", value: "230V AC" },
        { label: "Running Time", value: "120s" },
        { label: "Protection Class", value: "IP40" },
        { label: "Communication", value: "MP-Bus" },
      ],
    },
  ];
}

export const mockTelemetry = generateTelemetry();
export const mockAnomalies = generateAnomalies();
export const healthScore = computeHealthScore(mockTelemetry, mockAnomalies);
export const machineStatus = generateMachineStatus();
export const mockDevices = generateDevices();
