// api/sign-url.ts
import { supabase } from "../lib/supabase";
import { okJSON, badJSON, preflight } from "../lib/cors";

const ALLOWED_MIME = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm", "video/quicktime"
]);
const MAX_SIZE_MB = Number(process.env.MAX_UPLOAD_MB || 50);
const MAX_FILES = 20;

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default async function handler(req: Request) {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return preflight(origin);
  if (req.method !== "POST") return badJSON("Method not allowed", 405, origin);

  try {
    const { eventSlug, files } = (await req.json()) as {
      eventSlug?: string;
      files?: { fileName: string; mime: string; size: number }[];
    };

    if (!eventSlug || !Array.isArray(files) || files.length === 0) {
      return badJSON("eventSlug and files[] are required", 400, origin);
    }
    if (files.length > MAX_FILES) {
      return badJSON(`Too many files. Max ${MAX_FILES}.`, 400, origin);
    }

    const bucket = process.env.SUPABASE_BUCKET;
    if (!bucket) return badJSON("SUPABASE_BUCKET not configured", 500, origin);

    // 1) Event doğrulaması (slug -> id)
    const { data: ev, error: evErr } = await supabase
      .from("events")
      .select("id")
      .eq("slug", eventSlug)
      .maybeSingle();

    if (evErr) return badJSON(`DB error: ${evErr.message}`, 500, origin);
    if (!ev) return badJSON("Invalid event", 404, origin);

    const uploads: Array<{
      path: string;
      url: string;
      token: string;
      headers: Record<string, string>;
      mediaId: string | null;
    }> = [];

    // 2) Dosya başına kontrol + signed upload + media(pending) insert
    for (const f of files) {
      if (!f?.fileName || !f?.mime || typeof f?.size !== "number") {
        return badJSON("Each file must include fileName, mime, size", 400, origin);
      }
      if (!ALLOWED_MIME.has(f.mime)) {
        return badJSON(`Mime not allowed: ${f.mime}`, 400, origin);
      }
      if (f.size <= 0 || f.size > MAX_SIZE_MB * 1024 * 1024) {
        return badJSON(`File too large. Max ${MAX_SIZE_MB}MB`, 400, origin);
      }

      const safeName = sanitize(f.fileName);
      const key = `events/${eventSlug}/${crypto.randomUUID()}_${safeName}`;

      // Supabase signed upload URL + token
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .createSignedUploadUrl(key);

      if (error || !data) {
        return badJSON(error?.message || "Failed to create signed upload url", 500, origin);
      }

      // media kaydını pending olarak ekle (event_id ile)
      let mediaId: string | null = null;
      const { data: ins, error: insErr } = await supabase
        .from("media")
        .insert({
          event_id: ev.id,
          file_path: key,
          mime: f.mime,
          status: "pending"
        })
        .select("id")
        .single();

      if (insErr) {
        return badJSON(`DB insert error: ${insErr.message}`, 500, origin);
      }
      mediaId = ins?.id ?? null;

      uploads.push({
        path: data.path,
        url: data.signedUrl,   // Client bu URL'yi kullanacak
        token: data.token,     // ... ve BU token ile yükleyecek
        headers: { "Content-Type": f.mime },
        mediaId
      });
    }

    return okJSON({ uploads }, origin);
  } catch (e: any) {
    console.error("sign-url", e);
    return badJSON(e?.message || "unexpected error", 500, origin);
  }
} 
