'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, LayoutDashboard, Camera } from 'lucide-react'
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
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Section A: Guest & Couple Access (Left/Top) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 bg-gradient-to-br from-emerald-50 to-teal-100 text-center relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-md w-full">
                    <div className="mb-8 flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg transform rotate-3">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">
                        BiKare Anı
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 font-inter">
                        Düğün kodunu gir, anıları keşfet.
                    </p>

                    <form onSubmit={handleEventSubmit} className="w-full space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={eventCode}
                                onChange={(e) => setEventCode(e.target.value)}
                                placeholder="Örn: ayse-ali"
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-lg placeholder:text-gray-400 shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                        >
                            Galeriye Git
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Section B: Photographer/Partner Access (Right/Bottom) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 bg-[#10221c] text-center relative overflow-hidden"
            >
                <div className="relative z-10 max-w-md w-full">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
                        Fotoğrafçılar için BiKare
                    </h2>
                    <p className="text-lg text-gray-400 mb-8 font-inter">
                        Etkinliklerinizi yönetin, QR kodlarınızı oluşturun ve işinizi büyütün.
                    </p>

                    <div className="space-y-4 w-full">
                        <Link
                            href="/dashboard"
                            className="block w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2 group"
                        >
                            <LayoutDashboard className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                            Yönetici Paneli
                        </Link>

                        <div className="pt-4">
                            <Link
                                href="/auth/signup"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors hover:underline underline-offset-4"
                            >
                                Partnerimiz olun
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
