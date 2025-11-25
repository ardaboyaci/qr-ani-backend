import { createClient } from "@/utils/supabase/server";
import { corsHeaders, okJSON, badJSON, preflight } from "@/utils/cors";

export default async function handler(req: Request) {
  const origin = req.headers.get("origin") ?? '*';
  if (req.method === "OPTIONS") return preflight(origin);

  const supabase = await createClient();

  // URL'den slug'ı al (basitçe URL path'inden)
  // Not: Next.js App Router Route Handler'da params argümanı da kullanılabilir ama
  // bu dosya yapısı (api/events/[slug].ts) Vercel Function gibi duruyor.
  // URL parsing ile slug'ı almaya çalışalım.
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  // /api/events/SLUG varsayımıyla son parça veya sondan bir önceki
  const slug = pathParts[pathParts.length - 1] || '';

  if (req.method === "GET") {
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) return badJSON(error.message, 404, origin);
    return okJSON(event, origin || undefined);
  }

  return badJSON("Method not allowed", 405, origin);
} 