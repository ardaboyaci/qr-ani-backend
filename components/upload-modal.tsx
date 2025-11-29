'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Image as ImageIcon, Film, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { getGuestHash } from '@/utils/guest-hash'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { WhatsAppShareModal } from './whatsapp-share-modal'
import imageCompression from 'browser-image-compression'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    eventId: number
    eventSlug: string
    coupleName: string
}

export function UploadModal({ isOpen, onClose, eventId, eventSlug, coupleName }: UploadModalProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [showWhatsApp, setShowWhatsApp] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            const validFiles = newFiles.filter(file => {
                const isVideo = file.type.startsWith('video/')
                const limit = isVideo ? 500 * 1024 * 1024 : 50 * 1024 * 1024

                if (file.size > limit) {
                    toast.error(`${file.name} ${isVideo ? '500MB' : '50MB'}'dan büyük!`)
                    return false
                }
                return true
            })
            setFiles(prev => [...prev, ...validFiles])
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files)
            const validFiles = newFiles.filter(file => {
                const isVideo = file.type.startsWith('video/')
                const limit = isVideo ? 500 * 1024 * 1024 : 50 * 1024 * 1024

                if (file.size > limit) {
                    toast.error(`${file.name} ${isVideo ? '500MB' : '50MB'}'dan büyük!`)
                    return false
                }
                return true
            })
            setFiles(prev => [...prev, ...validFiles])
        }
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setUploading(true)
        setProgress(0)
        const supabase = createClient()
        const guestHash = getGuestHash()
        let successCount = 0

        try {
            const totalSize = files.reduce((acc, file) => acc + file.size, 0)
            let uploadedSize = 0

            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${eventId}/${crypto.randomUUID()}.${fileExt}`

                // Compress if image
                let fileToUpload = file
                let mediaType = 'image'

                if (file.type.startsWith('image/')) {
                    try {
                        const options = {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                            onProgress: (p: number) => {
                                // Optional: update UI with compression progress if needed
                            }
                        }
                        fileToUpload = await imageCompression(file, options)
                    } catch (error) {
                        console.error('Compression failed:', error)
                        // Fallback to original file
                    }
                } else if (file.type.startsWith('video/')) {
                    mediaType = 'video'
                    // Skip compression for video, but check size again just in case
                    if (file.size > 500 * 1024 * 1024) {
                        toast.error(`${file.name} 500MB'dan büyük!`)
                        continue // Skip this file
                    }
                }

                // Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('uploads')
                    .upload(fileName, fileToUpload)

                if (uploadError) throw uploadError

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('uploads')
                    .getPublicUrl(fileName)

                // Insert to DB
                const { error: dbError } = await supabase
                    .from('uploads')
                    .insert({
                        event_id: eventId,
                        file_url: publicUrl,
                        guest_hash: guestHash,
                        media_type: mediaType as 'image' | 'video',
                    })

                if (dbError) throw dbError

                successCount++
                uploadedSize += file.size
                setProgress(Math.round((uploadedSize / totalSize) * 100))
            }

            // Success
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })

            toast.success(`${successCount} anı başarıyla eklendi! 🎉`)
            setFiles([])
            setUploading(false)
            onClose() // Close upload modal
            setTimeout(() => setShowWhatsApp(true), 500) // Open WhatsApp modal

        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error('Yükleme sırasında bir hata oluştu.')
            setUploading(false)
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg bg-white rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Sınırsız Fotoğraf ve Uzun Video Yükle</h2>
                                <button onClick={onClose} disabled={uploading} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {files.length === 0 ? (
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}`}
                                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <p className="text-gray-900 font-medium mb-1">Fotoğraf veya Video Seç</p>
                                        <p className="text-gray-500 text-sm">veya buraya sürükle</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-4">
                                        {files.map((file, i) => (
                                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Film className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => removeFile(i)}
                                                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                                        >
                                            <Upload className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/*,video/mp4,video/quicktime,video/webm"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t bg-gray-50">
                                {uploading ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{progress === 0 ? 'Sıkıştırılıyor...' : 'Yükleniyor...'}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleUpload}
                                        disabled={files.length === 0}
                                        className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
                                    >
                                        {files.length > 0 ? `${files.length} Dosyayı Yükle` : 'Dosya Seçin'}
                                    </button>
                                )}
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    Videolar için önerilen maks: 500MB
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <WhatsAppShareModal
                isOpen={showWhatsApp}
                onClose={() => setShowWhatsApp(false)}
                eventSlug={eventSlug}
                coupleName={coupleName}
            />
        </>
    )
}
