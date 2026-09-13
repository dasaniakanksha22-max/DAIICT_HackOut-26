import React from 'react';
import { RenewableSite, HourlyForecastPoint } from '../types';
import {
  Sun,
  Wind,
  BatteryCharging,
  Battery,
  Activity,
  Radio,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface LivePowerFlowDiagramProps {
  site: RenewableSite;
  currentPoint: HourlyForecastPoint;
  gridFrequencyHz: number;
}

export const LivePowerFlowDiagram: React.FC<LivePowerFlowDiagramProps> = ({
  site,
  currentPoint,
  gridFrequencyHz,
}) => {
  const isSolar = site.type === 'solar' || site.type === 'hybrid';
  const isWind = site.type === 'wind' || site.type === 'hybrid';

  const bessMW = currentPoint.bessDispatchMW; // negative = charging, positive = discharging
  const isBessCharging = bessMW < 0;
  const isBessDischarging = bessMW > 0;
  const bessActiveMW = Math.abs(bessMW);

  // Net exported to national grid = Expected P50 - BESS charging + BESS discharging - curtailment
  const rawGen = currentPoint.p50MW;
  const netExportMW = Math.max(0, rawGen + bessMW - currentPoint.curtailmentMW);

  // Grid frequency evaluation (Indian Grid Code standard: 49.90 Hz to 50.05 Hz)
  const isFreqSafe = gridFrequencyHz >= 49.90 && gridFrequencyHz <= 50.05;
  const freqDeviation = gridFrequencyHz - 50.00;

  // Substation transformer loading %
  const busLoadingPct = Math.min(100, Math.round((netExportMW / site.capacityMW) * 100));

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl text-white relative overflow-hidden">
      
      {/* Background Circuit Grid Glow Accents */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar of Diagram: Title + Realtime Status Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>Dynamic SCADA Single-Line Power Flow</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE BUS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live power routing between Renewable Array, BESS Lithium Bank, and 400kV Grid Interconnection
            </p>
          </div>
        </div>

        {/* Current Time Stamp Pill */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center gap-2">
            <span className="text-slate-400 font-sans text-[11px]">Interval:</span>
            <span className="text-emerald-400 font-bold">{currentPoint.time}</span>
            <span className="text-slate-400 text-[10px]">({currentPoint.dateStr})</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center gap-2">
            <span className="text-slate-400 font-sans text-[11px]">Bus Load:</span>
            <span className="text-cyan-400 font-bold">{busLoadingPct}%</span>
          </div>
        </div>
      </div>

      {/* 4-Node Interactive Power Flow Schematic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        
        {/* NODE 1: Renewable Generation Source */}
        <div className="bg-slate-800/60 rounded-xl border border-slate-700/70 p-4 flex flex-col justify-between relative group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                {isSolar ? <Sun className="w-4 h-4 animate-spin-slow" /> : <Wind className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">
                  {isSolar ? 'Solar PV Array' : 'Wind Turbine Farm'}
                </span>
                <div className="text-[10px] text-slate-400 font-mono">
                  Cap: {site.capacityMW} MW
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {rawGen} <span className="text-xs font-sans text-slate-400 font-normal">MW</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
              <span>Expected P50:</span>
              <span className="font-mono text-slate-200">{currentPoint.p50MW} MW</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>P10–P90 Spread:</span>
              <span className="font-mono text-amber-400">±{Math.round(currentPoint.uncertaintySpreadMW / 2)} MW</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>Inverters: Synchronized</span>
            <span className="text-emerald-400 font-semibold">100% Online</span>
          </div>
        </div>

        {/* NODE 2: BESS Flexibility Storage */}
        <div className={`rounded-xl border p-4 flex flex-col justify-between relative transition-all ${
          isBessCharging
            ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50'
            : isBessDischarging
            ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/50'
            : 'bg-slate-800/60 border-slate-700/70'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isBessCharging
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : isBessDischarging
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-700/50 text-slate-400 border-slate-600'
              }`}>
                {isBessCharging ? (
                  <BatteryCharging className="w-4 h-4 animate-pulse" />
                ) : (
                  <Battery className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">
                  BESS Bank
                </span>
                <div className="text-[10px] text-slate-400 font-mono">
                  {site.bessCapacityMWh} MWh Li-ion
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isBessCharging
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : isBessDischarging
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-700 text-slate-400'
            }`}>
              {isBessCharging ? 'Charging' : isBessDischarging ? 'Discharging' : 'Standby'}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between">
              <div className={`text-2xl font-bold font-mono ${
                isBessCharging ? 'text-cyan-400' : isBessDischarging ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {bessActiveMW > 0 ? (isBessCharging ? `-${bessActiveMW}` : `+${bessActiveMW}`) : '0.0'}{' '}
                <span className="text-xs font-sans text-slate-400 font-normal">MW</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-white">
                  {currentPoint.bessSoCPct}%
                </span>
                <span className="text-[10px] text-slate-400 block">State of Charge</span>
              </div>
            </div>

            {/* SoC Progress Bar */}
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  currentPoint.bessSoCPct < 20 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                }`}
                style={{ width: `${currentPoint.bessSoCPct}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>Ramping Rate</span>
            <span className="text-slate-200 font-mono">Max {site.bessMaxPowerMW} MW/s</span>
          </div>
        </div>

        {/* NODE 3: Substation Step-Up Transformer (33kV to 400kV) */}
        <div className="bg-slate-800/60 rounded-xl border border-slate-700/70 p-4 flex flex-col justify-between relative group hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">
                  400kV Pooling Substation
                </span>
                <div className="text-[10px] text-slate-400 font-mono">
                  Bay #4 Interconnect
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white">
              {netExportMW} <span className="text-xs font-sans text-slate-400 font-normal">MW Net</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
              <span>Curtailed / Spilled:</span>
              <span className={`font-mono ${currentPoint.curtailmentMW > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                {currentPoint.curtailmentMW} MW
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Contract Schedule:</span>
              <span className="font-mono text-slate-300">{currentPoint.scheduleMW} MW</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>Power Factor:</span>
            <span className="text-emerald-400 font-mono font-semibold">0.985 Lagging</span>
          </div>
        </div>

        {/* NODE 4: National Grid & SLDC Telemetry Gauge */}
        <div className={`rounded-xl border p-4 flex flex-col justify-between relative transition-all ${
          !isFreqSafe
            ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/40'
            : 'bg-slate-800/60 border-slate-700/70'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isFreqSafe
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              }`}>
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">
                  SLDC Regional Grid
                </span>
                <div className="text-[10px] text-slate-400 font-mono">
                  IEGC 50.00 Hz Band
                </div>
              </div>
            </div>

            {/* Compliance Badge */}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isFreqSafe
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {isFreqSafe ? 'IEGC COMPLIANT' : 'FREQUENCY STRESS'}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between">
              <div className={`text-2xl font-bold font-mono ${
                isFreqSafe ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {gridFrequencyHz.toFixed(2)}{' '}
                <span className="text-xs font-sans text-slate-400 font-normal">Hz</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-bold ${
                  freqDeviation >= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {freqDeviation >= 0 ? `+${freqDeviation.toFixed(2)}` : freqDeviation.toFixed(2)} Hz
                </span>
                <span className="text-[10px] text-slate-400 block">Delta from 50.00</span>
              </div>
            </div>

            {/* Frequency band visual gauge */}
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-2 relative overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isFreqSafe ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
                style={{
                  width: `${Math.max(10, Math.min(100, ((gridFrequencyHz - 49.70) / (50.30 - 49.70)) * 100))}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">DSM Penalty Band:</span>
            <span className={`font-semibold ${currentPoint.riskLevel === 'critical' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currentPoint.riskLevel === 'critical' ? 'Penalty Active' : 'Safe Band (±10%)'}
            </span>
          </div>
        </div>

      </div>

      {/* Energy Flow Animation Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
          <span className="text-slate-300 font-medium">Flow Direction:</span>
          <span>
            Array ({rawGen} MW)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 inline" />
          <span>
            {isBessCharging ? `BESS Absorbing (-${bessActiveMW} MW)` : isBessDischarging ? `BESS Discharging (+${bessActiveMW} MW)` : 'BESS Standby'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 inline" />
          <span className="text-emerald-300 font-bold">
            Grid Injection ({netExportMW} MW)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Auto-Balancing Protocol:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
            MILP Sub-second Inverter Control
          </span>
        </div>
      </div>

    </div>
  );
};
