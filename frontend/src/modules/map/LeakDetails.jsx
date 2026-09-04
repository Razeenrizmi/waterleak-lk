import React from 'react';
import { ArrowLeft, MapPin, Clock, AlertTriangle, CheckCircle, Info, Image as ImageIcon } from 'lucide-react';

export default function LeakDetails({ leak, onBack }) {
  if (!leak) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-LK', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusStyles = {
      'PENDING': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'VERIFIED': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'DISPATCHED': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'RESOLVED': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'REJECTED': 'bg-red-500/10 text-red-400 border-red-500/30'
    };
    return statusStyles[status] || statusStyles['PENDING'];
  };

  // Get severity badge color
  const getSeverityBadge = (severity) => {
    const severityStyles = {
      'CRITICAL': 'bg-red-500/10 text-red-400 border-red-500/30',
      'HIGH': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      'MEDIUM': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'LOW': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    };
    return severityStyles[severity] || severityStyles['MEDIUM'];
  };

  // Get coordinates
  const lat = leak.latitude || leak.lat;
  const lng = leak.longitude || leak.lng;

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Map
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Leak Report Details</h2>
          <p className="text-sm text-slate-400">View detailed information about this reported water leak</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusBadge(leak.status)}`}>
            {leak.status}
          </span>
          {leak.severityLevel && (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getSeverityBadge(leak.severityLevel)}`}>
              {leak.severityLevel}
            </span>
          )}
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        {/* Leak Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Leak Type
          </div>
          <div className="text-lg font-semibold text-white">
            {leak.leakType || 'Unknown Leak Type'}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            Location
          </div>
          <div className="text-base text-slate-200">
            {leak.location || 'Unknown Location'}
          </div>
          {lat && lng && (
            <div className="text-xs text-slate-500 font-mono">
              Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Info className="w-4 h-4" />
            Description
          </div>
          <div className="text-base text-slate-200 leading-relaxed">
            {leak.description || 'No description provided.'}
          </div>
        </div>

        {/* Reporter */}
        {leak.reporterName && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Reporter
            </div>
            <div className="text-base text-slate-200">
              {leak.reporterName}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            Reported Date
          </div>
          <div className="text-base text-slate-200">
            {formatDate(leak.createdAt || leak.timestamp)}
          </div>
        </div>

        {/* Image */}
        {leak.imageUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              Report Image
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-700">
              <img 
                src={leak.imageUrl} 
                alt="Leak report image" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* AI Analysis Fields (if available) */}
        {(leak.severityScore || leak.estimatedLossPerHourLiters || leak.recommendedAction) && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="text-sm font-semibold text-cyan-400">AI Analysis Results</div>
            
            {leak.severityScore && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Severity Score:</span>
                <span className="text-sm font-semibold text-white">{leak.severityScore}/100</span>
              </div>
            )}
            
            {leak.estimatedLossPerHourLiters && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Estimated Loss:</span>
                <span className="text-sm font-semibold text-white">{leak.estimatedLossPerHourLiters.toLocaleString()} L/hr</span>
              </div>
            )}
            
            {leak.priorityScore && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Priority Score:</span>
                <span className="text-sm font-semibold text-white">{leak.priorityScore}/100</span>
              </div>
            )}
            
            {leak.recommendedAction && (
              <div className="space-y-1">
                <span className="text-sm text-slate-400">Recommended Action:</span>
                <div className="text-sm text-slate-200">{leak.recommendedAction}</div>
              </div>
            )}
            
            {leak.targetAuthority && (
              <div className="space-y-1">
                <span className="text-sm text-slate-400">Target Authority:</span>
                <div className="text-sm text-slate-200">{leak.targetAuthority}</div>
              </div>
            )}
            
            {leak.safetyAdvisory && (
              <div className="space-y-1">
                <span className="text-sm text-slate-400">Safety Advisory:</span>
                <div className="text-sm text-slate-200">{leak.safetyAdvisory}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
