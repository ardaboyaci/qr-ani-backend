// api/qr.ts
import QRCode from "qrcode";
import { okJSON, badJSON, preflight } from "../lib/cors";

// Küçük güvenlik: en fazla 1024 karakter metin
const MAX_LEN = 1024 as const;

export default async function handler(req: Request) {
  const origin = req.headers.get("origin") ?? '*';
  if (req.method === "OPTIONS") return preflight(origin);

  try {
    if (req.method === "POST") {
      const { text } = await req.json() as { text?: string };
      if (!text || typeof text !== "string" || text.length > MAX_LEN) {
        return badJSON("Invalid 'text'", 400, origin);
      }
      const buffer = await QRCode.toBuffer(text, { errorCorrectionLevel: "M", margin: 1 });
      const headers = new Headers({ "content-type": "image/png" });
      // CORS
      headers.set("access-control-allow-origin", origin || "*");
      headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
      headers.set("access-control-allow-headers", "content-type, authorization");
      return new Response(buffer as unknown as BodyInit, { status: 200, headers });
    }

    if (req.method === "GET") {
      const url = new URL(req.url);
      const text = url.searchParams.get("text");
      if (!text || text.length > MAX_LEN) return badJSON("Invalid 'text'", 400, origin);
      const buffer = await QRCode.toBuffer(text, { errorCorrectionLevel: "M", margin: 1 });
      const headers = new Headers({ "content-type": "image/png" });
      headers.set("access-control-allow-origin", origin || "*");
      headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
      headers.set("access-control-allow-headers", "content-type, authorization");
      return new Response(buffer as unknown as BodyInit, { status: 200, headers });
    }

    return badJSON("Method not allowed", 405, origin);
  } catch (e: any) {
    console.error("qr", e);
    return badJSON("Internal error", 500, origin);
  }
} 
