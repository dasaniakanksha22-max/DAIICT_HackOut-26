import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { HourlyForecastPoint, RenewableSite } from '../types';
import { Eye, EyeOff, Info, Sun, Wind, Cloud, ShieldAlert } from 'lucide-react';

interface ForecastChartProps {
  forecasts: HourlyForecastPoint[];
  site: RenewableSite;
  horizonHours: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  forecasts,
  site,
  horizonHours,
}) => {
  const [showQuantiles, setShowQuantiles] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);
  const [showBess, setShowBess] = useState(true);
  const [showCurtailment, setShowCurtailment] = useState(true);

  // Transform data for stacked or quantile band rendering
  // We want to shade between P10 and P90:
  // p10 is base, p90MinusP10 is the height of the uncertainty ribbon
  const chartData = forecasts.map((f) => ({
    ...f,
    p10Base: f.p10MW,
    quantileBandWidth: Math.max(0, f.p90MW - f.p10MW),
    // Positive BESS is discharge, negative is charge; for display we separate or label clearly
    bessNetMW: f.bessDispatchMW,
    curtailmentDisplay: f.curtailmentMW > 0 ? f.curtailmentMW : null,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: HourlyForecastPoint = payload[0].payload;

    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md max-w-xs">
        <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
          <span className="font-bold text-emerald-400 font-mono">
            {data.dateStr} • {data.time} (Block #{data.blockIndex})
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
            data.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
            data.riskLevel === 'elevated' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}>
            {data.riskLevel}
          </span>
        </div>

        {/* Forecast Quantiles */}
        <div className="space-y-1 mb-2 font-mono">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">P90 (Optimistic High):</span>
            <span className="font-bold text-sky-300">{data.p90MW} MW</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="text-emerald-300 font-semibold">P50 (Expected Median):</span>
            <span className="font-bold text-emerald-400 text-sm">{data.p50MW} MW</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">P10 (Conservative Low):</span>
            <span className="font-bold text-indigo-300">{data.p10MW} MW</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-800">
            <span>Quantile Risk Spread (P90-P10):</span>
            <span className="font-semibold text-amber-300">{data.uncertaintySpreadMW} MW</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Contract Schedule Baseline:</span>
            <span className="font-semibold text-slate-300">{data.scheduleMW} MW</span>
          </div>
        </div>

        {/* Grid Action Details */}
        {(data.bessDispatchMW !== 0 || data.curtailmentMW > 0 || data.reserveCallMW > 0) && (
          <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
            <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">
              Optimization Layer Command:
            </div>
            {data.bessDispatchMW !== 0 && (
              <div className="flex justify-between text-cyan-300">
                <span>BESS {data.bessDispatchMW < 0 ? 'Charging' : 'Discharging'}:</span>
                <span className="font-bold">{Math.abs(data.bessDispatchMW)} MW (SoC: {data.bessSoCPct}%)</span>
              </div>
            )}
            {data.curtailmentMW > 0 && (
              <div className="flex justify-between text-rose-400 font-bold">
                <span>Dynamic Curtailment:</span>
                <span>{data.curtailmentMW} MW</span>
              </div>
            )}
            {data.reserveCallMW > 0 && (
              <div className="flex justify-between text-amber-400 font-bold">
                <span>Spinning Peaker Call:</span>
                <span>{data.reserveCallMW} MW</span>
              </div>
            )}
          </div>
        )}

        {/* Atmospheric Indicators */}
        <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-400" />
            <span>GHI: {data.ghi} W/m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-sky-400" />
            <span>Wind 100m: {data.windSpeed100m} m/s</span>
          </div>
          <div className="flex items-center gap-1">
            <Cloud className="w-3 h-3 text-slate-300" />
            <span>Cloud: {data.cloudCoverPct}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Temp: {data.temperatureC}°C</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Calibrated Uncertainty Horizon ({horizonHours}h Rolling)
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800">
              Quantile Loss (TFT / LSTM)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Shaded envelope represents P10 (Conservative) to P90 (Optimistic) probability bounds.
          </p>
        </div>

        {/* Toggleable Layer Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setShowQuantiles(!showQuantiles)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all ${
              showQuantiles
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {showQuantiles ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>P10–P90 Band</span>
          </button>

          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all ${
              showSchedule
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {showSchedule ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Contract Schedule</span>
          </button>

          <button
            onClick={() => setShowBess(!showBess)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all ${
              showBess
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {showBess ? <Eye className="w-3.5 h-3.5 text-cyan-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>BESS Dispatch</span>
          </button>

          <button
            onClick={() => setShowCurtailment(!showCurtailment)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all ${
              showCurtailment
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {showCurtailment ? <Eye className="w-3.5 h-3.5 text-rose-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Curtailment Flag</span>
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-[360px] sm:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
          >
            <defs>
              {/* Uncertainty Band Gradient */}
              <linearGradient id="quantileGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.10} />
              </linearGradient>

              {/* Transparent base for P10 stacking */}
              <linearGradient id="transparentBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.0} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
              </linearGradient>

              {/* Curtailment Pattern */}
              <linearGradient id="curtailGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              interval={Math.ceil(horizonHours / 12) - 1}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              unit=" MW"
              domain={[0, Math.ceil((site.capacityMW * 1.05) / 50) * 50]}
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={site.capacityMW}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: `Rated Capacity: ${site.capacityMW} MW`,
                position: 'insideTopRight',
                fill: '#64748b',
                fontSize: 10,
              }}
            />

            {/* STACKED AREA TO CREATE P10-P90 UNCERTAINTY BAND */}
            {showQuantiles && (
              <>
                {/* 1. Base up to P10 (invisible) */}
                <Area
                  type="monotone"
                  dataKey="p10Base"
                  stackId="band"
                  stroke="none"
                  fill="url(#transparentBase)"
                  isAnimationActive={false}
                />
                {/* 2. Band between P10 and P90 */}
                <Area
                  type="monotone"
                  name="P10–P90 Uncertainty Envelope"
                  dataKey="quantileBandWidth"
                  stackId="band"
                  stroke="#10b981"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  fill="url(#quantileGradient)"
                  isAnimationActive={false}
                />
              </>
            )}

            {/* Curtailment Area Highlight */}
            {showCurtailment && (
              <Area
                type="step"
                name="Curtailment Order (MW)"
                dataKey="curtailmentDisplay"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#curtailGradient)"
              />
            )}

            {/* Contract Schedule Baseline (Dashed Dark Line) */}
            {showSchedule && (
              <Line
                type="monotone"
                name="Contracted Schedule"
                dataKey="scheduleMW"
                stroke="#334155"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}

            {/* P50 Expected Median Generation (Solid Vibrant Line) */}
            <Line
              type="monotone"
              name="P50 Expected Output"
              dataKey="p50MW"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 2, fill: '#059669', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* BESS Net Dispatch (Cyan Line) */}
            {showBess && (
              <Line
                type="monotone"
                name="BESS Dispatch (MW)"
                dataKey="bessNetMW"
                stroke="#0284c7"
                strokeWidth={2}
                dot={false}
              />
            )}

            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ paddingTop: '14px', fontSize: '11px' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Interpretation */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            <strong>Operator Guide:</strong> Whenever green P50 drops below the dashed schedule, BESS discharges to prevent DSM fines. When P90 exceeds intertie capacity, curtailment is triggered.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> P50 Expected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-slate-700 border-dashed" /> Schedule
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-200 border border-emerald-400" /> P10–P90 Band
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-300 border border-rose-500" /> Curtailment
          </span>
        </div>
      </div>
    </div>
  );
};
