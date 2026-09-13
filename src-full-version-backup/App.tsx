import React, { useState, useEffect, useMemo } from 'react';
import { RENEWABLE_SITES, SCENARIO_PRESETS } from './data/sites';
import { RolePerspective, RenewableSite, ScenarioPreset, DispatchAction } from './types';
import { computeSynapseForecast } from './services/forecastEngine';
import { Header } from './components/Header';
import { TrafficLightBanner } from './components/TrafficLightBanner';
import { ForecastChart } from './components/ForecastChart';
import { DispatchOptimizerView } from './components/DispatchOptimizerView';
import { ShapPanel } from './components/ShapPanel';
import { RoleSpecificViews } from './components/RoleSpecificViews';
import { ImpactMetricCards } from './components/ImpactMetricCards';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';
import { AiAdvisoryModal } from './components/AiAdvisoryModal';
import {
  TrendingUp,
  Cpu,
  BarChart3,
  Sliders,
  CheckCircle2,
  FileText,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function App() {
  const [selectedSite, setSelectedSite] = useState<RenewableSite>(RENEWABLE_SITES[0]);
  const [horizonHours, setHorizonHours] = useState<number>(24);
  const [currentRole, setCurrentRole] = useState<RolePerspective>('grid_operator');
  const [activePreset, setActivePreset] = useState<ScenarioPreset>(SCENARIO_PRESETS[0]);
  const [scenarioModalOpen, setScenarioModalOpen] = useState<boolean>(false);
  const [aiAdvisorModalOpen, setAiAdvisorModalOpen] = useState<boolean>(false);

  const [executedActionIds, setExecutedActionIds] = useState<Set<string>>(new Set());
  const [dismissedActionIds, setDismissedActionIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [liveWeatherData, setLiveWeatherData] = useState<any>(null);
  const [isLiveWeather, setIsLiveWeather] = useState<boolean>(false);

  // Fetch live Open-Meteo weather when site changes
  useEffect(() => {
    let isCancelled = false;
    async function loadWeather() {
      try {
        const res = await fetch(`/api/weather?lat=${selectedSite.lat}&lon=${selectedSite.lon}`);
        const data = await res.json();
        if (!isCancelled && data.success && data.data) {
          setLiveWeatherData(data.data);
          setIsLiveWeather(true);
        } else {
          setIsLiveWeather(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setIsLiveWeather(false);
        }
      }
    }
    loadWeather();
    return () => {
      isCancelled = true;
    };
  }, [selectedSite]);

  // Compute forecast and dispatch models
  const { forecasts, actions: rawActions, summary, shapFactors } = useMemo(() => {
    return computeSynapseForecast(selectedSite, horizonHours, activePreset, liveWeatherData);
  }, [selectedSite, horizonHours, activePreset, liveWeatherData]);

  // Apply execution status to actions
  const actions: DispatchAction[] = useMemo(() => {
    return rawActions
      .filter((a) => !dismissedActionIds.has(a.id))
      .map((a) => ({
        ...a,
        status: executedActionIds.has(a.id) ? 'executed' : a.status,
      }));
  }, [rawActions, executedActionIds, dismissedActionIds]);

  const handleExecuteAction = (id: string) => {
    setExecutedActionIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    showToast('Operational dispatch order transmitted to SLDC SCADA gateway.');
  };

  const handleDismissAction = (id: string) => {
    setDismissedActionIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleExecuteAll = () => {
    setExecutedActionIds((prev) => {
      const next = new Set(prev);
      actions.forEach((a) => next.add(a.id));
      return next;
    });
    showToast('All recommended dispatch commands executed across BESS & curtailment gates.');
  };

  const handleExecutePrimaryAction = () => {
    const firstPending = actions.find((a) => a.status === 'pending');
    if (firstPending) {
      handleExecuteAction(firstPending.id);
    } else {
      showToast('Grid already in optimal dispatch state. No pending orders.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'optimizer' | 'shap' | 'roles'>('overview');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedSite={selectedSite}
        sites={RENEWABLE_SITES}
        onSelectSite={setSelectedSite}
        horizonHours={horizonHours}
        onHorizonChange={setHorizonHours}
        riskLevel={summary.overallLevel}
        gridFrequencyHz={summary.gridFrequencyHz}
        isLiveWeather={isLiveWeather}
        onOpenAiAdvisor={() => setAiAdvisorModalOpen(true)}
        onOpenScenarioModal={() => setScenarioModalOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Active Scenario Indicator if not default */}
        {activePreset.id !== 'baseline_clear' && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>
                <strong>Simulated Stress Active:</strong> {activePreset.name} ({activePreset.tagline})
              </span>
            </div>
            <button
              onClick={() => setActivePreset(SCENARIO_PRESETS[0])}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
            >
              Reset to Clear Sky NWP
            </button>
          </div>
        )}

        {/* 1. Traffic-Light Risk Indicator Banner (Slide 9 & 4) */}
        <TrafficLightBanner
          summary={summary}
          site={selectedSite}
          scenario={activePreset}
          onExecutePrimaryAction={handleExecutePrimaryAction}
          onOpenAiAdvisor={() => setAiAdvisorModalOpen(true)}
        />

        {/* Workspace Section Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs font-bold">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Executive Dispatch Overview</span>
            </button>
            <button
              id="tab-forecast"
              onClick={() => setActiveTab('forecast')}
              className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'forecast'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Quantile Forecast (P10/P50/P90)</span>
            </button>
            <button
              id="tab-optimizer"
              onClick={() => setActiveTab('optimizer')}
              className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'optimizer'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Decision Optimization Layer ({actions.length})</span>
            </button>
            <button
              id="tab-shap"
              onClick={() => setActiveTab('shap')}
              className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'shap'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>SHAP Explainability</span>
            </button>
            <button
              id="tab-roles"
              onClick={() => setActiveTab('roles')}
              className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'roles'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Role Console ({currentRole.replace('_', ' ').toUpperCase()})</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center text-xs text-slate-500 font-medium">
            <span>Asset: <strong>{selectedSite.name}</strong> ({selectedSite.capacityMW} MW)</span>
          </div>
        </div>

        {/* Tab Content Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Main Forecast Visualizer */}
            <ForecastChart
              forecasts={forecasts}
              site={selectedSite}
              horizonHours={horizonHours}
            />

            {/* Prescriptive Dispatch Engine */}
            <DispatchOptimizerView
              actions={actions}
              site={selectedSite}
              summary={summary}
              forecasts={forecasts}
              onExecuteAction={handleExecuteAction}
              onDismissAction={handleDismissAction}
              onExecuteAll={handleExecuteAll}
            />

            {/* Role Perspective Console */}
            <RoleSpecificViews
              currentRole={currentRole}
              site={selectedSite}
              summary={summary}
              forecasts={forecasts}
            />

            {/* SHAP Feature Attribution Panel */}
            <ShapPanel shapFactors={shapFactors} site={selectedSite} />

            {/* Indian National Grid & Economic Impact Banner */}
            <ImpactMetricCards summary={summary} site={selectedSite} />
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <ForecastChart
              forecasts={forecasts}
              site={selectedSite}
              horizonHours={horizonHours}
            />
            <ShapPanel shapFactors={shapFactors} site={selectedSite} />
          </div>
        )}

        {activeTab === 'optimizer' && (
          <div className="space-y-6">
            <DispatchOptimizerView
              actions={actions}
              site={selectedSite}
              summary={summary}
              forecasts={forecasts}
              onExecuteAction={handleExecuteAction}
              onDismissAction={handleDismissAction}
              onExecuteAll={handleExecuteAll}
            />
            <ImpactMetricCards summary={summary} site={selectedSite} />
          </div>
        )}

        {activeTab === 'shap' && (
          <div className="space-y-6">
            <ShapPanel shapFactors={shapFactors} site={selectedSite} />
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-6">
            <RoleSpecificViews
              currentRole={currentRole}
              site={selectedSite}
              summary={summary}
              forecasts={forecasts}
            />
          </div>
        )}
      </main>

      {/* Footer / Hackathon Submission Context */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-800">
              SynapseGrid Renewable Intelligence Platform
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              DA-IICT HackOut '26 • Team Semi;colon • Theme: Renewable Energy Intelligence
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Indian Electricity Grid Code (IEGC) Compliant</span>
            <span>•</span>
            <span>CERC Deviation Settlement Mechanism (DSM)</span>
            <span>•</span>
            <span>Central Transmission Utility (CTU) Ready</span>
          </div>
        </div>
      </footer>

      {/* Scenario Simulation Modal */}
      <ScenarioSimulatorModal
        isOpen={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
        activePreset={activePreset}
        onSelectPreset={(p) => {
          setActivePreset(p);
          setScenarioModalOpen(false);
          showToast(`Applied scenario: ${p.name}`);
        }}
        onUpdateManualParams={(updated) => {
          setActivePreset((prev) => ({ ...prev, ...updated }));
        }}
      />

      {/* AI Advisory Copilot Modal */}
      <AiAdvisoryModal
        isOpen={aiAdvisorModalOpen}
        onClose={() => setAiAdvisorModalOpen(false)}
        site={selectedSite}
        summary={summary}
        forecasts={forecasts}
        currentRole={currentRole}
      />
    </div>
  );
}
