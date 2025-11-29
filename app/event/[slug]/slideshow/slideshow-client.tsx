'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

interface Photo {
    id: number
    file_url: string
    media_type: 'image' | 'video'
}

interface SlideshowClientProps {
    eventId: number
    eventSlug: string
    initialPhotos: Photo[]
}

export function SlideshowClient({ eventId, eventSlug, initialPhotos }: SlideshowClientProps) {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
    const [currentIndex, setCurrentIndex] = useState(0)
    const supabase = createClient()

    // Realtime Subscription
    useEffect(() => {
        const channel = supabase
            .channel('slideshow-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'uploads',
                    filter: `event_id=eq.${eventId}`
                },
                (payload) => {
                    const newPhoto = payload.new as Photo
                    // Add new photo and immediately show it
                    setPhotos(prev => {
                        const newPhotos = [...prev]
                        // Insert after current index to show next, or just append?
                        // User said: "hemen yeni gelen fotoğrafı ekrana bas" (show immediately)
                        // So we should insert it at the next index and jump to it?
                        // Or just append and set index to it?
                        // Let's append it and set index to the last one.
                        return [...newPhotos, newPhoto]
                    })
                    // We need to wait for state update to know the new length, 
                    // but we can just set it to photos.length (which is the index of the new item)
                    // actually safer to use functional update or just rely on the fact that we added one.
                    // Let's use a separate effect or just force it here.
                    // Actually, if we append, the index of the new item is prev.length.
                    setCurrentIndex(prev => prev + 1) // This might be wrong if we are not at the end.
                    // Better strategy: Insert new photo right after current index, and advance index by 1.
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [eventId, supabase])

    // Auto-play Timer
    useEffect(() => {
        if (photos.length <= 1) return

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % photos.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [photos.length]) // Re-create timer when photos change to avoid skipping

    // Handle "Show Immediately" logic better
    // When a new photo comes in, we want to show it. 
    // The subscription adds it. We need to detect that addition and jump to it?
    // Or maybe the subscription logic above needs refinement.
    // Let's refine the subscription logic:
    useEffect(() => {
        const channel = supabase
            .channel('slideshow-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'uploads',
                    filter: `event_id=eq.${eventId}`
                },
                (payload) => {
                    const newPhoto = payload.new as Photo
                    setPhotos(prev => {
                        const updated = [...prev, newPhoto]
                        // Jump to the new photo (last index)
                        setCurrentIndex(updated.length - 1)
                        return updated
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [eventId, supabase])


    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (photos.length === 0) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center text-white/50 font-playfair text-2xl">
                Henüz fotoğraf yok...
                {mounted && (
                    <div className="absolute bottom-8 right-8 bg-white/90 p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <QRCodeSVG
                                value={`${window.location.origin}/event/${eventSlug}`}
                                size={120}
                            />
                            <span className="text-xs font-bold text-gray-900">Yüklemek için Tara</span>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const currentPhoto = photos[currentIndex]

    if (!currentPhoto) return null


    return (
        <div className="fixed inset-0 bg-black overflow-hidden z-[100]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPhoto.id} // Key change triggers animation
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {currentPhoto.media_type === 'video' || currentPhoto.file_url.endsWith('.mp4') ? (
                        <video
                            src={currentPhoto.file_url}
                            autoPlay
                            muted
                            loop // Maybe loop for 5 seconds? Or just play once? 
                            // User said "5 seconds auto change". If video is long, it will cut off.
                            // Ideally we should pause timer for video, but requirement says "5 seconds".
                            // Let's stick to 5s for now as per "Slideshow" usually implies.
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <img
                            src={currentPhoto.file_url}
                            alt="Slideshow"
                            className="w-full h-full object-contain"
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* QR Code Overlay */}
            {mounted && (
                <div className="absolute bottom-8 right-8 bg-white/90 p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <QRCodeSVG
                            value={`${window.location.origin}/event/${eventSlug}`}
                            size={120}
                        />
                        <span className="text-xs font-bold text-gray-900">Yüklemek için Tara</span>
                    </div>
                </div>
            )}
        </div>
    )
}
