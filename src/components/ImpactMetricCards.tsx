import React from 'react';
import { GridRiskSummary, RenewableSite } from '../types';
import { TrendingDown, IndianRupee, ShieldAlert, Leaf, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';

interface ImpactMetricCardsProps {
  summary: GridRiskSummary;
  site: RenewableSite;
}

export const ImpactMetricCards: React.FC<ImpactMetricCardsProps> = ({ summary, site }) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Quantified Grid & Economic Impact (India National Context)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Benchmarked against Central Electricity Regulatory Commission (CERC) & CEA national standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-slate-400">National Target:</span>
          <span className="text-emerald-400 font-bold">500 GW by 2030</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1 */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Dynamic Reserve Padding Reduction</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            -30%
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            Dynamic P10 quantile reserve sizing prevents over-allocating costly thermal spinning peakers.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>RE Curtailment Recovered</span>
            <Leaf className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {summary.totalBessAbsorptionMWh} MWh
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            Absorbed into BESS instead of forced dumping when coal reaches 55% Technical Minimum.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Protected Revenue (DSM Fines)</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            ₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)} Lakh
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            Keeps 15-minute deviation error strictly within the 10% tolerance boundary.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Clean Energy CO₂ Displaced</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {summary.co2DisplacedTons.toLocaleString('en-IN')} tCO₂
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            Directly replaces coal thermal generation at 0.82 MT CO₂/MWh emission factor.
          </p>
        </div>
      </div>
    </div>
  );
};
