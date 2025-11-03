// api/events/index.ts
import { supabase } from "../../lib/supabase";
import { corsHeaders, okJSON, badJSON } from "../../lib/cors";

// Helper fonksiyonunu eventController'dan buraya taşıdık
const generateSlug = (title: string) => {
  const slug = title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${slug}-${randomSuffix}`;
};

export default async function handler(req: Request) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // === GET /api/events ===
    // (Eski getAllEvents mantığı)
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return okJSON({
        count: data.length,
        items: data
      });
    }

    // === POST /api/events ===
    // (Eski createEvent mantığı)
    if (req.method === "POST") {
      const body = await req.json();
      const { title, date, theme, cover_url } = body;

      if (!title) return badJSON("Title is required");
      
      const slug = generateSlug(title);

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            slug,
            date: date || new Date().toISOString().split('T')[0],
            theme: theme || 'classic',
            cover_url: cover_url || null
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // QR kod URL'sini oluştur
      const host = req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      const qrCodeUrl = `${protocol}://${host}/upload/${slug}`;

      return okJSON({
        ...data,
        qr_code_url: qrCodeUrl,
        upload_url: qrCodeUrl
      }, { status: 201 });
    }

    // İzin verilmeyen diğer metotlar
    return badJSON("Method not allowed", 405);

  } catch (error: any) {
    return badJSON(error.message || 'Internal Server Error', 500);
  }
} 