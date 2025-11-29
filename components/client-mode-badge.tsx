'use client'

import { useClientMode } from '@/context/client-mode-context'
import { LogOut } from 'lucide-react'

export function ClientModeBadge() {
    const { isClientAdmin, disableClientMode } = useClientMode()

    if (!isClientAdmin) return null

    return (
        <>
            {/* Gold Border Effect */}
            <div className="fixed inset-0 z-50 pointer-events-none border-[3px] border-amber-500/50 rounded-lg" />

            {/* Floating Exit Button */}
            <button
                onClick={disableClientMode}
                className="fixed bottom-6 right-6 z-50 bg-red-500 text-white p-3 rounded-full shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
                aria-label="Yönetici Modundan Çık"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </>
    )
}
