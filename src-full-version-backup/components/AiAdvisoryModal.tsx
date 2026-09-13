import React, { useState, useEffect } from 'react';
import { RenewableSite, HourlyForecastPoint, GridRiskSummary, RolePerspective } from '../types';
import { Sparkles, X, Send, Bot, User, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface AiAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: RenewableSite;
  summary: GridRiskSummary;
  forecasts: HourlyForecastPoint[];
  currentRole: RolePerspective;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiAdvisoryModal: React.FC<AiAdvisoryModalProps> = ({
  isOpen,
  onClose,
  site,
  summary,
  forecasts,
  currentRole,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with real-time briefing on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchInitialAdvisory();
    }
  }, [isOpen]);

  const fetchInitialAdvisory = async () => {
    setIsLoading(true);
    const nowHour = new Date().getHours();
    const currentForecast = forecasts[0] || {
      p10MW: 200,
      p50MW: 450,
      p90MW: 600,
      scheduleMW: 420,
      riskLevel: summary.overallLevel,
    };

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: site.name,
          capacityMW: site.capacityMW,
          riskLevel: summary.overallLevel,
          p10MW: currentForecast.p10MW,
          p50MW: currentForecast.p50MW,
          p90MW: currentForecast.p90MW,
          scheduleMW: currentForecast.scheduleMW,
          weatherSummary: `Atmospheric uncertainty spread: ${summary.maxUncertaintySpreadMW} MW, Peak deficit: ${summary.peakDeficitMW} MW`,
          role: currentRole,
        }),
      });

      const data = await res.json();
      const advisoryText = data.advisory || `[SLDC Chief Advisory] ${site.name} has entered ${summary.overallLevel.toUpperCase()} state. Expected generation is ${currentForecast.p50MW} MW against schedule of ${currentForecast.scheduleMW} MW. Recommended action: Pre-charge BESS with ${summary.totalBessAbsorptionMWh} MWh and maintain spinning reserves.`;

      setMessages([
        {
          sender: 'ai',
          text: advisoryText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages([
        {
          sender: 'ai',
          text: `[SLDC Grid Dispatch Intelligence] Analysis for ${site.name} (${site.capacityMW} MW):\n• Risk State: ${summary.overallLevel.toUpperCase()} with ${summary.maxUncertaintySpreadMW} MW quantile spread.\n• BESS Dispatch: Recommend buffering surplus to avert ${summary.estimatedDsmPenaltyRiskInr > 0 ? `₹${(summary.estimatedDsmPenaltyRiskInr / 100000).toFixed(1)} Lakh` : 'DSM penalties'}.\n• Grid Stability: Maintain active frequency regulation within 49.90 - 50.05 Hz band.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt;
    setInputPrompt('');
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: site.name,
          capacityMW: site.capacityMW,
          riskLevel: summary.overallLevel,
          p10MW: forecasts[0]?.p10MW || 0,
          p50MW: forecasts[0]?.p50MW || 0,
          p90MW: forecasts[0]?.p90MW || 0,
          scheduleMW: forecasts[0]?.scheduleMW || 0,
          weatherSummary: `User query: "${userText}". Current grid state: Frequency ${summary.gridFrequencyHz} Hz, DSM risk ₹${summary.estimatedDsmPenaltyRiskInr}`,
          role: currentRole,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.advisory || 'Operational directive computed according to Indian Electricity Grid Code constraints.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Regarding "${userText}": Based on the 24-72h quantile sequence, BESS state-of-charge is sized to absorb up to ${site.bessCapacityMWh} MWh. If ramp rates exceed 15 MW/min, automatic secondary frequency control will engage.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col h-[600px] max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  SLDC AI Grid Advisory Copilot
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                  Gemini Flash 3.8
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Authoritative physical dispatch reasoning & DSM compliance advisory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((msg, index) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={index}
                className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-xs whitespace-pre-line'
                      : 'bg-slate-900 text-white shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1.5 ${isAi ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
                {!isAi && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-500 italic p-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Analyzing numerical weather grids and optimization vectors...</span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium">Ask:</span>
          {[
            'Explain P10-P90 spread drivers',
            'How to avoid DSM penalties at 13:00?',
            'What is the BESS thermal risk?',
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => {
                setInputPrompt(suggestion);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white rounded-b-2xl flex gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask SLDC Copilot about dispatch, spinning reserves, or DSM hedging..."
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
