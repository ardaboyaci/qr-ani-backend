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
                    <h1 className="text-3xl font-playfair font-bold text-gray-900">Etkinliklerim</h1>
                    <p className="text-gray-500 mt-1">Tüm organizasyonlarınızı buradan yönetebilirsiniz.</p>
                </div>
                <EventListClient userId={user.id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events?.map((event: any) => (
                    <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex flex-col justify-between text-white">
                            <h3 className="font-playfair text-xl font-bold truncate">{event.couple_name}</h3>
                            <div className="flex items-center justify-between text-sm opacity-90">
                                <span>
                                    {event.wedding_date
                                        ? new Date(event.wedding_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : 'Tarih Belirlenmedi'}
                                </span>
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                    {event.uploads?.[0]?.count || 0} Medya
                                </span>
                            </div>
                        </div>

                        <div className="p-4 flex items-center gap-2">
                            <Link
                                href={`/dashboard/${event.id}`}
                                className="flex-1 py-2 text-center bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors"
                            >
                                Yönet
                            </Link>
                            <Link
                                href={`/dashboard/${event.id}/settings`}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Ayarlar"
                            >
                                <Settings className="w-5 h-5" />
                            </Link>
                            <Link
                                href={`/event/${event.slug}`}
                                target="_blank"
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Görüntüle"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                ))}

                {(!events || events.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">Henüz hiç etkinlik oluşturmadınız.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
