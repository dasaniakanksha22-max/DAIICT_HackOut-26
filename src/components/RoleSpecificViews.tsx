import React from 'react';
import { RolePerspective, RenewableSite, GridRiskSummary, HourlyForecastPoint } from '../types';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Coins,
  TrendingUp,
  BatteryCharging,
  Zap,
  DollarSign,
  Scale,
  Gauge,
  Layers,
  ArrowRight,
  TrendingDown,
  LineChart,
  PieChart,
  Flame,
  CheckCircle2,
  Clock,
  Briefcase,
  BarChart3,
  IndianRupee,
} from 'lucide-react';

interface RoleSpecificViewsProps {
  currentRole: RolePerspective;
  site: RenewableSite;
  summary: GridRiskSummary;
  forecasts: HourlyForecastPoint[];
  isDarkMode?: boolean;
}

export const RoleSpecificViews: React.FC<RoleSpecificViewsProps> = ({
  currentRole,
  site,
  summary,
  forecasts,
  isDarkMode = true,
}) => {
  const previewBlocks = forecasts.slice(0, 5);

  // 1. Grid Operator (SLDC / POSOCO) Perspective
  if (currentRole === 'grid_operator') {
    return (
      <div className={`rounded-2xl border p-5 flex flex-col h-full transition-all ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className={`flex items-center justify-between gap-3 border-b pb-3.5 mb-3 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold tracking-tight">
                SLDC / POSOCO Grid Operator Telemetry
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              IEGC Mandate: 49.90–50.05 Hz frequency stability & 55% thermal MTL constraints
            </p>
          </div>
          <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
            isDarkMode
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {site.state} 400kV Ring
          </span>
        </div>

        {/* 3 Telemetry Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className={`flex items-center justify-between text-[11px] mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span className="truncate">Grid Frequency</span>
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {summary.gridFrequencyHz.toFixed(2)} Hz
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              IEGC: 49.90–50.05 Hz
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className={`flex items-center justify-between text-[11px] mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span className="truncate">Ramping Margin</span>
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {Math.round(summary.maxUncertaintySpreadMW * 0.45)} MW/h
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              Buffered by BESS
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className={`flex items-center justify-between text-[11px] mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span className="truncate">Coal Tech Min</span>
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-lg font-bold font-mono text-indigo-400">
              55% MTL
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              CERC Base Limit
            </p>
          </div>
        </div>

        {/* Compact Schedule Table */}
        <div className="flex-1 flex flex-col justify-between">
          <div className={`overflow-x-auto rounded-xl border ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <table className="w-full text-[11px] text-left">
              <thead className={`font-semibold border-b ${
                isDarkMode
                  ? 'bg-slate-950 text-slate-400 border-slate-800'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="px-3 py-1.5">Block / Time</th>
                  <th className="px-3 py-1.5 text-right">Schedule</th>
                  <th className="px-3 py-1.5 text-right">Expected P50</th>
                  <th className="px-3 py-1.5 text-center">BESS SoC</th>
                  <th className="px-3 py-1.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono ${
                isDarkMode ? 'divide-slate-800/80' : 'divide-slate-100'
              }`}>
                {previewBlocks.map((b) => (
                  <tr key={b.time} className={isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                    <td className={`px-3 py-1.5 font-sans font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Block #{b.blockIndex} ({b.time})
                    </td>
                    <td className={`px-3 py-1.5 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{b.scheduleMW} MW</td>
                    <td className="px-3 py-1.5 text-right font-bold text-emerald-400">{b.p50MW} MW</td>
                    <td className="px-3 py-1.5 text-center font-sans">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-50 text-cyan-800'
                      }`}>
                        {b.bessSoCPct}%
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-center font-sans">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        b.riskLevel === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {b.riskLevel.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. Plant Owner (IPP) Perspective: Asset Health & Revenue Protection
  if (currentRole === 'plant_owner') {
    return (
      <div className={`rounded-2xl border p-5 flex flex-col h-full transition-all ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className={`flex items-center justify-between pb-3.5 mb-3 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-sm font-bold tracking-tight">
                IPP Asset Manager Console
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Asset Lifecycle & Revenue Arbitrage: {site.operator}
            </p>
          </div>
          <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
            isDarkMode
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
          }`}>
            ₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)}L Net Savings
          </span>
        </div>

        {/* 3 Key IPP Financial/Asset Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className={`flex items-center justify-between text-[11px] mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span className="truncate">Avoided Penalty</span>
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              ₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)}L
            </div>
            <p className="text-[10px] text-emerald-500/80 truncate mt-0.5">
              100% CERC Compliant
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className={`flex items-center justify-between text-[11px] mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span className="truncate">Battery Health</span>
              <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold font-mono text-cyan-400">
              98.4% SOH
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              0.82 C-Rate (Cell Safe)
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className={`flex items-center justify-between text-[11px] mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span className="truncate">Yield Captured</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {summary.totalBessAbsorptionMWh} MWh
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              Zero Spilled Solar
            </p>
          </div>
        </div>

        {/* Revenue & Warranty Summary */}
        <div className="flex-1 flex flex-col justify-between space-y-2.5">
          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Asset Warranty & Cycle Wear</span>
              <span className="text-emerald-400 font-mono text-[11px]">1.1 Cycles/Day (Warranty Cap: 2.0)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-2 rounded-full" style={{ width: '55%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
              <span>Current Wear: 0.018%/mo</span>
              <span>Remaining Life: 13.8 Years</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
            isDarkMode ? 'border-slate-800 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
          }`}>
            <span className="font-bold text-cyan-400">IPP Strategy Note:</span> Pre-charging BESS bank at noon avoided forced curtailment from local 400kV line congestion. Stored {summary.totalBessAbsorptionMWh} MWh is queued for evening peak injection at ₹7.85/kWh PPA peak tariff.
          </div>
        </div>
      </div>
    );
  }

  // 3. Energy Trader (DAM / RTM) Perspective: IEX Spot Arbitrage & Deviation Hedging
  return (
    <div className={`rounded-2xl border p-5 flex flex-col h-full transition-all ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
        : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
    }`}>
      <div className={`flex items-center justify-between pb-3.5 mb-3 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-sm font-bold tracking-tight">
              Energy Trading & IEX Market Desk
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Green Day-Ahead Market (G-DAM) & Real-Time Market (RTM) Arbitrage
          </p>
        </div>
        <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
          isDarkMode
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          IEX Spot: ₹4.62 / kWh
        </span>
      </div>

      {/* 3 Trading Metrics */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className={`p-3 rounded-xl border ${
          isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`flex items-center justify-between text-[11px] mb-1 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span className="truncate">RTM Price Spread</span>
            <Coins className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-400">
            +₹3.20/kWh
          </div>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            Peak vs Solar Trough
          </p>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`flex items-center justify-between text-[11px] mb-1 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span className="truncate">DSM Risk Hedged</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            96.8%
          </div>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            Tolerance &lt; 10% Band
          </p>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`flex items-center justify-between text-[11px] mb-1 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span className="truncate">Arbitrage Margin</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-cyan-400">
            +18.4%
          </div>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            BESS Time-Shift ROI
          </p>
        </div>
      </div>

      {/* Trading Schedule Guidance */}
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        <div className={`p-3 rounded-xl border ${
          isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>IEX Bidding Recommendations</span>
            <span className="text-amber-400 font-mono text-[10px]">Active Gate Window #18</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-slate-400 block text-[10px]">12:00 - 15:00 Solar Dip:</span>
              <span className="font-bold text-cyan-400 font-mono">Absorb 120 MW Surplus</span>
            </div>
            <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-slate-400 block text-[10px]">18:00 - 21:00 Peak Demand:</span>
              <span className="font-bold text-emerald-400 font-mono">Discharge @ ₹8.10 Max Cap</span>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
          isDarkMode ? 'border-slate-800 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
        }`}>
          <span className="font-bold text-amber-400">Trader Advisory:</span> Real-Time Market (RTM) clearing prices are currently elevated due to regional evening cooling loads. By maintaining BESS SoC at &gt;70%, the plant can bid uncontracted merchant capacity into high-clearing RTM blocks without risking PPA baseline penalties.
        </div>
      </div>
    </div>
  );
};
