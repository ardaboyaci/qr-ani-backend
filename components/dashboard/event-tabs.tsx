'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Image as ImageIcon, Settings } from 'lucide-react'

interface EventTabsProps {
    eventId: string
}

export function EventTabs({ eventId }: EventTabsProps) {
    const pathname = usePathname()

    const tabs = [
        {
            name: 'Genel Bakış',
            href: `/dashboard/${eventId}`,
            icon: LayoutDashboard,
            active: pathname === `/dashboard/${eventId}`
        },
        {
            name: 'Galeri Yönetimi',
            href: `/dashboard/${eventId}/gallery`,
            icon: ImageIcon,
            active: pathname === `/dashboard/${eventId}/gallery`
        },
        {
            name: 'Ayarlar',
            href: `/dashboard/${eventId}/settings`,
            icon: Settings,
            active: pathname === `/dashboard/${eventId}/settings`
        }
    ]

    return (
        <div className="border-b border-gold/20 mb-8">
            <nav className="flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300
                            ${tab.active
                                ? 'border-gold text-gold'
                                : 'border-transparent text-gray-400 hover:text-gold hover:border-gold/30'
                            }
                        `}
                    >
                        <tab.icon
                            className={`
                                -ml-0.5 mr-2 h-5 w-5 transition-colors duration-300
                                ${tab.active ? 'text-gold' : 'text-gray-500 group-hover:text-gold'}
                            `}
                            aria-hidden="true"
                        />
                        {tab.name}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
