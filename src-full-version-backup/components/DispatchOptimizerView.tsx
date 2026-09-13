import React, { useState } from 'react';
import { DispatchAction, RenewableSite, GridRiskSummary, HourlyForecastPoint } from '../types';
import {
  BatteryCharging,
  Battery,
  ZapOff,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingDown,
  Coins,
  Leaf,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DispatchOptimizerViewProps {
  actions: DispatchAction[];
  site: RenewableSite;
  summary: GridRiskSummary;
  forecasts: HourlyForecastPoint[];
  onExecuteAction: (id: string) => void;
  onDismissAction: (id: string) => void;
  onExecuteAll: () => void;
}

export const DispatchOptimizerView: React.FC<DispatchOptimizerViewProps> = ({
  actions,
  site,
  summary,
  forecasts,
  onExecuteAction,
  onDismissAction,
  onExecuteAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'bess' | 'curtailment'>('all');

  const filteredActions = actions.filter((act) => {
    if (filter === 'critical') return act.priority === 'critical';
    if (filter === 'bess') return act.type === 'bess_charge' || act.type === 'bess_discharge';
    if (filter === 'curtailment') return act.type === 'curtailment';
    return true;
  });

  const executedCount = actions.filter((a) => a.status === 'executed').length;
  const pendingCount = actions.filter((a) => a.status === 'pending').length;

  // Data for BESS State-of-Charge (SoC) Curve (24h)
  const socData = forecasts.slice(0, 24).map((f) => ({
    time: f.time,
    soc: f.bessSoCPct,
    dispatchMW: f.bessDispatchMW,
  }));

  const getActionIcon = (type: DispatchAction['type']) => {
    switch (type) {
      case 'bess_charge':
        return <BatteryCharging className="w-5 h-5 text-emerald-600" />;
      case 'bess_discharge':
        return <Battery className="w-5 h-5 text-cyan-600" />;
      case 'curtailment':
        return <ZapOff className="w-5 h-5 text-rose-600" />;
      case 'spinning_reserve':
        return <Flame className="w-5 h-5 text-amber-600" />;
      default:
        return <BatteryCharging className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Optimization KPI Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Prescriptive Dispatch Optimization Engine
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800">
                PuLP / MILP Solver (Linear Programming)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated operational orders minimizing grid cost, DSM penalties, and fossil spinning reserves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Executed: <strong className="text-emerald-600">{executedCount}</strong> / {actions.length}
            </span>
            {pendingCount > 0 && (
              <button
                id="execute-all-btn"
                onClick={onExecuteAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Execute All Recommendations</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Economic & Dispatch KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Net Value Protected</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              ₹{((summary.avoidedDsmPenaltyInr + actions.reduce((sum, a) => sum + (a.status === 'executed' ? a.costSavingsInr : 0), 0)) / 100000).toFixed(1)} Lakh
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Avoided DSM fines + arbitrage
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
              <Battery className="w-4 h-4 text-cyan-600" />
              <span>BESS Available Reserve</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {site.bessCapacityMWh} MWh / {site.bessMaxPowerMW} MW
            </div>
            <div className="text-[11px] text-cyan-700 font-medium mt-0.5">
              Round-trip Efficiency: 92%
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span>Curtailment Prevented</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {summary.totalBessAbsorptionMWh} MWh
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Buffered into local battery bank
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Clean Power Preserved</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {summary.co2DisplacedTons} tCO₂
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Displacing thermal coal peakers
            </div>
          </div>
        </div>
      </div>

      {/* BESS SoC (State of Charge) Trajectory Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-cyan-600" />
              BESS State-of-Charge (SoC %) Optimization Curve (24h)
            </h3>
            <p className="text-xs text-slate-500">
              Dynamic charging during midday solar peak, scheduled discharge during evening ramp. Kept strictly within 15%–90% bounds.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
            Active SoC Target: {socData[socData.length - 1]?.soc || 50}%
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={socData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="socGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} unit="%" domain={[0, 100]} />
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Battery SoC']}
                labelFormatter={(label) => `Time: ${label}`}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
              />
              <Area
                type="monotone"
                dataKey="soc"
                stroke="#0891b2"
                strokeWidth={2.5}
                fill="url(#socGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actionable Dispatch Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Operational Dispatch Queue (Ranked by Economic & Grid Impact)
            </h3>
            <p className="text-xs text-slate-500">
              One-click operator authorization commands generated by PuLP decision heuristics.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({actions.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'critical' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter('bess')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'bess' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              BESS Dispatch
            </button>
            <button
              onClick={() => setFilter('curtailment')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'curtailment' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Curtailment
            </button>
          </div>
        </div>

        {/* Action Cards List */}
        {filteredActions.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No active dispatch actions matching this filter. Grid status is currently balanced.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredActions.map((action) => {
              const isExecuted = action.status === 'executed';
              return (
                <div
                  key={action.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isExecuted
                      ? 'bg-slate-50/80 border-slate-200 opacity-75'
                      : action.priority === 'critical'
                      ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 mt-0.5">
                        {getActionIcon(action.type)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">
                            {action.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              action.priority === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {action.priority}
                          </span>
                          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Scheduled: {action.scheduledTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                          {action.rationale}
                        </p>
                      </div>
                    </div>

                    {/* Right Action buttons & savings */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right font-mono text-xs hidden md:block">
                        <span className="text-emerald-700 font-bold block">
                          +₹{action.costSavingsInr.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {action.carbonReductionTons > 0 ? `${action.carbonReductionTons} tCO₂ saved` : 'Grid integrity order'}
                        </span>
                      </div>

                      {isExecuted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4" /> Dispatched
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`execute-btn-${action.id}`}
                            onClick={() => onExecuteAction(action.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-transform active:scale-95 shadow-xs"
                          >
                            Dispatch Order
                          </button>
                          <button
                            onClick={() => onDismissAction(action.id)}
                            className="px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-600 transition-colors"
                            title="Dismiss order"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
