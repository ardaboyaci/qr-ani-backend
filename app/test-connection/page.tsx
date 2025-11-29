import { createClient } from '@/utils/supabase/server'

export default async function TestConnectionPage() {
    const supabase = await createClient()

    // Test connection by fetching events
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .limit(10)

    const isConnected = !error

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Supabase Connection Test</h1>

                {/* Connection Status */}
                <div className={`p-6 rounded-xl border mb-8 ${isConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <h2 className={`font-semibold text-lg ${isConnected ? 'text-green-900' : 'text-red-900'}`}>
                            Status: {isConnected ? 'Connected Successfully' : 'Connection Failed'}
                        </h2>
                    </div>
                    {!isConnected && (
                        <p className="mt-2 text-red-700 font-mono text-sm bg-red-100/50 p-2 rounded">
                            {error.message}
                        </p>
                    )}
                </div>

                {/* Events Grid */}
                {isConnected && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Events <span className="text-gray-500 text-sm font-normal ml-2">({events?.length || 0} fetched)</span>
                            </h2>
                        </div>

                        {events && events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event: any) => (
                                    <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                Event
                                            </div>
                                            <span className="text-xs text-gray-400 font-mono">#{event.id}</span>
                                        </div>

                                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                                            {event.name || event.title || 'Unnamed Event'}
                                        </h3>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            {event.date && (
                                                <div className="flex items-center gap-2">
                                                    <span>📅</span>
                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {event.location && (
                                                <div className="flex items-center gap-2">
                                                    <span>📍</span>
                                                    <span className="line-clamp-1">{event.location}</span>
                                                </div>
                                            )}
                                            {!event.date && !event.location && (
                                                <div className="text-gray-400 italic text-xs mt-4">
                                                    Raw Data: {JSON.stringify(event).slice(0, 50)}...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No events found in the database.</p>
                                <p className="text-sm text-gray-400 mt-1">Try adding some data to the 'events' table.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
