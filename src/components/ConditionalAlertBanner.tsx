import React from 'react';
import { GridRiskSummary, RenewableSite, ScenarioPreset } from '../types';
import { AlertOctagon, AlertTriangle, ArrowRight, ShieldAlert, ZapOff, BatteryCharging } from 'lucide-react';

interface ConditionalAlertBannerProps {
  summary: GridRiskSummary;
  site: RenewableSite;
  scenario: ScenarioPreset;
  onExecutePrimaryAction: () => void;
  onOpenAiAdvisor: () => void;
}

export const ConditionalAlertBanner: React.FC<ConditionalAlertBannerProps> = ({
  summary,
  site,
  scenario,
  onExecutePrimaryAction,
  onOpenAiAdvisor,
}) => {
  // Only render when there is an active variance or critical condition!
  const isCritical = summary.overallLevel === 'critical';
  const isElevated = summary.overallLevel === 'elevated';
  const isCustomScenario = scenario.id !== 'baseline_clear';

  if (!isCritical && !isElevated && !isCustomScenario) {
    // Normal balanced condition: don't clutter the view with an intrusive banner!
    return null;
  }

  const isSevere = isCritical || scenario.gridCongestionActive;

  const accentColor = isSevere ? 'border-l-rose-500 bg-rose-50/50' : 'border-l-amber-500 bg-amber-50/50';
  const iconColor = isSevere ? 'text-rose-600' : 'text-amber-600';
  const headline = isSevere
    ? 'Critical Generation Variance Alert'
    : 'Elevated Generation Uncertainty Detected';

  const subline = isSevere
    ? `P10–P90 divergence reached ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(0)}% capacity). Immediate BESS buffer or curtailment order required to protect 49.90–50.05 Hz bounds.`
    : `Incoming meteorological volatility widens quantile envelope to ${summary.maxUncertaintySpreadMW} MW. CERC DSM imbalance fine exposure active.`;

  const primaryActionLabel = scenario.gridCongestionActive
    ? 'Issue Curtailment Order'
    : isSevere
    ? 'Dispatch Emergency BESS'
    : 'Pre-charge BESS Storage';

  return (
    <div className={`rounded-xl border border-slate-200/80 border-l-4 ${accentColor} p-4 sm:p-5 shadow-xs transition-all`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Icon + Headline + Narrative + Stat Chips */}
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 shrink-0">
            {isSevere ? (
              <AlertOctagon className={`w-5 h-5 ${iconColor} animate-pulse`} />
            ) : (
              <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-slate-900 leading-none">
                {headline}
              </h3>
              {scenario.id !== 'baseline_clear' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Scenario: {scenario.name}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {subline}
            </p>

            {/* 2–3 Inline Stat Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs font-mono">
                <span className="text-slate-400 font-sans text-[11px]">Spread:</span>
                <span className="font-bold">±{Math.round(summary.maxUncertaintySpreadMW / 2)} MW</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs font-mono">
                <span className="text-slate-400 font-sans text-[11px]">Peak Deficit:</span>
                <span className="font-bold text-rose-700">{summary.peakDeficitMW} MW</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs font-mono">
                <span className="text-slate-400 font-sans text-[11px]">DSM Exposure:</span>
                <span className="font-bold text-amber-700">₹{(summary.estimatedDsmPenaltyRiskInr / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: One Primary (solid) and One Secondary (outline/ghost) CTA */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
          {/* Secondary Ghost Button */}
          <button
            onClick={onOpenAiAdvisor}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            Review AI Rationale
          </button>

          {/* Primary Solid Action Button */}
          <button
            onClick={onExecutePrimaryAction}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-xs transition-all active:scale-98 cursor-pointer ${
              isSevere
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
