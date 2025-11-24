'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'

export async function signInWithOAuth(provider: Provider) {
    const origin = (await headers()).get('origin')
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback?next=/dashboard`,
        },
    })

    if (error) {
        console.error(error)
        return redirect('/login?message=Could not authenticate user')
    }

    return redirect(data.url)
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}
