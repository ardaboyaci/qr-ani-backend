// lib/cors.ts
export const corsHeaders = {
    "access-control-allow-origin": process.env.ALLOWED_ORIGIN || "*",
    "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
};
export function okJSON(data, init) {
    return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders },
        ...init,
    });
}
export function badJSON(message, status = 400) {
    return new Response(JSON.stringify({ error: { message } }), {
        status,
        headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders },
    });
}
