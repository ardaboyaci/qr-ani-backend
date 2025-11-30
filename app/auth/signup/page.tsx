'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Hesap oluşturuldu! Lütfen emailinizi kontrol edin.')
            // Optional: Redirect to login or show check email message
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
            <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-2xl border border-gold/20 backdrop-blur-md">
                <div className="text-center">
                    <h2 className="text-3xl font-playfair font-bold text-white">Hesap Oluştur</h2>
                    <p className="mt-2 text-white/60">Organizasyonlarınızı yönetmek için katılın</p>
                </div>

                <form onSubmit={handleSignup} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                                placeholder="ornek@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/80">
                                Şifre
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-charcoal bg-gold hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kayıt Ol'}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-white/60">Zaten hesabınız var mı? </span>
                        <Link href="/auth/login" className="font-medium text-gold hover:text-gold-light">
                            Giriş Yap
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
