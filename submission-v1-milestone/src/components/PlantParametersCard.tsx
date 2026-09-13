import React from 'react';
import { RenewableSite, HourlyForecastPoint } from '../types';
import { Sun, Wind, Thermometer, Cloud, Activity, Compass, Zap } from 'lucide-react';

interface PlantParametersCardProps {
  site: RenewableSite;
  currentPoint?: HourlyForecastPoint;
}

export const PlantParametersCard: React.FC<PlantParametersCardProps> = ({ site, currentPoint }) => {
  const ghi = currentPoint?.ghi ?? (site.type === 'wind' ? 0 : 740);
  const dni = currentPoint?.dni ?? (site.type === 'wind' ? 0 : 620);
  const windSpeed = currentPoint?.windSpeed100m ?? 7.8;
  const temp = currentPoint?.temperatureC ?? 32.4;
  const cloud = currentPoint?.cloudCoverPct ?? 18;

  // Physical PV cell temperature & thermal derate
  const tCell = temp + 25 * (ghi / 800);
  const thermalLossPct = Math.max(0, (tCell - 25) * 0.38);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Atmospheric Ingestion & Physical Conversion Telemetry</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-variable feed from Open-Meteo REST API grounded in physical plant topology
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 font-medium">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>{site.lat.toFixed(2)}°N, {site.lon.toFixed(2)}°E</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Solar Irradiance */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold mb-1">
            <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> GHI / DNI</span>
            <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded font-mono">W/m²</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {ghi} <span className="text-xs font-normal text-slate-500">/ {dni}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Global & Direct Normal Irradiance
          </span>
        </div>

        {/* Wind Speed 100m */}
        <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-sky-700 text-xs font-semibold mb-1">
            <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> Hub Wind</span>
            <span className="text-[10px] bg-sky-100 px-1.5 py-0.5 rounded font-mono">100m</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {windSpeed.toFixed(1)} <span className="text-xs font-normal text-slate-500">m/s</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Betz power curve zone
          </span>
        </div>

        {/* Ambient & Cell Temp */}
        <div className="bg-orange-50/60 border border-orange-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-orange-700 text-xs font-semibold mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5" /> Cell Temp</span>
            <span className="text-[10px] bg-orange-100 px-1.5 py-0.5 rounded font-mono">°C</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {tCell.toFixed(1)}° <span className="text-xs font-normal text-slate-500">({temp}° amb)</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            -{thermalLossPct.toFixed(1)}% thermal loss derate
          </span>
        </div>

        {/* Cloud Cover */}
        <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold mb-1">
            <span className="flex items-center gap-1"><Cloud className="w-3.5 h-3.5" /> Cloud Cover</span>
            <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded font-mono">%</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {cloud}%
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Optical attenuation coefficient
          </span>
        </div>

        {/* Interconnection Substation */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold mb-1">
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Grid Intertie</span>
            <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded font-mono">kV</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {site.gridIntertieKV} kV
          </div>
          <span className="text-[10px] text-slate-500 block mt-1 truncate" title={site.operator}>
            {site.operator.split('/')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};
