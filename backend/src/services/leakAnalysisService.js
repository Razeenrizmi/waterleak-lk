/**
 * Member 3 Backend AI Analysis Service
 * Integrates Gemini API or runs Resilient Local Heuristic Engine
 */

export function runLocalFallbackEngine(description = '') {
  const text = (description || '').toLowerCase();

  const isMainBurst = text.includes('burst') || text.includes('gushing') || text.includes('flooding road') || text.includes('main line');
  const isRoadway = text.includes('road') || text.includes('street') || text.includes('asphalt') || text.includes('sidewalk');
  const isCommercial = text.includes('hotel') || text.includes('shop') || text.includes('commercial') || text.includes('factory');
  const isHousehold = text.includes('meter') || text.includes('house') || text.includes('tap') || text.includes('home');

  let leakType = "Roadway Surface Leak";
  let severityScore = 65;
  let estimatedLossPerHourLiters = 800;
  let severityLevel = "HIGH";
  let targetAuthority = "NWSDB Quick Response Unit";
  let recommendedAction = "Schedule road cut permit & fix subterranean pipe fracture.";
  let safetyAdvisory = "Drive with caution; water accumulation on roadway.";

  if (isMainBurst) {
    leakType = "Main Pipeline Burst";
    severityScore = 92;
    estimatedLossPerHourLiters = 3500;
    severityLevel = "CRITICAL";
    targetAuthority = "NWSDB Quick Response Unit";
    recommendedAction = "URGENT: Isolate main feeder valve at nearest pump station & deploy heavy excavation team.";
    safetyAdvisory = "CRITICAL ROADWAY HAZARD: Hydro-eroded cavity risk. Keep vehicles and pedestrians 15m away.";
  } else if (isCommercial) {
    leakType = "Commercial Overflow";
    severityScore = 78;
    estimatedLossPerHourLiters = 1400;
    severityLevel = "HIGH";
    targetAuthority = "NWSDB Quick Response Unit";
    recommendedAction = "Issue isolation notice to commercial facility & inspect mainline coupling.";
    safetyAdvisory = "Watch for slippery commercial access pathways.";
  } else if (isHousehold) {
    leakType = "Household Meter Leak";
    severityScore = 45;
    estimatedLossPerHourLiters = 250;
    severityLevel = "MEDIUM";
    targetAuthority = "Local Pradeshiya Sabha / Municipal Council";
    recommendedAction = "Inform property owner to turn off stop-cock and dispatch local NWSDB technician.";
    safetyAdvisory = "Ensure electrical grounds near wet meter area are safe.";
  }

  const priorityScore = Math.min(100, Math.round(severityScore * 1.05));

  return {
    leakType,
    severityLevel,
    severityScore,
    estimatedLossPerHourLiters,
    priorityScore,
    recommendedAction,
    targetAuthority,
    safetyAdvisory
  };
}

export async function analyzeWaterLeakBackend({ description, imageBase64 }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const promptText = `
You are an expert Water Infrastructure Specialist for Sri Lanka's NWSDB.
Analyze this leak description: "${description || 'No description provided'}".
Return JSON with keys: leakType, severityLevel ("CRITICAL"|"HIGH"|"MEDIUM"|"LOW"), severityScore (1-100), estimatedLossPerHourLiters, priorityScore (1-100), recommendedAction, targetAuthority ("NWSDB Quick Response Unit"|"Local Pradeshiya Sabha / Municipal Council"), safetyAdvisory.
      `;

      const parts = [{ text: promptText }];
      if (imageBase64) {
        parts.push({
          inline_data: {
            mime_type: 'image/jpeg',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
          }
        });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleanJsonStr);
        }
      }
    } catch (err) {
      console.warn('Backend Gemini API call error, using local fallback:', err);
    }
  }

  return runLocalFallbackEngine(description);
}
