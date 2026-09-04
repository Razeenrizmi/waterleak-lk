import { analyzeWaterLeakBackend } from '../services/leakAnalysisService.js';
import Leak from '../models/Leak.js';

/**
 * @desc Member 3: AI Leak Analysis Endpoint
 * @route POST /api/ai/analyze
 */
export const analyzeLeak = async (req, res) => {
  try {
    const { description, imageBase64, saveToDb } = req.body;
    
    // Run AI / Heuristic Analysis
    const analysisResult = await analyzeWaterLeakBackend({ description, imageBase64 });

    // Optional: Save directly to MongoDB if requested
    let savedRecord = null;
    if (saveToDb) {
      try {
        savedRecord = await Leak.create({
          location: req.body.location || 'Reported Location',
          description: description || 'No description',
          ...analysisResult
        });
      } catch (dbErr) {
        console.warn('Database save skipped:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: analysisResult,
      dbRecord: savedRecord
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI leak analysis',
      error: error.message
    });
  }
};
