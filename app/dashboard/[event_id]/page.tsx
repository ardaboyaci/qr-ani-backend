import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { AnalyticsClient } from './analytics-client'
import { Users, Image as ImageIcon, Heart } from 'lucide-react'

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
