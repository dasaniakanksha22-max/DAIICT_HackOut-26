import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

interface FooterProps {
  isDarkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode = false }) => {
  return (
    <footer className={`border-t py-6 mt-16 text-xs transition-colors ${
      isDarkMode
        ? 'border-slate-800/80 bg-slate-950/80 text-slate-400'
        : 'border-slate-200/70 bg-white text-slate-500'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Project Attribution */}
        <div>
          <div className={`font-semibold flex items-center gap-2 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>SynapseGrid Renewable Intelligence Platform</span>
          </div>
          <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            DA-IICT HackOut '26 • Team Semi;colon • Theme: Renewable Energy Forecasting & Grid Flexibility
          </p>
        </div>

        {/* Small Outlined Compliance Badges (Low-emphasis) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
            isDarkMode
              ? 'text-slate-300 bg-slate-900 border-slate-800'
              : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}>
            IEGC Grid Code Compliant
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
            isDarkMode
              ? 'text-slate-300 bg-slate-900 border-slate-800'
              : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}>
            CERC DSM Settlement Band
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
            isDarkMode
              ? 'text-slate-300 bg-slate-900 border-slate-800'
              : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}>
            TreeSHAP Additive Attribution
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
            isDarkMode
              ? 'text-slate-300 bg-slate-900 border-slate-800'
              : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}>
            PuLP MILP Optimization
          </span>
        </div>

      </div>
    </footer>
  );
};
