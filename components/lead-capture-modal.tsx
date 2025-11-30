'use client'

import { useState } from 'react'
import { Download, X, Loader2, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useBulkDownload } from '@/hooks/use-bulk-download'

interface LeadCaptureModalProps {
    isOpen: boolean
    onClose: () => void
    eventId: number
}

export function LeadCaptureModal({ isOpen, onClose, eventId }: LeadCaptureModalProps) {
    const [email, setEmail] = useState('')
    const [isPlanning, setIsPlanning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [step, setStep] = useState<'capture' | 'downloading'>('capture')

    const supabase = createClient()
    const { downloadAll, isProcessing, progress } = useBulkDownload(eventId)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)

        // Save lead
        const { error } = await supabase
            .from('leads')
            .insert({
                event_id: eventId,
                email,
                is_planning_event: isPlanning
            })

        if (error) {
            console.error(error)
            toast.error('Bir hata oluştu, lütfen tekrar deneyin.')
            setIsSubmitting(false)
            return
        }

        // Success - Start Download
        setStep('downloading')
        setIsSubmitting(false)

        // Trigger download
        await downloadAll()

        // Close after a delay if download finished
        // Note: downloadAll handles its own completion toast
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl shadow-gold/20 border border-gold/20 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-charcoal transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {step === 'capture' ? (
                    <>
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Download className="w-8 h-8 text-gold" />
                        </div>

                        <h2 className="text-2xl font-playfair font-bold text-charcoal text-center mb-2">Anıları İndir</h2>
                        <p className="text-gray-500 text-center mb-8">
                            İndirme işlemi hazırlanıyor. Size özel fırsatlar için e-posta adresinizi bırakabilirsiniz.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-charcoal">E-posta Adresi</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-ivory rounded-xl border border-gold/10">
                                <input
                                    id="planning"
                                    type="checkbox"
                                    checked={isPlanning}
                                    onChange={(e) => setIsPlanning(e.target.checked)}
                                    className="w-5 h-5 text-gold border-gray-300 rounded focus:ring-gold"
                                />
                                <label htmlFor="planning" className="text-sm text-charcoal cursor-pointer select-none">
                                    Ben de düğün/etkinlik planlıyorum
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-gold text-charcoal rounded-xl font-medium hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        İndirmeyi Başlat
                                        <Download className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        {isProcessing ? (
                            <>
                                <div className="w-20 h-20 mx-auto mb-6 relative">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-100"
                                        />
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={36 * 2 * Math.PI}
                                            strokeDashoffset={36 * 2 * Math.PI - (progress / 100) * (36 * 2 * Math.PI)}
                                            className="text-gold transition-all duration-300"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gold">
                                        {progress}%
                                    </div>
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-charcoal mb-2">Hazırlanıyor...</h3>
                                <p className="text-gray-500">Fotoğraflarınız zipleniyor, lütfen bekleyin.</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-playfair font-bold text-charcoal mb-2">İndirme Başladı!</h3>
                                <p className="text-gray-500 mb-8">Dosyanız hazırlandı ve indirilmeye başlandı.</p>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-gray-100 text-charcoal rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Pencereyi Kapat
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
