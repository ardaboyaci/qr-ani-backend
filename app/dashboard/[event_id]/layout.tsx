import { EventTabs } from '@/components/dashboard/event-tabs'

export default async function EventDashboardLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ event_id: string }>
}) {
    const { event_id } = await params

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EventTabs eventId={event_id} />
            {children}
        </div>
    )
}
