import { createClient } from "@/utils/supabase/server";
import { corsHeaders, okJSON, badJSON, preflight } from "@/utils/cors";

export default async function handler(req: Request) {
  const origin = req.headers.get("origin") ?? '*';
  if (req.method === "OPTIONS") return preflight(origin);

  const supabase = await createClient();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return badJSON(error.message, 500, origin);
    return okJSON(data, origin || undefined);
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      // Basit validasyon
      if (!body.name || !body.slug) {
        return badJSON("Name and slug are required", 400, origin);
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          name: body.name,
          slug: body.slug,
          date: body.date,
          location: body.location
        } as any)
        .select()
        .single();

      if (error) return badJSON(error.message, 500, origin);
      return okJSON(data, origin, { status: 201 });
    } catch (e: any) {
      return badJSON(e.message, 400, origin);
    }
  }

  return badJSON("Method not allowed", 405, origin);
}