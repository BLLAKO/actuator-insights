import { TelemetryPoint, AnomalyEvent } from "./mockData";

// InfluxDB connection config — update these when on BELIMO-X network
const INFLUX_HOST = "http://192.168.3.14:8086";
const INFLUX_DB = "belimo"; // Update with actual DB name

interface InfluxSeries {
  name: string;
  columns: string[];
  values: any[][];
}

interface InfluxResult {
  results: { series?: InfluxSeries[] }[];
}

async function queryInflux(query: string): Promise<InfluxSeries | null> {
  try {
    const res = await fetch(
      `${INFLUX_HOST}/query?db=${INFLUX_DB}&q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error(`InfluxDB error: ${res.status}`);
    const data: InfluxResult = await res.json();
    return data.results?.[0]?.series?.[0] ?? null;
  } catch (err) {
    console.error("InfluxDB query failed:", err);
    return null;
  }
}

export async function fetchLiveTelemetry(durationMinutes = 120): Promise<TelemetryPoint[]> {
  const series = await queryInflux(
    `SELECT * FROM measurements WHERE time > now() - ${durationMinutes}m ORDER BY time ASC`
  );

  if (!series) return [];

  const cols = series.columns;
  const getCol = (name: string) => cols.indexOf(name);

  return series.values.map((row, i) => {
    const time = i; // sequential minute index
    const setpoint = row[getCol("setpoint")] ?? 0;
    const feedback = row[getCol("feedback")] ?? row[getCol("position")] ?? 0;
    const torque = row[getCol("torque")] ?? 0;
    const power = row[getCol("power")] ?? 0;
    const temperature = row[getCol("temperature")] ?? row[getCol("temp")] ?? 0;
    const direction = row[getCol("rotation_direction")] === 1 ? "CW" 
                    : row[getCol("rotation_direction")] === -1 ? "CCW" 
                    : "STOP";

    return {
      timestamp: row[getCol("time")] ?? new Date().toISOString(),
      time,
      setpoint: Math.round(setpoint * 10) / 10,
      feedback: Math.round(Math.max(0, Math.min(100, feedback)) * 10) / 10,
      torque: Math.round(torque),
      power: Math.round(power * 100) / 100,
      temperature: Math.round(temperature * 10) / 10,
      direction: direction as "CW" | "CCW" | "STOP",
    };
  });
}

export async function sendSetpoint(position: number, testNumber = 1): Promise<boolean> {
  try {
    const lineProtocol = `_process setpoint=${position},test_number=${testNumber} 0`;
    const res = await fetch(`${INFLUX_HOST}/write?db=${INFLUX_DB}`, {
      method: "POST",
      body: lineProtocol,
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to send setpoint:", err);
    return false;
  }
}

export function detectAnomalies(data: TelemetryPoint[]): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];

  data.forEach((point, i) => {
    if (point.torque > 1000) {
      anomalies.push({
        id: `live-torque-${i}`,
        timestamp: point.timestamp,
        type: "torque_spike",
        severity: point.torque > 1200 ? "high" : "medium",
        message: `Torque spike detected: ${point.torque} Nmm exceeds threshold (1,000 Nmm)`,
        value: point.torque,
      });
    }
    if (point.temperature > 45) {
      anomalies.push({
        id: `live-temp-${i}`,
        timestamp: point.timestamp,
        type: "temp_warning",
        severity: point.temperature > 50 ? "high" : "medium",
        message: `Temperature warning: ${point.temperature}°C approaching limit (50°C)`,
        value: point.temperature,
      });
    }
    if (Math.abs(point.setpoint - point.feedback) > 5) {
      anomalies.push({
        id: `live-drift-${i}`,
        timestamp: point.timestamp,
        type: "position_drift",
        severity: Math.abs(point.setpoint - point.feedback) > 10 ? "high" : "low",
        message: `Position drift: feedback ${Math.abs(point.setpoint - point.feedback).toFixed(1)}% from setpoint`,
        value: Math.abs(point.setpoint - point.feedback),
      });
    }
  });

  // Return most recent anomalies (deduplicated by type, max 10)
  const seen = new Set<string>();
  return anomalies
    .reverse()
    .filter((a) => {
      if (seen.has(a.type)) return false;
      seen.add(a.type);
      return true;
    })
    .slice(0, 10);
}

export async function checkConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${INFLUX_HOST}/ping`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
