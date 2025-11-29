import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { SettingsForm } from './settings-form'

export default async function SettingsPage({ params }: { params: Promise<{ event_id: string }> }) {
    const { event_id } = await params
    const supabase = await createClient()

    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('id', event_id)
        .single()

    if (!event) notFound()

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900">Etkinlik Ayarları</h1>
                <p className="text-gray-500 mt-1">Etkinlik detaylarını ve gizlilik ayarlarını yönetin.</p>
            </div>

            <SettingsForm event={event} />
        </div>
    )
}
