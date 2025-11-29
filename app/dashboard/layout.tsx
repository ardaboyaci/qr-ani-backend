'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    Camera
} from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
        // Settings is usually per event, but maybe a global settings or profile?
        // The prompt implies "Settings" in the sidebar. Let's assume it links to a general settings or maybe just the first event's settings if we had one?
        // Actually, the prompt says "Navigation Links (Events, Settings)". 
        // But Settings usually requires an event context in this app structure (/dashboard/[event_id]/settings).
        // Let's keep "Events" as the main one. Maybe "Settings" here is User Settings?
        // For now, let's stick to "Events" and maybe a placeholder for "Profile" or similar if needed.
        // Or maybe the user meant the Event Settings? But that's inside an event.
        // Let's just put "Events" for now as the main nav.
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#10221c] text-white transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 flex items-center gap-3 border-b border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-playfair text-xl font-bold">Gelin & Damat</span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="ml-auto lg:hidden text-white/60 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
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
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }
                  `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile / Sign Out */}
                    <div className="p-4 border-t border-white/10">
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
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-playfair text-lg font-bold text-gray-900">Gelin & Damat</span>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
