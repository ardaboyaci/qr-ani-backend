'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, QrCode, User } from 'lucide-react'

export default function BottomNav() {
    const pathname = usePathname()

    const navigation = [
        { name: 'Etkinlikler', href: '/dashboard', icon: Home },
        { name: 'QR Araçları', href: '/dashboard/qr', icon: QrCode },
        { name: 'Profil', href: '/dashboard/profile', icon: User },
    ]

    return (
        <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 md:hidden">
            <div className="grid h-full grid-cols-3 mx-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors group ${isActive ? 'text-emerald-500' : 'text-gray-400'
                                }`}
                        >
                            <item.icon
                                className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-300'
                                    }`}
                            />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
