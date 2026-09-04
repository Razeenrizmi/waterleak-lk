import React from 'react';

export default function LeakMap({ leaks = [] }) {
  return (
    <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-400 mb-2">🗺️ Member 2: Leak Management Map</h2>
      <p className="text-slate-400 text-sm mb-4">Module assigned to Member 2. Interactive map display & leak tracking across Sri Lanka.</p>
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400">
        [LeakMap component ready for Member 2 implementation]
      </div>
    </div>
  );
}
