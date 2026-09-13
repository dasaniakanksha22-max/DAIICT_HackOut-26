import React from 'react';
import { GridRiskSummary, RenewableSite } from '../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

interface TrafficLightBannerProps {
  summary: GridRiskSummary;
  site: RenewableSite;
}

export const TrafficLightBanner: React.FC<TrafficLightBannerProps> = ({ summary, site }) => {
  const isCritical = summary.overallLevel === 'critical';
  const isAmber = summary.overallLevel === 'elevated';

  let config = {
    bgColor: 'bg-emerald-50 border-emerald-300',
    badgeBg: 'bg-emerald-600 text-white',
    title: '🟢 Grid Balanced (Green) — Forecast Within Operational Tolerance',
    description: `Generation at ${site.name} closely tracks contracted schedule. Maximum P10–P90 spread is contained at ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(1)}% of capacity). Spinning reserve margins and Indian IEGC grid frequency remain stable.`,
  };

  if (isCritical) {
    config = {
      bgColor: 'bg-rose-50 border-rose-300',
      badgeBg: 'bg-rose-600 text-white',
      title: '🔴 Critical Risk (Red) — Wide Quantile Divergence Detected',
      description: `High operational vulnerability! P10–P90 quantile spread widened to ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(1)}% of plant capacity). Rapid cloud optical transitions or wind shear require immediate reserve buffer readiness.`,
    };
  } else if (isAmber) {
    config = {
      bgColor: 'bg-amber-50 border-amber-300',
      badgeBg: 'bg-amber-600 text-white',
      title: '🟡 Elevated Variance (Amber) — Weather Turbulence Approaching',
      description: `Meteorological variance detected across NWP model feeds. P10–P90 spread widened to ${summary.maxUncertaintySpreadMW} MW (${((summary.maxUncertaintySpreadMW / site.capacityMW) * 100).toFixed(1)}% of capacity). Schedule deviation requires monitoring against contracted baselines.`,
    };
  }

  return (
    <section aria-label="Operational Risk Banner" className={`rounded-xl border p-4 shadow-xs transition-all ${config.bgColor}`}>
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 shrink-0">
          {isCritical ? (
            <AlertOctagon className="w-5 h-5 text-rose-600 animate-pulse" />
          ) : isAmber ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.badgeBg}`}>
              {summary.overallLevel} Risk
            </span>
            <h2 className="font-bold text-sm text-slate-900">
              {config.title}
            </h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {config.description}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 border border-slate-200/80 text-[11px] text-slate-600 shrink-0 font-medium">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>IEGC 49.90–50.05 Hz</span>
        </div>
      </div>
    </section>
  );
};
