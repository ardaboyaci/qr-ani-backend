import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { SlideshowClient } from './slideshow-client'

export default async function SlideshowPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch Event
    const { data: event } = await supabase
        .from('events')
        .select('id, slug')
        .eq('slug', slug)
        .single()

    if (!event) {
        notFound()
    }

    // Fetch Initial Photos (Last 50)
    const { data: uploads } = await supabase
        .from('uploads')
        .select('*')
        .eq('event_id', event.id)
        .eq('is_hidden', false) // Don't show hidden photos
        .order('created_at', { ascending: false })
        .limit(50)

    // Reverse to show oldest first? Or newest?
    // Slideshow usually cycles through. 
    // If we want "Live", maybe we start with the most recent?
    // Let's just pass them as is (Newest first).
    // But for a slideshow, usually you want to cycle. 
    // If we have 0 photos, client handles it.

    return (
        <SlideshowClient
            eventId={event.id}
            eventSlug={event.slug}
            initialPhotos={uploads || []}
        />
    )
}
