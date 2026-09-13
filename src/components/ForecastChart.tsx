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
import { Info, Check } from 'lucide-react';

interface ForecastChartProps {
  forecasts: HourlyForecastPoint[];
  site: RenewableSite;
  horizonHours: number;
  isDarkMode?: boolean;
  activeTime?: string;
  onSelectTimePoint?: (idx: number) => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  forecasts,
  site,
  horizonHours,
  isDarkMode = false,
  activeTime,
  onSelectTimePoint,
}) => {
  const [showQuantiles, setShowQuantiles] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);
  const [showBess, setShowBess] = useState(true);
  const [showCurtailment, setShowCurtailment] = useState(true);

  // Transform data for stacked or quantile band rendering
  const chartData = forecasts.map((f) => ({
    ...f,
    p10Base: f.p10MW,
    quantileBandWidth: Math.max(0, f.p90MW - f.p10MW),
    bessNetMW: f.bessDispatchMW,
    curtailmentDisplay: f.curtailmentMW > 0 ? f.curtailmentMW : null,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: HourlyForecastPoint = payload[0].payload;

    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs backdrop-blur-md max-w-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="font-bold text-slate-200 font-mono">
            {data.dateStr} • {data.time}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
            data.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
            data.riskLevel === 'elevated' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {data.riskLevel}
          </span>
        </div>

        {/* Quantiles Detail */}
        <div className="space-y-1.5 font-mono mb-2">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 font-sans">P90 Ceiling:</span>
            <span className="font-bold text-sky-300">{data.p90MW} MW</span>
          </div>
          <div className="flex justify-between items-center text-white bg-slate-800/80 px-2 py-1 rounded-md">
            <span className="text-emerald-400 font-bold font-sans">P50 Expected:</span>
            <span className="font-bold text-emerald-400 text-sm">{data.p50MW} MW</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 font-sans">P10 Floor:</span>
            <span className="font-bold text-indigo-300">{data.p10MW} MW</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1.5 border-t border-slate-800">
            <span className="font-sans">Uncertainty Spread:</span>
            <span className="font-semibold text-amber-300">±{Math.round(data.uncertaintySpreadMW / 2)} MW</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span className="font-sans">Contract Baseline:</span>
            <span className="font-semibold text-slate-200">{data.scheduleMW} MW</span>
          </div>
        </div>

        {/* Optimization details */}
        {(data.bessDispatchMW !== 0 || data.curtailmentMW > 0) && (
          <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 font-mono">
            {data.bessDispatchMW !== 0 && (
              <div className="flex justify-between text-cyan-300">
                <span className="font-sans">BESS {data.bessDispatchMW < 0 ? 'Charge' : 'Discharge'}:</span>
                <span className="font-bold">{Math.abs(data.bessDispatchMW)} MW (SoC: {data.bessSoCPct}%)</span>
              </div>
            )}
            {data.curtailmentMW > 0 && (
              <div className="flex justify-between text-rose-300">
                <span className="font-sans">Curtailment:</span>
                <span className="font-bold">{data.curtailmentMW} MW</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border p-6 transition-all ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md shadow-xl text-white'
        : 'bg-white border-slate-200/80 shadow-xs text-slate-900'
    }`}>
      
      {/* Header + Filter Chip Legend */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Probabilistic Generation Forecast & Quantile Risk Profile
            </h2>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              {horizonHours}h Horizon
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Expected P50 generation framed by P10–P90 confidence envelope against contracted day-ahead schedules.
          </p>
        </div>

        {/* Toggle-able Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setShowQuantiles(!showQuantiles)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              showQuantiles
                ? isDarkMode
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showQuantiles ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>P10–P90 Confidence Band</span>
          </button>

          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              showSchedule
                ? isDarkMode
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className={`w-2 h-0.5 ${showSchedule ? 'bg-white' : 'bg-slate-500'}`} />
            <span>Contract Schedule</span>
          </button>

          <button
            onClick={() => setShowBess(!showBess)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              showBess
                ? isDarkMode
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-2xs'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showBess ? 'bg-cyan-400' : 'bg-slate-500'}`} />
            <span>BESS Action</span>
          </button>

          <button
            onClick={() => setShowCurtailment(!showCurtailment)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              showCurtailment
                ? isDarkMode
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs'
                : isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showCurtailment ? 'bg-rose-400' : 'bg-slate-500'}`} />
            <span>Curtailment Spill</span>
          </button>
        </div>
      </div>

      {/* Primary Chart Canvas with Generous Vertical Space & Soft Gridlines */}
      <div className="h-[380px] sm:h-[440px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
            onClick={(e: any) => {
              if (e && e.activeTooltipIndex !== undefined && onSelectTimePoint) {
                onSelectTimePoint(e.activeTooltipIndex);
              }
            }}
          >
            <defs>
              <linearGradient id="softConfidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={isDarkMode ? 0.35 : 0.25} />
                <stop offset="95%" stopColor="#059669" stopOpacity={isDarkMode ? 0.08 : 0.05} />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />

            <XAxis
              dataKey="time"
              stroke={isDarkMode ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? '#334155' : '#e2e8f0' }}
              interval={Math.ceil(chartData.length / 12)}
            />
            <YAxis
              stroke={isDarkMode ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? '#334155' : '#e2e8f0' }}
              unit=" MW"
              domain={[0, Math.ceil(site.capacityMW * 1.08)]}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Active Time Cursor from Time Machine */}
            {activeTime && (
              <ReferenceLine
                x={activeTime}
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: `Interval: ${activeTime}`,
                  fill: '#38bdf8',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}

            {/* Plant Capacity Baseline */}
            <ReferenceLine
              y={site.capacityMW}
              stroke={isDarkMode ? '#334155' : '#e2e8f0'}
              strokeDasharray="4 4"
              label={{
                value: `Capacity: ${site.capacityMW} MW`,
                fill: isDarkMode ? '#64748b' : '#94a3b8',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            {/* Invisible P10 Base Stack */}
            {showQuantiles && (
              <Area
                type="monotone"
                dataKey="p10Base"
                stackId="quantile_envelope"
                stroke="transparent"
                fill="transparent"
                legendType="none"
              />
            )}

            {/* Soft Accent Confidence Band */}
            {showQuantiles && (
              <Area
                type="monotone"
                name="P10–P90 Confidence Envelope"
                dataKey="quantileBandWidth"
                stackId="quantile_envelope"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                fill="url(#softConfidenceBand)"
              />
            )}

            {/* Contract Day-Ahead Schedule */}
            {showSchedule && (
              <Line
                type="stepAfter"
                name="Contract Schedule"
                dataKey="scheduleMW"
                stroke={isDarkMode ? '#e2e8f0' : '#0f172a'}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            )}

            {/* Expected P50 Generation Primary Trace */}
            <Line
              type="monotone"
              name="Expected P50 Generation"
              dataKey="p50MW"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* Curtailment Line */}
            {showCurtailment && (
              <Line
                type="monotone"
                name="Curtailment MW"
                dataKey="curtailmentDisplay"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 3, fill: '#f43f5e' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Context */}
      <div className={`mt-4 pt-3.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
        isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
      }`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            P50 Expected Median
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/20 border border-emerald-400 inline-block" />
            P10–P90 Quantile Band
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className={`w-3 h-0.5 border-t-2 border-dashed inline-block ${isDarkMode ? 'border-slate-200' : 'border-slate-900'}`} />
            Contract Schedule
          </span>
        </div>

        <div className="font-mono text-[11px]">
          Resolution: 15-min CERC Time Blocks • Open-Meteo REST Integrated
        </div>
      </div>

    </div>
  );
};
