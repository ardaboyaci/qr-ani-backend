'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateEventModal } from '@/components/create-event-modal'

export function EventListClient({ userId }: { userId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal rounded-lg hover:bg-gold-dark transition-colors shadow-sm hover:shadow-md hover:shadow-gold/20"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Etkinlik</span>
            </button>

            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
            />
        </>
    )
}
