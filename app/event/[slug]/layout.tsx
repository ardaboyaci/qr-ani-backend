import { Camera } from 'lucide-react'
import Link from 'next/link'

import { ClientModeProvider } from '@/context/client-mode-context'
import { ClientModeBadge } from '@/components/client-mode-badge'

export default function EventLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClientModeProvider>
            <div className="min-h-screen bg-[#10221c]">
                <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
                    <Link href="/" className="pointer-events-auto flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <Camera className="w-6 h-6" />
                        </div>
                        <span className="font-playfair text-xl font-bold">Gelin & Damat</span>
                    </Link>
                </header>
                <ClientModeBadge />
                {children}
            </div>
        </ClientModeProvider>
    )
}
