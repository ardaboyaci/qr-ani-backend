'use client'

import { useState, useEffect } from 'react'
import { PasswordModal } from './password-modal'

interface EventProtectionWrapperProps {
    children: React.ReactNode
    eventId: number
    password?: string | null
}

export function EventProtectionWrapper({ children, eventId, password }: EventProtectionWrapperProps) {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // If no password, it's unlocked
        if (!password) {
            setIsUnlocked(true)
            setChecking(false)
            return
        }

        // Check localStorage
        const unlocked = localStorage.getItem(`event_unlocked_${eventId}`)
        if (unlocked === 'true') {
            setIsUnlocked(true)
        }
        setChecking(false)
    }, [eventId, password])

    const handleUnlock = () => {
        localStorage.setItem(`event_unlocked_${eventId}`, 'true')
        setIsUnlocked(true)
    }

    if (checking) return null // Or a loading spinner

    if (!isUnlocked && password) {
        return (
            <PasswordModal
                isOpen={true}
                correctPassword={password}
                onUnlock={handleUnlock}
            />
        )
    }

    return <>{children}</>
}
