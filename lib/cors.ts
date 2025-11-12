// lib/cors.ts
const ALLOWED = (process.env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);

function isAllowedOrigin(origin?: string | null) {
  if (!origin) return false;
  if (ALLOWED.length === 0) return true; // geliştirici modunda geniş
  return ALLOWED.includes(origin);
}

export function withCors(resHeaders: Headers, origin?: string | null) {
  const headers = new Headers(resHeaders);
  if (isAllowedOrigin(origin)) {
    headers.set("access-control-allow-origin", origin!);
  }
  headers.set("access-control-allow-methods", "GET,POST,PATCH,DELETE,OPTIONS");
  headers.set("access-control-allow-headers", "content-type, authorization");
  return headers;
}

export function preflight(origin?: string | null) {
  return new Response(null, { status: 204, headers: withCors(new Headers(), origin) });
}

export function okJSON(data: unknown, origin?: string | null, init?: ResponseInit) {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: withCors(new Headers({ "content-type": "application/json; charset=utf-8" }), origin),
    ...init,
  });
}

export function badJSON(message: string, status = 400, origin?: string | null) {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: withCors(new Headers({ "content-type": "application/json; charset=utf-8" }), origin),
  });
}
