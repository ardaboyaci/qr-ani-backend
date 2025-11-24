/**
 * DEVELOPER NOTU: Supabase Dashboard -> Authentication -> Providers kısmından Google'ı enable etmeyi unutma.
 * Redirect URL olarak [PROJECT_URL]/auth/callback eklenmeli.
 */

import { signInWithOAuth } from '@/app/auth/actions'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Hesabınıza giriş yapın
                    </h2>
                </div>

                <div className="mt-6">
                    <form action={async () => {
                        'use server'
                        await signInWithOAuth('google')
                    }}>
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-transparent"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 4.66c1.61 0 3.1.59 4.24 1.61l3.19-3.19C17.48 1.2 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="leading-6">Google ile Devam Et</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
