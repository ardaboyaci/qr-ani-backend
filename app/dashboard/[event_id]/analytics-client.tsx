'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface AnalyticsClientProps {
    eventId: number
    initialChartData: any[]
    initialUploads: any[]
}

export function AnalyticsClient({ eventId, initialChartData, initialUploads }: AnalyticsClientProps) {
    const [chartData, setChartData] = useState(initialChartData)
    const [recentUploads, setRecentUploads] = useState<any[]>(initialUploads)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('dashboard-analytics')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'uploads',
                    filter: `event_id=eq.${eventId}`,
                },
                (payload) => {
                    const newUpload = payload.new as any

                    // Update Recent Uploads
                    setRecentUploads((prev) => [newUpload, ...prev].slice(0, 10))

                    // Update Chart Data
                    const hour = new Date(newUpload.created_at).getHours()
                    setChartData((prev) => {
                        const newData = [...prev]
                        newData[hour].count += 1
                        return newData
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [eventId, supabase])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Saatlik Yükleme Aktivitesi</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="hour"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Live Feed Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Canlı Akış
                </h3>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {recentUploads.map((upload) => (
                        <div key={upload.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 animate-in slide-in-from-top-2 duration-300">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                {/* Use thumbnail if available, else file_url (if image) */}
                                {upload.file_url.match(/\.(mp4|webm)$/i) ? (
                                    <video src={upload.file_url} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={upload.thumbnail_url || upload.file_url} alt="" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    Yeni medya yüklendi
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(upload.created_at), { addSuffix: true, locale: tr })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {recentUploads.length === 0 && (
                        <div className="text-center text-gray-400 py-8 text-sm">
                            Henüz yükleme yok.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
