'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { GalleryGrid } from '@/components/gallery-grid'
import { TimelineView } from '@/components/timeline-view'
import { ClientLogin } from '@/components/client-login'
import { HighlightsLoader } from '@/components/HighlightsLoader'
import { selectHighlights } from '@/lib/utils/highlightsAlgorithm'
import { createClient } from '@/utils/supabase/client'

interface GalleryContainerProps {
    eventId: number
    coupleName: string
    slug: string
}

type Tab = 'all' | 'timeline' | 'highlights'

export function GalleryContainer({ eventId, coupleName, slug }: GalleryContainerProps) {
    const [activeTab, setActiveTab] = useState<Tab>('all')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [highlightedPhotos, setHighlightedPhotos] = useState<any[]>([])
    const supabase = createClient()

    const handleHighlightsClick = async () => {
        setActiveTab('highlights')

        // Check cache first
        const cached = sessionStorage.getItem(`highlights-${eventId}`)
        if (cached) {
            setHighlightedPhotos(JSON.parse(cached))
            return
        }

        setIsAnalyzing(true)

        // Fetch recent 100 photos for analysis
        const { data: photos } = await supabase
            .from('uploads')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false })
            .limit(100)

        if (photos) {
            // Store for processing after animation
            // We'll process them in handleAnalysisComplete
            (window as any).tempPhotosForAnalysis = photos
        }
    }

    const handleAnalysisComplete = () => {
        const photos = (window as any).tempPhotosForAnalysis || []
        const highlights = selectHighlights(photos, 15)
        setHighlightedPhotos(highlights)
        sessionStorage.setItem(`highlights-${eventId}`, JSON.stringify(highlights))
        setIsAnalyzing(false)
        delete (window as any).tempPhotosForAnalysis
    }

    return (
        <main className="min-h-screen bg-ivory">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-ivory/80 backdrop-blur-md border-b border-gold/20">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href={`/event/${slug}`} className="text-charcoal/70 hover:text-gold transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="font-playfair text-xl text-charcoal font-semibold">{coupleName}</h1>
                    <div className="w-6" />
                </div>

                {/* Tabs / Filters */}
                <div className="max-w-7xl mx-auto px-4 pb-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 border ${activeTab === 'all'
                                ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                                : 'bg-white text-charcoal/70 border-bronze/20 hover:border-gold/50 hover:text-gold'
                                }`}
                        >
                            Tüm Anılar
                        </button>
                        <button
                            onClick={handleHighlightsClick}
                            className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 border ${activeTab === 'highlights'
                                ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                                : 'bg-white text-charcoal/70 border-bronze/20 hover:border-gold/50 hover:text-gold'
                                }`}
                        >
                            ✨ Öne Çıkanlar
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 border ${activeTab === 'timeline'
                                ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                                : 'bg-white text-charcoal/70 border-bronze/20 hover:border-gold/50 hover:text-gold'
                                }`}
                        >
                            Zaman Tüneli
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'all' && <GalleryGrid eventId={eventId} />}
                {activeTab === 'timeline' && <TimelineView eventId={eventId} />}
                {activeTab === 'highlights' && (
                    isAnalyzing ? (
                        <HighlightsLoader onComplete={handleAnalysisComplete} />
                    ) : (
                        <>
                            {highlightedPhotos.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <p className="text-lg">Henüz öne çıkan anı bulunamadı.</p>
                                    <p className="text-sm mt-2">Daha fazla fotoğraf yüklendiğinde en iyileri burada görünecek.</p>
                                </div>
                            ) : (
                                <GalleryGrid eventId={eventId} staticPhotos={highlightedPhotos} />
                            )}
                        </>
                    )
                )}
            </div>

            {/* Footer Login */}
            <div className="py-8 flex justify-center pb-24 md:pb-8">
                <ClientLogin eventId={eventId} />
            </div>
        </main>
    )
}
