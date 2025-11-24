'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg text-center">
                <h2 className="text-3xl font-bold tracking-tight text-red-600">
                    Giriş Hatası
                </h2>
                <p className="mt-2 text-gray-600">
                    Oturum açılırken bir sorun oluştu.
                </p>

                {error && (
                    <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 break-words">
                        Hata Kodu: {error}
                    </div>
                )}

                <div className="mt-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Tekrar Dene
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <AuthErrorContent />
        </Suspense>
    )
}
