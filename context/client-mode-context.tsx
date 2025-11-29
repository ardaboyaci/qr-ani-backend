'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ClientModeContextType {
    isClientAdmin: boolean
    enableClientMode: () => void
    disableClientMode: () => void
}

const ClientModeContext = createContext<ClientModeContextType | undefined>(undefined)

export function ClientModeProvider({ children }: { children: ReactNode }) {
    const [isClientAdmin, setIsClientAdmin] = useState(false)

    const enableClientMode = () => setIsClientAdmin(true)
    const disableClientMode = () => setIsClientAdmin(false)

    return (
        <ClientModeContext.Provider value={{ isClientAdmin, enableClientMode, disableClientMode }}>
            {children}
        </ClientModeContext.Provider>
    )
}

export function useClientMode() {
    const context = useContext(ClientModeContext)
    if (context === undefined) {
        throw new Error('useClientMode must be used within a ClientModeProvider')
    }
    return context
}
