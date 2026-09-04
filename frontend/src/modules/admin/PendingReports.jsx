import React, { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle2, XCircle, RefreshCw, MapPin } from 'lucide-react';
import { fetchPendingReports, approveReport, rejectReport } from './adminService';

export default function PendingReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [reasonDraft, setReasonDraft] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchPendingReports();
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

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      await approveReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const startReject = (id) => {
    setRejectingId(id);
    setReasonDraft('');
  };

  const confirmReject = async (id) => {
    if (!reasonDraft.trim()) return;
    setBusyId(id);
    try {
      await rejectReport(id, reasonDraft.trim());
      setReports((prev) => prev.filter((r) => r._id !== id));
      setRejectingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-cyan-400" />
          Pending Reports
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

      {!loading && reports.length === 0 && !error && (
        <p className="text-xs text-slate-500">No reports waiting for approval.</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="py-2 pr-4 font-semibold">Photo</th>
              <th className="py-2 pr-4 font-semibold">Location</th>
              <th className="py-2 pr-4 font-semibold">Description</th>
              <th className="py-2 pr-4 font-semibold">Severity</th>
              <th className="py-2 pr-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <React.Fragment key={r._id}>
                <tr className="border-b border-slate-800/60 align-top">
                  <td className="py-3 pr-4">
                    {r.imageUrl ? (
                      <img
                        src={r.imageUrl}
                        alt="Leak"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-800"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                        —
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-slate-200">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {r.location}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-400 max-w-xs">{r.description}</td>
                  <td className="py-3 pr-4 text-slate-300">{r.severityLevel}</td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-2">
                      <button
                        disabled={busyId === r._id}
                        onClick={() => handleApprove(r._id)}
                        className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        disabled={busyId === r._id}
                        onClick={() => startReject(r._id)}
                        className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
                {rejectingId === r._id && (
                  <tr className="border-b border-slate-800/60">
                    <td colSpan={5} className="py-3">
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={reasonDraft}
                          onChange={(e) => setReasonDraft(e.target.value)}
                          placeholder="Reason for rejection..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          disabled={!reasonDraft.trim() || busyId === r._id}
                          onClick={() => confirmReject(r._id)}
                          className="px-3 py-1.5 bg-rose-500 text-white rounded-lg font-semibold disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
