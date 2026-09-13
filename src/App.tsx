import React, { useState, useEffect, useMemo } from 'react';
import { RENEWABLE_SITES, SCENARIO_PRESETS } from './data/sites';
import { RolePerspective, RenewableSite, ScenarioPreset, DispatchAction } from './types';
import { computeSynapseForecast } from './services/forecastEngine';

import { Header } from './components/Header';
import { StatusStrip } from './components/StatusStrip';
import { ConditionalAlertBanner } from './components/ConditionalAlertBanner';
import { InteractiveStressBar } from './components/InteractiveStressBar';
import { LivePowerFlowDiagram } from './components/LivePowerFlowDiagram';
import { TimeMachinePlayer } from './components/TimeMachinePlayer';
import { KpiMetricsRow } from './components/KpiMetricsRow';
import { ForecastChart } from './components/ForecastChart';
import { DispatchOptimizerView } from './components/DispatchOptimizerView';
import { HourlyScheduleTable } from './components/HourlyScheduleTable';
import { ShapPanel } from './components/ShapPanel';
import { RoleSpecificViews } from './components/RoleSpecificViews';
import { CompactDispatchQueue } from './components/CompactDispatchQueue';
import { AppSidebar, DashboardViewId } from './components/AppSidebar';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';
import { AiAdvisoryModal } from './components/AiAdvisoryModal';
import { HackathonPitchModal } from './components/HackathonPitchModal';
import { LoginPage } from './components/LoginPage';
import { Footer } from './components/Footer';

import { CheckCircle2, RotateCcw } from 'lucide-react';
import { toggleAudio, isAudioEnabled } from './utils/audioFx';

