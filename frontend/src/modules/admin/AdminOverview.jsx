import React, { useEffect, useState } from 'react';
import { Droplet, ClipboardCheck, Clock, CheckCircle2, RefreshCw, BarChart3 } from 'lucide-react';
import { fetchStats } from './adminService';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchStats();
      setStats(res.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const maxDistrictCount = stats?.byDistrict?.length
    ? Math.max(...stats.byDistrict.map((d) => d.count))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Admin Overview
        </h2>
        <button
          onClick={load}
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Droplet} label="Total Reports" value={stats?.total} accent="text-cyan-400" />
        <StatCard icon={Clock} label="Pending Approval" value={stats?.pending} accent="text-amber-400" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats?.resolved} accent="text-emerald-400" />
      </div>

      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-cyan-400" />
          Reports by District
        </h3>
        {(!stats?.byDistrict || stats.byDistrict.length === 0) && !loading && (
          <p className="text-xs text-slate-500">No data yet.</p>
        )}
        <div className="space-y-3">
          {stats?.byDistrict?.map((row) => (
            <div key={row.district}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{row.district}</span>
                <span className="font-mono text-slate-300">{row.count}</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${maxDistrictCount ? (row.count / maxDistrictCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
      <div className={`p-3 bg-slate-950/60 border border-slate-800 rounded-xl ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-black text-white">{value ?? '—'}</p>
      </div>
    </div>
  );
}
