import React, { useState, useEffect } from 'react';
import { analyzeWaterLeak } from './leakAnalysisService';
import { 
  Sparkles, 
  AlertTriangle, 
  Droplet, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Building2, 
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function AiLeakAnalyzer({ 
  imageFile = null, 
  imageUrl = '', 
  description = '', 
  onAnalysisComplete = () => {} 
}) {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [manualOverride, setManualOverride] = useState(false);
  const [editableSeverity, setEditableSeverity] = useState('HIGH');
  const [editableLoss, setEditableLoss] = useState(1000);
  const [editableType, setEditableType] = useState('');

  // Severity UI Styles Config
  const SEVERITY_CONFIG = {
    CRITICAL: {
      badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      barBg: 'bg-gradient-to-r from-rose-600 to-red-500',
      glow: 'shadow-rose-900/30',
      iconColor: 'text-rose-400',
      label: 'CRITICAL SEVERITY'
    },
    HIGH: {
      badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      barBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      glow: 'shadow-amber-900/30',
      iconColor: 'text-amber-400',
      label: 'HIGH SEVERITY'
    },
    MEDIUM: {
      badgeBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      barBg: 'bg-gradient-to-r from-yellow-400 to-amber-500',
      glow: 'shadow-yellow-900/30',
      iconColor: 'text-yellow-400',
      label: 'MEDIUM SEVERITY'
    },
    LOW: {
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      barBg: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      glow: 'shadow-emerald-900/30',
      iconColor: 'text-emerald-400',
      label: 'LOW SEVERITY'
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analyzeWaterLeak({ imageFile, imageUrl, description });
      setAnalysisResult(res);
      setEditableSeverity(res.severityLevel);
      setEditableLoss(res.estimatedLossPerHourLiters);
      setEditableType(res.leakType);
      onAnalysisComplete(res);
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sync state if manual override changes
  const handleSeverityChange = (newLevel) => {
    setEditableSeverity(newLevel);
    if (analysisResult) {
      const updated = {
        ...analysisResult,
        severityLevel: newLevel,
        severityScore: newLevel === 'CRITICAL' ? 95 : newLevel === 'HIGH' ? 75 : newLevel === 'MEDIUM' ? 50 : 25,
        estimatedLossPerHourLiters: editableLoss,
        leakType: editableType
      };
      setAnalysisResult(updated);
      onAnalysisComplete(updated);
    }
  };

  const currentLevelConfig = SEVERITY_CONFIG[editableSeverity] || SEVERITY_CONFIG.HIGH;

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/20 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              AI Leak Analysis Module
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono">
                Member 3
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated Severity & Sri Lankan Municipal (NWSDB) Dispatch Triage
            </p>
          </div>
        </div>

        {analysisResult && (
          <button
            onClick={() => setManualOverride(!manualOverride)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all flex items-center gap-1.5 ${
              manualOverride
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {manualOverride ? 'Manual Override Active' : 'Verify & Tweak'}
          </button>
        )}
      </div>

      {/* Trigger Button State (Before Analysis) */}
      {!analysisResult && !loading && (
        <div className="text-center py-8 px-4 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
          <Droplet className="w-12 h-12 text-cyan-500/50 mx-auto mb-3 animate-bounce" />
          <h4 className="text-base font-semibold text-slate-200 mb-1">
            Ready to Analyze Leak Metadata
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Upload an image or describe the issue to run Gemini Vision AI & local Sri Lankan municipal triage rules.
          </p>
          <button
            onClick={handleRunAnalysis}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Run AI Analysis Engine
          </button>
        </div>
      )}

      {/* Skeleton Loading Indicator */}
      {loading && (
        <div className="space-y-4 py-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-slate-800 rounded-lg" />
            <div className="h-6 w-24 bg-slate-800 rounded-full" />
          </div>
          <div className="h-24 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="h-4 w-1/3 bg-slate-800 rounded" />
            <div className="h-3 w-3/4 bg-slate-800/60 rounded" />
            <div className="h-3 w-1/2 bg-slate-800/60 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-slate-800/50 rounded-xl" />
            <div className="h-20 bg-slate-800/50 rounded-xl" />
          </div>
          <p className="text-center text-xs text-cyan-400 flex items-center justify-center gap-2 pt-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Processing visual & text cues for NWSDB dispatch rules...
          </p>
        </div>
      )}

      {/* Analysis Result Output */}
      {analysisResult && !loading && (
        <div className="space-y-6">
          {/* Triage Overview Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                Detected Leak Category
              </span>
              {manualOverride ? (
                <input
                  type="text"
                  value={editableType}
                  onChange={(e) => setEditableType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-cyan-300 font-bold px-3 py-1 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                />
              ) : (
                <span className="text-lg font-extrabold text-white">
                  {analysisResult.leakType}
                </span>
              )}
            </div>

            {/* Color-Coded Severity Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg ${currentLevelConfig.badgeBg} ${currentLevelConfig.glow}`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {editableSeverity}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                Score: {analysisResult.severityScore}/100
              </span>
            </div>
          </div>

          {/* Manual Severity Tweaker Control (when override active) */}
          {manualOverride && (
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Manual Override: Select Severity Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSeverityChange(lvl)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      editableSeverity === lvl
                        ? SEVERITY_CONFIG[lvl].badgeBg
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Water Loss Metric Gauge */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Droplet className="w-4 h-4 text-cyan-400" />
                Estimated Water Waste Rate
              </span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                ~{editableLoss.toLocaleString()} Liters / hour
              </span>
            </div>
            
            {/* Animated Progress Gauge Bar */}
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${currentLevelConfig.barBg}`}
                style={{ width: `${Math.min(100, (editableLoss / 4000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
              <span>0 L/hr</span>
              <span>2,000 L/hr</span>
              <span>4,000+ L/hr</span>
            </div>
          </div>

          {/* Practical Recommendations & Target Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                Target Municipal Authority
              </span>
              <p className="text-sm font-semibold text-white">
                {analysisResult.targetAuthority}
              </p>
              <span className="text-[11px] text-slate-400 block pt-1">
                Priority Index: <strong className="text-cyan-300 font-mono">{analysisResult.priorityScore}/100</strong>
              </span>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Recommended Response Action
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {analysisResult.recommendedAction}
              </p>
            </div>
          </div>

          {/* Civilian Safety Advisory Banner */}
          {analysisResult.safetyAdvisory && (
            <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                  Public Safety Advisory
                </span>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  {analysisResult.safetyAdvisory}
                </p>
              </div>
            </div>
          )}

          {/* Action / Re-analyze footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRunAnalysis}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-run AI Analysis
            </button>

            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Triage Payload Ready for Member 1 / 4 Storage
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
