import React, { useState } from 'react';
import { Shield, Zap, Lock, Mail, User, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
  isDarkMode?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isDarkMode = true }) => {
  const [email, setEmail] = useState('operator@synapsegrid.energy');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'grid_operator' | 'asset_manager' | 'compliance_officer'>('grid_operator');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let name = 'Devansh Sharma (Chief Dispatcher)';
      if (role === 'asset_manager') name = 'Priya Patel (BESS Asset Lead)';
      if (role === 'compliance_officer') name = 'Rajesh Verma (CERC Compliance Auditor)';

      onLogin({
        name,
        email: email || 'operator@synapsegrid.energy',
        role,
      });
    }, 600);
  };

  const handleQuickDemoFill = (selectedRole: typeof role, defaultEmail: string) => {
    setRole(selectedRole);
    setEmail(defaultEmail);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors ${
      isDarkMode ? 'bg-[#080d16] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 shadow-xl shadow-emerald-500/20 mb-3 font-bold">
            <Zap className="w-7 h-7 fill-slate-950" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Synapse<span className="text-emerald-400">Grid</span> OS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous Renewable Forecasting & BESS Dispatch Platform
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <Shield className="w-3 h-3" /> CERC / IEGC Secure Dispatch Terminal
          </div>
        </div>

        {/* Login Card */}
        <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}>
          <div className="mb-5">
            <h2 className="text-lg font-bold">Operator Authentication</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your control room credential profile to continue.
            </p>
          </div>

          {/* Quick Role Profile Switcher */}
          <div className="mb-5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Operator Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('grid_operator', 'sldc.operator@synapsegrid.energy')}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                  role === 'grid_operator'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Grid Operator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('asset_manager', 'bess.manager@synapsegrid.energy')}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                  role === 'asset_manager'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Asset Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('compliance_officer', 'cerc.auditor@synapsegrid.energy')}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                  role === 'compliance_officer'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Auditor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Work Email / SCADA ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@energy.gov.in"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Security Passkey
                </label>
                <span className="text-[11px] text-emerald-400 font-medium cursor-pointer hover:underline">
                  Hardware Token (YubiKey)
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Persist 24h SCADA Session</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">TLS 1.3 / AES-256</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <span>Authorizing National Grid Ingress...</span>
              ) : (
                <>
                  <span>Access Operational Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-semibold">Hackathon Demo Mode:</span> Passkeys are pre-loaded. Click any role button above to sign in as that persona and launch the dashboard.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-500 font-mono">
          DA-IICT HackOut '26 • Team Semi;colon • SynapseGrid v2.4
        </div>
      </div>
    </div>
  );
};
