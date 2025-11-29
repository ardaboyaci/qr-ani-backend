'use client'

import { useState } from 'react'
import { Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordModalProps {
    isOpen: boolean
    correctPassword?: string | null
    onUnlock: () => void
}

export function PasswordModal({ isOpen, correctPassword, onUnlock }: PasswordModalProps) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === correctPassword) {
            onUnlock()
        } else {
            setError(true)
            toast.error('Hatalı şifre')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#10221c] border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-playfair font-bold text-white mb-2">Şifreli Etkinlik</h2>
                <p className="text-white/60 mb-8">Bu etkinliğin fotoğraflarını görmek için lütfen şifreyi giriniz.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError(false)
                        }}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all text-center text-lg tracking-widest
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-emerald-500'}
            `}
                        placeholder="••••"
                        autoFocus
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Giriş Yap
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}
