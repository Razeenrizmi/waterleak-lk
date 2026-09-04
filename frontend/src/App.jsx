import React, { useState } from 'react';
import ReportingForm from './modules/reporting/ReportingForm';
import LeakMap from './modules/map/LeakMap';
import AiLeakAnalyzer from './modules/ai-analysis/AiLeakAnalyzer';
import AdminDashboard from './modules/admin/AdminDashboard';
import mockData from './shared/mockData.json';
import { API_CONFIG } from './shared/apiConfig';
import { Droplet, Shield, MapPin, Sparkles, Layers, FileText, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('ai-analysis');
  const [leaks, setLeaks] = useState(mockData);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Sample report input state for demoing Member 3
  const [sampleDescription, setSampleDescription] = useState(
    'High pressure main pipeline burst on Galle Road near Bambalapitiya junction causing asphalt erosion and deep flooding.'
  );

  const handleAnalysisComplete = (result) => {
    console.log("Member 3 AI Analysis completed:", result);
    setCurrentAnalysis(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                WaterLeak <span className="text-cyan-400">LK</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Community Water Waste Management System • Sri Lanka Hackathon
              </p>
            </div>
          </div>

          {/* Member Navigation Tabs */}
          <nav className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ai-analysis')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'ai-analysis'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Member 3 (AI Module)
            </button>
            <button
              onClick={() => setActiveTab('reporting')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'reporting'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Member 1 (Report)
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'map'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Member 2 (Map)
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Member 4 (Admin)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Hackathon Architecture Notice Banner */}
        <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-xs text-slate-300">
              <strong className="text-cyan-300">Modular Team Architecture:</strong> Each module is completely isolated inside <code className="text-cyan-400">src/modules/</code>. Member 3's AI Analysis engine works standalone and shares JSON callbacks with Member 1 & Member 4.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            NWSDB Dispatch: <span className="text-emerald-400 font-bold">1939</span>
          </div>
        </div>

        {/* Dynamic View based on Active Tab */}
        {activeTab === 'ai-analysis' && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Live Demo: Member 3 AI Leak Analysis Module
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test the Gemini Vision / Heuristic Fallback AI Analysis engine. Enter a problem description or pick a sample below to see automated Sri Lankan severity calculation and NWSDB authority dispatch recommendations.
              </p>
              
              {/* Sample Description Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Sample Leak Description Input:
                </label>
                <textarea
                  value={sampleDescription}
                  onChange={(e) => setSampleDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400 font-semibold py-1">Quick Presets:</span>
                <button
                  onClick={() => setSampleDescription("Main pipeline burst flooding Galle Road Bambalapitiya with heavy pressure stream.")}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  Main Pipeline Burst (Critical)
                </button>
                <button
                  onClick={() => setSampleDescription("Commercial shop water meter overflowing into pavement drain under Kandy Road.")}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  Commercial Overflow (High)
                </button>
                <button
                  onClick={() => setSampleDescription("Slow constant tap leak in household garden near meter valve.")}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  Household Meter Leak (Low)
                </button>
              </div>
            </div>

            {/* Render Member 3 AI Component */}
            <AiLeakAnalyzer
              description={sampleDescription}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {activeTab === 'reporting' && <ReportingForm />}
        {activeTab === 'map' && <LeakMap leaks={leaks} />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        WaterLeak LK — Built for 4-Hour Hackathon • Sri Lanka National Water Waste Prevention Initiative
      </footer>
    </div>
  );
}
