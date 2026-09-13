import React from 'react';
import { ShapFactor, RenewableSite } from '../types';
import { HelpCircle, ArrowUpRight, ArrowDownRight, Sun, Cloud, Wind, Thermometer, Database } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine, CartesianGrid } from 'recharts';

interface ShapPanelProps {
  shapFactors: ShapFactor[];
  site: RenewableSite;
}

export const ShapPanel: React.FC<ShapPanelProps> = ({ shapFactors, site }) => {
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
        return <Cloud className="w-4 h-4 text-sky-600" />;
      case 'aerodynamic':
        return <Wind className="w-4 h-4 text-teal-600" />;
      case 'thermal':
        return <Thermometer className="w-4 h-4 text-rose-600" />;
      case 'grid_lag':
        return <Database className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sun className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              TreeSHAP Feature Attribution & Root-Cause Explainability
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              Layer 1 Interpretability
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deconstructs exactly why the ML model shifted expected P50 generation and broadened the uncertainty envelope.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Calculated via Shapley Additive exPlanations</span>
        </div>
      </div>

      {/* Waterfall / Diverging Bar Chart */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 140, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              unit=" MW"
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#1e293b"
              fontSize={11}
              tickLine={false}
              width={140}
            />
            <Tooltip
              formatter={(value: any, name: any, item: any) => [
                `${value > 0 ? '+' : ''}${value} MW (${item.payload.impactPct > 0 ? '+' : ''}${item.payload.impactPct}%)`,
                'SHAP Impact',
              ]}
              labelFormatter={(label) => `Feature: ${label}`}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
            />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
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

      {/* Feature Breakdown Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {shapFactors.map((factor, idx) => {
          const isPositive = factor.direction === 'positive';
          return (
            <div
              key={idx}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  {getCategoryIcon(factor.category)}
                  <span className="truncate">{factor.featureName}</span>
                </div>
                <span
                  className={`inline-flex items-center text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                    isPositive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {isPositive ? '+' : ''}
                  {factor.impactMW} MW
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mb-1 flex items-center justify-between">
                <span>Observed telemetry:</span>
                <span className="font-semibold text-slate-700 font-mono">{factor.valueDisplay}</span>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
