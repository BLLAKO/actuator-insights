import { useState, useEffect, useCallback, useRef } from "react";
import { TelemetryPoint, AnomalyEvent, computeHealthScore, mockTelemetry, mockAnomalies } from "@/lib/mockData";
import { fetchLiveTelemetry, detectAnomalies, checkConnection } from "@/lib/influxService";

interface LiveDataState {
  telemetry: TelemetryPoint[];
  anomalies: AnomalyEvent[];
  healthScore: number;
  isLive: boolean;
  isConnecting: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

const POLL_INTERVAL = 5000; // 5 seconds

export function useLiveData() {
  const [state, setState] = useState<LiveDataState>({
    telemetry: mockTelemetry,
    anomalies: mockAnomalies,
    healthScore: computeHealthScore(mockTelemetry, mockAnomalies),
    isLive: false,
    isConnecting: true,
    lastUpdated: null,
    error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchLiveTelemetry(120);
      if (data.length > 0) {
        const liveAnomalies = detectAnomalies(data);
        const score = computeHealthScore(data, liveAnomalies);
        setState({
          telemetry: data,
          anomalies: liveAnomalies,
          healthScore: score,
          isLive: true,
          isConnecting: false,
          lastUpdated: new Date(),
          error: null,
        });
      } else {
        // Connected but no data yet
        setState((prev) => ({
          ...prev,
          isLive: true,
          isConnecting: false,
          error: "Connected but no telemetry data available",
        }));
      }
    } catch {
      // Fall back to mock data silently
      setState((prev) => ({
        ...prev,
        isLive: false,
        isConnecting: false,
        error: "InfluxDB unreachable — using demo data",
      }));
    }
  }, []);

  useEffect(() => {
    // Initial connection check
    checkConnection().then((connected) => {
      if (connected) {
        fetchData();
        intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
      } else {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isLive: false,
          error: null, // Silent fallback to mock
        }));
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  const latest = state.telemetry[state.telemetry.length - 1] ?? mockTelemetry[mockTelemetry.length - 1];

  return {
    ...state,
    latest,
  };
}
