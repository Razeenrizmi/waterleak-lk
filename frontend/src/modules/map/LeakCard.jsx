import React from 'react';
import { MapPin, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function LeakCard({ leak, onViewDetails }) {
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

  // Get status icon
  const getStatusIcon = (status) => {
    if (status === 'RESOLVED') return <CheckCircle className="w-3.5 h-3.5" />;
    if (status === 'REJECTED') return <AlertCircle className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-LK', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Get coordinates - handle both lat/lng and latitude/longitude
  const lat = leak.latitude || leak.lat;
  const lng = leak.longitude || leak.lng;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-cyan-500/50 transition-all cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">
            {leak.leakType || 'Unknown Leak Type'}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{leak.location || 'Unknown Location'}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 shrink-0 ${getStatusBadge(leak.status)}`}>
          {getStatusIcon(leak.status)}
          {leak.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
        {leak.description || 'No description provided.'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <span className="text-xs text-slate-500">
          {formatDate(leak.createdAt || leak.timestamp)}
        </span>
        <button
          onClick={() => onViewDetails(leak)}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group-hover:gap-2"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
