import { supabase } from "../lib/supabase";
import { corsHeaders, okJSON, badJSON } from "../lib/cors";

export const config = { runtime: "nodejs" };

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  if (req.method === "GET") {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("media")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (eventId) query = query.eq("event_id", eventId);

    const { data, error, count } = await query;
    if (error) return badJSON(error.message, 500);

    return okJSON({
      items: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
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

  if (req.method === "DELETE") {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return badJSON("id parameter is required");

    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) return badJSON(error.message, 500);
    return okJSON({ success: true });
  }

  return badJSON("Method not allowed", 405);
} 