export default function App() {
  const [selectedSite, setSelectedSite] = useState<RenewableSite>(RENEWABLE_SITES[0]);
  const [horizonHours, setHorizonHours] = useState<number>(24);
  const [currentRole, setCurrentRole] = useState<RolePerspective>('grid_operator');
  const [activePreset, setActivePreset] = useState<ScenarioPreset>(SCENARIO_PRESETS[0]);
  
  // Theme state: dark mode default for Mission Control aesthetic
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  // Sidebar navigation & responsive drawer states
  const [activeView, setActiveView] = useState<DashboardViewId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Time Machine & Playback scrubber state
  const [timeIndex, setTimeIndex] = useState<number>(10); // default to 10:00 AM peak
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Modals state
  const [scenarioModalOpen, setScenarioModalOpen] = useState<boolean>(false);
  const [aiAdvisorModalOpen, setAiAdvisorModalOpen] = useState<boolean>(false);
  const [pitchModalOpen, setPitchModalOpen] = useState<boolean>(false);

  const [executedActionIds, setExecutedActionIds] = useState<Set<string>>(new Set());
  const [dismissedActionIds, setDismissedActionIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [liveWeatherData, setLiveWeatherData] = useState<any>(null);
  const [isLiveWeather, setIsLiveWeather] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>({
    name: 'Devansh Sharma (Chief Dispatcher)',
    email: 'operator@synapsegrid.energy',
    role: 'grid_operator',
  });

  const handleLogin = (user: { name: string; email: string; role: string }) => {
    setCurrentUser(user);
    if (user.role === 'grid_operator' || user.role === 'asset_manager' || user.role === 'compliance_officer') {
      setCurrentRole(user.role as RolePerspective);
    }
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.name}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Logged out of SCADA session.');
  };

  const handleToggleSound = () => {
    const newState = toggleAudio();
    setIsSoundOn(newState);
    showToast(newState ? 'Audio Telemetry Chimes Enabled' : 'Audio Muted');
  };

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

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

  // Bound timeIndex within forecast range
  const safeTimeIndex = Math.min(timeIndex, Math.max(0, forecasts.length - 1));
  const currentTimePoint = forecasts[safeTimeIndex] || forecasts[0];

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

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors ${
      isDarkMode
        ? 'bg-[#080d16] text-slate-100 selection:bg-emerald-400 selection:text-slate-950'
        : 'bg-[#f8fafc] text-slate-900 selection:bg-emerald-500 selection:text-white'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Bar with Mobile Drawer Hamburger */}
      <Header
        selectedSite={selectedSite}
        sites={RENEWABLE_SITES}
        onSelectSite={setSelectedSite}
        horizonHours={horizonHours}
        onHorizonChange={setHorizonHours}
        onOpenAiAdvisor={() => setAiAdvisorModalOpen(true)}
        onOpenScenarioModal={() => setScenarioModalOpen(true)}
        onOpenPitchModal={() => setPitchModalOpen(true)}
        activeScenarioName={activePreset.name}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        onToggleMobileMenu={() => setIsMobileDrawerOpen((prev) => !prev)}
      />

      {/* 2. Status Strip (Role Switcher + Severity Badge Pinned to Right) */}
      <StatusStrip
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        riskLevel={summary.overallLevel}
        gridFrequencyHz={summary.gridFrequencyHz}
        isLiveWeather={isLiveWeather}
        maxSpreadMW={summary.maxUncertaintySpreadMW}
        isDarkMode={isDarkMode}
      />

      {/* Main Responsive Layout: Side Drawer Navigation + Central Workspace */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto min-h-0">
        {/* Modern Collapsible / Fixed Side Drawer */}
        <AppSidebar
          activeView={activeView}
          onSelectView={(view) => {
            setActiveView(view);
            setIsMobileDrawerOpen(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
          isDarkMode={isDarkMode}
          selectedSite={selectedSite}
          currentRole={currentRole}
          pendingDirectivesCount={actions.filter((a) => a.status === 'pending').length}
          criticalAlertCount={summary.overallLevel === 'critical' ? 2 : summary.overallLevel === 'elevated' ? 1 : 0}
          onOpenScenarioModal={() => setIsMobileDrawerOpen(false) || setScenarioModalOpen(true)}
          onOpenPitchModal={() => setIsMobileDrawerOpen(false) || setPitchModalOpen(true)}
          onOpenAiAdvisor={() => setIsMobileDrawerOpen(false) || setAiAdvisorModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Central Workspace Container */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 py-5 sm:py-6 space-y-6 overflow-x-hidden">
          
          {/* Interactive Weather Stress Injection Bar */}
          <InteractiveStressBar
            activePreset={activePreset}
            onSelectPreset={(preset) => {
              setActivePreset(preset);
              showToast(`Stress Scenario: ${preset.name} applied.`);
            }}
            isDarkMode={isDarkMode}
          />

          {/* 3. Conditional Alert Banner */}
          <ConditionalAlertBanner
            summary={summary}
            site={selectedSite}
            scenario={activePreset}
            onExecutePrimaryAction={handleExecutePrimaryAction}
            onOpenAiAdvisor={() => setAiAdvisorModalOpen(true)}
          />

          {/* 5. KPI Metrics Row (Changes dynamically based on selected Perspective: SLDC vs IPP vs Trader) */}
          <KpiMetricsRow summary={summary} site={selectedSite} currentRole={currentRole} isDarkMode={isDarkMode} />

          {/* Time Machine Playback Controller (Always available to scrub through forecasts) */}
          <TimeMachinePlayer
            forecasts={forecasts}
            currentIndex={safeTimeIndex}
            onIndexChange={setTimeIndex}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
          />

          {/* View-Dependent Modules Selected via Side Drawer */}

          {/* View A: Executive Overview (Dual-Pane Mission Control Architecture) */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Real-time SCADA Power Flow Diagram */}
              <LivePowerFlowDiagram
                site={selectedSite}
                currentPoint={currentTimePoint}
                gridFrequencyHz={summary.gridFrequencyHz}
              />

              {/* Mission Control Dual-Pane Row: Forecast Curve + Compact Dispatch Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Pane (8 cols): Primary Quantile Forecast Chart */}
                <div className="lg:col-span-8 flex flex-col">
                  <ForecastChart
                    forecasts={forecasts}
                    site={selectedSite}
                    horizonHours={horizonHours}
                    isDarkMode={isDarkMode}
                    activeTime={currentTimePoint?.time}
                    onSelectTimePoint={(idx) => setTimeIndex(idx)}
                  />
                </div>

                {/* Right Pane (4 cols): Real-Time BESS Dispatch Queue */}
                <div className="lg:col-span-4 flex flex-col">
                  <CompactDispatchQueue
                    actions={actions}
                    onExecuteAction={handleExecuteAction}
                    onExecuteAll={handleExecuteAll}
                    onViewAll={() => setActiveView('bess')}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* Secondary Operational Row: TreeSHAP Feature Attribution & Quick Role Console */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <ShapPanel shapFactors={shapFactors} site={selectedSite} isDarkMode={isDarkMode} />
                </div>
                <div className="lg:col-span-6">
                  <RoleSpecificViews
                    currentRole={currentRole}
                    site={selectedSite}
                    summary={summary}
                    forecasts={forecasts}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* View B: Dedicated SCADA Power Flow Focus */}
          {activeView === 'powerflow' && (
            <div className="space-y-6">
              <LivePowerFlowDiagram
                site={selectedSite}
                currentPoint={currentTimePoint}
                gridFrequencyHz={summary.gridFrequencyHz}
              />
              <ForecastChart
                forecasts={forecasts}
                site={selectedSite}
                horizonHours={horizonHours}
                isDarkMode={isDarkMode}
                activeTime={currentTimePoint?.time}
                onSelectTimePoint={(idx) => setTimeIndex(idx)}
              />
            </div>
          )}

          {/* View C: P10-P90 Curves Focus */}
          {activeView === 'curves' && (
            <div className="space-y-6">
              <ForecastChart
                forecasts={forecasts}
                site={selectedSite}
                horizonHours={horizonHours}
                isDarkMode={isDarkMode}
                activeTime={currentTimePoint?.time}
                onSelectTimePoint={(idx) => setTimeIndex(idx)}
              />
              <HourlyScheduleTable
                forecasts={forecasts}
                site={selectedSite}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* View D: BESS Dispatch Focus */}
          {activeView === 'bess' && (
            <div className="space-y-6">
              <DispatchOptimizerView
                actions={actions}
                site={selectedSite}
                summary={summary}
                forecasts={forecasts}
                onExecuteAction={handleExecuteAction}
                onDismissAction={handleDismissAction}
                onExecuteAll={handleExecuteAll}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* View E: CERC Schedule Focus */}
          {activeView === 'schedule' && (
            <div className="space-y-6">
              <HourlyScheduleTable
                forecasts={forecasts}
                site={selectedSite}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* View F: SHAP Explainability Focus */}
          {activeView === 'shap' && (
            <div className="space-y-6">
              <ShapPanel shapFactors={shapFactors} site={selectedSite} isDarkMode={isDarkMode} />
            </div>
          )}

          {/* View G: Role Console Focus */}
          {activeView === 'roles' && (
            <div className="space-y-6">
              <RoleSpecificViews
                currentRole={currentRole}
                site={selectedSite}
                summary={summary}
                forecasts={forecasts}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

        </main>
      </div>

      {/* 8. Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Scenario Stress Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
        activePreset={activePreset}
        onSelectPreset={(p) => {
          setActivePreset(p);
          setScenarioModalOpen(false);
          showToast(`Applied weather stress scenario: ${p.name}`);
        }}
        onUpdateManualParams={(updated) => {
          setActivePreset((prev) => ({ ...prev, ...updated }));
        }}
        isDarkMode={isDarkMode}
      />

      {/* AI Advisory Copilot Modal */}
      <AiAdvisoryModal
        isOpen={aiAdvisorModalOpen}
        onClose={() => setAiAdvisorModalOpen(false)}
        site={selectedSite}
        summary={summary}
        forecasts={forecasts}
        currentRole={currentRole}
        isDarkMode={isDarkMode}
      />

      {/* Hackathon Defense Showcase Modal */}
      <HackathonPitchModal
        isOpen={pitchModalOpen}
        onClose={() => setPitchModalOpen(false)}
        onOpenAiAdvisor={() => {
          setPitchModalOpen(false);
          setAiAdvisorModalOpen(true);
        }}
        onTriggerSandstorm={() => {
          const sandstormPreset = SCENARIO_PRESETS.find((p) => p.id === 'sandstorm_curtailment') || SCENARIO_PRESETS[1];
          setActivePreset(sandstormPreset);
          setPitchModalOpen(false);
          showToast('Thar Sandstorm Anomaly triggered! Observe BESS buffering.');
        }}
      />

    </div>
  );
}

