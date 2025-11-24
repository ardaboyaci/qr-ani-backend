import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // 🔥 KRİTİK AN: Kodu verip oturum istiyoruz
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Başarılıysa yönlendir
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      // 🚨 HATA VARSA TERMİNALE BAS (Claude'un göremediği detay bu)
      console.error('🔴 SUPABASE AUTH HATASI:', error)
      // Hatayı URL'e de ekle ki ekranda görelim
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error.name}&desc=${error.message}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No_Code`)
} 