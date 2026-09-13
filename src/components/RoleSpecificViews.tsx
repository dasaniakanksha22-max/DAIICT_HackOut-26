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
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-sm font-bold tracking-tight">
                SLDC / POSOCO Grid Operator Telemetry
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              IEGC Compliance: 49.90–50.05 Hz frequency stability & thermal MTL limits
            </p>
          </div>
          <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
            isDarkMode
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
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

        {/* Compact Schedule Table (Fixed height to perfectly match TreeSHAP) */}
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
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
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

  // Fallback for IPP Asset Lead & Compliance roles
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
          <h2 className="text-sm font-bold tracking-tight">
            {currentRole === 'plant_owner' ? 'IPP Renewable Asset Cockpit' : 'Regulatory & DSM Auditor'}
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Financial exposure arbitrage and avoided DSM penalties
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          ₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)}L Protected
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
          <div className="text-[11px] text-slate-400 mb-1">Avoided DSM Penalty</div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            ₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)}L
          </div>
        </div>
        <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
          <div className="text-[11px] text-slate-400 mb-1">Total Carbon Displaced</div>
          <div className="text-lg font-bold font-mono text-cyan-400">
            {summary.co2DisplacedTons} tCO₂
          </div>
        </div>
      </div>

      <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
        isDarkMode ? 'border-slate-800 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
      }`}>
        BESS MILP co-optimization successfully absorbed noon generation surplus and dispatched during peak evening tariffs, preserving full revenue parity under CERC IEGC Deviation Settlement Mechanism regulations.
      </div>
    </div>
  );
};
