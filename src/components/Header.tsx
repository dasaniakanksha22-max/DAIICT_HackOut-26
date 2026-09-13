import React from 'react';
import { RenewableSite } from '../types';
import {
  Zap,
  Sparkles,
  ChevronDown,
  SlidersHorizontal,
  Trophy,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  selectedSite: RenewableSite;
  sites: RenewableSite[];
  onSelectSite: (site: RenewableSite) => void;
  horizonHours: number;
  onHorizonChange: (h: number) => void;
  onOpenAiAdvisor: () => void;
  onOpenScenarioModal: () => void;
  onOpenPitchModal: () => void;
  activeScenarioName?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedSite,
  sites,
  onSelectSite,
  horizonHours,
  onHorizonChange,
  onOpenAiAdvisor,
  onOpenScenarioModal,
  onOpenPitchModal,
  activeScenarioName,
  isDarkMode,
  onToggleTheme,
  isSoundOn,
  onToggleSound,
  onToggleMobileMenu,
}) => {
  return (
    <header className={`border-b sticky top-0 z-40 transition-colors backdrop-blur-md ${
      isDarkMode
        ? 'border-slate-800/90 bg-slate-950/90 text-white'
        : 'border-slate-200/90 bg-white/90 text-slate-900'
    }`}>
      <div className="w-full px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* 1. Left: Mobile menu toggle + Brand + Name + Tagline */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className={`p-2 rounded-xl border lg:hidden cursor-pointer ${
                isDarkMode
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/20 font-bold">
            <Zap className="w-4 h-4 fill-current text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                SynapseGrid
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                isDarkMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                OS
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-medium leading-none mt-1 hidden xs:block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Probabilistic Renewable & BESS Operations
            </p>
          </div>
        </div>

        {/* 2. Center-Right: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Plant/Location Selector */}
          <div className="relative">
            <label htmlFor="plant-select" className="sr-only">Select Plant</label>
            <select
              id="plant-select"
              value={selectedSite.id}
              onChange={(e) => {
                const found = sites.find((s) => s.id === e.target.value);
                if (found) onSelectSite(found);
              }}
              className={`appearance-none text-xs font-semibold rounded-xl pl-2.5 sm:pl-3 pr-7 sm:pr-8 py-1.5 sm:py-2 border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 focus:border-emerald-500'
              }`}
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                  {site.name} ({site.capacityMW} MW)
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Time-Range Toggle (24h / 48h / 72h) */}
          <div className={`hidden sm:flex items-center p-0.5 rounded-xl border text-xs font-semibold ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            {[24, 48, 72].map((hours) => (
              <button
                key={hours}
                onClick={() => onHorizonChange(hours)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  horizonHours === hours
                    ? isDarkMode
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-white text-slate-900 font-bold shadow-xs'
                    : isDarkMode
                    ? 'hover:text-white'
                    : 'hover:text-slate-900'
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>

          {/* Weather Stress Simulator Pill Button */}
          <button
            onClick={onOpenScenarioModal}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeScenarioName && activeScenarioName !== 'Clear Sky NWP Baseline'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Stress Lab</span>
            {activeScenarioName && activeScenarioName !== 'Clear Sky NWP Baseline' && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </button>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}
            title={isSoundOn ? 'Mission Control Sound Active (Click to Mute)' : 'Sound Muted'}
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Theme Toggle (Dark Mission Control vs Daylight SCADA) */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400 hover:text-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title={isDarkMode ? 'Switch to Daylight SCADA' : 'Switch to Mission Control Dark Deck'}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Golden Trophy: Hackathon Defense Deck */}
          <button
            onClick={onOpenPitchModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Hackathon Deck</span>
          </button>

          {/* AI Copilot Pill */}
          <button
            onClick={onOpenAiAdvisor}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition-all active:scale-98 cursor-pointer shrink-0 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden xs:inline">AI Copilot</span>
          </button>

        </div>
      </div>
    </header>
  );
};
