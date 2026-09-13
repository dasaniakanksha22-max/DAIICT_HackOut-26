import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// Safe resolution for both ESM and CJS bundle
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'SynapseGrid Renewable Intelligence',
    timestamp: new Date().toISOString(),
  });
});

// Proxy Open-Meteo to guarantee fast, CORS-free access
app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat || '23.90'; // Default Charanka, Gujarat
    const lon = req.query.lon || '71.20';
    const hourly = [
      'temperature_2m',
      'relative_humidity_2m',
      'direct_normal_irradiance',
      'direct_radiation',
      'diffuse_radiation',
      'shortwave_radiation',
      'wind_speed_10m',
      'wind_speed_100m',
      'cloud_cover',
      'surface_pressure'
    ].join(',');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${hourly}&timezone=auto&forecast_days=3`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const raw = await response.json();
    
    // Normalize aliases so frontend engine can seamlessly access ghi & dhi
    if (raw.hourly) {
      if (!raw.hourly.global_horizontal_irradiance && raw.hourly.shortwave_radiation) {
        raw.hourly.global_horizontal_irradiance = raw.hourly.shortwave_radiation;
      }
      if (!raw.hourly.diffuse_horizontal_irradiance && raw.hourly.diffuse_radiation) {
        raw.hourly.diffuse_horizontal_irradiance = raw.hourly.diffuse_radiation;
      }
    }

    res.json({ success: true, source: 'live_open_meteo', data: raw });
  } catch (err: any) {
    console.warn('Open-Meteo fetch failed, returning structured synthetic solar-wind data fallback:', err?.message);
    res.json({
      success: false,
      source: 'fallback',
      message: err?.message || 'Weather feed unreachable',
    });
  }
});

// AI Dispatch Advisor Endpoint
app.post('/api/ai-advisor', async (req, res) => {
  try {
    const { siteName, capacityMW, riskLevel, p10MW, p50MW, p90MW, scheduleMW, weatherSummary, role } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        success: true,
        advisory: `[Automated SLDC Advisory Engine] At ${siteName} (${capacityMW} MW), risk is ${riskLevel}. Expected P50 generation is ${p50MW} MW against contracted schedule of ${scheduleMW} MW. Uncertainty spread is ${(p90MW - p10MW).toFixed(1)} MW. Recommended action: Maintain dynamic BESS reserve of ${Math.round((p50MW - p10MW) * 0.6)} MW, defer thermal ramping, and monitor 15-min DSM block deviations.`,
        source: 'rule_engine',
      });
    }

    const prompt = `You are the Chief Grid Dispatch Intelligence Officer for the Indian State Load Despatch Centre (SLDC / POSOCO Grid-India).
Analyze the following real-time renewable forecasting snapshot:
- Asset / Hub: ${siteName} (Installed: ${capacityMW} MW)
- Current Target Horizon: 24-48 Hours
- Quantile Forecast: P10 (Conservative) = ${p10MW} MW, P50 (Expected) = ${p50MW} MW, P90 (Optimistic) = ${p90MW} MW
- Contracted Schedule Baseline: ${scheduleMW} MW
- Quantile Risk Spread: ${(p90MW - p10MW).toFixed(1)} MW (${(((p90MW - p10MW) / capacityMW) * 100).toFixed(1)}% of capacity)
- Risk Level: ${riskLevel}
- Weather Drivers: ${weatherSummary || 'Variable irradiance, cloud turbulence'}
- User Role Perspective: ${role || 'Grid Operator'}

Provide a 3-4 bullet operational advisory that includes:
1. Operational Risk Assessment (grid frequency stability 49.90-50.05 Hz, ramp rate risks).
2. Prescriptive Dispatch Directive (exact BESS MWh charging/discharging recommendation or curtailment order to prevent coal plants breaching 55% Technical Minimum MTL).
3. Financial / DSM Imbalance Warning (CERC Deviation Settlement Mechanism exposure in ₹ Lakhs).
Keep it professional, concise, authoritative, and actionable. No generic fluff.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text || 'Operational recommendation computed successfully.';
    res.json({
      success: true,
      advisory: text,
      source: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Error generating AI advisory:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to generate advisory',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SynapseGrid Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
