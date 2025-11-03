import { supabase } from "../lib/supabase";
import { corsHeaders, okJSON, badJSON } from "../lib/cors";


export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return badJSON("Method not allowed", 405);

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || null;
    const eventId = (form.get("eventId") as string) || null;

    if (!file) return badJSON("file is required");

    // Dosya boyutu kontrolü: max 20MB
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) return badJSON("File size exceeds 20MB limit");

    // Mime türü kontrolü: sadece image/* ve video/*
    const allowedMimeTypes = /^(image|video)\//;
    if (!allowedMimeTypes.test(file.type)) {
      return badJSON("Only image/* and video/* files are allowed");
    }

    const bucket = process.env.SUPABASE_BUCKET!;
    const extGuess = file.name?.split(".").pop() || "bin";
    const key = `${eventId || "general"}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extGuess}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: upErr } = await supabase.storage.from(bucket).upload(key, new Uint8Array(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });
    if (upErr) return badJSON(`upload failed: ${upErr.message}`, 500);

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(key);
    const publicUrl = pub.publicUrl;

    return okJSON({ url: publicUrl, key, title, eventId });
  } catch (e: any) {
    return badJSON(e?.message || "unexpected error", 500);
  }
}
