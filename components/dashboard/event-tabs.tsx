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
        <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                            ${tab.active
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <tab.icon
                            className={`
                                -ml-0.5 mr-2 h-5 w-5
                                ${tab.active ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'}
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
