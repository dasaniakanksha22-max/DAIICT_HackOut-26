import React, { useState } from 'react';
import { DispatchAction, RenewableSite, GridRiskSummary, HourlyForecastPoint } from '../types';
import {
  BatteryCharging,
  Battery,
  ZapOff,
  Flame,
  CheckCircle2,
  TrendingDown,
  Coins,
  Leaf,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { playDispatchChime } from '../utils/audioFx';

interface DispatchOptimizerViewProps {
  actions: DispatchAction[];
  site: RenewableSite;
  summary: GridRiskSummary;
  forecasts: HourlyForecastPoint[];
  onExecuteAction: (id: string) => void;
  onDismissAction: (id: string) => void;
  onExecuteAll: () => void;
  isDarkMode?: boolean;
}

export const DispatchOptimizerView: React.FC<DispatchOptimizerViewProps> = ({
  actions,
  site,
  summary,
  forecasts,
  onExecuteAction,
  onDismissAction,
  onExecuteAll,
  isDarkMode = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'bess' | 'curtailment'>('all');

  const handleExecuteSingle = (id: string) => {
    playDispatchChime();
    onExecuteAction(id);
  };

  const handleExecuteAllDirectives = () => {
    playDispatchChime();
    onExecuteAll();
  };

  const filteredActions = actions.filter((act) => {
    if (filter === 'critical') return act.priority === 'critical';
    if (filter === 'bess') return act.type === 'bess_charge' || act.type === 'bess_discharge';
    if (filter === 'curtailment') return act.type === 'curtailment';
    return true;
  });

  const executedCount = actions.filter((a) => a.status === 'executed').length;
  const pendingCount = actions.filter((a) => a.status === 'pending').length;

  const socData = forecasts.slice(0, 24).map((f) => ({
    time: f.time,
    soc: f.bessSoCPct,
    dispatchMW: f.bessDispatchMW,
  }));

  const getActionBadge = (priority: DispatchAction['priority']) => {
    switch (priority) {
      case 'critical':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Critical</span>;
      case 'recommended':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Recommended</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Optional</span>;
    }
  };

  const getActionIcon = (type: DispatchAction['type']) => {
    switch (type) {
      case 'bess_charge':
        return <BatteryCharging className="w-4 h-4 text-emerald-600" />;
      case 'bess_discharge':
        return <Battery className="w-4 h-4 text-cyan-600" />;
      case 'curtailment':
        return <ZapOff className="w-4 h-4 text-rose-600" />;
      case 'spinning_reserve':
        return <Flame className="w-4 h-4 text-amber-600" />;
      default:
        return <BatteryCharging className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header + Linear Program Metrics */}
      <div className={`rounded-2xl border p-6 transition-all ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md shadow-xl text-white'
          : 'bg-white border-slate-200/80 shadow-xs text-slate-900'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">
                Prescriptive Dispatch Optimization Engine
              </h2>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                isDarkMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
              }`}>
                PuLP / MILP Solver
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Linear program minimizing total grid deviation cost, thermal ramping stress, and renewable spillage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Executed: <strong className="text-emerald-400 font-bold">{executedCount}</strong> / {actions.length}
            </span>
            {pendingCount > 0 && (
              <button
                id="execute-all-btn"
                onClick={handleExecuteAllDirectives}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-98 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Execute All Directives</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Economic & Dispatch KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border transition-all ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-white' : 'bg-slate-50/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className={`flex items-center gap-2 text-xs mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Net Economic Arbitrage</span>
            </div>
            <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              ₹{((summary.avoidedDsmPenaltyInr + actions.reduce((sum, a) => sum + (a.status === 'executed' ? a.costSavingsInr : 0), 0)) / 100000).toFixed(1)}L
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Avoided DSM fines + peak shifts
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-white' : 'bg-slate-50/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className={`flex items-center gap-2 text-xs mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Battery className="w-4 h-4 text-cyan-400" />
              <span>BESS Available Buffer</span>
            </div>
            <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {site.bessCapacityMWh} MWh
            </div>
            <div className="text-[11px] text-cyan-400 font-medium mt-1">
              Max Power: {site.bessMaxPowerMW} MW • η: 92%
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-white' : 'bg-slate-50/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className={`flex items-center gap-2 text-xs mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Curtailment Mitigated</span>
            </div>
            <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {summary.totalBessAbsorptionMWh} MWh
            </div>
            <div className={`text-[11px] font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Buffered into lithium cells
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-white' : 'bg-slate-50/70 border-slate-200/70 text-slate-900'
          }`}>
            <div className={`flex items-center gap-2 text-xs mb-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Thermal Coal Avoided</span>
            </div>
            <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {summary.co2DisplacedTons} tCO₂
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Displacing fossil peaker ramps
            </div>
          </div>
        </div>

        {/* 24-Hour BESS State-of-Charge Profile */}
        <div className={`mt-6 pt-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              <BatteryCharging className="w-4 h-4 text-cyan-400" />
              24-Hour Battery Storage SoC Trajectory (10% to 90% Operating Limits)
            </span>
            <span className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Depth of Discharge: 80% Safe Window
            </span>
          </div>

          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={socData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="time" stroke={isDarkMode ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} interval={3} />
                <YAxis domain={[0, 100]} unit="%" stroke={isDarkMode ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Battery SoC']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="soc"
                  stroke="#0891b2"
                  strokeWidth={2}
                  fill="url(#socGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Structured Data Table for Recommendations */}
      <div className={`rounded-2xl border p-6 transition-all ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              Operational Dispatch Sequence & Directives
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Target MW orders computed for BESS inverters and substation feeder gates.
            </p>
          </div>

          {/* Filter Pills */}
          <div className={`flex items-center gap-1 text-xs font-semibold p-0.5 rounded-xl border ${
            isDarkMode
              ? 'bg-slate-950 border-slate-800'
              : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? isDarkMode
                    ? 'bg-slate-800 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({actions.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'critical'
                  ? isDarkMode
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Critical Risk
            </button>
            <button
              onClick={() => setFilter('bess')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'bess'
                  ? isDarkMode
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              BESS Ops
            </button>
            <button
              onClick={() => setFilter('curtailment')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'curtailment'
                  ? isDarkMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Curtailments
            </button>
          </div>
        </div>

        {/* Hairline-Divided Table with Sticky Header */}
        <div className={`overflow-x-auto rounded-xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <table className="w-full text-xs text-left">
            <thead className={`font-semibold border-b sticky top-0 z-10 backdrop-blur-xs ${
              isDarkMode
                ? 'bg-slate-950/95 text-slate-400 border-slate-800'
                : 'bg-slate-50/90 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="px-4 py-3">Schedule Time</th>
                <th className="px-4 py-3">Directive / Action</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3 text-right">Target MW</th>
                <th className="px-4 py-3 text-right">Duration</th>
                <th className="px-4 py-3 text-right">Protected Val</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/80 font-mono' : 'divide-slate-100'}`}>
              {filteredActions.map((act) => {
                const isDone = act.status === 'executed';
                return (
                  <tr
                    key={act.id}
                    className={`transition-colors ${
                      isDarkMode
                        ? isDone
                          ? 'bg-slate-950/40 opacity-60'
                          : 'hover:bg-slate-800/40'
                        : isDone
                        ? 'bg-slate-50/40 opacity-70'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className={`px-4 py-3 font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {act.scheduledTime}
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2">
                        {getActionIcon(act.type)}
                        <div>
                          <div className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{act.title}</div>
                          <div className={`text-[11px] line-clamp-1 max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{act.rationale}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      {getActionBadge(act.priority)}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      {act.targetMW} MW
                    </td>
                    <td className={`px-4 py-3 text-right font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {act.durationHours}h
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">
                      ₹{(act.costSavingsInr / 100000).toFixed(1)}L
                    </td>
                    <td className="px-4 py-3 text-center font-sans">
                      {isDone ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          <Check className="w-3 h-3" /> Transmitted
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      {!isDone ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleExecuteSingle(act.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                              act.priority === 'critical'
                                ? 'bg-rose-600 hover:bg-rose-500 shadow-xs shadow-rose-900/40'
                                : 'bg-emerald-600 hover:bg-emerald-500 shadow-xs shadow-emerald-900/40'
                            }`}
                          >
                            Dispatch
                          </button>
                          <button
                            onClick={() => onDismissAction(act.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Dismiss"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-end gap-1 font-sans">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SCADA Confirmed
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

    </div>
  );
};
