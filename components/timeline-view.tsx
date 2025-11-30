'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PhotoCard } from './photo-card'
import { Lightbox } from './lightbox'
import { getGuestHash } from '@/utils/guest-hash'
import { useClientMode } from '@/context/client-mode-context'
import { toast } from 'sonner'

interface TimelineViewProps {
    eventId: number
}

interface TimeGroup {
    hour: string
    photos: any[]
}

export function TimelineView({ eventId }: TimelineViewProps) {
    const [groups, setGroups] = useState<TimeGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [lightboxIndex, setLightboxIndex] = useState(-1)
    const [activeGroupIndex, setActiveGroupIndex] = useState(-1)
    const [likedPhotoIds, setLikedPhotoIds] = useState<Set<number>>(new Set())
    const { isClientAdmin } = useClientMode()
    const supabase = createClient()

    useEffect(() => {
        const fetchPhotos = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('uploads')
                .select('*')
                .eq('event_id', eventId)
                .order('created_at', { ascending: true }) // Oldest first for timeline

            if (data) {
                // Group by hour
                const grouped = data.reduce((acc: { [key: string]: any[] }, photo) => {
                    const date = new Date(photo.created_at)
                    const hour = date.getHours().toString().padStart(2, '0') + ':00'
                    if (!acc[hour]) acc[hour] = []
                    acc[hour].push(photo)
                    return acc
                }, {})

                const sortedGroups = Object.entries(grouped)
                    .map(([hour, photos]) => ({ hour, photos: photos as any[] }))
                    .sort((a, b) => a.hour.localeCompare(b.hour))

                setGroups(sortedGroups)
            }
            setLoading(false)
        }

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

        fetchPhotos()
        fetchLikes()
    }, [eventId, supabase])

    const handleLike = async (photoId: number) => {
        const guestHash = getGuestHash()
        const isLiked = likedPhotoIds.has(photoId)

        setLikedPhotoIds(prev => {
            const next = new Set(prev)
            if (isLiked) next.delete(photoId)
            else next.add(photoId)
            return next
        })

        if (isLiked) {
            await supabase.from('likes').delete().eq('upload_id', photoId).eq('guest_hash', guestHash)
        } else {
            await supabase.from('likes').insert({ upload_id: photoId, guest_hash: guestHash })
        }
    }

    const handleDelete = async (photoId: number) => {
        if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return
        const { error } = await supabase.from('uploads').delete().eq('id', photoId)
        if (!error) {
            setGroups(prev => prev.map(g => ({ ...g, photos: g.photos.filter(p => p.id !== photoId) })).filter(g => g.photos.length > 0))
            toast.success('Fotoğraf silindi')
        } else {
            toast.error('Silme işlemi başarısız')
        }
    }

    const handleHide = async (photoId: number) => {
        const { error } = await supabase.from('uploads').update({ is_hidden: true }).eq('id', photoId)
        if (!error) {
            setGroups(prev => prev.map(g => ({ ...g, photos: g.photos.filter(p => p.id !== photoId) })).filter(g => g.photos.length > 0))
            toast.success('Fotoğraf gizlendi')
        } else {
            toast.error('Gizleme işlemi başarısız')
        }
    }

    // Flatten photos for lightbox navigation
    const allPhotos = groups.flatMap(g => g.photos)
    const currentPhoto = activeGroupIndex >= 0 && lightboxIndex >= 0 && groups[activeGroupIndex]?.photos[lightboxIndex] ? groups[activeGroupIndex].photos[lightboxIndex] : null
    const globalIndex = currentPhoto ? allPhotos.findIndex(p => p.id === currentPhoto.id) : -1

    const handleLightboxNext = () => {
        const nextIndex = (globalIndex + 1) % allPhotos.length
        const nextPhoto = allPhotos[nextIndex]
        // Find group and index of next photo
        const groupIndex = groups.findIndex(g => g.photos.some(p => p.id === nextPhoto.id))
        const photoIndex = groups[groupIndex]?.photos.findIndex(p => p.id === nextPhoto.id) ?? -1
        setActiveGroupIndex(groupIndex)
        setLightboxIndex(photoIndex)
    }

    const handleLightboxPrev = () => {
        const prevIndex = (globalIndex - 1 + allPhotos.length) % allPhotos.length
        const prevPhoto = allPhotos[prevIndex]
        const groupIndex = groups.findIndex(g => g.photos.some(p => p.id === prevPhoto.id))
        const photoIndex = groups[groupIndex]?.photos.findIndex(p => p.id === prevPhoto.id) ?? -1
        setActiveGroupIndex(groupIndex)
        setLightboxIndex(photoIndex)
    }

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
        )
    }

    if (groups.length === 0) {
        return (
            <div className="py-12 text-center text-charcoal/50">
                <p>Henüz akış başlamadı</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-24">
            {groups.map((group, groupIndex) => (
                <div key={group.hour} className="relative">
                    {/* Sticky Header */}
                    <div className="sticky top-20 z-30 px-4 py-2 mb-4">
                        <span className="inline-block px-4 py-1 rounded-full bg-ivory/80 backdrop-blur-md text-gold-dark text-sm font-medium border border-gold/20 shadow-sm">
                            Saat {group.hour}
                        </span>
                    </div>

                    {/* Horizontal Scrollable Strip */}
                    <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x snap-mandatory">
                        {group.photos.map((photo, index) => (
                            <div key={photo.id} className="flex-none w-64 snap-center">
                                <PhotoCard
                                    photo={photo}
                                    onClick={() => {
                                        setActiveGroupIndex(groupIndex)
                                        setLightboxIndex(index)
                                    }}
                                    isLikedInitial={likedPhotoIds.has(photo.id)}
                                    isClientAdmin={isClientAdmin}
                                    onDelete={() => handleDelete(photo.id)}
                                    onHide={() => handleHide(photo.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Lightbox
                isOpen={lightboxIndex >= 0}
                onClose={() => setLightboxIndex(-1)}
                photo={currentPhoto}
                onNext={handleLightboxNext}
                onPrev={handleLightboxPrev}
                hasPrev={allPhotos.length > 0}
                hasNext={allPhotos.length > 0}
                isLiked={currentPhoto ? likedPhotoIds.has(currentPhoto.id) : false}
                onLike={(id) => handleLike(id)}
            />
        </div>
    )
}
