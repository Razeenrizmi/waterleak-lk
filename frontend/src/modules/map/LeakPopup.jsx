import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';

export default function LeakPopup({ leak, onViewDetails }) {
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

  return (
    <div className="p-3 min-w-[200px] max-w-[280px]">
      {/* Header */}
      <div className="font-semibold text-slate-900 text-sm mb-1">
        {leak.leakType || 'Unknown Leak Type'}
      </div>
      
      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{leak.location || 'Unknown Location'}</span>
      </div>

      {/* Status */}
      <div className="text-xs text-slate-700 mb-2">
        <span className="font-medium">Status:</span> {leak.status || 'Unknown'}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
        {leak.description || 'No description provided.'}
      </p>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
        <Clock className="w-3 h-3" />
        <span>{formatDate(leak.createdAt || leak.timestamp)}</span>
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(leak)}
        className="w-full px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
      >
        View Details
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}
