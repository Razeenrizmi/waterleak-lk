import React, { useEffect, useMemo, useState } from 'react';
import { ListChecks, RefreshCw, MapPin } from 'lucide-react';
import { fetchAllReports } from './adminService';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'VERIFIED', 'DISPATCHED', 'RESOLVED', 'REJECTED'];

const STATUS_STYLES = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  VERIFIED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  DISPATCHED: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  RESOLVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  REJECTED: 'bg-rose-500/20 text-rose-400 border-rose-500/40'
};

export default function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAllReports();
      setReports(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (statusFilter === 'ALL' ? reports : reports.filter((r) => r.status === statusFilter)),
    [reports, statusFilter]
  );

  return (
    <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-cyan-400" />
          All Reports
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={load}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && !error && (
        <p className="text-xs text-slate-500">No reports match this filter.</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="py-2 pr-4 font-semibold">Location</th>
              <th className="py-2 pr-4 font-semibold">Type</th>
              <th className="py-2 pr-4 font-semibold">Severity</th>
              <th className="py-2 pr-4 font-semibold">Assigned Team</th>
              <th className="py-2 pr-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="border-b border-slate-800/60">
                <td className="py-3 pr-4 text-slate-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {r.location}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-400">{r.leakType}</td>
                <td className="py-3 pr-4 text-slate-300">{r.severityLevel}</td>
                <td className="py-3 pr-4 text-slate-400">{r.assignedTeam || '—'}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${
                      STATUS_STYLES[r.status] || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
