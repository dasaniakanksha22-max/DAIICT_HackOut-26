import React, { useState } from 'react';
import { HourlyForecastPoint, RenewableSite } from '../types';
import { Table, Filter, Download, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface HourlyScheduleTableProps {
  forecasts: HourlyForecastPoint[];
  site: RenewableSite;
  isDarkMode?: boolean;
}

export const HourlyScheduleTable: React.FC<HourlyScheduleTableProps> = ({
  forecasts,
  site,
  isDarkMode = false,
}) => {
  const [filterRiskOnly, setFilterRiskOnly] = useState(false);

  const displayedRows = filterRiskOnly
    ? forecasts.filter((f) => f.riskLevel !== 'normal' || f.curtailmentMW > 0 || f.bessDispatchMW !== 0)
    : forecasts;

  const handleExportCsv = () => {
    const headers = [
      'Block',
      'Time',
      'Date',
      'Contract Schedule (MW)',
      'P10 Low (MW)',
      'P50 Median (MW)',
      'P90 High (MW)',
      'Uncertainty Spread (MW)',
      'BESS Action (MW)',
      'BESS SoC (%)',
      'Curtailment (MW)',
      'IEGC Risk Level',
    ];

    const rows = forecasts.map((f) => [
      f.blockIndex,
      f.time,
      f.dateStr,
      f.scheduleMW,
      f.p10MW,
      f.p50MW,
      f.p90MW,
      f.uncertaintySpreadMW,
      f.bessDispatchMW,
      f.bessSoCPct,
      f.curtailmentMW,
      f.riskLevel,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${site.id}_cerc_dispatch_schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`rounded-2xl border p-6 transition-all ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
        : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
    } space-y-4`}>
      
      {/* Table Header & Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight">
              CERC 15-Minute Dispatch Schedule & Variance Audit
            </h2>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              {displayedRows.length} Time Blocks
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Official IEGC scheduling settlement comparison across P10 floor, P50 expected, and P90 ceiling values.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => setFilterRiskOnly(!filterRiskOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              filterRiskOnly
                ? isDarkMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>{filterRiskOnly ? 'Showing Risk Blocks Only' : 'Filter Deviations'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Zebra-Striped Data Table with Sticky Header */}
      <div className={`overflow-x-auto rounded-xl border max-h-[460px] overflow-y-auto ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <table className="w-full text-xs text-left">
          <thead className={`font-semibold border-b sticky top-0 z-10 backdrop-blur-xs ${
            isDarkMode
              ? 'bg-slate-950/95 text-slate-400 border-slate-800'
              : 'bg-slate-50/95 text-slate-500 border-slate-200'
          }`}>
            <tr>
              <th className="px-4 py-3">Block #</th>
              <th className="px-4 py-3">Time Window</th>
              <th className="px-4 py-3 text-right">Contract Schedule</th>
              <th className="px-4 py-3 text-right">P10 Floor</th>
              <th className="px-4 py-3 text-right">P50 Expected</th>
              <th className="px-4 py-3 text-right">P90 Ceiling</th>
              <th className="px-4 py-3 text-right">Uncertainty Spread</th>
              <th className="px-4 py-3 text-center">BESS State</th>
              <th className="px-4 py-3 text-right">Curtailment</th>
              <th className="px-4 py-3 text-center">Compliance Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-mono ${
            isDarkMode ? 'divide-slate-800/80' : 'divide-slate-100'
          }`}>
            {displayedRows.map((row, idx) => {
              const isEven = idx % 2 === 0;
              const hasCurtailment = row.curtailmentMW > 0;
              const isBessActive = row.bessDispatchMW !== 0;

              return (
                <tr
                  key={`${row.dateStr}-${row.time}`}
                  className={`transition-colors ${
                    isDarkMode
                      ? isEven
                        ? 'bg-slate-900/60 hover:bg-slate-800/50'
                        : 'bg-slate-950/40 hover:bg-slate-800/50'
                      : isEven
                      ? 'bg-white hover:bg-emerald-50/30'
                      : 'bg-slate-50/50 hover:bg-emerald-50/30'
                  }`}
                >
                  <td className="px-4 py-2.5 font-bold text-slate-400">
                    #{row.blockIndex}
                  </td>
                  <td className={`px-4 py-2.5 font-sans font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {row.time} <span className="text-slate-500 text-[10px]">({row.dateStr})</span>
                  </td>
                  <td className={`px-4 py-2.5 text-right ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {row.scheduleMW} MW
                  </td>
                  <td className="px-4 py-2.5 text-right text-indigo-400 font-semibold">
                    {row.p10MW} MW
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-emerald-400">
                    {row.p50MW} MW
                  </td>
                  <td className="px-4 py-2.5 text-right text-sky-400 font-semibold">
                    {row.p90MW} MW
                  </td>
                  <td className={`px-4 py-2.5 text-right ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    ±{Math.round(row.uncertaintySpreadMW / 2)} MW
                  </td>
                  <td className="px-4 py-2.5 text-center font-sans">
                    {isBessActive ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.bessDispatchMW < 0
                          ? isDarkMode
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                          : isDarkMode
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {row.bessDispatchMW < 0 ? 'Charge' : 'Discharge'} {Math.abs(row.bessDispatchMW)}MW ({row.bessSoCPct}%)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Idle ({row.bessSoCPct}%)</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-sans">
                    {hasCurtailment ? (
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        isDarkMode ? 'text-rose-400 bg-rose-950/40 border border-rose-900/50' : 'text-rose-600 bg-rose-50'
                      }`}>
                        {row.curtailmentMW} MW
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">0 MW</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center font-sans">
                    {row.riskLevel === 'critical' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isDarkMode ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        At Risk (DSM)
                      </span>
                    ) : row.riskLevel === 'elevated' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        Warning
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        Compliant
                      </span>
                    )}
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
