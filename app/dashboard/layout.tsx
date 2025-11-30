'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    LayoutDashboard,
    LogOut,
    Camera
} from 'lucide-react'
import { toast } from 'sonner'
import BottomNav from '@/components/dashboard/bottom-nav'
import FAB from '@/components/dashboard/fab'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error('Çıkış yapılırken bir hata oluştu')
        } else {
            toast.success('Çıkış yapıldı')
            router.push('/auth/login')
            router.refresh()
        }
    }

    const navigation = [
        { name: 'Etkinlikler', href: '/dashboard', icon: LayoutDashboard },
    ]

    return (
        <div className="min-h-screen bg-charcoal flex">
            {/* Desktop Sidebar - Hidden on Mobile */}
            <aside className="hidden md:flex flex-col w-64 bg-charcoal text-white fixed inset-y-0 left-0 z-50 border-r border-gold/10">
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 flex items-center gap-3 border-b border-gold/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
                            <Camera className="w-6 h-6 text-charcoal" />
                        </div>
                        <span className="font-playfair text-xl font-bold text-gold">BiKare Anı</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive
                                            ? 'bg-gradient-to-r from-gold to-gold-dark text-charcoal font-medium shadow-lg shadow-gold/20'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-gold'
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-charcoal' : 'text-gray-500 group-hover:text-gold'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile / Sign Out */}
                    <div className="p-4 border-t border-gold/10">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* Mobile Components */}
            <BottomNav />
            <FAB />
        </div>
    )
}
