import React from 'react';
import { Search, X } from 'lucide-react';

export default function LeakFilters({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter, 
  leakTypeFilter, 
  setLeakTypeFilter,
  onReset 
}) {
  const statusOptions = ['All', 'PENDING', 'VERIFIED', 'DISPATCHED', 'RESOLVED', 'REJECTED'];
  
  const leakTypeOptions = [
    'All',
    'Main Pipeline Burst',
    'Roadway Surface Leak',
    'Household Meter Leak',
    'Commercial Overflow',
    'Subsurface Main Seepage',
    'Unknown Leak Type'
  ];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by location, leak type or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'All Statuses' : status}
            </option>
          ))}
        </select>

        {/* Leak Type Filter */}
        <select
          value={leakTypeFilter}
          onChange={(e) => setLeakTypeFilter(e.target.value)}
          className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
        >
          {leakTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Leak Types' : type}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 flex items-center gap-2 transition-all"
        >
          <X className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}
