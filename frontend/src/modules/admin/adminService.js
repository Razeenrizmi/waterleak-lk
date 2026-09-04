// Member 4: Admin API service
//
// Approve/reject/status/stats/users calls hit /api/admin/* which require an
// admin JWT (see backend/src/controllers/adminController.js -> requireAdmin).
// Until a teammate's login flow exists, this reads { token, user } from
// localStorage under the 'waterleak_auth' key and sends the token as a
// Bearer header — align the key/shape with the real login once it lands.
//
// "All Reports" reuses Member 2's existing GET /api/map/leaks endpoint
// (already returns every leak) instead of duplicating a route.

const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  try {
    const stored = localStorage.getItem('waterleak_auth');
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
    const stored = localStorage.getItem('waterleak_auth');
    if (!stored) return null;
    return JSON.parse(stored).user || null;
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
