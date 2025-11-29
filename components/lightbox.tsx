'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, Heart } from 'lucide-react'
import { useEffect } from 'react'
import { CommentSection } from './comment-section'

interface LightboxProps {
    isOpen: boolean
    onClose: () => void
    photo: any
    onNext: () => void
    onPrev: () => void
    onLike: (id: number) => void
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
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-50"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto gap-4 items-center justify-center">
                    {/* Media Container */}
                    <div
                        className="flex-1 relative flex items-center justify-center w-full h-full min-h-[50vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {(photo.media_type === 'video' || photo.file_url.endsWith('.mp4')) ? (
                            <video
                                src={photo.file_url}
                                controls
                                autoPlay
                                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                            />
                        ) : (
                            <img
                                src={photo.file_url}
                                alt="Gallery item"
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        )}

                        {/* Navigation Buttons */}
                        {hasPrev && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onPrev() }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                        )}
                        {hasNext && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onNext() }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        )}

                        {/* Actions Overlay */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); onLike(photo.id) }}
                                className="p-3 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all group"
                            >
                                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white group-hover:scale-110 transition-transform'}`} />
                            </button>
                            <a
                                href={photo.file_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all text-white"
                                onClick={e => e.stopPropagation()}
                            >
                                <Download className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Comments Sidebar */}
                    <div
                        className="w-full lg:w-[350px] h-[300px] lg:h-[85vh] shrink-0"
                        onClick={e => e.stopPropagation()}
                    >
                        <CommentSection uploadId={photo.id} />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
