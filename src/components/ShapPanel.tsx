import React from 'react';
import { ShapFactor, RenewableSite } from '../types';
import { HelpCircle, Sun, Cloud, Wind, Thermometer, Database, ChevronRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine, CartesianGrid } from 'recharts';

interface ShapPanelProps {
  shapFactors: ShapFactor[];
  site: RenewableSite;
  isDarkMode?: boolean;
  onViewDetails?: () => void;
}

export const ShapPanel: React.FC<ShapPanelProps> = ({
  shapFactors,
  site,
  isDarkMode = true,
  onViewDetails,
}) => {
  const chartData = shapFactors.map((f) => ({
    name: f.featureName,
    impactMW: f.impactMW,
    impactPct: f.impactPercentage,
    valueDisplay: f.valueDisplay,
    direction: f.direction,
    description: f.description,
  }));

  const getCategoryIcon = (category: ShapFactor['category']) => {
    switch (category) {
      case 'atmospheric':
        return <Cloud className="w-3.5 h-3.5 text-sky-400" />;
      case 'aerodynamic':
        return <Wind className="w-3.5 h-3.5 text-teal-400" />;
      case 'thermal':
        return <Thermometer className="w-3.5 h-3.5 text-rose-400" />;
      case 'grid_lag':
        return <Database className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className={`rounded-2xl border p-5 flex flex-col h-full transition-all ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
        : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-3.5 mb-3 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight">
              TreeSHAP Root-Cause Attribution
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
              isDarkMode
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              Layer 1 Interpretability
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Physical drivers causing deviation from baseline forecast
          </p>
        </div>

        <div className={`hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border font-mono ${
          isDarkMode
            ? 'bg-slate-950 border-slate-800 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Additive SHAP</span>
        </div>
      </div>

      {/* Diverging Waterfall Bar Chart */}
      <div className="h-52 w-full mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
            <XAxis
              type="number"
              stroke={isDarkMode ? '#64748b' : '#94a3b8'}
              fontSize={10}
              unit=" MW"
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={isDarkMode ? '#cbd5e1' : '#334155'}
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? '#334155' : '#cbd5e1' }}
              width={125}
            />
            <Tooltip
              formatter={(value: any, name: any, item: any) => [
                `${value > 0 ? '+' : ''}${value} MW (${item.payload.valueDisplay})`,
                'Attribution Delta',
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                fontSize: '11px',
                color: '#fff',
              }}
            />
            <ReferenceLine x={0} stroke={isDarkMode ? '#64748b' : '#94a3b8'} strokeWidth={1.5} />
            <Bar dataKey="impactMW" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.impactMW >= 0 ? '#10b981' : '#f43f5e'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 Drivers Horizontal Strip (No orphaned blocks, perfectly aligned) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-auto pt-2">
        {shapFactors.slice(0, 3).map((factor) => (
          <div
            key={factor.featureName}
            className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
              isDarkMode
                ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                {getCategoryIcon(factor.category)}
                <span className="truncate">{factor.featureName}</span>
              </div>
              <span
                className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  factor.direction === 'positive'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {factor.impactMW > 0 ? '+' : ''}
                {factor.impactMW} MW
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Telemetry: <span className="font-mono text-slate-200 font-semibold">{factor.valueDisplay}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
