/**
 * Member 1 - Reporting Module Service
 * Connects to Express Backend (POST /api/reports) with automatic offline fallback.
 */

const BACKEND_REPORTS_API = 'http://localhost:5001/api/reports';

export const submitReport = async (reportData) => {
  console.log("Submitting report to backend:", reportData);

  try {
    const response = await fetch(BACKEND_REPORTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Backend response received:", result);

      // Save locally as backup cache
      saveToLocalStorage(result.data || reportData);

      return {
        success: true,
        id: result.id || result.data?.reportId || `LEAK-${Date.now().toString().slice(-6)}`,
        report: result.data || reportData,
        message: result.message || "Water leak report logged successfully with backend API."
      };
    }
  } catch (err) {
    console.warn("Backend API server offline or unreachable. Using resilient client storage fallback...", err);
  }

  // Client-side fallback mode
  await new Promise((resolve) => setTimeout(resolve, 500));
  const fallbackId = `LEAK-${Date.now().toString().slice(-6)}`;

  const createdReport = {
    id: fallbackId,
    reportId: fallbackId,
    ...reportData,
    status: reportData.status || 'PENDING',
    timestamp: reportData.timestamp || new Date().toISOString(),
  };

  saveToLocalStorage(createdReport);

  return {
    success: true,
    id: fallbackId,
    report: createdReport,
    message: "Water leak report submitted successfully (Local Storage mode)."
  };
};

export const fetchAllReports = async () => {
  try {
    const response = await fetch(BACKEND_REPORTS_API);
    if (response.ok) {
      const result = await response.json();
      return result.data || [];
    }
  } catch (err) {
    console.warn("Could not fetch reports from backend API, retrieving cached local reports.");
  }

  return getStoredReports();
};

const saveToLocalStorage = (report) => {
  try {
    const existingReports = JSON.parse(localStorage.getItem('waterleak_user_reports') || '[]');
    localStorage.setItem('waterleak_user_reports', JSON.stringify([report, ...existingReports]));
  } catch (err) {
    console.warn("Could not save report to localStorage:", err);
  }
};

export const getStoredReports = () => {
  try {
    return JSON.parse(localStorage.getItem('waterleak_user_reports') || '[]');
  } catch (err) {
    return [];
  }
};
