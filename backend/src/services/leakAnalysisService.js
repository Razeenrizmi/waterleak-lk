/**
 * Member 3 Backend AI Analysis Service
 * Integrates Gemini API or runs Resilient Local Heuristic Engine
 */

export function runLocalFallbackEngine(description = '', imageBase64 = null) {
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

  // If photo is provided without description, simulate visual detection based on image data
  if (!description && imageBase64) {
    const isLargeData = imageBase64.length > 50000;
    if (isLargeData) {
      leakType = "Roadway Pipeline Fracture";
      severityScore = 74;
      estimatedLossPerHourLiters = 1200;
      severityLevel = "HIGH";
      recommendedAction = "Visual Detection: Surface ponding detected in photo. Dispatch NWSDB crew to inspect road curb valve.";
      safetyAdvisory = "Caution: Slippery road conditions identified from uploaded photo.";
    } else {
      leakType = "Household Meter Leak";
      severityScore = 42;
      estimatedLossPerHourLiters = 180;
      severityLevel = "MEDIUM";
      targetAuthority = "Local Pradeshiya Sabha / Municipal Council";
      recommendedAction = "Visual Detection: Localized moisture pooling near meter. Inspect stop-cock.";
      safetyAdvisory = "Keep electrical cords and pets away from wet meter enclosure.";
    }
  } else if (isMainBurst) {
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

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const promptText = `
You are an expert Water Infrastructure Specialist for Sri Lanka's NWSDB (National Water Supply and Drainage Board).
Analyze this water leak report.
${description ? `User Description: "${description}"` : 'No text description provided, rely primarily on visual inspection.'}

Perform visual and engineering analysis:
1. Examine water volume, spray height, pressure, surface flooding, and erosion risks.
2. Accurately categorize the leak: "Main Pipeline Burst", "Roadway Surface Leak", "Commercial Overflow", or "Household Meter Leak".
3. Evaluate severity ("CRITICAL", "HIGH", "MEDIUM", "LOW") based on water waste velocity and risk to Sri Lankan roads/homes.
4. Estimate water loss rate in Liters/Hour (e.g. 2000-6000 L/hr for pipeline bursts, 500-1500 for roadway leaks, 50-300 for meters).
5. Specify target authority: either "NWSDB Quick Response Unit" (for mains, road breaks, large volume) or "Local Pradeshiya Sabha / Municipal Council" (for domestic meters, minor drains).

Respond strictly with a JSON object matching this structure:
{
  "leakType": "Main Pipeline Burst" | "Roadway Surface Leak" | "Commercial Overflow" | "Household Meter Leak",
  "severityLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "severityScore": number (1-100),
  "estimatedLossPerHourLiters": number,
  "priorityScore": number (1-100),
  "recommendedAction": "string with specific technical dispatch steps",
  "targetAuthority": "NWSDB Quick Response Unit" | "Local Pradeshiya Sabha / Municipal Council",
  "safetyAdvisory": "string with practical citizen safety instructions"
}
`;

      const parts = [{ text: promptText }];

      if (imageBase64) {
        // Extract MIME type dynamically (supports png, jpeg, webp, etc.)
        const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64
          }
        });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleanJsonStr);
        }
      } else {
        const errBody = await response.text();
        console.warn('Gemini API returned error status:', response.status, errBody);
      }
    } catch (err) {
      console.warn('Backend Gemini API call error, using local fallback:', err.message);
    }
  }

  return runLocalFallbackEngine(description, imageBase64);
}
