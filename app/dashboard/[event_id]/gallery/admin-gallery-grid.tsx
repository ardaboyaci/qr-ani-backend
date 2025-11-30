'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useInView } from 'react-intersection-observer'
import { Loader2, Download, EyeOff, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface Upload {
    id: number
    file_url: string
    thumbnail_url: string | null
    is_hidden: boolean
    created_at: string
}

export function AdminGalleryGrid({ eventId }: { eventId: number }) {
    const [uploads, setUploads] = useState<Upload[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [isProcessing, setIsProcessing] = useState(false)

    const supabase = createClient()
    const { ref, inView } = useInView()
    const PAGE_SIZE = 20

    const fetchUploads = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        const { data, error } = await supabase
            .from('uploads')
            .select('*')
            .eq('event_id', eventId)
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('Fotoğraflar yüklenirken hata oluştu')
        } else {
            if (data.length < PAGE_SIZE) setHasMore(false)
            setUploads(prev => [...prev, ...data])
            setPage(prev => prev + 1)
        }
        setLoading(false)
    }, [eventId, page, hasMore, loading, supabase])

    useEffect(() => {
        if (inView) {
            fetchUploads()
        }
    }, [inView, fetchUploads])

    const toggleSelection = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const handleBulkDownload = async () => {
        if (selectedIds.size > 50) {
            toast.error('En fazla 50 fotoğrafı aynı anda indirebilirsiniz.')
            return
        }

        setIsProcessing(true)
        const zip = new JSZip()
        const folder = zip.folder("photos")

        try {
            const selectedUploads = uploads.filter(u => selectedIds.has(u.id))

            const promises = selectedUploads.map(async (upload) => {
                const response = await fetch(upload.file_url)
                const blob = await response.blob()
                const fileName = `photo-${upload.id}.${blob.type.split('/')[1]}`
                folder?.file(fileName, blob)
            })

            await Promise.all(promises)

            const content = await zip.generateAsync({ type: "blob" })
            saveAs(content, `event-${eventId}-photos.zip`)
            toast.success('İndirme başlatıldı')
            setSelectedIds(new Set())
        } catch (error) {
            toast.error('İndirme sırasında hata oluştu')
        }
        setIsProcessing(false)
    }

    const handleBulkHide = async () => {
        setIsProcessing(true)
        const { error } = await supabase
            .from('uploads')
            .update({ is_hidden: true })
            .in('id', Array.from(selectedIds))

        if (error) {
            toast.error('Gizleme işlemi başarısız')
        } else {
            toast.success('Seçilenler gizlendi')
            setUploads(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, is_hidden: true } : u))
            setSelectedIds(new Set())
        }
        setIsProcessing(false)
    }

    const handleDownloadAll = async () => {
        setIsProcessing(true)
        const zip = new JSZip()
        const folder = zip.folder("photos")
        let successCount = 0

        try {
            toast.info('Fotoğraflar hazırlanıyor...')

            // Fetch ALL photos
            const { data: allPhotos, error } = await supabase
                .from('uploads')
                .select('*')
                .eq('event_id', eventId)
                .order('created_at', { ascending: false })

            if (error || !allPhotos) throw new Error('Fotoğraflar alınamadı')

            toast.info(`${allPhotos.length} fotoğraf indirilecek. Bu işlem biraz sürebilir.`)

            // Process in chunks of 5
            const chunkSize = 5
            for (let i = 0; i < allPhotos.length; i += chunkSize) {
                const chunk = allPhotos.slice(i, i + chunkSize)
                await Promise.all(chunk.map(async (upload) => {
                    try {
                        const response = await fetch(upload.file_url)
                        const blob = await response.blob()
                        const ext = blob.type.split('/')[1] || 'jpg'
                        const fileName = `photo-${upload.id}.${ext}`
                        folder?.file(fileName, blob)
                        successCount++
                    } catch (e) {
                        console.error(`Failed to download ${upload.id}`, e)
                    }
                }))
            }

            const content = await zip.generateAsync({ type: "blob" })
            saveAs(content, `event-${eventId}-archive.zip`)
            toast.success(`${successCount} fotoğraf başarıyla indirildi`)
        } catch (error) {
            console.error(error)
            toast.error('İndirme sırasında hata oluştu')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm('Seçilenleri silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return

        setIsProcessing(true)
        const ids = Array.from(selectedIds)

        const { error } = await supabase
            .from('uploads')
            .delete()
            .in('id', ids)

        if (error) {
            toast.error('Silme işlemi başarısız')
        } else {
            toast.success('Seçilenler silindi')
            setUploads(prev => prev.filter(u => !selectedIds.has(u.id)))
            setSelectedIds(new Set())
        }
        setIsProcessing(false)
    }

    return (
        <div className="relative pb-24">
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleDownloadAll}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-gold/20"
                >
                    {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    <span>{isProcessing ? 'Zipleniyor...' : 'Tümünü İndir (ZIP)'}</span>
                </button>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {uploads.map((upload) => (
                    <div
                        key={upload.id}
                        className={`relative group break-inside-avoid rounded-xl overflow-hidden cursor-pointer transition-all ${selectedIds.has(upload.id) ? 'ring-4 ring-gold' : ''}`}
                        onClick={() => toggleSelection(upload.id)}
                    >
                        {upload.file_url.match(/\.(mp4|webm)$/i) ? (
                            <video src={upload.file_url} className="w-full h-auto" />
                        ) : (
                            <img
                                src={upload.thumbnail_url || upload.file_url}
                                alt=""
                                className={`w-full h-auto ${upload.is_hidden ? 'opacity-50 grayscale' : ''}`}
                                loading="lazy"
                            />
                        )}

                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {selectedIds.has(upload.id) ? (
                                <CheckCircle2 className="w-12 h-12 text-gold fill-white" />
                            ) : (
                                <Circle className="w-12 h-12 text-white" />
                            )}
                        </div>

                        {upload.is_hidden && (
                            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
                                <EyeOff className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
            )}

            <div ref={ref} className="h-10" />

            {/* Bulk Actions Toolbar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4">
                    <span className="font-medium text-gray-700">{selectedIds.size} seçildi</span>
                    <div className="h-6 w-px bg-gray-200" />

                    <button
                        onClick={handleBulkDownload}
                        disabled={isProcessing}
                        className="flex items-center gap-2 text-gray-600 hover:text-gold transition-colors disabled:opacity-50"
                        title="İndir (Max 50)"
                    >
                        <Download className="w-5 h-5" />
                        <span className="hidden sm:inline">İndir</span>
                    </button>

                    <button
                        onClick={handleBulkHide}
                        disabled={isProcessing}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50"
                        title="Gizle"
                    >
                        <EyeOff className="w-5 h-5" />
                        <span className="hidden sm:inline">Gizle</span>
                    </button>

                    <button
                        onClick={handleBulkDelete}
                        disabled={isProcessing}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Sil"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Sil</span>
                    </button>
                </div>
            )}
        </div>
    )
}
