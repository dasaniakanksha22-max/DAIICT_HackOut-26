import React from 'react';
import { RolePerspective, RiskLevel } from '../types';
import { Radio, Activity } from 'lucide-react';

interface StatusStripProps {
  currentRole: RolePerspective;
  onRoleChange: (role: RolePerspective) => void;
  riskLevel: RiskLevel;
  gridFrequencyHz: number;
  isLiveWeather: boolean;
  maxSpreadMW: number;
  isDarkMode: boolean;
}

export const StatusStrip: React.FC<StatusStripProps> = ({
  currentRole,
  onRoleChange,
  riskLevel,
  gridFrequencyHz,
  isLiveWeather,
  maxSpreadMW,
  isDarkMode,
}) => {
  const getSeverityBadge = () => {
    switch (riskLevel) {
      case 'critical':
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isDarkMode
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-rose-50 text-rose-700 border border-rose-200/80'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-bold">Critical Variance</span>
            <span className="text-rose-400 font-mono text-[11px] hidden sm:inline">±{maxSpreadMW} MW</span>
          </div>
        );
      case 'elevated':
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isDarkMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-amber-50 text-amber-800 border border-amber-200/80'
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-bold">Elevated Variance</span>
            <span className="text-amber-400 font-mono text-[11px] hidden sm:inline">±{maxSpreadMW} MW</span>
          </div>
        );
      default:
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isDarkMode
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold">Grid Balanced</span>
            <span className="text-emerald-400 font-mono text-[11px] hidden sm:inline">±{maxSpreadMW} MW</span>
          </div>
        );
    }
  };

  return (
    <div className={`border-b transition-colors ${
      isDarkMode ? 'border-slate-800/80 bg-slate-950/80 backdrop-blur-md' : 'border-slate-200/70 bg-white'
    }`}>
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Role Switcher Segmented Control */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold uppercase tracking-wider hidden lg:inline ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Perspective:
          </span>
          <div className={`inline-flex items-center p-1 rounded-xl border text-xs font-medium gap-1 ${
            isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200/70 text-slate-500'
          }`}>
            <button
              id="role-btn-grid-operator"
              onClick={() => onRoleChange('grid_operator')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'grid_operator'
                  ? isDarkMode
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white text-emerald-700 shadow-xs font-bold border border-emerald-200'
                  : isDarkMode
                  ? 'hover:text-white hover:bg-slate-900/60'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentRole === 'grid_operator' ? 'bg-slate-950' : 'bg-emerald-400'}`} />
              Grid Operator (SLDC)
            </button>
            <button
              id="role-btn-plant-owner"
              onClick={() => onRoleChange('plant_owner')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'plant_owner'
                  ? isDarkMode
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/20'
                    : 'bg-white text-cyan-700 shadow-xs font-bold border border-cyan-200'
                  : isDarkMode
                  ? 'hover:text-white hover:bg-slate-900/60'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentRole === 'plant_owner' ? 'bg-slate-950' : 'bg-cyan-400'}`} />
              Plant Owner (IPP)
            </button>
            <button
              id="role-btn-energy-trader"
              onClick={() => onRoleChange('energy_trader')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'energy_trader'
                  ? isDarkMode
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-white text-amber-700 shadow-xs font-bold border border-amber-200'
                  : isDarkMode
                  ? 'hover:text-white hover:bg-slate-900/60'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentRole === 'energy_trader' ? 'bg-slate-950' : 'bg-amber-400'}`} />
              Energy Trader (DAM/RTM)
            </button>
          </div>
        </div>

        {/* Right: Grid Telemetry & Color-Coded Severity Badge */}
        <div className="flex items-center justify-between sm:justify-end gap-3.5">
          {/* Subtle Live Feed Status */}
          <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden md:inline">Grid Frequency:</span>
            <span className={`font-mono font-bold ${
              gridFrequencyHz >= 49.90 && gridFrequencyHz <= 50.05
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}>
              {gridFrequencyHz.toFixed(2)} Hz
            </span>
            <span className={`w-2 h-2 rounded-full ${isLiveWeather ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} title="Live Sensor Feed Active" />
          </div>

          {/* Color-Coded Severity Badge Pinned to the Right */}
          {getSeverityBadge()}
        </div>

      </div>
    </div>
  );
};
