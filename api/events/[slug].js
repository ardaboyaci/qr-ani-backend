// api/events/[slug].ts
import { supabase } from "../../lib/supabase";
import { corsHeaders, okJSON, badJSON } from "../../lib/cors";
export default async function handler(req) {
    // CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }
    // URL'den [slug] parametresini al
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop();
    if (!slug)
        return badJSON("Slug is required", 400);
    try {
        // === GET /api/events/:slug ===
        // (Eski getEventBySlug mantığı)
        if (req.method === "GET") {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return badJSON('Event not found', 404);
                throw error;
            }
            return okJSON(data);
        }
        // === PUT /api/events/:slug ===
        // (Eski updateEvent mantığı)
        if (req.method === "PUT") {
            const body = await req.json();
            const { title, date, theme, cover_url } = body;
            const updates = {};
            if (title)
                updates.title = title;
            if (date)
                updates.date = date;
            if (theme)
                updates.theme = theme;
            if (cover_url !== undefined)
                updates.cover_url = cover_url;
            if (Object.keys(updates).length === 0) {
                return badJSON('No fields to update', 400);
            }
            const { data, error } = await supabase
                .from('events')
                .update(updates)
                .eq('slug', slug)
                .select()
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return badJSON('Event not found', 404);
                throw error;
            }
            return okJSON(data);
        }
        // === DELETE /api/events/:slug ===
        // (Eski deleteEvent mantığı)
        if (req.method === "DELETE") {
            const { data, error } = await supabase
                .from('events')
                .delete()
                .eq('slug', slug)
                .select()
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return badJSON('Event not found', 404);
                throw error;
            }
            return okJSON(data);
        }
        // İzin verilmeyen diğer metotlar
        return badJSON("Method not allowed", 405);
    }
    catch (error) {
        return badJSON(error.message || 'Internal Server Error', 500);
    }
}
