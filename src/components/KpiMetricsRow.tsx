import React from 'react';
import { GridRiskSummary, RenewableSite, RolePerspective } from '../types';
import {
  TrendingDown,
  BatteryCharging,
  IndianRupee,
  Leaf,
  Activity,
  Gauge,
  Scale,
  ShieldCheck,
  TrendingUp,
  Coins,
  Cpu,
  BarChart2,
} from 'lucide-react';

interface KpiMetricsRowProps {
  summary: GridRiskSummary;
  site: RenewableSite;
  currentRole?: RolePerspective;
  isDarkMode?: boolean;
}

export const KpiMetricsRow: React.FC<KpiMetricsRowProps> = ({
  summary,
  site,
  currentRole = 'grid_operator',
  isDarkMode = false,
}) => {
  // 1. Grid Operator KPIs (Grid Reliability, Reserve Cushion, Thermal MTL, Frequency)
  if (currentRole === 'grid_operator') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Grid Frequency Stability */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Grid Frequency
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-emerald-400' : 'text-slate-900'
          }`}>
            {summary.gridFrequencyHz.toFixed(2)} <span className="text-sm font-sans font-normal opacity-60">Hz</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
          }`}>
            IEGC 49.90–50.05 Hz Stable
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Automatic BESS governor response dampens transient generation swings.
          </p>
        </div>

        {/* Metric 2: Spinning Reserve Cushion */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Reserve Cushion
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-50 text-cyan-600'
            }`}>
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-cyan-400' : 'text-slate-900'
          }`}>
            -30%
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-cyan-300' : 'text-cyan-700'
          }`}>
            Thermal peaker reduction
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Quantile P10 lower-bound lets SLDC dispatch 30% fewer costly gas/diesel peakers.
          </p>
        </div>

        {/* Metric 3: Ramping Stress Margin */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Max Ramp Rate
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-600'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-amber-400' : 'text-slate-900'
          }`}>
            {Math.round(summary.maxUncertaintySpreadMW * 0.45)} <span className="text-sm font-sans font-normal opacity-60">MW/h</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-amber-300' : 'text-amber-700'
          }`}>
            Buffered within transmission limits
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Regional 400kV intertie thermal limits protected against uncontrolled ramp events.
          </p>
        </div>

        {/* Metric 4: Coal Thermal Min Headroom */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Coal Technical Min
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-indigo-400' : 'text-slate-900'
          }`}>
            55% <span className="text-sm font-sans font-normal opacity-60">MTL</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
          }`}>
            CERC Baselines Maintained
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Prevents forced cycling of regional supercritical coal units during peak solar influx.
          </p>
        </div>
      </div>
    );
  }

  // 2. Plant Owner (IPP) KPIs (Avoided Penalties, Battery Life, Solar Preservation, Green CO2)
  if (currentRole === 'plant_owner') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Avoided DSM Penalties */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Avoided DSM Penalty
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-emerald-400' : 'text-slate-900'
          }`}>
            ₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)} <span className="text-sm font-sans font-normal opacity-60">Lakh</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
          }`}>
            100% CERC Penalty Protection
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Keeps 15-minute dispatch blocks strictly compliant within the Indian 10% deviation band.
          </p>
        </div>

        {/* Metric 2: Preserved Solar Generation */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Clean Energy Preserved
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-50 text-cyan-600'
            }`}>
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-cyan-400' : 'text-slate-900'
          }`}>
            {summary.totalBessAbsorptionMWh} <span className="text-sm font-sans font-normal opacity-60">MWh</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-cyan-300' : 'text-cyan-700'
          }`}>
            Zero Solar Curtailment
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Absorbed into local battery bank instead of forced spillage during line congestion.
          </p>
        </div>

        {/* Metric 3: Battery Health & Degradation */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              BESS Health (SOH)
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-600'
            }`}>
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-amber-400' : 'text-slate-900'
          }`}>
            98.4% <span className="text-sm font-sans font-normal opacity-60">SOH</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-amber-300' : 'text-amber-700'
          }`}>
            1.1 Cycles/Day (Safe Limit: 2.0)
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Optimizer enforces 10%–90% SoC bounds to maximize 15-year OEM cell warranty.
          </p>
        </div>

        {/* Metric 4: Carbon Offset Displaced */}
        <div className={`rounded-2xl border p-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-white backdrop-blur-md shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Carbon Offset
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            isDarkMode ? 'text-emerald-400' : 'text-slate-900'
          }`}>
            {summary.co2DisplacedTons.toLocaleString('en-IN')} <span className="text-sm font-sans font-normal opacity-60">tCO₂</span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${
            isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
          }`}>
            Green Energy Certificate Yield
          </div>
          <p className={`text-[11px] mt-1.5 leading-snug ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Displaces thermal coal generation at CEA baseline emission factor of 0.82 MT CO₂/MWh.
          </p>
        </div>
      </div>
    );
  }

  // 3. Energy Trader KPIs (IEX Spot Price, Arbitrage Margin, RTM Hedging, Gate Closure)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: IEX Average Clearing Price */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-white backdrop-blur-md shadow-lg'
          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            IEX Spot Clearing
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-600'
          }`}>
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
          isDarkMode ? 'text-amber-400' : 'text-slate-900'
        }`}>
          ₹4.62 <span className="text-sm font-sans font-normal opacity-60">/ kWh</span>
        </div>
        <div className={`text-xs font-semibold mt-1 ${
          isDarkMode ? 'text-amber-300' : 'text-amber-700'
        }`}>
          G-DAM Day-Ahead Average
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Indian Energy Exchange Green Day-Ahead Market weighted clearing benchmark.
        </p>
      </div>

      {/* Metric 2: BESS Time-Shift Arbitrage Margin */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-white backdrop-blur-md shadow-lg'
          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Arbitrage Spread
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
          isDarkMode ? 'text-emerald-400' : 'text-slate-900'
        }`}>
          +₹3.20 <span className="text-sm font-sans font-normal opacity-60">/ kWh</span>
        </div>
        <div className={`text-xs font-semibold mt-1 ${
          isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
        }`}>
          Noon Absorption $\rightarrow$ Evening Peak
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Charge at ₹2.40 solar base; discharge at ₹5.60–₹8.10 during regional peak demand.
        </p>
      </div>

      {/* Metric 3: RTM Deviation Risk Hedged */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-white backdrop-blur-md shadow-lg'
          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            RTM Risk Hedged
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-50 text-cyan-600'
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
          isDarkMode ? 'text-cyan-400' : 'text-slate-900'
        }`}>
          96.8%
        </div>
        <div className={`text-xs font-semibold mt-1 ${
          isDarkMode ? 'text-cyan-300' : 'text-cyan-700'
        }`}>
          Within &lt;10% Deviation Tolerance
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Real-Time Market bids hedged with reserve BESS capacity to avoid settlement penalties.
        </p>
      </div>

      {/* Metric 4: Market Gate Closure Window */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 text-white backdrop-blur-md shadow-lg'
          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Next RTM Gate
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-50 text-purple-600'
          }`}>
            <BarChart2 className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
          isDarkMode ? 'text-purple-400' : 'text-slate-900'
        }`}>
          Gate #18 <span className="text-sm font-sans font-normal opacity-60">(14:30)</span>
        </div>
        <div className={`text-xs font-semibold mt-1 ${
          isDarkMode ? 'text-purple-300' : 'text-purple-700'
        }`}>
          75-Min Lookahead Open
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Next submission window for revised 4-block schedule on the national trading portal.
        </p>
      </div>
    </div>
  );
};
