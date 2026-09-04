import React from 'react';

export default function ReportingForm({ onReportSubmitted }) {
  return (
    <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-400 mb-2">📋 Member 1: Leak Reporting Form</h2>
      <p className="text-slate-400 text-sm mb-4">Module assigned to Member 1. Allows users to upload images, enter description & location.</p>
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400">
        [ReportingForm component ready for Member 1 implementation]
      </div>
    </div>
  );
}
