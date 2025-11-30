'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Camera, ArrowRight, Heart, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function LandingPage() {
    const [eventCode, setEventCode] = useState('')
    const router = useRouter()

    const handleEventSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!eventCode.trim()) {
            toast.error('Lütfen bir kod girin')
            return
        }
        router.push(`/event/${eventCode.trim()}`)
    }

    return (
        <main className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Guest/Couple Entrance */}
            <div className="w-full md:w-1/2 min-h-[60vh] md:min-h-screen bg-ivory relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-md w-full"
                >
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-4 border border-gold/20">
                            <Heart className="w-10 h-10 text-gold" />
                        </div>
                    </div>

                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-4 tracking-tight">
                        BiKare Anı
                    </h1>
                    <p className="text-bronze text-lg mb-12 font-light">
                        En özel anlarınızı ölümsüzleştirin.
                    </p>

                    <form onSubmit={handleEventSubmit} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                value={eventCode}
                                onChange={(e) => setEventCode(e.target.value)}
                                placeholder="Düğün kodunu girin"
                                className="w-full px-6 py-4 rounded-2xl border border-bronze/30 bg-white/50 text-charcoal focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none text-lg placeholder:text-gray-400 shadow-sm backdrop-blur-sm"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold opacity-50 group-focus-within:opacity-100 transition-opacity">
                                <Sparkles className="w-5 h-5" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold to-gold-light text-charcoal font-medium shadow-lg shadow-gold/40 hover:shadow-gold/60 hover:scale-[1.02] transition-all duration-300 text-lg flex items-center justify-center gap-2"
                        >
                            <span>Galeriye Git</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Right Side - Photographer/Partner Entrance */}
            <div className="w-full md:w-1/2 min-h-[40vh] md:min-h-screen bg-charcoal relative flex flex-col items-center justify-center p-8 text-center border-t md:border-t-0 md:border-l border-gold/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent opacity-40" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 max-w-md w-full"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-white/5 rounded-2xl border border-gold/10 backdrop-blur-sm">
                            <Camera className="w-8 h-8 text-gold" />
                        </div>
                    </div>

                    <h2 className="font-playfair text-3xl font-bold text-white mb-4">
                        Fotoğrafçılar için BiKare
                    </h2>
                    <p className="text-gray-400 mb-8 font-light">
                        İşinizi büyütün, çiftlerinize premium bir deneyim sunun.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/dashboard"
                            className="block w-full py-4 rounded-2xl bg-white/5 border border-gold/20 text-gold hover:bg-gold/10 transition-all duration-300 font-medium backdrop-blur-sm hover:border-gold/40"
                        >
                            Yönetici Paneli
                        </Link>

                        <Link
                            href="/auth/signup"
                            className="block w-full py-4 text-gray-400 hover:text-white transition-colors text-sm font-light"
                        >
                            Partnerimiz olun
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
