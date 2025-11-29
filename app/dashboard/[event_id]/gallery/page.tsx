import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { AdminGalleryGrid } from './admin-gallery-grid'

export default async function GalleryManagerPage({ params }: { params: Promise<{ event_id: string }> }) {
    const { event_id } = await params
    const supabase = await createClient()

    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('id', event_id)
        .single()

    if (!event) notFound()

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-playfair font-bold text-gray-900">Galeri Yönetimi</h1>
                <p className="text-gray-500 mt-1">Fotoğrafları seçin, indirin veya gizleyin.</p>
            </div>

            <div className="flex-1 min-h-0">
                <AdminGalleryGrid eventId={event.id} />
            </div>
        </div>
    )
}
