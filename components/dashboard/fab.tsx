'use client'

import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CreateEventModal } from '@/components/create-event-modal'
import { createClient } from '@/utils/supabase/client'

export default function FAB() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userId, setUserId] = useState<string>('')
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
            }
        }
        getUser()
    }, [supabase])

    if (!userId) return null

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-20 right-4 z-50 p-4 rounded-full bg-gradient-to-r from-gold to-gold-dark text-charcoal shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all active:scale-95 md:hidden"
                aria-label="Create New Event"
            >
                <Plus className="w-6 h-6" />
            </button>

            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
            />
        </>
    )
}
