import { corsHeaders, okJSON } from "../lib/cors";

export const config = { runtime: "nodejs20.x" };

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  return okJSON({ status: "ok", time: new Date().toISOString() });
}
