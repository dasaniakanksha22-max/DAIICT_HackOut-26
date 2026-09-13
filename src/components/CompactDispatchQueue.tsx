import React from 'react';
import { DispatchAction } from '../types';
import { ShieldCheck, Check, BatteryCharging, Battery, ZapOff, Flame, ChevronRight } from 'lucide-react';

interface CompactDispatchQueueProps {
  actions: DispatchAction[];
  onExecuteAction: (id: string) => void;
  onExecuteAll: () => void;
  onViewAll: () => void;
  isDarkMode?: boolean;
}

export const CompactDispatchQueue: React.FC<CompactDispatchQueueProps> = ({
  actions,
  onExecuteAction,
  onExecuteAll,
  onViewAll,
  isDarkMode = true,
}) => {
  const pendingActions = actions.filter((a) => a.status === 'pending');
  const executedCount = actions.filter((a) => a.status === 'executed').length;

  const getActionIcon = (type: DispatchAction['type']) => {
    switch (type) {
      case 'bess_charge':
        return <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />;
      case 'bess_discharge':
        return <Battery className="w-3.5 h-3.5 text-cyan-400" />;
      case 'curtailment':
        return <ZapOff className="w-3.5 h-3.5 text-rose-400" />;
      case 'spinning_reserve':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className={`rounded-2xl border p-4.5 flex flex-col h-full transition-all ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md shadow-xl text-white'
        : 'bg-white border-slate-200/90 shadow-xs text-slate-900'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-tight">BESS Dispatch Directives</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            pendingActions.length > 0
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {pendingActions.length} Pending
          </span>
        </div>

        {pendingActions.length > 0 ? (
          <button
            onClick={onExecuteAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer shadow-xs shadow-emerald-500/20"
          >
            <ShieldCheck className="w-3 h-3" /> Execute All
          </button>
        ) : (
          <span className="text-[11px] text-emerald-400 font-medium">Grid Balanced</span>
        )}
      </div>

      {/* Action Queue List */}
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {actions.slice(0, 5).map((act) => {
          const isDone = act.status === 'executed';
          return (
            <div
              key={act.id}
              className={`p-3 rounded-xl border transition-all ${
                isDone
                  ? isDarkMode
                    ? 'bg-slate-950/40 border-slate-800/40 opacity-55'
                    : 'bg-slate-50 border-slate-100 opacity-60'
                  : isDarkMode
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-400">
                  {getActionIcon(act.type)}
                  <span>{act.scheduledTime}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase ${
                    act.priority === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {act.priority}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  +₹{(act.costSavingsInr / 100000).toFixed(1)}L
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1.5">
                <div>
                  <div className={`text-xs font-semibold line-clamp-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    {act.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Target: {act.targetMW} MW • Duration: {act.durationHours}h
                  </div>
                </div>

                {isDone ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    <Check className="w-2.5 h-2.5" /> Dispatched
                  </span>
                ) : (
                  <button
                    onClick={() => onExecuteAction(act.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer shrink-0 ${
                      act.priority === 'critical'
                        ? 'bg-rose-600 hover:bg-rose-500 shadow-xs'
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-xs'
                    }`}
                  >
                    Dispatch
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer link to detailed view */}
      <div className={`pt-3 mt-3 border-t flex items-center justify-between text-xs ${
        isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
      }`}>
        <span>Completed: {executedCount} of {actions.length}</span>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
        >
          <span>Full MILP View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
