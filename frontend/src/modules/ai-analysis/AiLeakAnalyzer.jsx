import React, { useState, useRef } from 'react';
import { analyzeLeak } from '../../services/leakAnalysisService';

const SEVERITY_COLORS = {
  CRITICAL: 'bg-red-500 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-400 text-slate-900',
  LOW: 'bg-green-500 text-white'
};

const SEVERITY_BORDER = {
  CRITICAL: 'border-red-500',
  HIGH: 'border-orange-500',
  MEDIUM: 'border-yellow-400',
  LOW: 'border-green-500'
};

export default function AiLeakAnalyzer({ description, imageFile: initialFile, imageUrl: initialUrl, onAnalysisComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [manualOverride, setManualOverride] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialUrl || null);
  const [imageBase64, setImageBase64] = useState(null);
  const fileInputRef = useRef(null);

  // Convert File to Base64 data URL for Gemini Vision
  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!description && !imageBase64 && !imagePreview) {
      setError("Please enter a description or upload a photo of the leak to analyze.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Pass both description and image base64 data to backend for Gemini Vision analysis
      const analysisData = await analyzeLeak(description, imageBase64 || imagePreview);
      setResult(analysisData);
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError("Analysis encountered an issue. Reverted to heuristic triage.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualSeverityChange = (e) => {
    const newSeverity = e.target.value;
    const updatedResult = { ...result, severityLevel: newSeverity };
    setResult(updatedResult);
    if (onAnalysisComplete) {
      onAnalysisComplete(updatedResult);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/90 rounded-2xl shadow-xl border border-slate-800 overflow-hidden text-slate-100">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Gemini AI Leak Vision & Triage
            </h3>
            <p className="text-xs text-slate-400">Multimodal photo & text severity classifier</p>
          </div>
        </div>

        <button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-200 shadow-md flex items-center gap-2 ${
            isAnalyzing 
              ? 'bg-cyan-600/50 cursor-not-allowed text-white' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-500/20 hover:scale-[1.02]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inspecting Photo & Details...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Analyze with Gemini AI
            </>
          )}
        </button>
      </div>

      {/* Image Upload / Preview Zone */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/50">
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />

        {!imagePreview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group bg-slate-900/30 hover:bg-cyan-950/10"
          >
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-800 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-slate-300">
              <span className="text-cyan-400 underline">Upload leak photo</span> for Gemini Vision detection
            </p>
            <p className="text-[11px] text-slate-500 mt-1">PNG, JPG or WEBP (AI inspects water pressure, pooling & pipe burst type)</p>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-between p-3 gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={imagePreview} 
                alt="Leak Preview" 
                className="w-16 h-16 object-cover rounded-lg border border-slate-700 shadow-md"
              />
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Photo Ready for Vision Inspection
                </p>
                <p className="text-[11px] text-slate-400">Gemini will compute visual severity & flow loss from this image.</p>
              </div>
            </div>
            <button
              onClick={handleRemoveImage}
              className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 text-red-300 text-xs border-b border-red-800/50 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isAnalyzing && !result && (
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-800 rounded-lg w-1/3"></div>
          <div className="h-4 bg-slate-800 rounded-lg w-2/3"></div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-24 bg-slate-800/60 rounded-xl"></div>
            <div className="h-24 bg-slate-800/60 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Results Breakdown */}
      {result && !isAnalyzing && (
        <div className={`p-6 border-l-4 ${SEVERITY_BORDER[result.severityLevel]} space-y-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Identified Leak Classification</p>
              <h4 className="text-2xl font-black text-white">{result.leakType}</h4>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider ${SEVERITY_COLORS[result.severityLevel]}`}>
                {result.severityLevel} SEVERITY
              </span>
              <p className="text-xs text-slate-400 mt-1 font-mono">Dynamic Score: {result.severityScore}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Water Loss Gauge */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold mb-1">Estimated Wasted Water</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-400">{result.estimatedLossPerHourLiters}</span>
                <span className="text-slate-400 text-xs font-semibold">Liters / hour</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, (result.estimatedLossPerHourLiters / 5000) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Target Authority & Priority */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold mb-1">Target Sri Lankan Authority</p>
              <p className="text-xs font-bold text-white mb-3">{result.targetAuthority}</p>
              
              <p className="text-xs text-slate-400 font-semibold mb-1">Priority Triage Index ({result.priorityScore}/100)</p>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-sm ${
                      i < Math.round(result.priorityScore / 10) 
                        ? (result.priorityScore >= 70 ? 'bg-red-500' : result.priorityScore >= 40 ? 'bg-orange-400' : 'bg-emerald-400') 
                        : 'bg-slate-800'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-500/30">
            <p className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recommended NWSDB Action
            </p>
            <p className="text-xs text-slate-200 leading-relaxed">{result.recommendedAction}</p>
          </div>

          {/* Safety Advisory */}
          <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/30">
            <p className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Civilian Safety Advisory
            </p>
            <p className="text-xs text-slate-200 leading-relaxed">{result.safetyAdvisory}</p>
          </div>

          {/* Manual Admin Override */}
          <div className="border-t border-slate-800 pt-4">
            <label className="flex items-center gap-2 text-xs text-slate-400 font-semibold cursor-pointer w-max mb-3">
              <input 
                type="checkbox" 
                checked={manualOverride}
                onChange={() => setManualOverride(!manualOverride)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
              />
              Enable Manual Severity Verification / Override
            </label>
            
            {manualOverride && (
              <div className="flex flex-wrap gap-4 items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="font-semibold text-slate-300">Override Severity:</span>
                <select 
                  value={result.severityLevel}
                  onChange={handleManualSeverityChange}
                  className="bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
                <span className="text-slate-500 text-[11px]">(Modifications propagate to Member 1 & Admin state)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ready Empty State */}
      {!isAnalyzing && !result && (
        <div className="p-10 flex flex-col items-center justify-center text-slate-500 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-sm font-bold text-slate-300">Ready for Multimodal Vision Analysis</p>
          <p className="text-xs max-w-sm mt-1 text-slate-500">Attach a leak image or adjust the description above, then click the analyze button to detect severity with Gemini Vision.</p>
        </div>
      )}
    </div>
  );
}
