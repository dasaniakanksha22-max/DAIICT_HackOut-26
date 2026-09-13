import React from 'react';
import { ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/sites';
import {
  Sun,
  Wind,
  CloudRain,
  AlertOctagon,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { playAlertChime, playDispatchChime } from '../utils/audioFx';

interface InteractiveStressBarProps {
  activePreset: ScenarioPreset;
  onSelectPreset: (preset: ScenarioPreset) => void;
  isDarkMode: boolean;
}

export const InteractiveStressBar: React.FC<InteractiveStressBarProps> = ({
  activePreset,
  onSelectPreset,
  isDarkMode,
}) => {
  const handleSelect = (preset: ScenarioPreset) => {
    if (preset.id === 'baseline_clear') {
      playDispatchChime();
    } else {
      playAlertChime();
    }
    onSelectPreset(preset);
  };

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'sandstorm_curtailment':
        return <Wind className="w-3.5 h-3.5 text-amber-400" />;
      case 'monsoon_ramp_down':
        return <CloudRain className="w-3.5 h-3.5 text-sky-400" />;
      case 'transmission_trip':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
      case 'frequency_dip':
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Sun className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className={`p-3 rounded-2xl border transition-all ${
      isDarkMode
        ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-lg'
        : 'bg-slate-50 border-slate-200/90 shadow-2xs'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left Label */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className={`text-xs font-bold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Live Grid Stress Lab:
          </span>
          <span className={`text-[11px] hidden sm:inline ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Inject synthetic physical anomalies to test autonomous BESS flexibility
          </span>
        </div>

        {/* Interactive Scenario Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {SCENARIO_PRESETS.map((preset) => {
            const isActive = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelect(preset)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {getPresetIcon(preset.id)}
                <span>{preset.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
                )}
              </button>
            );
          })}

          {activePreset.id !== 'baseline_clear' && (
            <button
              onClick={() => handleSelect(SCENARIO_PRESETS[0])}
              className={`p-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  : 'bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
              }`}
              title="Reset to Clear Sky Baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
