import React from 'react';
import { GridRiskSummary, RenewableSite, ScenarioPreset } from '../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, BatteryCharging, ArrowRight, ZapOff, Sparkles, ShieldCheck } from 'lucide-react';

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
    cardBorder: 'border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white',
    badgeClass: 'bg-emerald-600 text-white',
    badgeText: 'NORMAL (GREEN)',
    title: 'Grid Balanced & Compliant — Operations Within IEGC Bands',
    description: `Generation at ${site.name} closely tracks contracted schedule. Max P10–P90 spread is safely contained at ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(1)}% of capacity). No emergency curtailment or thermal peaking ramp required.`,
    actionText: 'Optimize BESS State-of-Charge',
    actionIcon: BatteryCharging,
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
  };

  if (isCritical) {
    config = {
      cardBorder: 'border-rose-300 bg-gradient-to-r from-rose-50/80 via-red-50/40 to-white',
      badgeClass: 'bg-rose-600 text-white',
      badgeText: 'CRITICAL (RED)',
      title: 'Critical Imbalance Alert — Severe Quantile Divergence Detected',
      description: `High operational vulnerability! P10–P90 spread reached ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(1)}% of capacity). ${
        scenario.gridCongestionActive
          ? 'Thermal baseload at 55% Technical Minimum MTL; clean energy spill imminent unless curtailed or stored.'
          : 'Severe generation ramp variance threatens SLDC frequency bounds (49.90–50.05 Hz).'
      }`,
      actionText: scenario.gridCongestionActive ? 'Issue Dynamic Curtailment' : 'Dispatch BESS Emergency Reserves',
      actionIcon: ZapOff,
      btnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
    };
  } else if (isAmber) {
    config = {
      cardBorder: 'border-amber-300 bg-gradient-to-r from-amber-50/80 via-orange-50/30 to-white',
      badgeClass: 'bg-amber-600 text-white',
      badgeText: 'ELEVATED (AMBER)',
      title: 'Elevated Variance — Approaching Weather Front & DSM Exposure',
      description: `Meteorological volatility detected. P10–P90 spread broadened to ${summary.maxUncertaintySpreadMW} MW. Potential deviation from schedule threatens the CERC 10% threshold, initiating DSM penalty exposure.`,
      actionText: 'Pre-charge BESS Storage Buffer',
      actionIcon: BatteryCharging,
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
    };
  }

  const ActionIcon = config.actionIcon;

  return (
    <section aria-label="Operational Risk Banner" className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition-all ${config.cardBorder}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Status Content */}
        <div className="flex items-start gap-3.5">
          <div className="mt-1 p-2 rounded-xl bg-white shadow-2xs border border-slate-200/60 shrink-0">
            {isCritical ? (
              <AlertOctagon className="w-5 h-5 text-rose-600 animate-pulse" />
            ) : isAmber ? (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${config.badgeClass}`}>
                {config.badgeText}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {config.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              {config.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
          <button
            id="primary-action-btn"
            onClick={onExecutePrimaryAction}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${config.btnClass}`}
          >
            <ActionIcon className="w-4 h-4" />
            <span>{config.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="copilot-brief-btn"
            onClick={onOpenAiAdvisor}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Grid Advisory</span>
          </button>
        </div>
      </div>

      {/* KPI Ticker Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-2xs">
          <span className="text-slate-400 block text-[11px] font-medium">Uncertainty Envelope</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-slate-900 text-sm">{summary.maxUncertaintySpreadMW} MW</span>
            <span className="text-[10px] text-slate-500 font-mono">({((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(0)}% Cap)</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-2xs">
          <span className="text-slate-400 block text-[11px] font-medium">Peak Schedule Deficit</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-rose-700 text-sm">{summary.peakDeficitMW} MW</span>
            <span className="text-[10px] text-slate-500">below schedule</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-2xs">
          <span className="text-slate-400 block text-[11px] font-medium">BESS Flexibility Absorbed</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-emerald-700 text-sm">{summary.totalBessAbsorptionMWh} MWh</span>
            <span className="text-[10px] text-slate-500">buffered</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-2xs">
          <span className="text-slate-400 block text-[11px] font-medium">Avoided DSM Imbalance Fine</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-indigo-700 text-sm">₹{(summary.avoidedDsmPenaltyInr / 100000).toFixed(1)} Lakh</span>
            <span className="text-[10px] text-slate-500">protected</span>
          </div>
        </div>
      </div>
    </section>
  );
};
