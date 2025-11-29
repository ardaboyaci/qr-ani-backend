'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Camera, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { UploadModal } from './upload-modal'

export function EventHero({ event }: { event: any }) {
    const [timeLeft, setTimeLeft] = useState('')
    const [isUploadOpen, setIsUploadOpen] = useState(false)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(event.wedding_date) - +new Date()

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
                const minutes = Math.floor((difference / 1000 / 60) % 60)
                const seconds = Math.floor((difference / 1000) % 60)
                return `${days}g ${hours}s ${minutes}d ${seconds}sn`
            }
            return 'Büyük Gün Geldi! 🎉'
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        setTimeLeft(calculateTimeLeft())

        return () => clearInterval(timer)
    }, [event.wedding_date])

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#10221c] via-[#0a1612] to-[#10221c] z-0" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="font-playfair text-5xl md:text-7xl text-white mb-6 leading-tight">
                        {event.couple_name}
                    </h1>

                    <div className="text-emerald-400/80 font-mono text-lg md:text-xl tracking-widest mb-8">
                        {timeLeft}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue_name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg border-b border-white/20 hover:border-white/60 pb-0.5"
                        >
                            {event.venue_name}
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                        <div className="relative flex items-center justify-center gap-3">
                            <Camera className="w-6 h-6" />
                            <span className="text-lg">Anılarını Ekle 📸</span>
                        </div>
                    </button>

                    <Link
                        href={`/event/${event.slug}/gallery`}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>Galeriyi Gözat</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Upload Modal */}
            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                eventId={event.id}
                eventSlug={event.slug}
                coupleName={event.couple_name}
            />
        </div>
    )
}
