import React from 'react';
import { RolePerspective, RenewableSite, GridRiskSummary, HourlyForecastPoint } from '../types';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Coins,
  TrendingUp,
  BatteryCharging,
  Zap,
  DollarSign,
  Scale,
  Gauge,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface RoleSpecificViewsProps {
  currentRole: RolePerspective;
  site: RenewableSite;
  summary: GridRiskSummary;
  forecasts: HourlyForecastPoint[];
}

export const RoleSpecificViews: React.FC<RoleSpecificViewsProps> = ({
  currentRole,
  site,
  summary,
  forecasts,
}) => {
  // First 12 15-min / 1-hr blocks for the table
  const previewBlocks = forecasts.slice(0, 8);

  if (currentRole === 'grid_operator') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                SLDC / POSOCO Regional Grid Operator Console
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeting Indian Electricity Grid Code (IEGC) compliance: 49.90–50.05 Hz frequency stability and spinning reserve margins.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            Node: {site.state} State Transmission 400kV Ring
          </span>
        </div>

        {/* Operator Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Grid Frequency Tolerance</span>
              <Gauge className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {summary.gridFrequencyHz.toFixed(2)} Hz
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {summary.gridFrequencyHz < 49.90
                ? '⚠️ Frequency deficit! Low renewable injection.'
                : summary.gridFrequencyHz > 50.05
                ? '⚠️ Over-frequency spike! Initiate curtailment order.'
                : '✅ Nominal band (49.90 - 50.05 Hz). Safe margin.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Dynamic Spinning Reserve Req.</span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-700">
              {Math.round(summary.maxUncertaintySpreadMW * 0.45)} MW
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dynamic P10 reserve sizing saves 30% unneeded thermal peaker idling vs static padding.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Thermal Coal MTL Protection (55%)</span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {summary.totalCurtailmentRiskMWh > 0 ? 'CONGESTION FLAGGED' : 'NORMAL HEADROOM'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Prevents coal baseload plants from tripping below 55% Technical Minimum.
            </p>
          </div>
        </div>

        {/* 15-Minute DSM Block Dispatch Table */}
        <div className="overflow-x-auto">
          <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
            <span>Upcoming 15-Min Time-Block Schedule & Imbalance Telemetry</span>
            <span className="text-slate-400 font-normal">Showing upcoming blocks</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2 px-2.5">Block #</th>
                <th className="py-2 px-2.5">Time</th>
                <th className="py-2 px-2.5">Contract Schedule</th>
                <th className="py-2 px-2.5">P50 Expected</th>
                <th className="py-2 px-2.5">Uncertainty (P10–P90)</th>
                <th className="py-2 px-2.5">BESS Dispatch</th>
                <th className="py-2 px-2.5">Net Imbalance</th>
                <th className="py-2 px-2.5">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {previewBlocks.map((b) => {
                const netImbalance = b.p50MW - b.scheduleMW + b.bessDispatchMW;
                return (
                  <tr key={b.time} className="hover:bg-slate-50/80">
                    <td className="py-2 px-2.5 font-bold text-slate-700">#{b.blockIndex}</td>
                    <td className="py-2 px-2.5 text-slate-900">{b.time}</td>
                    <td className="py-2 px-2.5 text-slate-600">{b.scheduleMW} MW</td>
                    <td className="py-2 px-2.5 font-bold text-emerald-700">{b.p50MW} MW</td>
                    <td className="py-2 px-2.5 text-slate-600">
                      [{b.p10MW} - {b.p90MW}]
                    </td>
                    <td className="py-2 px-2.5 text-cyan-700 font-semibold">
                      {b.bessDispatchMW !== 0 ? `${b.bessDispatchMW > 0 ? '+' : ''}${b.bessDispatchMW} MW` : '—'}
                    </td>
                    <td className={`py-2 px-2.5 font-bold ${
                      Math.abs(netImbalance) > 20 ? 'text-rose-600' : 'text-slate-700'
                    }`}>
                      {netImbalance > 0 ? `+${netImbalance.toFixed(1)}` : netImbalance.toFixed(1)} MW
                    </td>
                    <td className="py-2 px-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                        b.riskLevel === 'critical' ? 'bg-rose-100 text-rose-800' :
                        b.riskLevel === 'elevated' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.riskLevel}
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
  }

  if (currentRole === 'plant_owner') {
    const avgYield = forecasts.reduce((acc, f) => acc + f.p50MW, 0);
    const capacityFactor = ((avgYield / (site.capacityMW * forecasts.length)) * 100).toFixed(1);
    const estDailyRevLakh = ((avgYield * 1000 * 2.65) / 100000).toFixed(1); // Standard ₹2.65/kWh PPA tariff

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Independent Power Producer (IPP) Asset Management
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Yield optimization, PPA contract compliance, inverter clipping mitigation, and battery degradation management.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Plant: {site.name} ({site.operator})
          </span>
        </div>

        {/* IPP Asset Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-slate-500 text-xs block">Projected Capacity Utilization Factor (CUF)</span>
            <span className="text-xl font-bold font-mono text-slate-900">{capacityFactor}%</span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">Above regional benchmark (22%)</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-slate-500 text-xs block">Contract PPA Revenue (Est. 24h)</span>
            <span className="text-xl font-bold font-mono text-emerald-700">₹{estDailyRevLakh} Lakh</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">@ ₹2.65 / kWh PPA rate</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-slate-500 text-xs block">Inverter Thermal Derating Loss</span>
            <span className="text-xl font-bold font-mono text-rose-600">-6.5%</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">High ambient temperature impact</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-slate-500 text-xs block">BESS Health & Degradation</span>
            <span className="text-xl font-bold font-mono text-cyan-700">98.4% SOH</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">1.2 Equivalent Full Cycles/day</span>
          </div>
        </div>

        {/* IPP Insights Box */}
        <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-xs text-slate-700 space-y-1.5">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Asset Manager Action Directive:
          </div>
          <p>
            • Midday irradiance allows <strong>100% absorption</strong> into the onsite {site.bessCapacityMWh} MWh BESS bank, avoiding commercial curtailment penalties.
          </p>
          <p>
            • Inverter AC clipping will occur between 11:30 and 13:45. Automated smart string derating will prevent thermal stress on power conversion units (PCUs).
          </p>
        </div>
      </div>
    );
  }

  // Energy Trader (IEX/PXIL) View
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Power Exchange & Energy Trading Desk (IEX / PXIL)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated P10–P90 risk bounds for Day-Ahead Market (DAM) and Real-Time Market (RTM) clearing and DSM penalty hedging.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
          Exchange: IEX India Green Market (G-DAM)
        </span>
      </div>

      {/* Trader Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <span className="text-slate-500 text-xs block">Optimal Day-Ahead Bid (Conservative P25)</span>
          <span className="text-xl font-bold font-mono text-slate-900">
            {Math.round(summary.maxUncertaintySpreadMW * 0.75)} MW
          </span>
          <span className="text-[11px] text-emerald-600 block mt-0.5">Zero DSM penalty risk threshold</span>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <span className="text-slate-500 text-xs block">RTM Arbitrage Opportunity</span>
          <span className="text-xl font-bold font-mono text-amber-700">₹4.85 / kWh</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Discharge BESS during evening peak</span>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <span className="text-slate-500 text-xs block">Unhedged DSM Penalty Exposure</span>
          <span className="text-xl font-bold font-mono text-rose-700">
            ₹{(summary.estimatedDsmPenaltyRiskInr / 100000).toFixed(1)} Lakh
          </span>
          <span className="text-[11px] text-rose-600 block mt-0.5">Mitigated to near zero with BESS</span>
        </div>
      </div>

      {/* CERC Deviation Settlement Table */}
      <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
        <span className="font-bold text-slate-800 block">
          Indian CERC DSM Regulatory Framework (2024–2026 Rules)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 text-[11px]">
          <div className="p-2 rounded bg-white border border-slate-200">
            <strong>Error &le; 10%:</strong> No DSM penalty. Full PPA tariff credited.
          </div>
          <div className="p-2 rounded bg-white border border-slate-200">
            <strong>10% &lt; Error &le; 15%:</strong> ₹1.80/kWh payable on deviation volume.
          </div>
          <div className="p-2 rounded bg-white border border-slate-200">
            <strong>Error &gt; 15%:</strong> ₹3.50/kWh penalty + mandatory curtailment flag.
          </div>
        </div>
      </div>
    </div>
  );
};
