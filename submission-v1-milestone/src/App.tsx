import React, { useState, useMemo, useEffect } from 'react';
import { RENEWABLE_SITES } from './data/sites';
import { RenewableSite, ScenarioPreset } from './types';
import { computeSynapseForecast } from './services/forecastEngine';
import { Header } from './components/Header';
import { TrafficLightBanner } from './components/TrafficLightBanner';
import { ForecastChart } from './components/ForecastChart';
import { PlantParametersCard } from './components/PlantParametersCard';
import { HourlyScheduleTable } from './components/HourlyScheduleTable';

const BASELINE_PRESET: ScenarioPreset = {
  id: 'baseline_clear',
  name: 'Standard Calibrated NWP',
  tagline: 'Normal clear atmospheric profile',
  description: 'Operational clear-sky and baseline NWP conditions',
  cloudMultiplier: 1.0,
  windMultiplier: 1.0,
  tempOffsetC: 0,
  gridCongestionActive: false,
  thermalMtlConstraint: false,
};

export default function App() {
  const [selectedSite, setSelectedSite] = useState<RenewableSite>(RENEWABLE_SITES[0]);
  const [horizonHours, setHorizonHours] = useState<number>(24);

  const [liveWeatherData, setLiveWeatherData] = useState<any>(null);
  const [isLiveWeather, setIsLiveWeather] = useState<boolean>(false);

  // Fetch live Open-Meteo weather when site changes
  useEffect(() => {
    let isCancelled = false;
    async function fetchWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedSite.lat}&longitude=${selectedSite.lon}&hourly=temperature_2m,direct_normal_irradiance,global_horizontal_irradiance,wind_speed_100m,cloud_cover&forecast_days=3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Live weather fetch failed');
        const data = await res.json();
        if (!isCancelled && data && data.hourly) {
          setLiveWeatherData({ hourly: data.hourly });
          setIsLiveWeather(true);
        }
      } catch (err) {
        if (!isCancelled) {
          setIsLiveWeather(false);
        }
      }
    }
    fetchWeather();
    return () => {
      isCancelled = true;
    };
  }, [selectedSite]);

  // Compute forecasts and summary from the physics engine
  const { forecasts, summary, averageExpectedMW } = useMemo(() => {
    const result = computeSynapseForecast(
      selectedSite,
      horizonHours,
      BASELINE_PRESET,
      liveWeatherData
    );

    const avgP50 = result.forecasts.length > 0
      ? Math.round(result.forecasts.reduce((acc, f) => acc + f.p50MW, 0) / result.forecasts.length)
      : 0;

    return {
      forecasts: result.forecasts,
      summary: result.summary,
      averageExpectedMW: avgP50,
    };
  }, [selectedSite, horizonHours, liveWeatherData]);

  const currentForecastPoint = forecasts[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Main Navigation */}
      <Header
        selectedSite={selectedSite}
        sites={RENEWABLE_SITES}
        onSelectSite={setSelectedSite}
        horizonHours={horizonHours}
        onHorizonChange={setHorizonHours}
        riskLevel={summary.overallLevel}
        gridFrequencyHz={summary.gridFrequencyHz}
        isLiveWeather={isLiveWeather}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Operational Traffic-Light Risk Banner */}
        <TrafficLightBanner
          summary={summary}
          site={selectedSite}
        />

        {/* 2. Key Executive Telemetry Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-xs block">Max Uncertainty Spread</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {summary.maxUncertaintySpreadMW} MW
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              P90 minus P10 confidence spread
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-xs block">Peak Forecast Deficit</span>
            <span className="text-xl font-bold font-mono text-rose-600">
              {summary.peakDeficitMW} MW
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Maximum drop below schedule
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-xs block">Average Expected Generation</span>
            <span className="text-xl font-bold font-mono text-emerald-700">
              {averageExpectedMW} MW
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              P50 median across {horizonHours}h
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-xs block">Grid Frequency Benchmark</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {summary.gridFrequencyHz.toFixed(2)} Hz
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">
              Nominal IEGC operational band
            </span>
          </div>
        </div>

        {/* 3. Main Quantile Uncertainty Sequence Chart */}
        <ForecastChart
          forecasts={forecasts}
          site={selectedSite}
          horizonHours={horizonHours}
        />

        {/* 4. Atmospheric Telemetry & Physical Parameters Card */}
        <PlantParametersCard
          site={selectedSite}
          currentPoint={currentForecastPoint}
        />

        {/* 5. CERC 15-Minute / Hourly Time-Block Schedule Table */}
        <HourlyScheduleTable
          forecasts={forecasts}
          site={selectedSite}
        />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        SynapseGrid • Renewable Generation Forecasting Platform • DA-IICT HackOut '26 • Team Semi;colon
      </footer>
    </div>
  );
}
