import React, { useEffect, useState } from 'react';
import { Users, RefreshCw, Ban, CheckCircle2 } from 'lucide-react';
import { fetchUsers, toggleUserBlock } from './adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleBlock = async (id) => {
    setBusyId(id);
    try {
      const res = await toggleUserBlock(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
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
          <Users className="w-5 h-5 text-cyan-400" />
          Users
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

      {!loading && users.length === 0 && !error && (
        <p className="text-xs text-slate-500">No users found.</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="py-2 pr-4 font-semibold">Name</th>
              <th className="py-2 pr-4 font-semibold">Email</th>
              <th className="py-2 pr-4 font-semibold">Role</th>
              <th className="py-2 pr-4 font-semibold">Status</th>
              <th className="py-2 pr-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-800/60">
                <td className="py-3 pr-4 text-slate-200">{u.name}</td>
                <td className="py-3 pr-4 text-slate-400">{u.email}</td>
                <td className="py-3 pr-4 text-slate-300 capitalize">{u.role}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${
                      u.blocked
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {u.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right">
                  <button
                    disabled={busyId === u._id}
                    onClick={() => handleToggleBlock(u._id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 ml-auto disabled:opacity-50 ${
                      u.blocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {u.blocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                    {u.blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
