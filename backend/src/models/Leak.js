import mongoose from 'mongoose';

const LeakSchema = new mongoose.Schema(
  {
    reporterName: { type: String, default: 'Anonymous Citizen' },
    location: { type: String, required: true },
    // Member 4: not yet collected by the reporting form — used to group admin stats by district
    district: { type: String, default: '' },
    latitude: { type: Number, default: 6.9271 },
    longitude: { type: Number, default: 79.8612 },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    
    // Member 3: AI Triage Fields
    leakType: { 
      type: String, 
      enum: ['Main Pipeline Burst', 'Roadway Surface Leak', 'Household Meter Leak', 'Commercial Overflow', 'Subsurface Main Seepage', 'Unknown Leak Type'],
      default: 'Roadway Surface Leak' 
    },
    severityLevel: { 
      type: String, 
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], 
      default: 'HIGH' 
    },
    severityScore: { type: Number, default: 75 },
    estimatedLossPerHourLiters: { type: Number, default: 1000 },
    priorityScore: { type: Number, default: 80 },
    recommendedAction: { type: String, default: 'Dispatch local NWSDB maintenance team' },
    targetAuthority: { 
      type: String, 
      default: 'NWSDB Quick Response Unit' 
    },
    safetyAdvisory: { type: String, default: 'Drive with caution' },
    
    // Status tracking for Member 4 Admin
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'DISPATCHED', 'RESOLVED', 'REJECTED'],
      default: 'PENDING'
    },

    // Member 4: Admin Approval & Assignment Fields
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: { type: String, default: '' },
    assignedTeam: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Leak', LeakSchema);
