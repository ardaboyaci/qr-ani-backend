import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import Image from 'next/image'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="flex flex-col items-center">
                    {user.user_metadata.avatar_url ? (
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-indigo-100 shadow-sm">
                            <Image
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                fill
                                className="object-cover"
                                sizes="96px"
                            />
                        </div>
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
                            {user.email?.[0].toUpperCase()}
                        </div>
                    )}

                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                        Hoşgeldin
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {user.email}
                    </p>
                </div>

                <div className="mt-8">
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Çıkış Yap
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
