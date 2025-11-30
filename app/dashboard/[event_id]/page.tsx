import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { AnalyticsClient } from './analytics-client'
import { Users, Image as ImageIcon, Heart, Tv, PlayCircle } from 'lucide-react'

export default async function EventDashboardPage({ params }: { params: Promise<{ event_id: string }> }) {
    const { event_id } = await params
    const supabase = await createClient()

    // Fetch event details
    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('id', event_id)
        .single()

    if (!event) notFound()

    // Fetch initial stats
    const { count: uploadsCount } = await supabase
        .from('uploads')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event_id)

    const { count: likesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('upload_id', event_id) // We need to join uploads to filter by event_id properly, but for now let's keep it simple or fix it. 
    // Actually, let's just use the uploads we fetch below to calculate likes if we want exact count for this event.

    const { data: uploads } = await supabase
        .from('uploads')
        .select('*')
        .eq('event_id', event_id)
        .order('created_at', { ascending: false })

    const totalLikes = uploads?.reduce((acc, curr) => acc + (curr.likes_count || 0), 0) || 0
    const uniqueGuests = new Set(uploads?.map(u => u.guest_hash)).size

    // Group by hour
    const hourlyData = uploads?.reduce((acc: any, curr) => {
        const hour = new Date(curr.created_at).getHours()
        acc[hour] = (acc[hour] || 0) + 1
        return acc
    }, {})

    const chartData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        count: hourlyData?.[i] || 0
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900">{event.couple_name}</h1>
                <p className="text-gray-500 mt-1">Etkinlik Analizleri ve Canlı Akış</p>
            </div>

            {/* Live Slideshow Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Tv className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-1">Canlı Sunum Modu</h2>
                            <p className="text-indigo-100 max-w-md">
                                Salondaki dev ekran veya projeksiyon için optimize edilmiş tam ekran görünümü.
                            </p>
                        </div>
                    </div>

                    <a
                        href={`/event/${event.slug}/slideshow`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Sunumu Başlat
                    </a>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Toplam Medya</p>
                            <h3 className="text-2xl font-bold text-gray-900">{uploadsCount || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tekil Misafir</p>
                            <h3 className="text-2xl font-bold text-gray-900">{uniqueGuests}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Toplam Beğeni</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalLikes}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <AnalyticsClient
                eventId={event.id}
                initialChartData={chartData}
                initialUploads={uploads?.slice(0, 10) || []} // Show last 10 uploads initially
            />
        </div>
    )
}
