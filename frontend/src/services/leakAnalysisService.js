import { runLocalFallbackEngine } from '../modules/ai-analysis/leakAnalysisService.js';

export async function analyzeLeak(description, imageUrl = null) {
  try {
    const payload = {
      description,
      imageBase64: imageUrl,
      saveToDb: false
    };

    const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/ai/analyze` : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api/ai/analyze' : 'https://waterleaklk1.vercel.app/api/ai/analyze');

    // Make a request to our Express backend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (error) {
    console.warn("Backend API not reachable. Using resilient local heuristic fallback.", error);
  }

  // Artificial short delay for smooth realistic UX
  await new Promise(resolve => setTimeout(resolve, 600));
  return runLocalFallbackEngine(description);
}
