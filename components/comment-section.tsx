'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Send, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'
import { useClientMode } from '@/context/client-mode-context'

interface Comment {
    id: number
    content: string
    created_at: string
    guest_name: string | null
    is_couple_reply: boolean
}

interface CommentSectionProps {
    uploadId: number
}

const BANNED_WORDS = ['amk', 'aq', 'sik', 'siktir', 'yarrak', 'oç', 'piç', 'kahpe']

export function CommentSection({ uploadId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [guestName, setGuestName] = useState('')
    const [isError, setIsError] = useState(false)
    const [sending, setSending] = useState(false)
    const commentsEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()
    const { isClientAdmin } = useClientMode()

    // Fetch Comments
    useEffect(() => {
        const fetchComments = async () => {
            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('upload_id', uploadId)
                .order('created_at', { ascending: true })

            if (data) setComments(data)
        }

        fetchComments()

        // Realtime Subscription
        const channel = supabase
            .channel(`comments-${uploadId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `upload_id=eq.${uploadId}`
                },
                (payload) => {
                    setComments(prev => [...prev, payload.new as Comment])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [uploadId, supabase])

    // Auto-scroll to bottom
    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [comments])

    const handleDelete = async (commentId: number) => {
        if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)

        if (!error) {
            setComments(prev => prev.filter(c => c.id !== commentId))
            toast.success('Yorum silindi')
        } else {
            toast.error('Silme işlemi başarısız')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        // Profanity Check
        const isProfane = BANNED_WORDS.some(word =>
            newComment.toLowerCase().includes(word)
        )

        if (isProfane) {
            setIsError(true)
            toast.error('Lütfen nazik bir dil kullanalım 🌸', {
                duration: 3000,
                style: { background: '#ef4444', color: 'white', border: 'none' }
            })

            // Reset error state after animation
            setTimeout(() => setIsError(false), 500)
            return
        }

        setSending(true)
        // Check if we have a stored guest name
        const storedName = localStorage.getItem('guest_name')
        const nameToUse = guestName || storedName || 'Misafir'

        if (guestName) {
            localStorage.setItem('guest_name', guestName)
        }

        const { error } = await supabase
            .from('comments')
            .insert({
                upload_id: uploadId,
                content: newComment,
                guest_name: nameToUse,
            })

        if (!error) {
            setNewComment('')
        } else {
            toast.error('Yorum gönderilemedi.')
        }
        setSending(false)
    }

    return (
        <div className="flex flex-col h-full bg-black/50 backdrop-blur-md rounded-lg overflow-hidden border border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-medium">Yorumlar</h3>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] md:max-h-full">
                {comments.length === 0 ? (
                    <p className="text-white/40 text-sm text-center py-4">Henüz yorum yok. İlk yorumu sen yaz!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className={`flex flex-col ${comment.is_couple_reply ? 'items-end' : 'items-start'}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2 ${comment.is_couple_reply
                                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 text-amber-100'
                                        : 'bg-white/10 text-white border border-white/5'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold ${comment.is_couple_reply ? 'text-amber-400' : 'text-white/60'}`}>
                                            {comment.is_couple_reply ? 'Gelin & Damat' : (comment.guest_name || 'Misafir')}
                                        </span>
                                        <span className="text-[10px] text-white/30">
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                    {isClientAdmin && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-white/30 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/20">
                {!localStorage.getItem('guest_name') && !guestName && (
                    <div className="mb-2 px-1">
                        <input
                            type="text"
                            placeholder="Adınız (İsteğe bağlı)"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            className="w-full bg-transparent text-white/80 text-xs border-b border-white/10 focus:border-white/40 outline-none py-1 placeholder:text-white/30"
                        />
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Yorum yaz..."
                        className={`flex-1 bg-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all ${isError ? 'border-2 border-red-500 animate-shake' : ''}`}
                    />
                    <button
                        type="submit"
                        disabled={sending || !newComment.trim()}
                        className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    )
}
