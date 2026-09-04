// Member 4: Admin API service
//
// Approve/reject/status/stats/users calls hit /api/admin/* which require an
// NWSDB_ADMIN JWT (see backend/src/middleware/authMiddleware.js).
// AuthContext.jsx stores the login response flat under the 'waterleak_user'
// localStorage key as { _id, name, email, role, token }.
//
// "All Reports" reuses Member 2's existing GET /api/map/leaks endpoint
// (already returns every leak) instead of duplicating a route.

const API_BASE = 'http://localhost:5001/api';

function getAuthHeaders() {
  try {
    const stored = localStorage.getItem('waterleak_user');
    if (!stored) return {};
    const { token } = JSON.parse(stored);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return body;
}

export function getCurrentUser() {
  try {
    const stored = localStorage.getItem('waterleak_user');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export const fetchStats = () => request(`${API_BASE}/admin/stats`);

export const fetchPendingReports = () => request(`${API_BASE}/admin/reports/pending`);

export const fetchAllReports = () => request(`${API_BASE}/map/leaks`);

export const approveReport = (id) =>
  request(`${API_BASE}/admin/reports/${id}/approve`, { method: 'PATCH' });

export const rejectReport = (id, reason) =>
  request(`${API_BASE}/admin/reports/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason })
  });

export const updateReportStatus = (id, { status, assignedTeam }) =>
  request(`${API_BASE}/admin/reports/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, assignedTeam })
  });

export const fetchUsers = () => request(`${API_BASE}/admin/users`);

export const toggleUserBlock = (id) =>
  request(`${API_BASE}/admin/users/${id}/block`, { method: 'PATCH' });
