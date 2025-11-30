'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { createClient } from '@/utils/supabase/client'
import { PhotoCard } from './photo-card'
import { Lightbox } from './lightbox'
import { getGuestHash } from '@/utils/guest-hash'
import { useClientMode } from '@/context/client-mode-context'
import { toast } from 'sonner'

export function GalleryGrid({ eventId, staticPhotos }: { eventId: number, staticPhotos?: any[] }) {
    const [photos, setPhotos] = useState<any[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [ref, inView] = useInView()
    const [lightboxIndex, setLightboxIndex] = useState(-1)
    const [likedPhotoIds, setLikedPhotoIds] = useState<Set<number>>(new Set())
    const { isClientAdmin } = useClientMode()

    const supabase = createClient()
    const PAGE_SIZE = 20

    // Initialize with static photos if provided
    useEffect(() => {
        if (staticPhotos) {
            setPhotos(staticPhotos)
            setHasMore(false)
        }
    }, [staticPhotos])

    // Fetch user likes to show initial state
    useEffect(() => {
        const fetchLikes = async () => {
            const guestHash = getGuestHash()
            const { data } = await supabase
                .from('likes')
                .select('upload_id')
                .eq('guest_hash', guestHash)

            if (data) {
                setLikedPhotoIds(new Set(data.map(d => d.upload_id)))
            }
        }
        fetchLikes()
    }, [])

    const handleLike = async (photoId: number) => {
        const guestHash = getGuestHash()
        const isLiked = likedPhotoIds.has(photoId)

        // Optimistic Update
        setLikedPhotoIds(prev => {
            const next = new Set(prev)
            if (isLiked) next.delete(photoId)
            else next.add(photoId)
            return next
        })

        // Update DB
        if (isLiked) {
            // Unlike
            await supabase
                .from('likes')
                .delete()
                .eq('upload_id', photoId)
                .eq('guest_hash', guestHash)
        } else {
            // Like
            await supabase
                .from('likes')
                .insert({
                    upload_id: photoId,
                    guest_hash: guestHash
                })
        }
    }

    const handleDelete = async (photoId: number) => {
        if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return

        const { error } = await supabase
            .from('uploads')
            .delete()
            .eq('id', photoId)

        if (!error) {
            setPhotos(prev => prev.filter(p => p.id !== photoId))
            toast.success('Fotoğraf silindi')
        } else {
            toast.error('Silme işlemi başarısız')
        }
    }

    const handleHide = async (photoId: number) => {
        const { error } = await supabase
            .from('uploads')
            .update({ is_hidden: true })
            .eq('id', photoId)

        if (!error) {
            setPhotos(prev => prev.filter(p => p.id !== photoId))
            toast.success('Fotoğraf gizlendi')
        } else {
            toast.error('Gizleme işlemi başarısız')
        }
    }

    const loadMore = async () => {
        if (staticPhotos) return // Don't load more if using static photos

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
        if (inView && hasMore && !staticPhotos) {
            loadMore()
        }
    }, [inView, hasMore, staticPhotos])

    return (
        <>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                {photos.map((photo, index) => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        onClick={() => setLightboxIndex(index)}
                        isLikedInitial={likedPhotoIds.has(photo.id)}
                        isClientAdmin={isClientAdmin}
                        onDelete={() => handleDelete(photo.id)}
                        onHide={() => handleHide(photo.id)}
                    />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="py-8 flex justify-center">
                    <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
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
                onLike={(id) => handleLike(id)}
            />
        </>
    )
}
