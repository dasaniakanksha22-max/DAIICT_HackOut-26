import React from 'react';
import { RenewableSite, RiskLevel } from '../types';
import { Zap, Radio } from 'lucide-react';

interface HeaderProps {
  selectedSite: RenewableSite;
  sites: RenewableSite[];
  onSelectSite: (site: RenewableSite) => void;
  horizonHours: number;
  onHorizonChange: (h: number) => void;
  riskLevel: RiskLevel;
  gridFrequencyHz: number;
  isLiveWeather: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedSite,
  sites,
  onSelectSite,
  horizonHours,
  onHorizonChange,
  riskLevel,
  gridFrequencyHz,
  isLiveWeather,
}) => {
  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            CRITICAL RISK (RED)
          </span>
        );
      case 'elevated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            ELEVATED VARIANCE (AMBER)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            GRID BALANCED (GREEN)
          </span>
        );
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Telemetry Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DA-IICT HackOut '26</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-semibold">Team Semi;colon</span>
          </div>
          <span className="hidden md:inline text-slate-500">|</span>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-400">SLDC National Grid Frequency:</span>
            <span className={`font-mono font-bold ${
              gridFrequencyHz < 49.90 || gridFrequencyHz > 50.05 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {gridFrequencyHz.toFixed(2)} Hz
            </span>
            <span className="text-[10px] text-slate-500">(IEGC Band: 49.90 - 50.05)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>Atmospheric Feeds:</span>
            <span className={`font-semibold ${isLiveWeather ? 'text-emerald-400' : 'text-sky-300'}`}>
              {isLiveWeather ? 'LIVE SYNC (Open-Meteo REST API)' : 'CALIBRATED NWP'}
            </span>
          </div>
        </div>
      </div>

      {/* Main App Navigation & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Sub-tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 font-display">
                  SynapseGrid
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  RE FORECASTING
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Confidence-Aware Renewable Generation Forecasting • 24–72h P10/P50/P90
              </p>
            </div>
          </div>

          {/* Center Site Selector, Horizon & Risk Badge */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Site Dropdown */}
            <div className="relative">
              <label htmlFor="site-select" className="sr-only">Select Renewable Hub</label>
              <select
                id="site-select"
                value={selectedSite.id}
                onChange={(e) => {
                  const target = sites.find(s => s.id === e.target.value);
                  if (target) onSelectSite(target);
                }}
                aria-label="Select Renewable Hub"
                className="appearance-none bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer shadow-xs"
              >
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    📍 {site.name} ({site.capacityMW} MW • {site.type.toUpperCase()})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-xs">
                ▼
              </div>
            </div>

            {/* Forecast Horizon Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              {[24, 48, 72].map(hours => (
                <button
                  key={hours}
                  id={`horizon-btn-${hours}`}
                  onClick={() => onHorizonChange(hours)}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${
                    horizonHours === hours
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {hours}h Horizon
                </button>
              ))}
            </div>

            {/* Risk Indicator Badge */}
            <div>{getRiskBadge()}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
