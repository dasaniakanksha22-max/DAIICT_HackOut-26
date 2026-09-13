import React from 'react';
import {
  LayoutDashboard,
  Activity,
  LineChart,
  BatteryCharging,
  CalendarClock,
  Sparkles,
  Users,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { RenewableSite, RolePerspective } from '../types';

export type DashboardViewId =
  | 'overview'
  | 'powerflow'
  | 'curves'
  | 'bess'
  | 'schedule'
  | 'shap'
  | 'roles';

interface NavItem {
  id: DashboardViewId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

interface AppSidebarProps {
  activeView: DashboardViewId;
  onSelectView: (view: DashboardViewId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDarkMode: boolean;
  selectedSite: RenewableSite;
  currentRole: RolePerspective;
  pendingDirectivesCount: number;
  criticalAlertCount: number;
  onOpenScenarioModal: () => void;
  onOpenPitchModal: () => void;
  onOpenAiAdvisor: () => void;
  currentUser?: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  isDarkMode,
  selectedSite,
  currentRole,
  pendingDirectivesCount,
  criticalAlertCount,
  onOpenScenarioModal,
  onOpenPitchModal,
  onOpenAiAdvisor,
  currentUser,
  onLogout,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Mission Control',
      shortLabel: 'Overview',
      description: 'Unified telemetry & operational dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'powerflow',
      label: 'SCADA Power Flow',
      shortLabel: 'SCADA',
      description: 'Live SLD diagram & bus power flows',
      icon: Activity,
    },
    {
      id: 'curves',
      label: 'P10–P90 Envelopes',
      shortLabel: 'Curves',
      description: 'Probabilistic generation forecasts',
      icon: LineChart,
      badge: criticalAlertCount > 0 ? criticalAlertCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'bess',
      label: 'BESS Optimization',
      shortLabel: 'BESS',
      description: 'MILP battery charging/discharging',
      icon: BatteryCharging,
      badge: pendingDirectivesCount > 0 ? pendingDirectivesCount : undefined,
      badgeColor: 'bg-emerald-500 text-slate-950',
    },
    {
      id: 'schedule',
      label: 'CERC 15-Min Schedule',
      shortLabel: 'Schedule',
      description: 'Day-ahead & intraday dispatch log',
      icon: CalendarClock,
    },
    {
      id: 'shap',
      label: 'Explainable AI (SHAP)',
      shortLabel: 'SHAP',
      description: 'Feature attribution & physical drivers',
      icon: Sparkles,
    },
    {
      id: 'roles',
      label: 'Multi-Role Console',
      shortLabel: 'Roles',
      description: 'Operator, IPP, and Trader cockpits',
      icon: Users,
    },
  ];

  const getRoleDisplayName = (r: RolePerspective) => {
    switch (r) {
      case 'grid_operator':
        return 'Grid Operator';
      case 'plant_owner':
        return 'IPP Asset Owner';
      case 'energy_trader':
        return 'Energy Trader';
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between">
      {/* Top section: Header & Navigation */}
      <div className="space-y-4">
        {/* Brand / Title inside Sidebar */}
        <div className="px-3 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20 shrink-0">
              <Zap className="w-4 h-4 fill-current text-slate-950" />
            </div>
            {!isCollapsed && (
              <div className="leading-none">
                <span className="text-sm font-extrabold tracking-tight">SynapseGrid</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  OS
                </span>
                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Grid Optimization Core
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Selected Asset Quick Info Pill (When expanded) */}
        {!isCollapsed && (
          <div className="px-3">
            <div className={`p-2.5 rounded-xl border text-xs ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold truncate text-[11px]">{selectedSite.name}</span>
                <span className="font-mono text-[10px] text-emerald-400 font-semibold">{selectedSite.capacityMW} MW</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{selectedSite.state}</span>
                <span className="capitalize">{getRoleDisplayName(currentRole)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="px-2 space-y-1">
          <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {!isCollapsed ? 'Operational Cockpits' : '•••'}
          </div>

          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group relative ${
                  isActive
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`relative shrink-0 ${isActive ? 'text-emerald-400' : ''}`}>
                  <Icon className="w-4 h-4" />
                  {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 text-left flex items-center justify-between overflow-hidden">
                    <div className="truncate">
                      <div className="leading-none">{item.label}</div>
                      <div className={`text-[10px] font-normal truncate mt-0.5 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-emerald-500 text-slate-950'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Floating tooltip for collapsed view */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded-md whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-700 font-normal">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom section: Shortcuts & Fast Access Modals */}
      <div className="p-2 space-y-1.5 border-t border-slate-800/80 mt-4">
        {/* Stress Lab button */}
        <button
          onClick={() => {
            onOpenScenarioModal();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isDarkMode
              ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-amber-300'
              : 'border-slate-200 bg-amber-50 hover:bg-amber-100 text-amber-900'
          } ${isCollapsed ? 'justify-center px-2' : ''}`}
          title="Grid Stress Testing Lab"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Stress Testing Lab</span>}
        </button>

        {/* AI Copilot modal button */}
        <button
          onClick={() => {
            onOpenAiAdvisor();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
            isDarkMode
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 hover:from-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700'
          } ${isCollapsed ? 'justify-center px-2' : ''}`}
          title="AI Dispatch Advisory Copilot"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span className="truncate">AI Dispatch Advisory</span>}
        </button>

        {/* Hackathon Defense Deck button */}
        <button
          onClick={() => {
            onOpenPitchModal();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isDarkMode
              ? 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
              : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800'
          } ${isCollapsed ? 'justify-center px-2' : ''}`}
          title="Hackathon Presentation & Defense"
        >
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Hackathon Defense</span>}
        </button>

        {/* Logged in User & Logout Action */}
        <div className={`pt-2 mt-2 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
          {!isCollapsed && currentUser && (
            <div className="px-2 py-1 mb-1.5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] font-bold truncate text-slate-200">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono">
                  {currentUser.email}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              onLogout();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDarkMode
                ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                : 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title="Log Out of SCADA Session"
          >
            <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r transition-all duration-300 z-30 sticky top-0 h-screen ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isDarkMode
            ? 'border-slate-800/90 bg-slate-950/95 backdrop-blur-md text-white'
            : 'border-slate-200/90 bg-white/95 backdrop-blur-md text-slate-900'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay backdrop) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        >
          <div
            className={`w-72 h-full border-r p-2 shadow-2xl transition-transform ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
