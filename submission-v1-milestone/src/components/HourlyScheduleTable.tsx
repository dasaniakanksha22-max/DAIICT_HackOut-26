import React, { useState } from 'react';
import { HourlyForecastPoint, RenewableSite } from '../types';
import { Table, ArrowDown, ArrowUp, Clock, Filter } from 'lucide-react';

interface HourlyScheduleTableProps {
  forecasts: HourlyForecastPoint[];
  site: RenewableSite;
}

export const HourlyScheduleTable: React.FC<HourlyScheduleTableProps> = ({ forecasts, site }) => {
  const [filter, setFilter] = useState<'all' | 'deviations' | 'critical'>('all');

  const filteredForecasts = forecasts.filter((f) => {
    if (filter === 'critical') return f.riskLevel === 'critical' || f.riskLevel === 'elevated';
    if (filter === 'deviations') return Math.abs(f.p50MW - f.scheduleMW) > (site.capacityMW * 0.05);
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Time-Block Dispatch & Quantile Uncertainty Schedule</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            CERC 15-minute time block scheduling table comparing P10, P50, and P90 against Day-Ahead baseline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded-md transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              All ({forecasts.length})
            </button>
            <button
              onClick={() => setFilter('deviations')}
              className={`px-2 py-1 rounded-md transition-all ${
                filter === 'deviations' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Deviations (&gt;5%)
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-2 py-1 rounded-md transition-all ${
                filter === 'critical' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              At Risk
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3">Block #</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Weather Condition</th>
              <th className="py-2.5 px-3 font-mono text-slate-600">P10 Floor</th>
              <th className="py-2.5 px-3 font-mono text-emerald-700">P50 Expected</th>
              <th className="py-2.5 px-3 font-mono text-sky-700">P90 Ceiling</th>
              <th className="py-2.5 px-3 font-mono text-slate-700">Contract Schedule</th>
              <th className="py-2.5 px-3 font-mono">Net Imbalance</th>
              <th className="py-2.5 px-3">Risk Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredForecasts.map((f, i) => {
              const imbalance = Math.round((f.p50MW - f.scheduleMW) * 10) / 10;
              const isSurplus = imbalance > 0;
              const isDeficit = imbalance < 0;

              return (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 font-medium">
                    #{f.blockIndex}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                    {f.dateStr}, {f.time}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span>{f.ghi > 50 ? `☀️ ${f.ghi} W/m²` : `💨 ${f.windSpeed100m.toFixed(1)} m/s`}</span>
                      <span className="text-[10px] text-slate-400">({f.cloudCoverPct}% cloud)</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">
                    {f.p10MW} MW
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/40">
                    {f.p50MW} MW
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-sky-700">
                    {f.p90MW} MW
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">
                    {f.scheduleMW} MW
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold">
                    {isSurplus ? (
                      <span className="text-emerald-700 flex items-center gap-0.5">
                        <ArrowUp className="w-3 h-3" /> +{imbalance} MW
                      </span>
                    ) : isDeficit ? (
                      <span className="text-rose-600 flex items-center gap-0.5">
                        <ArrowDown className="w-3 h-3" /> {imbalance} MW
                      </span>
                    ) : (
                      <span className="text-slate-400">0.0 MW</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      f.riskLevel === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      f.riskLevel === 'elevated' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {f.riskLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
