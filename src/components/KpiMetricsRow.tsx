import React from 'react';
import { GridRiskSummary, RenewableSite } from '../types';
import { TrendingDown, BatteryCharging, IndianRupee, Leaf } from 'lucide-react';

interface KpiMetricsRowProps {
  summary: GridRiskSummary;
  site: RenewableSite;
  isDarkMode?: boolean;
}

export const KpiMetricsRow: React.FC<KpiMetricsRowProps> = ({ summary, site, isDarkMode = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Dynamic Reserve Cushion */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-white backdrop-blur-md shadow-lg'
          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Reserve Cushion
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
          isDarkMode ? 'text-emerald-400' : 'text-slate-900'
        }`}>
          -30%
        </div>
        <div className={`text-xs font-semibold mt-1 ${
          isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
        }`}>
          Thermal peaker reduction
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Quantile P10 envelope dynamically adjusts spinning reserve margins without grid security risk.
        </p>
      </div>

      {/* Card 2: BESS Flexibility Buffer */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-white backdrop-blur-md shadow-lg'
          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            BESS Buffer
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
          Clean energy preserved
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Absorbed into local battery bank instead of forced spillage during thermal 55% MTL bottlenecks.
        </p>
      </div>

      {/* Card 3: Avoided DSM Penalties */}
      <div className={`rounded-2xl border p-5 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-white backdrop-blur-md shadow-lg'
          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            DSM Protection
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-600'
          }`}>
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
          isDarkMode ? 'text-amber-400' : 'text-slate-900'
        }`}>
          ₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)} <span className="text-sm font-sans font-normal opacity-60">Lakh</span>
        </div>
        <div className={`text-xs font-semibold mt-1 ${
          isDarkMode ? 'text-amber-300' : 'text-amber-700'
        }`}>
          Avoided CERC fines
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Keeps 15-minute dispatch blocks strictly compliant within the Indian 10% deviation band.
        </p>
      </div>

      {/* Card 4: Displaced Thermal CO2 */}
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
          Direct fossil displacement
        </div>
        <p className={`text-[11px] mt-1.5 leading-snug ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Displaces thermal coal generation at CEA baseline emission factor of 0.82 MT CO₂ per MWh.
        </p>
      </div>

    </div>
  );
};
