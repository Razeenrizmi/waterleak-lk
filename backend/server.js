import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';

// Route Imports for 4 Members
import reportingRoutes from './src/routes/reportingRoutes.js';
import mapRoutes from './src/routes/mapRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'WaterLeak LK API',
    timestamp: new Date().toISOString()
  });
});

// Member API Endpoints
app.use('/api/reports', reportingRoutes);  // Member 1
app.use('/api/map', mapRoutes);            // Member 2
app.use('/api/ai', aiRoutes);              // Member 3 (AI Leak Analysis)
app.use('/api/admin', adminRoutes);        // Member 4
app.use('/api/auth', authRoutes);          // Auth Module

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 WaterLeak LK Backend running on http://localhost:${PORT}`);
});
