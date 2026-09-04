import Leak from '../models/Leak.js';
import mongoose from 'mongoose';

// In-Memory Storage Fallback for rapid testing without MongoDB
const inMemoryReports = [
  {
    _id: 'mock-1',
    reportId: 'LEAK-100201',
    reporterName: 'Amara Perera',
    reporterContact: '+94 77 123 4567 | amara@waterleak.lk',
    userId: 'USR-88421',
    location: 'Galle Road, Bambalapitiya, Colombo 04',
    latitude: 6.8885,
    longitude: 79.8558,
    leakType: '🌊 Water Main Leak',
    severityLevel: 'CRITICAL',
    severityScore: 92,
    estimatedLossPerHourLiters: 3500,
    priorityScore: 95,
    description: 'Main pipeline rupture near bus stand flooding road surface with high pressure stream',
    impacts: ['road_flooding', 'large_wastage', 'blocking_traffic'],
    hasPhoto: true,
    hasVideo: false,
    reportedDate: '2026-09-04',
    reportedTime: '08:30 AM',
    recommendedAction: 'Emergency Isolation & Heavy Machinery Crew Dispatch',
    targetAuthority: 'NWSDB Quick Response Unit',
    safetyAdvisory: 'Roadway hazard! Drive slowly due to water accumulation and potential sinkhole.',
    status: 'DISPATCHED',
    createdAt: new Date().toISOString()
  }
];

/**
 * Helper: Run server-side heuristic AI calculation if aiAnalysis object is missing
 */
function calculateAiTriage(description = '', leakType = '', impacts = []) {
  const text = (description + ' ' + leakType + ' ' + impacts.join(' ')).toLowerCase();
  
  let severityLevel = 'MEDIUM';
  let severityScore = 55;
  let estimatedLoss = 500;
  let priorityScore = 60;
  let recommendedAction = 'Dispatch local NWSDB repair squad.';
  let targetAuthority = 'Local Municipal Water Works';
  let safetyAdvisory = 'Keep area clear of pedestrians.';

  if (text.includes('burst') || text.includes('main') || text.includes('road_flooding') || text.includes('critical')) {
    severityLevel = 'CRITICAL';
    severityScore = 90;
    estimatedLoss = 3000;
    priorityScore = 95;
    recommendedAction = 'URGENT: Shut off main feeder valve at nearest pump station & deploy heavy excavation team.';
    targetAuthority = 'NWSDB Quick Response Unit';
    safetyAdvisory = 'CRITICAL ROADWAY HAZARD: Risk of road surface collapse!';
  } else if (text.includes('broken') || text.includes('underground') || text.includes('property_damage')) {
    severityLevel = 'HIGH';
    severityScore = 75;
    estimatedLoss = 1200;
    priorityScore = 80;
    recommendedAction = 'Schedule priority road-cut inspection and isolate branch line.';
    targetAuthority = 'NWSDB Quick Response Unit';
    safetyAdvisory = 'Caution for slipping hazards and wet tarmac.';
  } else if (text.includes('tap') || text.includes('house') || text.includes('no_major_impact')) {
    severityLevel = 'LOW';
    severityScore = 35;
    estimatedLoss = 150;
    priorityScore = 40;
    recommendedAction = 'Inform property owner and schedule meter technician check.';
    targetAuthority = 'Local Pradeshiya Sabha / Municipal Council';
    safetyAdvisory = 'Ensure household water valve is isolated if unattended.';
  }

  return {
    severityLevel,
    severityScore,
    estimatedLossPerHourLiters: estimatedLoss,
    priorityScore,
    recommendedAction,
    targetAuthority,
    safetyAdvisory
  };
}

/**
 * @desc Create a new water leak report
 * @route POST /api/reports
 */
export const createReport = async (req, res) => {
  try {
    const {
      reporter,
      reporterName,
      reporterContact,
      userId,
      location,
      lat,
      latitude,
      lng,
      longitude,
      leakType,
      severityLevel,
      description,
      impacts,
      hasPhoto,
      hasVideo,
      reportedDate,
      reportedTime,
      aiAnalysis
    } = req.body;

    if (!location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Location and description are required fields.'
      });
    }

    const generatedReportId = `LEAK-${Math.floor(100000 + Math.random() * 900000)}`;
    const triage = aiAnalysis || calculateAiTriage(description, leakType, impacts || []);

    const reportData = {
      reportId: generatedReportId,
      reporterName: reporterName || reporter || 'Amara Perera',
      reporterContact: reporterContact || '+94 77 123 4567 | amara@waterleak.lk',
      userId: userId || 'USR-88421',
      location: location,
      latitude: latitude || lat || 6.8885,
      longitude: longitude || lng || 79.8558,
      leakType: leakType || '🚰 Water Pipe Leak',
      severityLevel: severityLevel || triage.severityLevel || 'HIGH',
      severityScore: triage.severityScore || 75,
      estimatedLossPerHourLiters: triage.estimatedLossPerHourLiters || 1000,
      priorityScore: triage.priorityScore || 80,
      description: description,
      impacts: impacts || [],
      hasPhoto: !!hasPhoto,
      hasVideo: !!hasVideo,
      reportedDate: reportedDate || new Date().toISOString().split('T')[0],
      reportedTime: reportedTime || new Date().toLocaleTimeString(),
      recommendedAction: triage.recommendedAction,
      targetAuthority: triage.targetAuthority,
      safetyAdvisory: triage.safetyAdvisory,
      aiAnalysis: triage,
      status: 'PENDING'
    };

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const newLeak = await Leak.create(reportData);
      return res.status(201).json({
        success: true,
        message: 'Leak report successfully created in MongoDB database.',
        id: generatedReportId,
        data: newLeak
      });
    } else {
      // In-Memory Mode
      const mockObj = { _id: `mem-${Date.now()}`, ...reportData, createdAt: new Date().toISOString() };
      inMemoryReports.unshift(mockObj);
      return res.status(201).json({
        success: true,
        message: 'Leak report logged in backend server memory.',
        id: generatedReportId,
        data: mockObj
      });
    }
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all leak reports
 * @route GET /api/reports
 */
export const getReports = async (req, res) => {
  try {
    const { status, severity } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (status) query.status = status;
      if (severity) query.severityLevel = severity;

      const reports = await Leak.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: reports.length, data: reports });
    } else {
      let filtered = [...inMemoryReports];
      if (status) filtered = filtered.filter(r => r.status === status);
      if (severity) filtered = filtered.filter(r => r.severityLevel === severity);
      return res.json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single report by ID
 * @route GET /api/reports/:id
 */
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const report = await Leak.findOne({ $or: [{ _id: id }, { reportId: id }] });
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      return res.json({ success: true, data: report });
    } else {
      const report = inMemoryReports.find(r => r._id === id || r.reportId === id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      return res.json({ success: true, data: report });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete a report
 * @route DELETE /api/reports/:id
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      await Leak.findOneAndDelete({ $or: [{ _id: id }, { reportId: id }] });
      return res.json({ success: true, message: 'Report deleted successfully' });
    } else {
      const idx = inMemoryReports.findIndex(r => r._id === id || r.reportId === id);
      if (idx !== -1) {
        inMemoryReports.splice(idx, 1);
      }
      return res.json({ success: true, message: 'Report deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
