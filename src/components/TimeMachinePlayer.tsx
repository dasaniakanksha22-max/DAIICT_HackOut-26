import React, { useEffect, useRef } from 'react';
import { HourlyForecastPoint } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  Sun,
  Moon,
  Zap,
  BatteryCharging,
} from 'lucide-react';
import { playTickSound } from '../utils/audioFx';

interface TimeMachinePlayerProps {
  forecasts: HourlyForecastPoint[];
  currentIndex: number;
  onIndexChange: (idx: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export const TimeMachinePlayer: React.FC<TimeMachinePlayerProps> = ({
  forecasts,
  currentIndex,
  onIndexChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onSpeedChange,
}) => {
  const currentPoint = forecasts[currentIndex] || forecasts[0];
  const maxIdx = Math.max(0, forecasts.length - 1);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(250, 1000 / playbackSpeed);

    const timer = setInterval(() => {
      onIndexChange((prev: any) => {
        const next = prev >= maxIdx ? 0 : prev + 1;
        playTickSound();
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, maxIdx, onIndexChange]);

  const handleSeek = (newVal: number) => {
    onIndexChange(newVal);
    playTickSound();
  };

  // Preset time bookmarks
  const bookmarks = [
    { label: 'Sunrise', hourTarget: '06:00', icon: Sun },
    { label: 'Solar Peak', hourTarget: '12:00', icon: Zap },
    { label: 'Evening Peak', hourTarget: '18:00', icon: BatteryCharging },
    { label: 'Night Baseload', hourTarget: '23:00', icon: Moon },
  ];

  const handleJumpToHour = (targetHour: string) => {
    const foundIdx = forecasts.findIndex((f) => f.time.startsWith(targetHour.slice(0, 2)));
    if (foundIdx !== -1) {
      handleSeek(foundIdx);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Play/Pause Controls & Current Time Display */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Play 24-Hour Simulation'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => handleSeek(0)}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer border border-slate-700"
            title="Rewind to 00:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Time & Telemetry Chip */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 font-mono">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-white leading-none">
                {currentPoint?.time || '00:00'} <span className="text-[10px] text-slate-400">({currentPoint?.dateStr})</span>
              </div>
              <div className="text-[10px] text-emerald-400 leading-none mt-1">
                Gen: {currentPoint?.p50MW || 0} MW
              </div>
            </div>
          </div>

          {/* Speed Toggle: 1x, 2x, 5x */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Scrubber Range Slider */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Interval #{currentIndex + 1} of {forecasts.length}
            </span>
            <span className="text-slate-300">
              Drag scrubber or press Play to simulate diurnal grid duck-curve
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={maxIdx}
            value={currentIndex}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Right: Quick Jump Event Bookmarks */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
          {bookmarks.map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.label}
                onClick={() => handleJumpToHour(b.hourTarget)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span>{b.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
