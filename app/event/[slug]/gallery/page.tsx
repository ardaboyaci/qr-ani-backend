import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { GalleryContainer } from '@/components/gallery-container'

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!event) {
        notFound()
    }

    return (
        <GalleryContainer
            eventId={event.id}
            coupleName={event.couple_name}
            slug={slug}
        />
    )
}
