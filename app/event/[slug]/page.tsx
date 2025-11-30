import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { EventHero } from '@/components/event-hero'
import { KvkkModal } from '@/components/kvkk-modal'
import { EventProtectionWrapper } from '@/components/event-protection-wrapper'

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
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
        <EventProtectionWrapper eventId={event.id} password={event.password}>
            <main className="min-h-screen bg-ivory text-charcoal">
                <EventHero event={event} />
                <KvkkModal eventSlug={slug} />
            </main>
        </EventProtectionWrapper>
    )
}
