import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, ListChecks, Users, ShieldAlert } from 'lucide-react';
import { getCurrentUser } from './adminService';
import AdminOverview from './AdminOverview';
import PendingReports from './PendingReports';
import AllReports from './AllReports';
import AdminUsers from './AdminUsers';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, Component: AdminOverview },
  { id: 'pending', label: 'Pending Reports', icon: ClipboardList, Component: PendingReports },
  { id: 'all', label: 'All Reports', icon: ListChecks, Component: AllReports },
  { id: 'users', label: 'Users', icon: Users, Component: AdminUsers }
];

export default function AdminDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const currentUser = getCurrentUser();

  // Only role 'admin' can open the admin pages below.
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="p-6 bg-slate-900/80 border border-rose-500/30 rounded-2xl shadow-xl text-center">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-rose-400 mb-2">Admin Access Required</h2>
        <p className="text-slate-400 text-sm">
          You must be signed in with an admin account to view this dashboard.
        </p>
      </div>
    );
  }

  const ActiveComponent = TABS.find((t) => t.id === activeSubTab)?.Component ?? AdminOverview;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5 w-fit flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSubTab(id)}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold ${
              activeSubTab === id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
}
