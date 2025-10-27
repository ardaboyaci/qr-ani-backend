import { supabase } from "../lib/supabase";
import { corsHeaders, okJSON, badJSON } from "../lib/cors";

export const config = { runtime: "nodejs20.x" };

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  if (req.method === "GET") {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const query = supabase.from("media").select("*").order("created_at", { ascending: false });
    const { data, error } = eventId ? await query.eq("event_id", eventId) : await query;
    if (error) return badJSON(error.message, 500);
    return okJSON(data);
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (!body?.url) return badJSON("url is required");
      const { data, error } = await supabase.from("media").insert({
        event_id: body.eventId || null,
        url: body.url,
        type: body.type || null,
        title: body.title || null,
      }).select().single();
      if (error) return badJSON(error.message, 500);
      return okJSON(data, { status: 201 });
    } catch (e: any) {
      return badJSON(e?.message || "invalid json");
    }
  }

  return badJSON("Method not allowed", 405);
}
