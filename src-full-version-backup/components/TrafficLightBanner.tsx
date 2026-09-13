import React from 'react';
import { GridRiskSummary, RenewableSite, ScenarioPreset } from '../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, BatteryCharging, ArrowRight, ZapOff, Sparkles } from 'lucide-react';

interface TrafficLightBannerProps {
  summary: GridRiskSummary;
  site: RenewableSite;
  scenario: ScenarioPreset;
  onExecutePrimaryAction: () => void;
  onOpenAiAdvisor: () => void;
}

export const TrafficLightBanner: React.FC<TrafficLightBannerProps> = ({
  summary,
  site,
  scenario,
  onExecutePrimaryAction,
  onOpenAiAdvisor,
}) => {
  const isCritical = summary.overallLevel === 'critical';
  const isAmber = summary.overallLevel === 'elevated';

  let config = {
    bgColor: 'bg-emerald-50 border-emerald-300',
    badgeBg: 'bg-emerald-600 text-white',
    title: '🟢 Normal Risk — Grid Frequency Stable (Within ±5% Tolerance)',
    description: `Forecasted generation at ${site.name} closely tracks contracted schedule. Maximum P10–P90 spread is contained at ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(1)}% of capacity). No emergency curtailment or thermal peaker dispatch required.`,
    actionText: 'Optimize BESS State-of-Charge',
    actionIcon: BatteryCharging,
  };

  if (isCritical) {
    config = {
      bgColor: 'bg-rose-50 border-rose-300',
      badgeBg: 'bg-rose-600 text-white',
      title: '🔴 Critical Dispatch Alert — Wide Quantile Divergence & Grid Imbalance',
      description: `High operational vulnerability! P10–P90 spread reached ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(1)}% of capacity). ${
        scenario.gridCongestionActive
          ? 'Thermal baseload at 55% Technical Minimum MTL; RE spill imminent unless curtailed or absorbed.'
          : 'Severe generation ramp variance threatens SLDC frequency bounds (49.90–50.05 Hz).'
      }`,
      actionText: scenario.gridCongestionActive ? 'Issue Dynamic Curtailment Order' : 'Dispatch Emergency Reserves / BESS',
      actionIcon: ZapOff,
    };
  } else if (isAmber) {
    config = {
      bgColor: 'bg-amber-50 border-amber-300',
      badgeBg: 'bg-amber-600 text-white',
      title: '🟡 Elevated Variance — Weather Front Approaching / BESS Pre-Allocation Required',
      description: `Significant meteorological turbulence detected. P10–P90 spread widened to ${summary.maxUncertaintySpreadMW} MW. Potential deviation from schedule crosses 10% threshold, triggering Indian CERC DSM penalty exposure.`,
      actionText: 'Pre-charge BESS Storage Buffer',
      actionIcon: BatteryCharging,
    };
  }

  const ActionIcon = config.actionIcon;

  return (
    <section aria-label="Operational Risk Banner" className={`rounded-xl border p-4 shadow-xs transition-all ${config.bgColor}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Indicator info */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {isCritical ? (
              <AlertOctagon className="w-6 h-6 text-rose-600 animate-pulse" />
            ) : isAmber ? (
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${config.badgeBg}`}>
                {summary.overallLevel}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {config.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
              {config.description}
            </p>
          </div>
        </div>

        {/* Right CTA buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="primary-action-btn"
            onClick={onExecutePrimaryAction}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${
              isCritical
                ? 'bg-rose-600 hover:bg-rose-700'
                : isAmber
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <ActionIcon className="w-4 h-4" />
            <span>{config.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="copilot-brief-btn"
            onClick={onOpenAiAdvisor}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">AI Grid Reasoning</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Ticker */}
      <div className="mt-3 pt-3 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-slate-200/50">
          <span className="text-slate-500 block text-[11px]">Uncertainty Band (P90 - P10)</span>
          <span className="font-mono font-bold text-slate-900 text-sm">{summary.maxUncertaintySpreadMW} MW</span>
          <span className="text-[10px] text-slate-500 ml-1">({((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(0)}% Cap)</span>
        </div>
        <div className="bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-slate-200/50">
          <span className="text-slate-500 block text-[11px]">Peak Deficit Exposure</span>
          <span className="font-mono font-bold text-rose-700 text-sm">{summary.peakDeficitMW} MW</span>
          <span className="text-[10px] text-slate-500 ml-1">below schedule</span>
        </div>
        <div className="bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-slate-200/50">
          <span className="text-slate-500 block text-[11px]">BESS Absorption Capacity</span>
          <span className="font-mono font-bold text-emerald-700 text-sm">{summary.totalBessAbsorptionMWh} MWh</span>
          <span className="text-[10px] text-slate-500 ml-1">buffered</span>
        </div>
        <div className="bg-white/70 backdrop-blur-xs p-2 rounded-lg border border-slate-200/50">
          <span className="text-slate-500 block text-[11px]">Avoided DSM Penalty</span>
          <span className="font-mono font-bold text-indigo-700 text-sm">₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)} Lakh</span>
          <span className="text-[10px] text-slate-500 ml-1">saved</span>
        </div>
      </div>
    </section>
  );
};
