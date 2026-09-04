import mongoose from 'mongoose';

const LeakSchema = new mongoose.Schema(
  {
    reportId: { type: String, unique: true, sparse: true },
    reporterName: { type: String, default: 'Anonymous Citizen' },
    reporterContact: { type: String, default: '+94 77 123 4567 | amara@waterleak.lk' },
    userId: { type: String, default: '' },
    
    location: { type: String, required: true },
    district: { type: String, default: '' },
    latitude: { type: Number, default: 6.9271 },
    longitude: { type: Number, default: 79.8612 },

    leakType: { 
      type: String, 
      default: '🚰 Water Pipe Leak' 
    },
    severityLevel: { 
      type: String, 
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], 
      default: 'HIGH' 
    },
    severityScore: { type: Number, default: 75 },
    estimatedLossPerHourLiters: { type: Number, default: 1000 },
    priorityScore: { type: Number, default: 80 },

    description: { type: String, required: true },
    impacts: [{ type: String }],
    
    imageUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    hasPhoto: { type: Boolean, default: false },
    hasVideo: { type: Boolean, default: false },

    reportedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    reportedTime: { type: String, default: () => new Date().toLocaleTimeString() },

    recommendedAction: { type: String, default: 'Dispatch local NWSDB maintenance team' },
    targetAuthority: { type: String, default: 'NWSDB Quick Response Unit' },
    safetyAdvisory: { type: String, default: 'Drive with caution near wet area' },
    
    aiAnalysis: { type: Object, default: null },

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
