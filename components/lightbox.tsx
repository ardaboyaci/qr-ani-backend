'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from 'lucide-react'
import { useEffect } from 'react'

interface LightboxProps {
    isOpen: boolean
    onClose: () => void
    photo: any
    onNext: () => void
    onPrev: () => void
    onLike: () => void
    isLiked: boolean
    hasPrev: boolean
    hasNext: boolean
}

export function Lightbox({ isOpen, onClose, photo, onNext, onPrev, onLike, isLiked, hasPrev, hasNext }: LightboxProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft' && hasPrev) onPrev()
            if (e.key === 'ArrowRight' && hasNext) onNext()
        }
        if (isOpen) window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext])

    if (!isOpen || !photo) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                onClick={onClose}
            >
                {/* Controls */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                >
                    <X className="w-8 h-8" />
                </button>

                {hasPrev && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev() }}
                        className="absolute left-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                )}

                {hasNext && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext() }}
                        className="absolute right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>
                )}

                {/* Image */}
                <div
                    className="relative max-w-[90vw] max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                >
                    {(photo.media_type === 'video' || photo.file_url.endsWith('.mp4')) ? (
                        <video
                            src={photo.file_url}
                            controls
                            autoPlay
                            className="max-w-full max-h-[90vh] rounded-lg"
                        />
                    ) : (
                        <img
                            src={photo.file_url}
                            alt="Gallery item"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                    )}

                    {/* Actions Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between rounded-b-lg">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); onLike() }}
                                className="flex items-center gap-2 text-white hover:scale-110 transition-transform"
                            >
                                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                <span className="font-medium">{photo.likes_count}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href={photo.file_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/80 hover:text-white"
                                onClick={e => e.stopPropagation()}
                            >
                                <Download className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
