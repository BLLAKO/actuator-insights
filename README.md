# Actuator Insights

<div align="center">

# Belimo Actuator Health Monitor

### Predictive Maintenance Dashboard for Industrial IoT Systems

Real-time telemetry analytics, anomaly detection, actuator health scoring, and AI-assisted diagnostics for industrial monitoring environments.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-Data_Visualization-orange)
![InfluxDB](https://img.shields.io/badge/InfluxDB-Time--Series-black?logo=influxdb)
![IoT](https://img.shields.io/badge/Industrial-IoT-success)
![Status](https://img.shields.io/badge/Status-Prototype-orange)

</div>

---

# Overview

Actuator Insights is an Industrial IoT monitoring and predictive maintenance platform designed to visualize actuator telemetry data, detect operational anomalies, and estimate system failure probabilities in real time.

The platform provides an intelligent dashboard environment for monitoring actuator health metrics such as:

- Torque
- Temperature
- Position
- Power Consumption
- Operational Drift
- Health Score
- Failure Probability

The application combines modern frontend technologies with telemetry analytics concepts commonly used in industrial automation, smart manufacturing, HVAC systems, and predictive maintenance environments.

The system also integrates an AI-powered assistant capable of interpreting telemetry information and assisting operators with system diagnostics and anomaly interpretation.

---

# Key Features

## Real-Time Telemetry Monitoring

- Live actuator metric visualization
- Time-series telemetry charts
- Dynamic metric updates
- Threshold monitoring
- Performance trend analysis

## Predictive Maintenance

- Health score computation
- Failure probability estimation
- Risk-level classification
- Early warning indicators
- Maintenance forecasting

## Anomaly Detection

The platform identifies abnormal actuator behavior including:

- Torque spikes
- Position oscillations
- Thermal anomalies
- Power irregularities
- Operational drift

Each anomaly is categorized by severity level:

- Low
- Medium
- High

---

## AI Data Assistant

Interactive AI-powered telemetry assistant capable of:

- Explaining telemetry metrics
- Interpreting anomaly logs
- Providing actuator insights
- Assisting with diagnostic analysis
- Improving operator interaction with system data

---

## Industrial Dashboard Interface

Modern operator-oriented UI including:

- Health gauges
- Telemetry cards
- Predictive risk panels
- Device monitoring
- Machine status visualization
- Interactive charts
- Responsive layouts

---

# System Architecture

```text
┌───────────────────────────────────────────────┐
│               Industrial Devices              │
│      Actuators / Motors / Sensors             │
└───────────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────┐
│             Telemetry Data Layer              │
│      Real-Time Metrics & Time-Series Data     │
└───────────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────┐
│               Analytics Engine                │
│  - Health Scoring                             │
│  - Threshold Analysis                         │
│  - Anomaly Detection                          │
│  - Failure Prediction                         │
└───────────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────┐
│               Frontend Dashboard              │
│ React + TypeScript + Tailwind + Recharts      │
└───────────────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────┐
│               AI Assistant Layer              │
│      Contextual Telemetry Interpretation      │
└───────────────────────────────────────────────┘
```

---

# Technology Stack

| Category | Technologies |
|---|---|
| Frontend Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS |
| UI Components | Radix UI |
| Data Visualization | Recharts |
| State/Data Handling | React Query |
| Testing | Vitest, Playwright |
| Time-Series Integration | InfluxDB |
| Routing | React Router |
| Form Validation | React Hook Form + Zod |

---

# Project Structure

```text
src/
│
├── components/
│   ├── AiAssistant.tsx
│   ├── AnomalyLog.tsx
│   ├── DevicesPanel.tsx
│   ├── HealthGauge.tsx
│   ├── MachineStatusPanel.tsx
│   ├── PredictivePanel.tsx
│   └── TelemetryCharts.tsx
│
├── hooks/
│   ├── useLiveData.ts
│   └── use-toast.ts
│
├── lib/
│   ├── influxService.ts
│   ├── mockData.ts
│   └── utils.ts
│
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
│
└── test/
    ├── example.test.ts
    └── setup.ts
```

---

# Telemetry Metrics

The system currently monitors several critical actuator indicators:

| Metric | Description |
|---|---|
| Torque | Rotational force applied by actuator |
| Temperature | Internal operating temperature |
| Position | Current actuator positioning |
| Power | Electrical power consumption |
| Health Score | Overall actuator operational condition |
| Failure Probability | Predicted operational risk |

---

# Predictive Maintenance Logic

The predictive maintenance module estimates future failure probability using:

- Health score weighting
- Active anomaly counts
- Severity-based scoring
- Telemetry trend analysis
- Threshold exceedance detection

Risk windows include:

- Next 24 hours
- Next 7 days
- Next 30 days

---

# Anomaly Detection Examples

The platform detects and logs anomalies such as:

```text
- Torque spike detected
- Position oscillation detected
- Internal temperature rising
- Position drift below setpoint
```

Each event includes:
- Timestamp
- Severity classification
- Metric source
- Contextual explanation

---

# AI Assistant

The integrated AI assistant allows operators to interact with telemetry data conversationally.

Example capabilities:

- Explain why health score dropped
- Describe anomaly causes
- Interpret telemetry patterns
- Provide operational summaries
- Assist in diagnostics

---

# Installation

## Clone Repository

```bash
git clone https://github.com/KlosiXhoi/actuator-insights.git
```

---

## Navigate Into Project

```bash
cd actuator-insights
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

---

## Build for Production

```bash
npm run build
```

---

# Testing

## Run Unit Tests

```bash
npm run test
```

## Run Watch Mode

```bash
npm run test:watch
```

---

# Current Status

Current implementation includes:

- Frontend dashboard prototype
- Simulated telemetry visualization
- Predictive maintenance interface
- AI telemetry assistant
- InfluxDB integration scaffolding
- Responsive UI architecture

---

# Future Improvements

Potential future extensions include:

- Real hardware telemetry integration
- MQTT/WebSocket streaming
- Machine learning anomaly detection
- Cloud deployment
- Historical analytics storage
- Authentication & RBAC
- Multi-device fleet management
- Advanced predictive modeling
- Edge-computing support
- Kubernetes deployment
- Mobile monitoring support

---

# Screenshots

## Dashboard Overview

_Add dashboard screenshot here_

## Telemetry Visualization

_Add telemetry chart screenshot here_

## Predictive Maintenance Panel

_Add predictive maintenance screenshot here_

## AI Assistant

_Add AI assistant screenshot here_

---

# Contributors

Developed collaboratively as part of an Industrial IoT monitoring and predictive analytics initiative.

Contributors include repository collaborators and project team members.

---

# Academic Context

This project demonstrates concepts related to:

- Industrial IoT Systems
- Predictive Maintenance
- Time-Series Analytics
- Human-Machine Interaction
- Real-Time Monitoring
- Telemetry Processing
- Smart Manufacturing Dashboards
- AI-Assisted Diagnostics

---

# License

This project is intended for educational, research, and prototype demonstration purposes.

---

# Acknowledgements

- React
- Vite
- TailwindCSS
- Recharts
- Radix UI
- InfluxDB
- Open-source frontend ecosystem

---

<div align="center">

### Industrial IoT • Predictive Maintenance • Telemetry Analytics • AI Diagnostics

</div>