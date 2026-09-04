import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  deleteReport
} from '../controllers/reportingController.js';

const router = express.Router();

// Member 1: Reporting Routes
router.route('/')
  .post(createReport)
  .get(getReports);

router.route('/:id')
  .get(getReportById)
  .delete(deleteReport);

export default router;
