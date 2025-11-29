import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { GalleryGrid } from '@/components/gallery-grid'
import { ClientLogin } from '@/components/client-login'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
        <main className="min-h-screen bg-[#10221c]">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#10221c]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href={`/event/${slug}`} className="text-white/70 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="font-playfair text-xl text-white font-semibold">{event?.couple_name}</h1>
                    <div className="w-6" />
                </div>

                {/* Tabs / Filters */}
                <div className="max-w-7xl mx-auto px-4 pb-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-white text-emerald-900 font-medium text-sm whitespace-nowrap">
                            Tüm Anılar
                        </button>
                        <button className="px-4 py-1.5 rounded-full bg-white/10 text-white/70 font-medium text-sm whitespace-nowrap hover:bg-white/20">
                            Hikayeler
                        </button>
                        <button className="px-4 py-1.5 rounded-full bg-white/10 text-white/70 font-medium text-sm whitespace-nowrap hover:bg-white/20">
                            Yüzler
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <GalleryGrid eventId={event.id} />
            </div>

            {/* Footer Login */}
            <div className="py-8 flex justify-center pb-24 md:pb-8">
                <ClientLogin eventId={event.id} />
            </div>
        </main>
    )
}
