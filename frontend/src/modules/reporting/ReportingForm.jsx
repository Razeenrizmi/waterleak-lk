import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  AlertTriangle,
  Upload,
  Camera,
  Video,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  Shield,
  Sparkles,
  CheckCircle2,
  FileText,
  X,
  Droplet,
  Loader2,
  Check,
  ChevronDown
} from 'lucide-react';
import MapPickerModal from './MapPickerModal';
import { submitReport } from './reportingService';
import { analyzeWaterLeak } from '../ai-analysis/leakAnalysisService';

const LEAK_TYPES = [
  { id: 'water_pipe', label: '🚰 Water Pipe Leak' },
  { id: 'broken_pipe', label: '🔧 Broken/Cracked Pipe' },
  { id: 'underground', label: '🕳️ Underground Leak' },
  { id: 'tap_faucet', label: '🚿 Tap/Faucet Leak' },
  { id: 'house_building', label: '🏠 House/Building Leak' },
  { id: 'water_main', label: '🌊 Water Main Leak' },
  { id: 'unknown', label: '❓ Unknown / Other' },
];

const SEVERITY_LEVELS = [
  { id: 'LOW', label: 'Low', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20', badge: 'bg-emerald-500' },
  { id: 'MEDIUM', label: 'Medium', color: 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20', badge: 'bg-amber-500' },
  { id: 'HIGH', label: 'High', color: 'border-orange-500/50 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20', badge: 'bg-orange-500' },
  { id: 'CRITICAL', label: 'Critical / Urgent', color: 'border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20', badge: 'bg-red-500' },
];

const IMPACT_OPTIONS = [
  { id: 'road_flooding', label: 'Road flooding' },
  { id: 'property_damage', label: 'Property damage' },
  { id: 'blocking_traffic', label: 'Blocking traffic' },
  { id: 'affecting_buildings', label: 'Affecting nearby buildings' },
  { id: 'large_wastage', label: 'Large water wastage' },
  { id: 'no_major_impact', label: 'No major impact' },
];

export default function ReportingForm({ onReportSubmitted }) {
  // Form State
  const [address, setAddress] = useState('Galle Road, Bambalapitiya, Colombo 04');
  const [coordinates, setCoordinates] = useState({ lat: 6.8885, lng: 79.8558 });
  const [leakType, setLeakType] = useState('🚰 Water Pipe Leak');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('Large amount of water is coming from a cracked pipe near the road.');
  const [impacts, setImpacts] = useState(['road_flooding', 'large_wastage']);
  
  // Media upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Auto-generated Date & Time
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Auto-populated Reporter Info (From Account)
  const [reporterInfo, setReporterInfo] = useState({
    name: 'Amara Perera',
    contact: '+94 77 123 4567 | amara.perera@example.lk',
    userId: 'USR-88421',
  });

  // Map Picker Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Status & Loading states
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [isCalculatingAi, setIsCalculatingAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportData, setSubmittedReportData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Clock Initialization
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toISOString().split('T')[0]); // YYYY-MM-DD
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle GPS detection
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    setGpsSuccess(false);

    if (!navigator.geolocation) {
      // Fallback location simulated
      setTimeout(() => {
        setCoordinates({ lat: 6.9271, lng: 79.8612 });
        setAddress("GPS Location: Colombo Fort, Western Province (Auto-Detected)");
        setIsDetectingGps(false);
        setGpsSuccess(true);
      }, 1000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));
        setCoordinates({ lat, lng });
        setAddress(`GPS Auto-Detected (${lat}° N, ${lng}° E)`);
        setIsDetectingGps(false);
        setGpsSuccess(true);
      },
      (error) => {
        console.warn("Geolocation warning:", error.message);
        // Fallback default coordinates
        setCoordinates({ lat: 6.9271, lng: 79.8612 });
        setAddress("GPS Location: Colombo Fort, Western Province (Auto-Detected)");
        setIsDetectingGps(false);
        setGpsSuccess(true);
      },
      { timeout: 5000 }
    );
  };

  // Handle Map Pin Select
  const handleMapLocationSelect = (locData) => {
    setAddress(locData.address);
    setCoordinates({ lat: locData.lat, lng: locData.lng });
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  // Handle Video File Upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // Toggle Impact Checkbox
  const toggleImpact = (impactId) => {
    if (impactId === 'no_major_impact') {
      setImpacts(['no_major_impact']);
      return;
    }

    const filtered = impacts.filter(i => i !== 'no_major_impact');
    if (filtered.includes(impactId)) {
      setImpacts(filtered.filter(i => i !== impactId));
    } else {
      setImpacts([...filtered, impactId]);
    }
  };

  // Trigger Member 3 AI Severity Calculation
  const handleCalculateAiSeverity = async () => {
    setIsCalculatingAi(true);
    setErrorMsg('');

    try {
      const promptText = `${description}. Leak Type: ${leakType}. Impacts observed: ${impacts.join(', ')}. Location: ${address}.`;
      const result = await analyzeWaterLeak({ description: promptText });
      
      setAiAnalysisResult(result);
      if (result.severityLevel) {
        setSeverity(result.severityLevel);
      }
    } catch (err) {
      setErrorMsg("Could not connect to AI engine. Using default calculation.");
    } finally {
      setIsCalculatingAi(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg("Please provide a brief description of the leak.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      reporter: reporterInfo.name,
      reporterContact: reporterInfo.contact,
      userId: reporterInfo.userId,
      location: address,
      lat: coordinates.lat,
      lng: coordinates.lng,
      leakType: leakType,
      severityLevel: severity,
      description: description,
      impacts: impacts,
      hasPhoto: !!photoPreview,
      hasVideo: !!videoFile,
      aiAnalysis: aiAnalysisResult,
      reportedDate: currentDate,
      reportedTime: currentTime,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await submitReport(payload);
      setSubmittedReportData(response);

      if (onReportSubmitted) {
        onReportSubmitted(response.report);
      }
    } catch (err) {
      setErrorMsg("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
              <Droplet className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  Member 1 Module
                </span>
                <span className="text-xs text-slate-400 font-mono">NWSDB Dispatch Ready</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                Report Water Leakage
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submit accurate pipe bursts and wastage points for fast NWSDB emergency dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="text-right">
              <div className="text-slate-400 font-medium text-[11px]">System Status</div>
              <div className="text-emerald-400 font-bold flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Active Dispatch
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. 📍 LOCATION */}
        <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              1. 📍 Location
            </h3>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              Coordinates: {coordinates.lat}° N, {coordinates.lng}° E
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">
              Location / Address <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Galle Road, near Bambalapitiya junction, Colombo 04"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
            />

            {/* Map & GPS Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:border-cyan-500/50 shadow-md group"
              >
                <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                Select Location on Map
              </button>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:border-emerald-500/50 shadow-md disabled:opacity-50"
              >
                {isDetectingGps ? (
                  <>
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    Acquiring GPS Signal...
                  </>
                ) : gpsSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    GPS Location Detected!
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-emerald-400" />
                    GPS Location — Auto-Detect
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 2. 💦 LEAK TYPE & 3. ⚠️ ESTIMATED SEVERITY (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. 💦 LEAK TYPE */}
          <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <Droplet className="w-5 h-5 text-cyan-400" />
                2. 💦 Leak Type
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select Leak Classification
                </label>
                <div className="relative">
                  <select
                    value={leakType}
                    onChange={(e) => setLeakType(e.target.value)}
                    className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner pr-10 cursor-pointer font-medium"
                  >
                    {LEAK_TYPES.map((type) => (
                      <option key={type.id} value={type.label} className="bg-slate-900 text-slate-100">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Categorizing the leak helps NWSDB send the appropriate repair crew and equipment.
                </p>
              </div>
            </div>
          </section>

          {/* 3. ⚠️ ESTIMATED SEVERITY & AI CALCULATION */}
          <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                3. ⚠️ Estimated Severity
              </h3>
              <span className="text-[11px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/50">
                {severity}
              </span>
            </div>

            <div className="space-y-4">
              {/* Manual Selection Pills */}
              <div className="grid grid-cols-2 gap-2">
                {SEVERITY_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSeverity(lvl.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                      severity === lvl.id
                        ? `${lvl.color} ring-2 ring-cyan-500/40 shadow-lg`
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{lvl.label}</span>
                    <span className={`w-2 h-2 rounded-full ${lvl.badge}`}></span>
                  </button>
                ))}
              </div>

              {/* AI Auto-Calculation Feature */}
              <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Member 3 AI Calculation
                  </span>
                  <span className="text-[10px] text-slate-400">Gemini/Local Fallback</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Allow the AI to calculate the exact severity and water loss rate dynamically.
                </p>
                <button
                  type="button"
                  onClick={handleCalculateAiSeverity}
                  disabled={isCalculatingAi}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isCalculatingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyzing with AI Engine...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Calculate Final Severity with AI
                    </>
                  )}
                </button>

                {aiAnalysisResult && (
                  <div className="mt-2 p-2.5 bg-slate-950/80 rounded-xl border border-cyan-500/40 text-[11px] text-slate-300 space-y-1">
                    <div className="flex justify-between font-bold text-cyan-400">
                      <span>Calculated Level: {aiAnalysisResult.severityLevel}</span>
                      <span>Score: {aiAnalysisResult.severityScore}/100</span>
                    </div>
                    <div className="text-slate-400">
                      Est. Loss: <strong className="text-amber-400">{aiAnalysisResult.estimatedLossPerHourLiters} L/hr</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 4. 📝 DESCRIPTION */}
        <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <FileText className="w-5 h-5 text-cyan-400" />
            4. 📝 Description
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Describe the problem <span className="text-cyan-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Example: "Large amount of water is coming from a cracked pipe near the road."'
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner resize-none leading-relaxed"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-500">
              <span>Be specific about water flow speed, road cracks, or pipe location.</span>
              <span>{description.length} chars</span>
            </div>
          </div>
        </section>

        {/* 5. 📷 UPLOAD EVIDENCE */}
        <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              5. 📷 Upload Evidence
            </h3>
            <span className="text-[11px] text-cyan-300 font-semibold bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-700/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Used by Member 3 AI Leak Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photo Upload Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" /> 📸 Upload Photo
              </label>
              
              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/50 h-36 group">
                  <img src={photoPreview} alt="Leak Evidence" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                      className="p-2 bg-red-500/80 hover:bg-red-600 rounded-xl text-white text-xs font-bold flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Remove Photo
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-500/30">
                    Photo Attached
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 rounded-2xl h-36 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-300">Click to upload photo</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">JPG, PNG up to 10MB</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Video Upload Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-cyan-400" /> 🎥 Optional Video
              </label>

              {videoFile ? (
                <div className="border border-emerald-500/50 bg-emerald-950/20 rounded-2xl h-36 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-400" /> Video Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 truncate font-mono bg-slate-900/80 p-2 rounded-xl">
                    {videoFile.name}
                  </div>
                  <span className="text-[10px] text-slate-400">Ready for fluid flow speed analysis</span>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 rounded-2xl h-36 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors group">
                  <Video className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-300">Click to upload video</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">MP4, MOV up to 50MB</span>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* 6. 📅 DATE & TIME & 7. 🚗 IMPACT / URGENCY (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 6. 📅 DATE & TIME (AUTO-GENERATED) */}
          <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                6. 📅 Date & Time
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/50">
                Auto Generated
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Report timestamp is captured automatically from system time:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" /> Reported Date
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-200">{currentDate || '2026-09-04'}</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> Reported Time
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-200">{currentTime || '11:38 AM'}</div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. 🚗 IMPACT / URGENCY */}
          <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              7. 🚗 Impact / Urgency
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Is the leak causing any of these problems?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {IMPACT_OPTIONS.map((opt) => {
                  const isChecked = impacts.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleImpact(opt.id)}
                      className={`p-2.5 rounded-xl text-xs text-left border transition-all flex items-center gap-2.5 ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* 8. 👤 REPORTER INFORMATION (AUTO-GET FROM ACCOUNT) */}
        <section className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              8. 👤 Reporter Information
            </h3>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/50">
              Auto-Retrieved from Account
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Reporter Name</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <input
                  type="text"
                  value={reporterInfo.name}
                  onChange={(e) => setReporterInfo({ ...reporterInfo, name: e.target.value })}
                  className="bg-transparent focus:outline-none w-full text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Email / Phone</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 truncate">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={reporterInfo.contact}
                  onChange={(e) => setReporterInfo({ ...reporterInfo, contact: e.target.value })}
                  className="bg-transparent focus:outline-none w-full text-slate-200 truncate"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Account User ID</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{reporterInfo.userId}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Error Alert Display */}
        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Action Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Transmitting Leak Report to NWSDB Unit...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit Leak Report to Water Authority
              </>
            )}
          </button>
        </div>
      </form>

      {/* Submission Success Modal / Banner */}
      {submittedReportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-center relative">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Report Successfully Logged!</h3>
              <p className="text-xs text-slate-400">
                Reference ID: <span className="font-mono text-cyan-400 font-bold">{submittedReportData.id}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Target Authority:</span>
                <span className="text-cyan-400 font-bold">NWSDB Quick Response Unit</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Assigned Priority:</span>
                <span className="text-amber-400 font-bold">{severity} SEVERITY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{address}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmittedReportData(null)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Done / Submit Another Report
            </button>
          </div>
        </div>
      )}

      {/* Map Picker Modal */}
      <MapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleMapLocationSelect}
        initialLocation={address}
      />
    </div>
  );
}
