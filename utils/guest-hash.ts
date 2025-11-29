export const getGuestHash = () => {
    if (typeof window === 'undefined') return ''

    let hash = localStorage.getItem('guest_hash')
    if (!hash) {
        hash = crypto.randomUUID()
        localStorage.setItem('guest_hash', hash)
    }
    return hash
}
