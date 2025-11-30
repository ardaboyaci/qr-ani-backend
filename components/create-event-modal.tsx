'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface CreateEventModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
}

export function CreateEventModal({ isOpen, onClose, userId }: CreateEventModalProps) {
    const [coupleName, setCoupleName] = useState('')
    const [weddingDate, setWeddingDate] = useState('')
    const [venueName, setVenueName] = useState('')
    const [slug, setSlug] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('events')
            .insert({
                couple_name: coupleName,
                wedding_date: weddingDate,
                venue_name: venueName,
                slug: slug || uuidv4().slice(0, 8), // Default slug if empty
                owner_id: userId,
            })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Etkinlik oluşturuldu!')
            onClose()
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Yeni Etkinlik</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Çift İsimleri</label>
                        <input
                            type="text"
                            required
                            value={coupleName}
                            onChange={(e) => setCoupleName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                            placeholder="Ayşe & Ahmet"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                        <input
                            type="datetime-local"
                            required
                            value={weddingDate}
                            onChange={(e) => setWeddingDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mekan</label>
                        <input
                            type="text"
                            required
                            value={venueName}
                            onChange={(e) => setVenueName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                            placeholder="Grand Hotel"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Özel Link (Opsiyonel)</label>
                        <div className="flex items-center">
                            <span className="text-gray-500 text-sm mr-2">gelindam.at/event/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                placeholder="ayse-ahmet"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gold text-charcoal rounded-xl font-medium hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Oluştur'}
                    </button>
                </form>
            </div>
        </div>
    )
}
