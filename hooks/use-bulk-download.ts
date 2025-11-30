import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'

export function useBulkDownload(eventId: number) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const supabase = createClient()

    const downloadAll = async () => {
        setIsProcessing(true)
        setProgress(0)
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
            const total = allPhotos.length

            for (let i = 0; i < total; i += chunkSize) {
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

                // Update progress
                setProgress(Math.round(((i + chunkSize) / total) * 100))
            }

            const content = await zip.generateAsync({ type: "blob" })
            saveAs(content, `event-${eventId}-archive.zip`)
            toast.success(`${successCount} fotoğraf başarıyla indirildi`)
        } catch (error) {
            console.error(error)
            toast.error('İndirme sırasında hata oluştu')
        } finally {
            setIsProcessing(false)
            setProgress(0)
        }
    }

    return { downloadAll, isProcessing, progress }
}
