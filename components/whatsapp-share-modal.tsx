'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface WhatsAppShareModalProps {
    isOpen: boolean
    onClose: () => void
    eventSlug: string
    coupleName: string
}

export function WhatsAppShareModal({ isOpen, onClose, eventSlug, coupleName }: WhatsAppShareModalProps) {
    const [copied, setCopied] = useState(false)

    const getShareUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/event/${eventSlug}`
        }
        return ''
    }

    const handleShare = () => {
        const url = getShareUrl()
        const text = `📸 ${coupleName} düğününden anılarını paylaşmak için tıkla: ${url}`
        const encodedText = encodeURIComponent(text)

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (isMobile) {
            window.location.href = `whatsapp://send?text=${encodedText}`
        } else {
            window.open(`https://web.whatsapp.com/send?text=${encodedText}`, '_blank')
        }
    }

    const handleCopy = async () => {
        const url = getShareUrl()
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Share2 className="w-8 h-8 text-gold" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Arkadaşların da eklesin! 🎉</h2>
                            <p className="text-gray-600">
                                Bu özel günü ölümsüzleştirmek için davet linkini arkadaşlarınla paylaş.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleShare}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                WhatsApp'ta Paylaş
                            </button>

                            <button
                                onClick={handleCopy}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5 text-gold" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-6 text-gray-400 text-sm hover:text-gray-600 w-full"
                        >
                            Kapat
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
