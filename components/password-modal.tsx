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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center shadow-2xl shadow-gold/20 border border-gold/20">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-gold" />
                </div>

                <h2 className="text-2xl font-playfair font-bold text-charcoal mb-2">Şifreli Etkinlik</h2>
                <p className="text-gray-500 mb-8">Bu etkinliğin fotoğraflarını görmek için lütfen şifreyi giriniz.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError(false)
                        }}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-center text-lg tracking-widest
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-gold'}
            `}
                        placeholder="••••"
                        autoFocus
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-gold text-charcoal rounded-xl font-medium hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                    >
                        Giriş Yap
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}
