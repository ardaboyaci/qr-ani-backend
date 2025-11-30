'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useClientMode } from '@/context/client-mode-context'
import { toast } from 'sonner'
import { Lock, X, Loader2 } from 'lucide-react'

interface ClientLoginProps {
    eventId: number
}

export function ClientLogin({ eventId }: ClientLoginProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [pin, setPin] = useState('')
    const [loading, setLoading] = useState(false)
    const { isClientAdmin, enableClientMode } = useClientMode()
    const supabase = createClient()

    if (isClientAdmin) return null

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await supabase
                .from('events')
                .select('client_pin')
                .eq('id', eventId)
                .single()

            if (error) throw error

            if (data.client_pin === pin) {
                enableClientMode()
                setIsOpen(false)
                toast.success('Yönetici modu aktif!', {
                    description: 'Artık fotoğrafları ve yorumları yönetebilirsiniz.'
                })
            } else {
                toast.error('Hatalı PIN kodu')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('Giriş yapılırken bir hata oluştu')
        } finally {
            setLoading(false)
            setPin('')
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-white/20 hover:text-white/60 transition-colors p-4"
                aria-label="Yönetici Girişi"
            >
                <Lock className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-white/70" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Yönetici Girişi</h3>
                            <p className="text-sm text-white/50 text-center mt-1">
                                İçerikleri yönetmek için PIN kodunu girin
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="PIN Kodu"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center tracking-widest placeholder:tracking-normal focus:outline-none focus:border-white/30 transition-colors"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={loading || !pin}
                                className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Giriş Yap'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
