# SynapseGrid: AI-Powered Renewable Generation Forecasting Platform
### Milestone 1 Submission (50% Progress Checkpoint)
**HackOut '26 · DA-IICT**  
**Theme:** Renewable Energy Intelligence  
**Team:** Semi;colon  

---

## 📌 Project Overview
Conventional renewable forecasting platforms focus on deterministic point predictions (*"Solar output will be 48 MW at 14:00"*). When weather shifts unexpectedly, grid operators must either over-allocate expensive thermal spinning reserves or force emergency curtailment.

**SynapseGrid** bridges this gap by delivering **Confidence-Aware Probabilistic Forecasting ($P_{10} / P_{50} / P_{90}$)** over rolling 24–72 hour horizons.

---

## 🚀 Completed Milestones (Phase 1 & 2 — Hours 0 to 24)

According to our implementation roadmap, this repository contains the **50% completed milestone**:

### 1. Ingestion & Preprocessing Pipeline (Phase 1)
- [x] **Live Atmospheric Weather Ingestion**: Automated ingestion from Open-Meteo API (Global Horizontal Irradiance, Direct Normal Irradiance, Diffuse Irradiance, 100m hub-height wind speed, surface pressure, ambient temperature, and cloud cover).
- [x] **Flagship Indian Renewable Hub Topologies**: Pre-configured site telemetry and grid interconnection parameters for:
  - **Charanka Solar Park** (Patan, Gujarat — 790 MW)
  - **Khavda Renewable Energy Hybrid Park** (Rann of Kutch, Gujarat — 3,200 MW Phase 1)
  - **Bhadla Solar Park** (Rajasthan — 2,245 MW)
  - **Muppandal Wind Farm** (Tamil Nadu — 1,500 MW)
  - **Pavagada Solar Park / Shakti Sthala** (Karnataka — 2,050 MW)

### 2. Sequence Modeling & Uncertainty Quantile Estimation (Phase 2)
- [x] **Physical PV & Aerodynamic Aerofoil Conversion**: Converts weather variables into active AC power while modeling silicon cell thermal derating ($-0.38\%/^\circ\text{C}$ above 25°C) and Betz-law cubic wind power curves.
- [x] **Calibrated Quantile Estimation ($P_{10} / P_{50} / P_{90}$)**:
  - **$P_{10}$ (Conservative Floor)**: Minimum guaranteed power floor for spinning reserve scheduling.
  - **$P_{50}$ (Expected Median)**: Expected generation for Day-Ahead Market scheduling.
  - **$P_{90}$ (Optimistic Ceiling)**: High-yield bound for battery pre-allocation and curtailment planning.
- [x] **Traffic-Light Risk Indicator**: Real-time risk categorization (Green / Amber / Red) evaluating grid frequency stability (IEGC nominal 49.90–50.05 Hz band) and quantile risk spread ($P_{90} - P_{10}$).
- [x] **Operator Telemetry Console**: Interactive visualizer charting the continuous uncertainty envelope alongside contracted day-ahead schedule baselines.

---

## 🛠️ Work-in-Progress (Phase 3 & 4 — Scheduled for Final Round)
- [ ] **Prescriptive Dispatch Optimization Layer**: Mixed-integer linear programming (PuLP / SciPy solver) translating uncertainty bounds into automated BESS charge/discharge commands.
- [ ] **Dynamic Curtailment & Peaker Reserve Directives**: Automated throttle schedules preventing baseload coal plants from dropping below 55% Technical Minimum (MTL).
- [ ] **CERC Deviation Settlement Mechanism (DSM) Cost Calculator**: Financial exposure modeling in ₹ Lakhs under Indian 2024–2026 grid regulations.
- [ ] **Role-Specific Perspectives**: Specialized dashboards for Grid Operators (SLDC), Plant Asset Managers (IPP), and Power Traders (IEX).
- [ ] **AI Advisory Copilot**: Natural language dispatch justification engine.

---

## 💻 Tech Stack (Milestone 1)
- **Frontend / Telemetry**: React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Forecasting & Modeling Engine**: Quantile sequence estimation, physical atmospheric conversion
- **Data Ingestion**: Open-Meteo REST API, NOAA GFS / NASA POWER models

---

## 🏃 Quick Start (Local Setup)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

Visit `http://localhost:3000` to interact with the Milestone 1 forecasting dashboard.
