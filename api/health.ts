// api/health.ts
import { corsHeaders, okJSON, badJSON } from "../lib/cors";

export default async function handler(req: Request) {
  // CORS preflight isteğini işle (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  // Sadece GET isteklerine izin ver
  if (req.method !== "GET") {
    return badJSON("Method not allowed", 405);
  }

  try {
    // Health check yanıtı
    return okJSON({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'QR Anı API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    // Beklenmedik bir hata olursa
    console.error('Health check error:', error);
    return badJSON("Internal server error", 500);
  }
} 