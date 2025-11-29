'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { createClient } from '@/utils/supabase/client'
import { PhotoCard } from './photo-card'
import { Lightbox } from './lightbox'
import { getGuestHash } from '@/utils/guest-hash'

export function GalleryGrid({ eventId }: { eventId: number }) {
    const [photos, setPhotos] = useState<any[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [ref, inView] = useInView()
    const [lightboxIndex, setLightboxIndex] = useState(-1)
    const [likedPhotoIds, setLikedPhotoIds] = useState<Set<number>>(new Set())

    const supabase = createClient()
    const PAGE_SIZE = 20

    // Fetch user likes to show initial state
    useEffect(() => {
        const fetchLikes = async () => {
            const guestHash = getGuestHash()
            const { data } = await supabase
                .from('favorites')
                .select('upload_id')
                .eq('guest_hash', guestHash)

            if (data) {
                setLikedPhotoIds(new Set(data.map(d => d.upload_id)))
            }
        }
        fetchLikes()
    }, [])

    const loadMore = async () => {
        const from = page * PAGE_SIZE
        const to = from + PAGE_SIZE - 1

        const { data } = await supabase
            .from('uploads')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (data) {
            if (data.length < PAGE_SIZE) {
                setHasMore(false)
            }
            setPhotos(prev => [...prev, ...data])
            setPage(prev => prev + 1)
        }
    }

    useEffect(() => {
        if (inView && hasMore) {
            loadMore()
        }
    }, [inView, hasMore])

    return (
        <>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                {photos.map((photo, index) => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        onClick={() => setLightboxIndex(index)}
                        isLikedInitial={likedPhotoIds.has(photo.id)}
                    />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="py-8 flex justify-center">
                    <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            )}

            <Lightbox
                isOpen={lightboxIndex >= 0}
                onClose={() => setLightboxIndex(-1)}
                photo={photos[lightboxIndex]}
                onNext={() => setLightboxIndex(i => (i + 1) % photos.length)}
                onPrev={() => setLightboxIndex(i => (i - 1 + photos.length) % photos.length)}
                hasPrev={photos.length > 0}
                hasNext={photos.length > 0}
                isLiked={lightboxIndex >= 0 ? likedPhotoIds.has(photos[lightboxIndex].id) : false}
                onLike={() => {
                    // Handle like in lightbox (optional, or just reuse logic)
                }}
            />
        </>
    )
} 
