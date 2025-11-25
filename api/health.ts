// api/health.ts
import { okJSON, badJSON, preflight } from "../lib/cors";

export default async function handler(req: Request) {
  const origin = req.headers.get("origin") ?? '*';
  if (req.method === "OPTIONS") return preflight(origin);

  if (req.method !== "GET") {
    return badJSON("Method not allowed", 405, origin);
  }

  try {
    return okJSON(
      {
        status: "ok",
        service: "QR Anı Backend API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      },
      origin
    );
  } catch (err: any) {
    console.error("health", err);
    return badJSON("Internal server error", 500, origin);
  }
} 
