import express from 'express';
import { getAllLeaks } from '../controllers/mapController.js';

const router = express.Router();

// Member 2: GET /api/map/leaks - Get all leaks for interactive map
router.get('/leaks', getAllLeaks);

export default router;
