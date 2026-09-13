import React from 'react';
import { ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/sites';
import { X, SlidersHorizontal, CloudRain, Sun, Wind, Flame, ZapOff, Check } from 'lucide-react';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePreset: ScenarioPreset;
  onSelectPreset: (preset: ScenarioPreset) => void;
  onUpdateManualParams: (updated: Partial<ScenarioPreset>) => void;
  isDarkMode?: boolean;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  activePreset,
  onSelectPreset,
  onUpdateManualParams,
  isDarkMode = true,
}) => {
  if (!isOpen) return null;

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'monsoon_front':
        return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'heatwave_clipping':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'wind_ramp_drop':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'coal_mtl_congestion':
        return <ZapOff className="w-5 h-5 text-rose-400" />;
      default:
        return <Sun className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all ${
        isDarkMode
          ? 'bg-slate-900 border-slate-700/80 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              isDarkMode
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-indigo-100 text-indigo-700'
            }`}>
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Weather Anomaly & Grid Stress Simulator
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Test how SynapseGrid's uncertainty model and PuLP decision layer react to extreme real-world events.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Preset Cards */}
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider block mb-2.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-700'
            }`}>
              Select Preset Grid Scenario
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SCENARIO_PRESETS.map((preset) => {
                const isSelected = activePreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? 'border-indigo-500 bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500/80 text-white'
                          : 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                        : isDarkMode
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className={`flex items-center gap-2 font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {getPresetIcon(preset.id)}
                        <span>{preset.name}</span>
                      </div>
                      {isSelected && (
                        <span className="p-0.5 rounded-full bg-indigo-600 text-white">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-snug ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Sliders for Custom Stress Testing */}
          <div className={`pt-4 border-t space-y-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <span className={`text-xs font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              Fine-Tune Atmospheric Variables
            </span>

            {/* Cloud Multiplier */}
            <div>
              <div className={`flex justify-between text-xs mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>Cloud Optical Attenuation Multiplier:</span>
                <span className="font-mono font-bold text-indigo-400">{activePreset.cloudMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={activePreset.cloudMultiplier}
                onChange={(e) => onUpdateManualParams({ cloudMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Higher multiplier deepens P10-P90 spread during midday
              </span>
            </div>

            {/* Wind Speed Multiplier */}
            <div>
              <div className={`flex justify-between text-xs mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>100m Wind Velocity Multiplier:</span>
                <span className="font-mono font-bold text-teal-400">{activePreset.windMultiplier.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={activePreset.windMultiplier}
                onChange={(e) => onUpdateManualParams({ windMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Controls aerodynamic turbine kinetic energy
              </span>
            </div>

            {/* Temp Offset */}
            <div>
              <div className={`flex justify-between text-xs mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>Ambient Temperature Offset:</span>
                <span className="font-mono font-bold text-amber-400">
                  {activePreset.tempOffsetC > 0 ? `+${activePreset.tempOffsetC}` : activePreset.tempOffsetC}°C
                </span>
              </div>
              <input
                type="range"
                min="-8"
                max="12"
                step="1"
                value={activePreset.tempOffsetC}
                onChange={(e) => onUpdateManualParams({ tempOffsetC: parseInt(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Temperatures above 25°C trigger PV thermal derating (-0.38%/°C)
              </span>
            </div>

            {/* Coal MTL Congestion Toggle */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${
              isDarkMode
                ? 'border-slate-800 bg-slate-950/60'
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div>
                <span className={`text-xs font-bold block ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  Simulate Coal at Technical Minimum (55% MTL)
                </span>
                <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Forces urgent renewable curtailment when generation exceeds local absorption.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={activePreset.gridCongestionActive}
                  onChange={(e) => onUpdateManualParams({
                    gridCongestionActive: e.target.checked,
                    thermalMtlConstraint: e.target.checked,
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 sm:p-5 border-t flex items-center justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Changes apply instantly to live forecast charts & dispatch solver.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Apply & Inspect Grid Output
          </button>
        </div>
      </div>
    </div>
  );
};
