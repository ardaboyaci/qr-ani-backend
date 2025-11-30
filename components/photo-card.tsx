'use client'

import { useState } from 'react'
import { Heart, Play, Trash2, EyeOff } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { createClient } from '@/utils/supabase/client'
import { getGuestHash } from '@/utils/guest-hash'

interface PhotoCardProps {
    photo: any
    onClick: () => void
    isLikedInitial: boolean
    isClientAdmin?: boolean
    onDelete?: () => void
    onHide?: () => void
}

export function PhotoCard({ photo, onClick, isLikedInitial, isClientAdmin, onDelete, onHide }: PhotoCardProps) {
    const [isLiked, setIsLiked] = useState(isLikedInitial)
    const [likesCount, setLikesCount] = useState(photo.likes_count || 0)
    const [isLikeAnimating, setIsLikeAnimating] = useState(false)

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLiked) return // Prevent unlike for now or handle toggle

        // Optimistic update
        setIsLiked(true)
        setLikesCount((prev: number) => prev + 1)
        setIsLikeAnimating(true)
        setTimeout(() => setIsLikeAnimating(false), 1000)

        const supabase = createClient()
        const guestHash = getGuestHash()

        // Insert to likes
        const { error } = await supabase
            .from('likes')
            .insert({ upload_id: photo.id, guest_hash: guestHash })

        if (error) {
            // Revert if error (duplicate key error is expected if already liked, so maybe ignore that)
            if (error.code !== '23505') { // 23505 is unique_violation
                setIsLiked(false)
                setLikesCount((prev: number) => prev - 1)
            }
        }
    }

    return (
        <div
            className="relative break-inside-avoid mb-4 group cursor-pointer rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500"
            onClick={onClick}
        >
            {(photo.media_type === 'video' || photo.file_url.endsWith('.mp4')) ? (
                <div className="relative">
                    <video src={photo.file_url} className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-12 h-12 text-white/80 fill-white/80" />
                    </div>
                </div>
            ) : (
                <img
                    src={photo.file_url}
                    alt="Gallery item"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            )}

            {/* Admin Controls - Always visible on mobile/desktop when admin */}
            {isClientAdmin && (
                <div className="absolute top-2 right-2 z-20 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onHide?.()
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-amber-400 hover:bg-black/80 transition-colors border border-white/10"
                        title="Gizle"
                    >
                        <EyeOff className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete?.()
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-red-500 hover:bg-black/80 transition-colors border border-white/10"
                        title="Sil"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                <div className="flex justify-between items-start">
                    <div /> {/* Spacer since admin buttons are now absolute */}

                    <span className="text-xs text-white/80 font-medium bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm ml-auto">
                        {formatDistanceToNow(new Date(photo.created_at), { addSuffix: true, locale: tr })}
                    </span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={handleLike}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors group/btn"
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white group-hover/btn:scale-110 transition-transform'}`} />
                    </button>
                    <span className="text-white font-medium text-sm">{likesCount}</span>
                </div>
            </div>
        </div>
    )
}
