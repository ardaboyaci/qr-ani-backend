import Link from 'next/link'

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between px-6 py-4">
                <div className="text-xl font-bold text-gray-900">QR Anı</div>
                <Link
                    href="/login"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                    Giriş Yap
                </Link>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Düğün ve Organizasyonlarınızı <br className="hidden sm:block" />
                    <span className="text-indigo-600">Ölümsüzleştirin</span>
                </h1>
                <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
                    Misafirlerinizin çektiği fotoğrafları tek bir yerde toplayın, anılarınızı güvenle saklayın ve paylaşın.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/login"
                        className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Hemen Başla
                    </Link>
                </div>
            </main>

            <footer className="py-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} QR Anı. Tüm hakları saklıdır.
            </footer>
        </div>
    )
}
