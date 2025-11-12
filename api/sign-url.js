import { supabase } from "../lib/supabase";
import { corsHeaders, okJSON, badJSON } from "../lib/cors";
export default async function handler(req) {
    if (req.method === "OPTIONS")
        return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== "POST")
        return badJSON("Method not allowed", 405);
    try {
        const body = await req.json();
        const path = body?.path;
        if (!path || typeof path !== "string") {
            return badJSON("path is required and must be a string");
        }
        const bucket = process.env.SUPABASE_BUCKET;
        // createSignedUploadUrl ile signed URL oluştur
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUploadUrl(path);
        if (error)
            return badJSON(error.message, 500);
        return okJSON({
            signedUrl: data.signedUrl,
            path: data.path,
            token: data.token,
        });
    }
    catch (e) {
        return badJSON(e?.message || "unexpected error", 500);
    }
}
