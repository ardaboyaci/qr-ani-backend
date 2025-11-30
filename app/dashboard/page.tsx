import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Settings, ExternalLink } from 'lucide-react'
import { CreateEventModal } from '@/components/create-event-modal'
import { EventListClient } from './event-list-client'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null // Middleware handles redirect

    const { data: events } = await supabase
        .from('events')
        .select('*, uploads(count)')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white">Etkinliklerim</h1>
                    <p className="text-gray-400 mt-1">Tüm organizasyonlarınızı buradan yönetebilirsiniz.</p>
                </div>
                <EventListClient userId={user.id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events?.map((event: any) => (
                    <div key={event.id} className="bg-white/5 backdrop-blur-md border border-gold/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-gold/10 transition-all duration-300 group">
                        <div className="h-32 bg-gradient-to-r from-gold to-gold-dark p-6 flex flex-col justify-between text-charcoal relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <h3 className="font-playfair text-xl font-bold truncate relative z-10">{event.couple_name}</h3>
                            <div className="flex items-center justify-between text-sm font-medium relative z-10">
                                <span>
                                    {event.wedding_date
                                        ? new Date(event.wedding_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : 'Tarih Belirlenmedi'}
                                </span>
                                <span className="bg-charcoal/10 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs border border-charcoal/10">
                                    {event.uploads?.[0]?.count || 0} Medya
                                </span>
                            </div>
                        </div>

                        <div className="p-4 flex items-center gap-2">
                            <Link
                                href={`/dashboard/${event.id}`}
                                className="flex-1 py-2 text-center bg-gold/10 hover:bg-gold/20 border border-gold/20 rounded-xl text-gold font-medium transition-colors"
                            >
                                Yönet
                            </Link>
                            <Link
                                href={`/dashboard/${event.id}/settings`}
                                className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-xl transition-colors"
                                title="Ayarlar"
                            >
                                <Settings className="w-5 h-5" />
                            </Link>
                            <Link
                                href={`/event/${event.slug}`}
                                target="_blank"
                                className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-xl transition-colors"
                                title="Görüntüle"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                ))}

                {(!events || events.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-dashed border-gold/20 backdrop-blur-sm">
                        <p className="text-gray-400 mb-4">Henüz hiç etkinlik oluşturmadınız.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
