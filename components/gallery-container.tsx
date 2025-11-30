'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { GalleryGrid } from '@/components/gallery-grid'
import { TimelineView } from '@/components/timeline-view'
import { ClientLogin } from '@/components/client-login'

interface GalleryContainerProps {
    eventId: number
    coupleName: string
    slug: string
}

type Tab = 'all' | 'timeline'

export function GalleryContainer({ eventId, coupleName, slug }: GalleryContainerProps) {
    const [activeTab, setActiveTab] = useState<Tab>('all')

    return (
        <main className="min-h-screen bg-[#10221c]">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#10221c]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href={`/event/${slug}`} className="text-white/70 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="font-playfair text-xl text-white font-semibold">{coupleName}</h1>
                    <div className="w-6" />
                </div>

                {/* Tabs / Filters */}
                <div className="max-w-7xl mx-auto px-4 pb-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'all'
                                    ? 'bg-white text-emerald-900'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            Tüm Anılar
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'timeline'
                                    ? 'bg-white text-emerald-900'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            Zaman Tüneli
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'all' ? (
                    <GalleryGrid eventId={eventId} />
                ) : (
                    <TimelineView eventId={eventId} />
                )}
            </div>

            {/* Footer Login */}
            <div className="py-8 flex justify-center pb-24 md:pb-8">
                <ClientLogin eventId={eventId} />
            </div>
        </main>
    )
}
