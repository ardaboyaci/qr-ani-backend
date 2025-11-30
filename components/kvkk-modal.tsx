'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

export function KvkkModal({ eventSlug }: { eventSlug: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [accepted, setAccepted] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem(`kvkk_consent_${eventSlug}`)
        if (!consent) {
            setIsOpen(true)
        }
    }, [eventSlug])

    const handleAccept = () => {
        localStorage.setItem(`kvkk_consent_${eventSlug}`, 'true')
        setIsOpen(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-gold/10 p-3 rounded-full mb-4">
                                <Shield className="w-8 h-8 text-gold" />
                            </div>
                            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                                Anılarınız Güvende 🔒
                            </h2>
                            <p className="text-gray-600 mb-6 text-sm">
                                Fotoğraf ve videolarınızı paylaşarak, bu içeriklerin etkinlik sahibi ile paylaşılmasını kabul etmiş olursunuz.
                            </p>

                            <div className="w-full bg-gray-50 p-4 rounded-lg mb-6 text-left">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 text-gold rounded border-gray-300 focus:ring-gold"
                                        checked={accepted}
                                        onChange={(e) => setAccepted(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-700">
                                        Fotoğraflarımın etkinlik sahibiyle paylaşılmasını ve{' '}
                                        <Link href="/privacy" target="_blank" className="text-gold underline">
                                            Gizlilik Politikası
                                        </Link>
                                        'nı kabul ediyorum.
                                    </span>
                                </label>
                            </div>

                            <button
                                onClick={handleAccept}
                                disabled={!accepted}
                                className="w-full bg-gold text-charcoal font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-dark transition-colors"
                            >
                                Kabul Et & Devam Et
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
} 
